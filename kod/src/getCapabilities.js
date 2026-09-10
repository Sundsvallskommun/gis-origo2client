function xmlToArray(xmlDoc) {
  const getCapabilitiesLayers = Array.prototype.map.call(xmlDoc.querySelectorAll('Layer > Name'), el => el.textContent);

  getCapabilitiesLayers.forEach((getCapabilitiesLayer, i) => {
    const data = getCapabilitiesLayer.split(':');
    getCapabilitiesLayers[i] = data.pop();
  });
  return getCapabilitiesLayers;
}

// Return the direct child elements of node with the given (namespace-agnostic) local name.
function childElements(node, localName) {
  return Array.prototype.filter.call(node.children, child => child.localName === localName);
}

// Build a map of { layerName: [metadataUrl, ...] } from a WMS GetCapabilities document.
// Each <Layer> that declares its own <MetadataURL><OnlineResource> is keyed both by its
// full name (e.g. 'ws:layer') and by its unprefixed name, so the layer can be matched
// regardless of how its id/LAYERS parameter is configured. Layers without a MetadataURL
// are omitted, so a present key always means an external metadata link exists.
function parseMetadataUrls(xmlDoc) {
  const metadataByLayer = {};
  Array.prototype.forEach.call(xmlDoc.querySelectorAll('Layer'), layerNode => {
    const nameNode = childElements(layerNode, 'Name')[0];
    if (!nameNode) return;
    const name = nameNode.textContent;
    const urls = childElements(layerNode, 'MetadataURL')
      .map(metadataNode => childElements(metadataNode, 'OnlineResource')[0])
      .filter(Boolean)
      .map(resource => resource.getAttribute('xlink:href') || resource.getAttribute('href'))
      .filter(Boolean);
    if (!urls.length) return;
    metadataByLayer[name] = urls;
    const shortName = name.split(':').pop();
    if (shortName !== name) {
      metadataByLayer[shortName] = urls;
    }
  });
  return metadataByLayer;
}

function responseParser(response) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(response, 'text/xml');
  return {
    capabilites: xmlToArray(xmlDoc),
    metadataByLayer: parseMetadataUrls(xmlDoc)
  };
}

const getCapabilities = function getCapabilities(name, getCapabilitiesURL) {
  return new Promise((resolve, reject) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function parseResponse() {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        const parsed = responseParser(xmlHttp.responseText);
        resolve({
          name,
          capabilites: parsed.capabilites,
          metadataByLayer: parsed.metadataByLayer,
          capabilitesDoc: xmlHttp.responseText
        });
      }
    };
    xmlHttp.onerror = reject;
    xmlHttp.open('GET', getCapabilitiesURL);
    xmlHttp.setRequestHeader('Content-type', 'application/xml; charset=UTF-8');
    xmlHttp.send(null);
  });
};

export default getCapabilities;
