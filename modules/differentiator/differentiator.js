Differentiator = {

  /**
   * @param {Signal} param
   */
  init(param) {
    this.signal = param
    let data = this.signal.data
    let output = []
    output.push({
      x: parseFloat(data[0].x),
      y: 0
    })
    for (let i = 1; i < data.length; i++) {
      output.push({
        x: parseFloat(data[i].x),
        y: this.differentiate(data[i-1], data[i])
      })
    }
    this.signal.data = output
    this.signal.description += '\nTransformed by differentiator'
    Workspace.startModule({
      module: 'Cable',
      param: this.signal
    }).then()
  },

  differentiate(data1, data2) {
    let x1 = parseFloat(data1.x)
    let x2 = parseFloat(data2.x)
    let y1 = parseFloat(data1.y)
    let y2 = parseFloat(data2.y)
    return  (y2 - y1) / (x2 - x1)
  }

}
