Integrator = {

  /**
   * @param {Signal} param
   */
  init(param) {
    this.signal = param
    let data = this.signal.data
    let output = []
    output.push({
      x: data[0].x,
      y: 0
    })
    let currY = 0
    for (let i = 1; i < data.length; i++) {
      currY += this.integrate(data[i-1], data[i])
      output.push({
        x: data[i].x,
        y: currY
      })
    }
    this.signal.data = output
    this.signal.description += '\nTransformed by integrator'
    Workspace.startModule({
      module: 'Cable',
      param: this.signal
    }).then()
  },

  /**
   * @param {SignalData} data1
   * @param {SignalData} data2
   */
  integrate(data1, data2) {
    return (data2.x - data1.x) * (data2.y + data1.y) / 2
  }

}
