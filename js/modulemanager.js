ModuleManager = {

  init() {
    this.selectElements()
    this.createTable()
    this.initEvents()
    this.refreshTable()
  },
  
  createTable() {
    this.ui.table = new Table({
      id: 'ModuleManagerTable',
      container: $('#ModuleManagerMain'),
      fields: {
        module: {
          name: 'Module',
          format: (value, object) => {
            return `<a href="#">${value}</a>`
          },
          click: (module) => {
            this.editModule(module).then()
          }
        },
        name: {name: 'Name'},
        container: {name: 'Container'},
        forMenu: {
          name: 'Show in menu',
          format: (value, object) => {
            return value ? 'yes' : 'no'
          }
        },
        transformer: {
          name: 'Is transformer',
          format: (value) => {
            return value ? 'yes' : 'no'
          }
        },
        del: {
          name: 'Delete',
          format: () => {
            return `<a href="#"><i class="fa fa-trash" aria-hidden="true"></i></a>`
          },
          click: (module) => {
            this.deleteModule(module).then()
          }
        }
      }
    })
  },
  
  selectElements() {
    this.ui = {}
    this.ui.addBtn = $('#ModuleManagerAdd')
  },
  
  initEvents() {
    this.ui.addBtn.on('click', () => {
      this.editModule().then()
    })
    EVENTS.MODULES_LOADED.subscribe(this, 'refreshTable')
  },

  refreshTable() {
    this.ui.table.clearAll()
    this.ui.table.makeTableRows(Workspace.getUserModules())
  },

  async editModule(module) {
    await Workspace.startModule({
      module: 'ModuleEditor',
      param: module
    })
  },

  async deleteModule(module) {

  }

}