DummyTransformer = {

  init(param) {
    this.signal = param
    this.signal.title.description += '\nTransformed by dummy transformer'
    Workspace.startModule({
      module: 'Cable',
      param: this.signal
    }).then()
  }

}
