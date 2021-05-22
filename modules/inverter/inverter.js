Inverter = {

  init(param) {
    let data = param.data
    for (let point of data) {
      point.y = -point.y
    }
    param.description += '\nTransformed by inverter'
    Workspace.startModule({
      module: 'Cable',
      param
    }).then()
  }

}