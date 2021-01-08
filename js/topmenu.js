TopMenu = {

  init() {
    this.selectElements()
    this.initEvents()
  },

  selectElements() {
    this.modulesSubmenu = $('#topmenu_modulesSubmenu')
    this.logo = $('#topmenu_logo')
  },

  initEvents() {
    this.logo.on('click', () => {
      Workspace.setStartPage().then()
    })
    EVENTS.MODULES_LOADED.subscribe(this, 'refreshModulesSubmenu')
  },

  refreshModulesSubmenu() {
    this.modulesSubmenu.html('')
    for (let module of Workspace.getModulesForMenu()) {
      this.addModuleLink(module)
    }
  },

  addModuleLink({id, module, name, container}) {
    let linkId = 'topmenu_link_' + id
    this.modulesSubmenu.append(`<button id="${linkId}" class="dropdown-item" type="button">${name}</button>`)
    let element = $('#' + linkId)
    element.on('click', () => Workspace.setModuleToContainer({module, name, container}))
  }

}