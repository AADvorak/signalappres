Workspace = {

  MODULES_BASE: [
    {module: 'SignalGenerator', name: 'Signal generator', container: 'left', forMenu: true},
    {module: 'SignalManager', name: 'Signal manager', container: 'main', forMenu: true},
    {module: 'SignalViewer', name: 'Signal viewer', container: 'main', forMenu: false},
    {module: 'ModuleManager', name: 'Module manager', container: 'main', forMenu: true},
    {module: 'ModuleEditor', name: 'Module editor', container: 'modal', forMenu: false},
    {module: 'Cable', name: 'Cable', container: 'main', forMenu: false},
    {module: 'Adder', name: 'Signal adder', forMenu: false}
  ],

  modules: [],

  modulesInContainers: {},

  async init() {
    this.selectElements()
    this.initEvents()
    this.setScrollHeight()
    await this.loadMenu()
    await this.setStartPage()
    await this.loadSignalStack()
    EVENTS.MODULES_CHANGED.trigger()
  },

  selectElements() {
    this.ui = {}
    this.ui.main = $('#WorkspaceMain')
    this.ui.mainCaption = $('#WorkspaceMainCaption')
    this.ui.mainContainer = $('#WorkspaceMainContainer')
    this.ui.left = $('#WorkspaceLeft')
    this.ui.leftCaption = $('#WorkspaceLeftCaption')
    this.ui.leftContainer = $('#WorkspaceLeftContainer')
    this.ui.leftCloseLnk = $('#WorkspaceLeftClose')
    this.ui.right = $('#WorkspaceRight')
    this.ui.rightCaption = $('#WorkspaceRightCaption')
    this.ui.rightContainer = $('#WorkspaceRightContainer')
    this.ui.rightCloseLnk = $('#WorkspaceRightClose')
    this.ui.menu = $('#WorkspaceMenu')
    this.ui.modal = $('#WorkspaceModal')
    this.ui.modalCaption = $('#WorkspaceModalCaption')
    this.ui.modalContainer = $('#WorkspaceModalContainer')
    this.ui.modalFooter = $('#WorkspaceModalFooter')
    this.ui.modalOkBtn = $('#WorkspaceModalOk')
  },

  initEvents() {
    EVENTS.MODULES_CHANGED.subscribe(this, 'loadModules')
    this.ui.leftCloseLnk.on('click', () => {
      this.closeModule(this.modulesInContainers['left'])
    })
    this.ui.rightCloseLnk.on('click', () => {
      this.closeModule(this.modulesInContainers['right'])
    })
  },

  setScrollHeight() {
    let h = document.documentElement.clientHeight - 100
    this.ui.mainContainer.css('max-height', h)
    this.ui.leftContainer.css('max-height', h)
    this.ui.rightContainer.css('max-height', h)
  },

  async setStartPage() {
    await this.setModuleToContainer({module: 'StartPage', name: 'Start page', container: 'main'})
  },

  async loadMenu() {
    let obj = await ModuleLoader.loadModule({module: 'TopMenu', container: this.ui.menu})
    obj.init()
  },

  async loadSignalStack() {
    let obj = await ModuleLoader.loadModule({module: 'SignalStack'})
    obj.init()
  },

  async startModule({module, param}) {
    let found = false
    for (let moduleObj of this.modules) {
      if (moduleObj.module === module) {
        await this.setModuleToContainer({
          module,
          param,
          name: moduleObj.name,
          container: moduleObj.container,
          isUserModule: true
        })
        found = true
        break
      }
    }
    if (!found) for (let moduleObj of this.MODULES_BASE) {
      if (moduleObj.module === module) {
        await this.setModuleToContainer({
          module,
          param,
          name: moduleObj.name,
          container: moduleObj.container
        })
        found = true
        break
      }
    }
  },
  
  async setModuleToContainer({module, name, container, param, isUserModule}) {
    if (['left', 'right'].includes(container) && document.documentElement.clientWidth < 1024) {
      container = 'main'
    }
    let obj = await ModuleLoader.loadModule({module, isUserModule, container: this.ui[container + 'Container']})
    if (container) {
      this.setCaption({name, container})
      if (this.modulesInContainers[container]) {
        this.unsubscribeModuleFromEvents(this.modulesInContainers[container])
      }
      switch (container) {
        case 'modal':
          this.ui.modalOkBtn.off()
          this.ui.modal.modal()
          break
        case 'left':
        case 'right':
          this.openSideContainer(container)
          break
      }
    }
    this.modulesInContainers[container] = obj
    obj.init(param)
  },

  setCaption({name, container}) {
    this.ui[container + 'Caption'].html(name)
  },

  openSideContainer(container) {
    this.ui[container].attr('class', 'col-3')
    this.ui[container].prop('hidden', false)
    this.setMainContainerWidth()
  },

  closeModule(obj) {
    let container
    for (let key in this.modulesInContainers) {
      if (this.modulesInContainers[key] === obj) {
        container = key
      }
    }
    if (!container) return
    delete this.modulesInContainers[container]
    this.unsubscribeModuleFromEvents(obj)
    if (['left', 'right'].includes(container)) this.closeSideContainer(container)
  },

  closeSideContainer(container) {
    this.ui[container].attr('class', '')
    this.ui[container].prop('hidden', true)
    this.ui[container + 'Container'].html('')
    this.setMainContainerWidth()
  },

  setMainContainerWidth() {
    let width = 12
    if (!this.ui.right.prop('hidden')) width -= 3
    if (!this.ui.left.prop('hidden')) width -= 3
    this.ui.main.attr('class', 'col-' + width)
  },

  async loadModules() {
    this.modules = await ApiProvider.getJson('/modules')
    EVENTS.MODULES_LOADED.trigger()
  },

  getTransformers() {
    let transformers = []
    for (let module of this.modules) {
      if (module.transformer) transformers.push(module)
    }
    return transformers
  },

  getModulesForMenu() {
    let forMenu = []
    for (let module of this.getAllModules()) {
      if (module.forMenu) forMenu.push(module)
    }
    return forMenu
  },

  getAllModules() {
    return [...this.MODULES_BASE, ...this.modules]
  },

  getUserModules() {
    return this.modules
  },

  unsubscribeModuleFromEvents(obj) {
    for (let key in EVENTS) {
      if (EVENTS.hasOwnProperty(key)) {
        EVENTS[key].unsubscribe(obj)
      }
    }
  },

  showAlert(msg) {
    $('body').append(`<div class="alert alert-danger workspaceAlert" role="alert">${msg}</div>`)
    setTimeout(() => {
      $('.alert').alert('close')
    }, 2000)
  }

}