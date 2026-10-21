import olDragAndDrop from 'ol/interaction/DragAndDrop';
import GPXFormat from 'ol/format/GPX';
import GeoJSONFormat from 'ol/format/GeoJSON';
import IGCFormat from 'ol/format/IGC';
import KMLFormat from 'ol/format/KML';
import TopoJSONFormat from 'ol/format/TopoJSON';
import { Component, InputFile, Button, Element as El } from '../ui';
import { getUnusedColor } from '../utils/colorpalette';
import { addLayerStyle } from '../utils/layercolor';

const DragAndDrop = function DragAndDrop(options = {}) {
  let dragAndDrop;
  let viewer;
  let map;
  let legendButton;
  const localization = options.localization;

  function localize(key) {
    return localization.getStringByKeys({ targetParentKey: 'draganddrop', targetKey: key });
  }

  if (options.showLegendButton) {
    const fileInput = InputFile({
      labelCls: 'hidden',
      inputCls: 'hidden',
      change(e) {
        const filesToDrop = e.target.files;

        function fakeIt(file) {
          this.dropEffect = 'copy';
          this.effectAllowed = 'all';
          this.items = [];
          this.types = [];
          this.getData = function getData() {
            return file;
          };
          this.files = file;
        }

        const fakeEvent = new DragEvent('drop');
        Object.defineProperty(fakeEvent, 'dataTransfer', {
          value: new fakeIt(filesToDrop)
        });
        viewer.getMap().getViewport().dispatchEvent(fakeEvent);
      }
    });

    const openBtn = Button({
      cls: 'text-medium padding-0',
      click() {
        const inputEl = document.getElementById(fileInput.getId());
        inputEl.value = null;
        inputEl.click();
      },
      text: localize('addFromFile'),
      ariaLabel: localize('addFromFile')
    });

    legendButton = El({
      components: [fileInput, openBtn]
    });

    legendButton.on('click', () => {
      openBtn.dispatch('click');
    });
  }

  return Component({
    name: 'draganddrop',
    onAdd(evt) {
      viewer = evt.target;
      map = viewer.getMap();
      if (options.showLegendButton) {
        const legend = viewer.getControlByName('legend');
        legend.addButtonToTools(legendButton, 'addLayerButton');
      }
      const groupName = options.groupName || localize('yourLayersName');
      const groupTitle = options.groupTitle || localize('yourLayersTitle');
      const draggable = options.draggable || true;
      const promptlessRemoval = options.promptlessRemoval !== false;
      const styleByAttribute = options.styleByAttribute || false;
      const zoomToExtent = options.zoomToExtent !== false;
      const zoomToExtentOnLoad = options.zoomToExtentOnLoad !== false;
      const featureStyles = options.featureStyles || {
        Point: [{
          circle: {
            radius: 5,
            stroke: {
              color: [0, 255, 255, 1],
              width: 0
            },
            fill: {
              color: [0, 255, 255, 1]
            }
          }
        }],
        LineString: [{
          stroke: {
            color: [255, 255, 255, 1],
            width: 5
          }
        },
        {
          stroke: {
            color: [0, 255, 255, 0.5],
            width: 3
          }
        }],
        Polygon: [{
          stroke: {
            color: [255, 255, 255, 1],
            width: 5
          }
        },
        {
          stroke: {
            color: [0, 255, 255, 1],
            width: 3
          }
        },
        {
          fill: {
            color: [0, 255, 255, 0.1]
          }
        }]
      };
      const alternateColors = typeof options.alternateColors !== 'undefined' ? options.alternateColors : true;
      const alternateStrokeColors = typeof options.alternateStrokeColors !== 'undefined' ? options.alternateStrokeColors : [[166, 206, 227, 1], [31, 120, 180, 1], [178, 223, 138, 1], [51, 160, 44, 1], [251, 154, 153, 1], [227, 26, 28, 1], [253, 191, 111, 1]];
      const alternateFillColors = typeof options.alternateFillColors !== 'undefined' ? options.alternateFillColors : [[166, 206, 227, 0.3], [31, 120, 180, 0.3], [178, 223, 138, 0.3], [51, 160, 44, 0.3], [251, 154, 153, 0.3], [227, 26, 28, 0.3], [253, 191, 111, 0.3]];
      let alternateIdx = 0;

      dragAndDrop = new olDragAndDrop({
        formatConstructors: [
          GPXFormat,
          GeoJSONFormat,
          IGCFormat,
          KMLFormat,
          TopoJSONFormat
        ]
      });

      this.addInteraction();

      dragAndDrop.on('addfeatures', (event) => {
        const fileExtension = event.file.name.split('.').pop();
        let layerName = event.file.name.split('.')[0].replace(/\W/g, '');
        let layerTitle = event.file.name.split('.')[0];
        if (viewer.getLayer(layerName)) {
          let i = 1;
          while (i < 99) {
            if (!viewer.getLayer(`${layerName}-${i}`)) {
              layerName = `${layerName}-${i}`;
              layerTitle = `${layerTitle} ${i}`;
              break;
            }
            i += 1;
          }
        }
        if (!viewer.getGroup(groupName)) {
          viewer.addGroup({ title: groupTitle, name: groupName, expanded: true, draggable });
        }
        const layerOptions = {
          group: groupName,
          name: layerName,
          title: layerTitle,
          zIndex: 6,
          styleByAttribute,
          queryable: true,
          removable: true,
          promptlessRemoval,
          zoomToExtent,
          visible: true,
          source: 'none',
          type: 'GEOJSON',
          features: event.features
        };
        // Give each layer its own color unless styles are configured or the file has its own styles (kml).
        // featureStyles always has a default here, so the option itself is checked.
        if (!options.featureStyles && !['kml', 'kmz'].includes(fileExtension.toLowerCase())) {
          if (styleByAttribute) {
            // Features with a style attribute keep their own style
            const getStyleFunction = viewer.getStylewindow().getStyleFunction;
            event.features.forEach((feature) => {
              const featureStyle = feature.get('origostyle') || feature.get('style');
              if (feature.getGeometry() && featureStyle && typeof featureStyle === 'object') {
                feature.setStyle(getStyleFunction(feature));
              }
            });
          }
          // Only features without their own style get the layer color
          let layerColor;
          if (event.features.some(feature => feature.getGeometry() && !feature.getStyle())) {
            const usedColors = viewer.getLayers().map(l => l.get('layerColor')).filter(color => color);
            layerColor = getUnusedColor(usedColors);
            layerOptions.layerColor = layerColor;
          }
          layerOptions.styleByAttribute = false;
          layerOptions.style = addLayerStyle({
            name: layerName,
            color: layerColor,
            features: event.features,
            labels: { layerColor: localize('layerColorLabel'), ownStyle: localize('ownStyleLabel') },
            viewer
          });
        } else if (!styleByAttribute) {
          let styles = [];
          const types = [];
          event.features.forEach((feature) => {
            if (!types.includes(feature.getGeometry().getType())) {
              const dadLayers = viewer.getLayersByProperty('group', groupName);
              if (dadLayers.length > 0 && alternateColors) {
                const tempStyle = featureStyles[feature.getGeometry().getType().replace('Multi', '').replace('GeometryCollection', 'Polygon')];
                if (alternateStrokeColors.length === alternateIdx) {
                  alternateIdx = 0;
                }
                if (typeof tempStyle !== 'undefined') {
                  if (tempStyle.length > 1) {
                    tempStyle.forEach((style, idx) => {
                      if ('stroke' in style) {
                        if (JSON.stringify(style.stroke.color) !== JSON.stringify([255, 255, 255, 1])) {
                          tempStyle[idx].stroke.color = alternateStrokeColors[alternateIdx];
                        }
                      }
                      if ('fill' in style) {
                        tempStyle[idx].fill.color = alternateFillColors[alternateIdx];
                      }
                    });
                  } else {
                    if ('stroke' in tempStyle) {
                      if (JSON.stringify(tempStyle.stroke.color) !== JSON.stringify([255, 255, 255, 1])) {
                        tempStyle.stroke.color = alternateStrokeColors[alternateIdx];
                      }
                    }
                    if ('fill' in tempStyle) {
                      tempStyle.fill.color = alternateFillColors[alternateIdx];
                    }
                  }
                }
                styles = styles.concat(tempStyle);
                alternateIdx += 1;
              } else {
                styles = styles.concat(featureStyles[feature.getGeometry().getType().replace('Multi', '').replace('GeometryCollection', 'Polygon')]);
              }
            }
            types.push(feature.getGeometry().getType());
          });
          if (styles.length && (!['kml', 'kmz'].includes(fileExtension.toLowerCase()))) {
            layerOptions.styleDef = styles;
          }
        }
        const layer = viewer.addLayer(layerOptions);
        // Statistics event: file format and number of features, never the file name or content
        viewer.dispatch('draganddrop:addfile', { format: fileExtension.toLowerCase(), features: event.features.length });
        if (zoomToExtentOnLoad) {
          const extent = typeof layer.getSource !== 'undefined' && typeof layer.getSource().getExtent !== 'undefined' ? layer.getSource().getExtent() : layer.getExtent();
          if (layer.getVisible()) {
            viewer.getMap().getView().fit(extent, {
              padding: [50, 50, 50, 50],
              duration: 1000
            });
          }
        }
      });
      this.render();
    },
    onInit() {
    },
    render() {
      this.dispatch('render');
    },
    addInteraction() {
      map.addInteraction(dragAndDrop);
    }
  });
};

export default DragAndDrop;
