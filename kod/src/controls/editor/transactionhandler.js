import wfsTransaction from './wfstransaction';
import agsTransaction from './agstransaction';
import geojsonTransaction from './geojsontransaction';
import indexedDb from './indexeddb';

const transactions = {
  WFS: wfsTransaction,
  AGS_FEATURE: agsTransaction,
  GEOJSON: geojsonTransaction,
  OFFLINE: indexedDb
};
export default function transactionhandler(transaction, layerName, viewer) {
  const type = viewer.getLayer(layerName).get('type');
  if (Object.prototype.hasOwnProperty.call(transactions, type)) {
    return transactions[type](transaction, layerName, viewer);
  }
  return false;
}
