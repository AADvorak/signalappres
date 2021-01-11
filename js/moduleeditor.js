ModuleEditor = {

  init(module) {
    this.module = module
    this.selectElements()
    this.initEvents()
    if (this.module) this.fillForm()
  },

  selectElements() {
    this.ui = {}
    this.ui.moduleInp = $('#ModuleEditorModule')
    this.ui.nameInp = $('#ModuleEditorName')
    this.ui.containerSel = $('#ModuleEditorContainer')
    this.ui.forMenuRbtn = $('#ModuleEditorForMenu')
    this.ui.transformerRbtn = $('#ModuleEditorTransformer')
  },

  initEvents() {
    Workspace.ui.modalOkBtn.on('click', () => {
      this.saveModule().then(() => {
        EVENTS.MODULES_CHANGED.trigger()
      })
    })
  },

  fillForm() {
    this.ui.moduleInp.val(this.module.module)
    this.ui.nameInp.val(this.module.name)
    this.ui.containerSel.val(this.module.container)
    this.ui.forMenuRbtn.prop('checked', this.module.forMenu)
    this.ui.transformerRbtn.prop('checked', this.module.transformer)
  },

  getFormValues() {
    return {
      module: this.ui.moduleInp.val(),
      name: this.ui.nameInp.val(),
      container: this.ui.containerSel.val(),
      forMenu: this.ui.forMenuRbtn.prop('checked'),
      transformer: this.ui.transformerRbtn.prop('checked')
    }
  },

  async saveModule() {
    let newModule = this.getFormValues()
    if (this.module && this.module.id) {
      await ApiProvider.putJson('/modules/' + this.module.id, newModule)
    } else {
      await ApiProvider.postJson('/modules', newModule)
    }
  }

}