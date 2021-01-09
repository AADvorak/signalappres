TopMenu = {

  init() {
    this.selectElements()
    this.initEvents()
  },

  selectElements() {
    this.ui = {}
    this.ui.modulesSubmenu = $('#TopMenuModulesSubmenu')
    this.ui.logo = $('#TopMenuLogo')
  },

  initEvents() {
    this.ui.logo.on('click', () => {
      Workspace.setStartPage().then()
    })
    EVENTS.MODULES_LOADED.subscribe(this, 'refreshModulesSubmenu')
  },

  refreshModulesSubmenu() {
    this.ui.modulesSubmenu.html('')
    for (let module of Workspace.getModulesForMenu()) {
      this.addModuleLink(module)
    }
  },

  addModuleLink({module, name}) {
    let linkId = 'TopMenuLink' + module
    this.ui.modulesSubmenu.append(`<button id="${linkId}" class="dropdown-item" type="button">${name}</button>`)
    let element = $('#' + linkId)
    element.on('click', () => Workspace.startModule({module}))
  }

}