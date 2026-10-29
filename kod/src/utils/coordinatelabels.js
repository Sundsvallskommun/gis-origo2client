import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style, Text } from 'ol/style';

const textStyle = new Style({
  text: new Text({
    font: '12px sans-serif',
    textAlign: 'left',
    offsetX: 10,
    fill: new Fill({ color: 'rgba(0,0,0,1)' }),
    backgroundFill: new Fill({ color: 'rgba(255,255,255,0.85)' }),
    backgroundStroke: new Stroke({ color: 'rgba(0,0,0,0.3)', width: 1 }),
    padding: [2, 4, 2, 4]
  })
});

// The vertices of a geometry as [coordinate, hasZ]. The last vertex of a polygon ring is skipped since it is the same as the first.
function getVertices(geometry) {
  if (!geometry) return [];
  const type = geometry.getType();
  if (type === 'GeometryCollection') return geometry.getGeometries().flatMap(getVertices);
  const hasZ = geometry.getLayout().includes('Z');
  let coordinates;
  if (type === 'Point') {
    coordinates = [geometry.getCoordinates()];
  } else if (type === 'LineString' || type === 'MultiPoint') {
    coordinates = geometry.getCoordinates();
  } else if (type === 'MultiLineString') {
    coordinates = geometry.getCoordinates().flat();
  } else if (type === 'Polygon') {
    coordinates = geometry.getCoordinates().flatMap(ring => ring.slice(0, -1));
  } else if (type === 'MultiPolygon') {
    coordinates = geometry.getCoordinates().flat().flatMap(ring => ring.slice(0, -1));
  } else {
    coordinates = [];
  }
  return coordinates.map(coordinate => [coordinate, hasZ]);
}

/**
 * Shows the coordinates of the vertices in the added layers that have the property showCoordinates, as labels
 * in an unmanaged layer which is not part of the legend. The property is turned on and off from the layer menu in the legend.
 * Z is only shown when the geometry has z values, e.g. elevation in gpx.
 */
export default function CoordinateLabels({
  map,
  decimals,
  labels = { north: 'N', east: 'E', z: 'Z' }
}) {
  const layers = new Set();
  const source = new VectorSource();
  const labelLayer = new VectorLayer({
    source,
    declutter: true,
    zIndex: 10,
    style(feature) {
      textStyle.getText().setText(feature.get('text'));
      return textStyle;
    }
  });
  labelLayer.setMap(map);
  // Two decimals for meters, six for degrees unless configured
  const defaultDecimals = map.getView().getProjection().getUnits() === 'degrees' ? 6 : 2;
  const precision = typeof decimals === 'number' ? decimals : defaultDecimals;

  function getText(coordinates, hasZ) {
    // Northing first, as is customary for SWEREF 99
    const rows = [`${labels.north}: ${coordinates[1].toFixed(precision)}`, `${labels.east}: ${coordinates[0].toFixed(precision)}`];
    if (hasZ) rows.push(`${labels.z}: ${coordinates[2].toFixed(precision)}`);
    return rows.join('\n');
  }

  function update() {
    source.clear();
    const features = [];
    layers.forEach((layer) => {
      if (!layer.getVisible() || !layer.get('showCoordinates')) return;
      layer.getSource().getFeatures().forEach((feature) => {
        getVertices(feature.getGeometry()).forEach(([coordinates, hasZ]) => {
          features.push(new Feature({ geometry: new Point(coordinates), text: getText(coordinates, hasZ) }));
        });
      });
    });
    source.addFeatures(features);
  }

  function removeLayer(layer) {
    if (!layers.delete(layer)) return;
    layer.un('change:visible', update);
    layer.un('change:showCoordinates', update);
    layer.getSource().un('change', update);
    update();
  }

  map.getLayers().on('remove', evt => removeLayer(evt.element));

  return {
    addLayer(layer) {
      layers.add(layer);
      layer.on('change:visible', update);
      layer.on('change:showCoordinates', update);
      layer.getSource().on('change', update);
      update();
    }
  };
}
