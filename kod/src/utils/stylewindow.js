import { Style, RegularShape, Circle, Stroke, Fill, Text } from 'ol/style';

let annotationField;
const swStyle = {};
const swDefaults = {
  fillColor: 'rgb(0,153,255)',
  fillOpacity: 0.75,
  strokeColor: 'rgb(0,153,255)',
  strokeOpacity: 1,
  strokeWidth: 2,
  strokeType: 'line',
  pointSize: 10,
  pointType: 'circle',
  textSize: 20,
  textString: 'Text',
  textFont: '"Helvetica Neue", Helvetica, Arial, sans-serif'
};

function rgbToArray(colorString, opacity = 1) {
  const colorArray = colorString.replace(/[^\d,.]/g, '').split(',');
  colorArray[3] = opacity;
  return colorArray;
}

swDefaults.fillColorArr = rgbToArray(swDefaults.fillColor, swDefaults.fillOpacity);
swDefaults.strokeColorArr = rgbToArray(swDefaults.strokeColor, swDefaults.strokeOpacity);

function createRegularShape(type, size, fill, stroke) {
  let style;
  switch (type) {
    case 'square':
      style = new Style({
        image: new RegularShape({
          fill,
          stroke,
          points: 4,
          radius: size,
          angle: Math.PI / 4
        })
      });
      break;

    case 'triangle':
      style = new Style({
        image: new RegularShape({
          fill,
          stroke,
          points: 3,
          radius: size,
          rotation: 0,
          angle: 0
        })
      });
      break;

    case 'star':
      style = new Style({
        image: new RegularShape({
          fill,
          stroke,
          points: 5,
          radius: size,
          radius2: size / 2.5,
          angle: 0
        })
      });
      break;

    case 'cross':
      style = new Style({
        image: new RegularShape({
          fill,
          stroke,
          points: 4,
          radius: size,
          radius2: 0,
          angle: 0
        })
      });
      break;

    case 'x':
      style = new Style({
        image: new RegularShape({
          fill,
          stroke,
          points: 4,
          radius: size,
          radius2: 0,
          angle: Math.PI / 4
        })
      });
      break;

    case 'circle':
      style = new Style({
        image: new Circle({
          fill,
          stroke,
          radius: size
        })
      });
      break;

    default:
      style = new Style({
        image: new Circle({
          fill,
          stroke,
          radius: size
        })
      });
  }
  return style;
}

export default function getStylewindowStyle(feature, featureStyle) {
  const styleObj = Object.assign(swStyle, featureStyle);
  let geometryType = feature.getGeometry().getType();
  if (feature.get(annotationField)) {
    geometryType = 'TextPoint';
  }
  const style = [];
  let lineDash;
  if (styleObj.strokeType === 'dash') {
    lineDash = [3 * styleObj.strokeWidth, 3 * styleObj.strokeWidth];
  } else if (styleObj.strokeType === 'dash-point') {
    lineDash = [3 * styleObj.strokeWidth, 3 * styleObj.strokeWidth, 0.1, 3 * styleObj.strokeWidth];
  } else if (styleObj.strokeType === 'point') {
    lineDash = [0.1, 3 * styleObj.strokeWidth];
  } else {
    lineDash = false;
  }

  const stroke = new Stroke({
    color: styleObj.strokeColorArr,
    width: styleObj.strokeWidth,
    lineDash
  });
  const fill = new Fill({
    color: styleObj.fillColorArr
  });
  const font = `${styleObj.textSize}px ${styleObj.textFont}`;
  switch (geometryType) {
    case 'LineString':
    case 'MultiLineString':
      style[0] = new Style({
        stroke
      });
      break;
    case 'Polygon':
    case 'MultiPolygon':
      style[0] = new Style({
        fill,
        stroke
      });
      break;
    case 'Point':
    case 'MultiPoint':
      style[0] = createRegularShape(styleObj.pointType, styleObj.pointSize, fill, stroke);
      break;
    case 'TextPoint':
      style[0] = new Style({
        text: new Text({
          text: styleObj.textString || 'Text',
          font,
          fill
        })
      });
      feature.set(annotationField, styleObj.textString || 'Text');
      break;
    default:
      style[0] = createRegularShape(styleObj.pointType, styleObj.pointSize, fill, stroke);
      break;
  }
  return style;
}
