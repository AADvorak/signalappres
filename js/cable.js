Cable = {

  /**
   * @param {Signal} signal
   */
  init(signal) {
    this.signal = signal
    this.selectElements()
    this.initEvents()
    this.fillForm()
    this.addSendLinks()
    this.showPreview()
    if (this.signalIsSaved()) this.showSaveAsNewBtn()
  },

  selectElements() {
    this.ui = {}
    this.ui.nameInp = $('#CableName')
    this.ui.descriptionInp = $('#CableDescription')
    this.ui.preview = $('#CablePreview')
    this.ui.saveBtn = $('#CableSave')
    this.ui.sendBtn = $('#CableSend')
    this.ui.sendSubmenu = $('#CableSendSubmenu')
    this.ui.backLnk = $('#CableBack')
    this.ui.saveAsNewBtn = $('#CableSaveAsNew')
  },

  initEvents() {
    this.ui.saveBtn.on('click', () => {
      this.saveSignal().then()
    })
    this.ui.saveAsNewBtn.on('click', () => {
      this.saveSignalAsNew().then()
    })
    this.ui.backLnk.on('click', () => {
      Workspace.startModule({
        module: 'SignalManager'
      }).then()
    })
  },

  fillForm() {
    if (this.signal.title) {
      this.ui.nameInp.val(this.signal.title.name)
      this.ui.descriptionInp.val(this.signal.title.description)
    }
  },

  addSendLinks() {
    for (let transformer of Workspace.getTransformers()) {
      this.addSendLink(transformer)
    }
  },

  addSendLink({id, module, name}) {
    let linkId = 'CableSendSubmenuLink' + id
    this.ui.sendSubmenu.append(`<button id="${linkId}" class="dropdown-item" type="button">${name}</button>`)
    let element = $('#' + linkId)
    element.on('click', () => this.sendSignal({module}))
  },

  showPreview() {
    ChartDrawer.drawLines({container: this.ui.preview, signals: [this.signal]})
  },

  sendSignal({module}) {
    Workspace.startModule({
      module,
      param: this.signal
    }).then()
  },

  async saveSignalAsNew() {
    delete this.signal.title.id
    await this.saveSignal()
  },

  async saveSignal() {
    let formValues = this.getFormValues()
    let signalToSave = {
      title: formValues,
      data: this.signal.data || []
    }
    if (this.signalIsSaved()) {
      await ApiProvider.putJson('/signals/' + this.signal.title.id, signalToSave)
    } else {
      this.signal.title = await ApiProvider.postJson('/signals/', signalToSave)
    }
    Workspace.startModule({
      module: 'SignalManager'
    }).then()
  },

  getFormValues() {
    return {
      name: this.ui.nameInp.val(),
      description: this.ui.descriptionInp.val()
    }
  },

  showSaveAsNewBtn() {
    this.ui.saveAsNewBtn.prop('hidden', false)
  },

  signalIsSaved() {
    return this.signal.title && this.signal.title.id
  }

}