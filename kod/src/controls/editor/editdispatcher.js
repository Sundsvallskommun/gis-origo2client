// Define some constants so we can use intellisense (and save a few bytes in the minified version)
const ADD_CHILD_EVENT = 'addChild';
const EDIT_CHILD_EVENT = 'editChild';
const DELETE_CHILD_EVENT = 'deleteChild';

function emitChangeEdit(tool, state) {
  const changeEdit = new CustomEvent('changeEdit', {
    detail: {
      tool,
      active: state
    }
  });
  document.dispatchEvent(changeEdit);
}

function emitChangeFeature(change) {
  const changeFeature = new CustomEvent('changeFeature', {
    detail: {
      feature: change.feature,
      layerName: change.layerName,
      action: change.action,
      status: change.status || 'pending'
    }
  });
  document.dispatchEvent(changeFeature);
}

function emitToggleEdit(tool, optOptions) {
  const options = optOptions || {};
  const defaults = {
    tool
  };
  const toggleEdit = new CustomEvent('toggleEdit', {
    detail: Object.assign(defaults, options)
  });
  document.dispatchEvent(toggleEdit);
}

function emitEnableInteraction() {
  const enableInteraction = new CustomEvent('enableInteraction', {
    detail: {
      interaction: 'editor'
    }
  });
  document.dispatchEvent(enableInteraction);
}

function emitEditsChange(edits) {
  const editsChange = new CustomEvent('editsChange', {
    detail: {
      edits
    }
  });
  document.dispatchEvent(editsChange);
}

function emitChangeEditorShapes(shape) {
  const editorShapes = new CustomEvent('editorShapes', {
    detail: {
      shape
    }
  });
  document.dispatchEvent(editorShapes);
}

function emitChangeOfflineEdits(edits, layerName) {
  const changeOfflineEdits = new CustomEvent('changeOfflineEdits', {
    detail: {
      edits,
      layerName
    }
  });
  document.dispatchEvent(changeOfflineEdits);
}

function emitCustomDrawEnd(feature) {
  const changeOfflineEdits = new CustomEvent('customDrawEnd', {
    detail: {
      feature
    }
  });
  document.dispatchEvent(changeOfflineEdits);
}
/**
 * Called from relatedTablesForm when add button is pressed
 * @param {any} parentLayer
 * @param {any} parentFeature
 * @param {any} childLayer
 */
function emitAddChild(parentLayer, parentFeature, childLayer) {
  document.dispatchEvent(new CustomEvent(ADD_CHILD_EVENT, { detail: { parentLayer, parentFeature, childLayer } }));
}

/**
 * Called from relatedTablesForm when edit button is pressed
 * @param {any} layer
 * @param {any} parentFeature
 * @param {any} feature
 */
function emitEditChild(layer, parentFeature, feature) {
  document.dispatchEvent(new CustomEvent(EDIT_CHILD_EVENT, { detail: { layer, parentFeature, feature } }));
}
/**
 * Called from relatedTablesForm when delete button is pressed
 * @param {any} layer
 * @param {any} parentFeature
 * @param {any} feature
 */
function emitDeleteChild(layer, parentFeature, feature) {
  document.dispatchEvent(new CustomEvent(DELETE_CHILD_EVENT, { detail: { layer, parentFeature, feature } }));
}

export default {
  emitChangeEdit,
  emitChangeFeature,
  emitToggleEdit,
  emitEnableInteraction,
  emitEditsChange,
  emitChangeEditorShapes,
  emitChangeOfflineEdits,
  emitCustomDrawEnd,
  ADD_CHILD_EVENT,
  emitEditChild,
  EDIT_CHILD_EVENT,
  emitAddChild,
  emitDeleteChild,
  DELETE_CHILD_EVENT
};
