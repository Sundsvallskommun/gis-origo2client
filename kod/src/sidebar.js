import { dom } from './ui';

/**
 * Will be imported as sort of "static" as it does not contain any creatish function
 * There can be only one sidebar in an entire page (or iframe)
 * 
 * @function
 * @name setVisibility
 * @kind function
 * @param {any} visible
 * @returns {void}
 */
function setVisibility(visible) {
  const sideEl = document.getElementById('o-sidebar');
  if (visible && sideEl) {
    sideEl.classList.add('o-sidebar-show');
  } else if (!visible && sideEl) {
    sideEl.classList.remove('o-sidebar-show');
  }
}

/**
 * Closes the sidebar and optionally calls a callback.
 * 
 * @function
 * @name closeSidebar
 * @kind function
 * @param {any} cb
 * @returns {void}
 */
function closeSidebar(cb) {
  setVisibility(false);
  if (cb) {
    cb();
  }
}

/**
 * Bind the close sidebar button to a event
 * 
 * @function
 * @name bindUIActions
 * @kind function
 * @param {any} closeCb
 * @returns {void}
 */
function bindUIActions(closeCb) {
  document.querySelector('#o-sidebar .o-sidebar #o-close-button').addEventListener('click', (evt) => {
    closeSidebar(closeCb);
    evt.preventDefault();
  });
}

/**
 * Sets the title of the sidebar
 * 
 * @function
 * @name setTitle
 * @kind function
 * @param {any} title
 * @returns {void}
 */
function setTitle(title) {
  const sideti = document.querySelector('#o-sidebar #o-card-title');
  sideti.innerHTML = title;
}

/**
 * Insert the content to the sidebar
 * 
 * @function
 * @name insertContent
 * @kind function
 * @param {any} content
 * @returns {void}
 */
function insertContent(content) {
  const el = document.querySelector('#o-sidebar .o-sidebar .o-card-content');
  el.innerHTML = content;
}

/**
 * Set the content to the sidebar
 * 
 * @function
 * @name setContent
 * @kind function
 * @param {any} config
 * @returns {void}
 */
function setContent(config) {
  const { title, content } = config;
  if (title) {
    setTitle(title);
  } else {
    setTitle('');
  }
  if (content) {
    insertContent(content);
  } else {
    insertContent('');
  }
}

/**
 * Creates a new popup and adds it to the dom.
 * @param {any} viewer the viewer object to attach to
 * @param {Object} opts options.
 * @param {function} opts.closeCb Function without parameters to be called when popup is closed from close button.
 */
function init(viewer, opts = {}) {
  const {
    closeCb
  } = opts;
  const mapId = viewer.getId();
  const el = `<div id="o-sidebar">
    <div class="o-sidebar o-card">
        <div class="flex row justify-end">
          <div id="o-card-title" class="justify-start margin-y-smaller margin-left text-weight-bold width-full"></div>
          <button id="o-close-button" class="small round margin-top-smaller margin-bottom-auto margin-right-small icon-smallest grey-lightest no-shrink" aria-label="Stäng">
            <span class="icon ">
              <svg>
                <use xlink:href="#ic_close_24px"></use>
              </svg>
            </span>
          </button>
        </div>
        <div class="flex column o-card-content"></div>
    </div>
    </div>`;
  document.getElementById(mapId).appendChild(dom.html(el));

  bindUIActions(closeCb);
}

export default {
  init,
  setVisibility,
  setTitle,
  setContent,
  closeSidebar
};
