LinearAmp = {

  /**
   * @param {Signal} param
   */
  init(param) {
    this.signal = param
    this.selectElements()
    this.initEvents()
  },

  selectElements() {
    this.ui = {}
    this.ui.coefInp = $('#LinearAmpCoef')
    this.ui.tranformBtn = $('#LinearAmpTransform')
  },

  initEvents() {
    this.ui.tranformBtn.on('click', () => {
      this.doTransform()
    })
  },

  doTransform() {
    let coef = parseFloat(this.ui.coefInp.val())
    this.signal.description += `\nTransformed by linear amplifier with k = ${coef}`
    let data = this.signal.data
    for (let item of data) {
      item.y = parseFloat(item.y) * coef
    }
    Workspace.closeModule(this)
    Workspace.startModule({
      module: 'Cable',
      param: this.signal
    }).then()
  }

}
