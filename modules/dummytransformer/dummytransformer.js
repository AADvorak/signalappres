DummyTransformer = {

  /**
   * @param {Signal} param
   */
  init(param) {
    this.signal = param
    this.signal.description += '\nTransformed by dummy transformer'
    Workspace.startModule({
      module: 'Cable',
      param: this.signal
    }).then()
  }

}
