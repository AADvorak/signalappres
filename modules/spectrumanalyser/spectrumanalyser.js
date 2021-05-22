SpectrumAnalyser = {

  /**
   * @param {Signal} param
   */
  init(param) {
    this.signal = param
    let output = this.transformDCT(this.signal.data)
    this.signal.data = output
    this.signal.description += '\nTransformed by spectrum analyser'
    this.signal.name += ' (Spectrum)'
    Workspace.startModule({
      module: 'Cable',
      param: this.signal
    }).then()
  },

  /**
   * @param {SignalData[]} data
   */
  transformDCT (data) {
    let output = []
    let N = this.getPowOfTwoLength(data.length)
    let freqStep = 1 / (2 * N * (data[1].x - data[0].x))
    for (let k = 0; k < N; k++) {
      let y = 0
      for (let n = 0; n < N; n++) {
        y += data[n].y * this.kernel(n, k, N)
      }
      output.push({
        x: k * freqStep,
        y: y
      })
    }
    this.postprocess(output)
    return output
  },

  getPowOfTwoLength(fullLength) {
    let powOfTwoLength = 1
    while (powOfTwoLength <= fullLength) {
      powOfTwoLength *= 2
    }
    return powOfTwoLength / 2
  },

  kernel(n, k, N) {
    return Math.cos(Math.PI * k * (n + 0.5) / N)
  },

  /**
   * @param {SignalData[]} data
   */
  postprocess(data) {
    for (let point of data) {
      point.y = Math.abs(point.y)
    }
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i].y < data[i - 1].y && data[i].y < data[i + 1].y) {
        data[i].y = (data[i - 1].y + data[i + 1].y) / 2
      }
    }
    let maximum = 0
    for (let point of data) {
      if (point.y > maximum) maximum = point.y
    }
    for (let point of data) {
      point.y /= maximum
    }
  }

}
