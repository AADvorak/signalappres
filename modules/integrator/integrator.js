Integrator = {

  init(param) {
    this.signal = param
    let data = this.signal.data
    let output = []
    output.push({
      x: parseFloat(data[0].x),
      y: 0
    })
    let currY = 0
    for (let i = 1; i < data.length; i++) {
      currY += this.integrate(data[i-1], data[i])
      output.push({
        x: parseFloat(data[i].x),
        y: currY
      })
    }
    this.signal.data = output
    this.signal.title.description += '\nTransformed by integrator'
    Workspace.startModule({
      module: 'Cable',
      param: this.signal
    }).then()
  },

  integrate(data1, data2) {
    let x1 = parseFloat(data1.x)
    let x2 = parseFloat(data2.x)
    let y1 = parseFloat(data1.y)
    let y2 = parseFloat(data2.y)
    return (x2 - x1) * (y2 + y1) / 2
  }

}
