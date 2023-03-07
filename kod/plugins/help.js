const Help = function Help(options = {}) {
  const {
    icon = '#ic_help_outline_24px',
    url,
    buttonText,
    target
  } = options;
  let mapMenu;
  let menuItem;
  let viewer;

  return Origo.ui.Component({
    name: 'help',
    onAdd(evt) {
      viewer = evt.target;
      mapMenu = viewer.getControlByName('mapmenu');
      if (mapMenu !== null) {
        menuItem = mapMenu.MenuItem({
          click() {
            visaInfo(url, target);
            mapMenu.close();
          },
          icon,
          title: buttonText
        });
        this.addComponent(menuItem);
      }
      this.render();
    },
    render() {
      if (mapMenu !== null) {
        mapMenu.appendMenuItem(menuItem);
      }
      this.dispatch('render');
    }
  });
};
