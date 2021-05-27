SelfCorrelator = {

  init(param) {
    param.data = SignalUtils.estimateCorrelationFunction(param, param)
    param.name += '\n (Self correlation function)'
    Workspace.startModule({
      module: 'Cable',
      param
    }).then()
  }

}