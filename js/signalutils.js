SignalUtils = {

  difEqMethod: 'Euler',

  /**
   *
   * @param {SignalData[]} inData
   * @param {function[]} equations
   * @param {Object} params
   * @param {number[]} initial
   * @param {number} outNumber
   * @returns {SignalData[]}
   */
  solveDifEq({inData, equations, params, initial, outNumber}) {
    return this['solveDifEq' + this.difEqMethod + 'Method']({inData, equations, params, initial, outNumber})
  },

  solveDifEqEulerMethod({inData, equations, params, initial, outNumber}) {
    let outData = []
    let equationsNumber = equations.length
    let step = inData[1].x - inData[0].x
    let currentValues = initial
    outData.push({x: inData[0].x, y: currentValues[outNumber]})
    for (let i = 1; i < inData.length; i++) {
      let point = inData[i]
      let nextValues = []
      for (let n = 0; n < equationsNumber; n++) {
        nextValues.push(currentValues[n] + step * equations[n](point.y, currentValues, params))
      }
      currentValues = nextValues
      outData.push({x: point.x, y: currentValues[outNumber]})
    }
    return outData
  },

  /**
   * @param {Signal[]} signals
   */
  calculateSignalsParams(signals) {
    for (let signal of signals) {
      this.calculateSignalParams(signal)
    }
  },

  /**
   * @param {Signal} signal
   */
  calculateSignalParams(signal) {
    let xMin = signal.data[0].x
    let xMax = signal.data[signal.data.length - 1].x
    let step = Number.parseFloat((signal.data[1].x - signal.data[0].x).toFixed(10))
    let length = xMax - xMin
    signal.params = {
      xMin, xMax, step, length
    }
  },

  /**
   * @param {Signal[]} signals
   */
  checkSignalsValueGrid(signals) {
    let step = signals[0].params.step
    for (let signal of signals) {
      if (signal.params.step !== step) return false
      for (let signalToCompare of signals) {
        if (!Number.isInteger((signal.params.xMin - signalToCompare.params.xMin) / step))
          return false
      }
    }
    return true
  },

  /**
   * @param {Signal} signal1
   * @param {Signal} signal2
   */
  estimateCorrelationFunction(signal1, signal2) {
    let step = signal1.params.step
    let tauMin = - signal2.params.xMax + signal1.params.xMin
    let tauMax = - signal2.params.xMin + signal1.params.xMax
    let xMin = signal1.params.xMin - signal2.params.length
    let xMax = signal1.params.xMax + signal2.params.length
    let tau = tauMin
    let outData = []
    while (tau <= tauMax) {
      let point = {
        x: tau,
        y: this.calculateCorrelationValue(signal1, signal2, tau, xMin, xMax, step)
      }
      outData.push(point)
      tau += step
    }
    return outData
  },

  /**
   *
   * @param {Signal} signal1
   * @param {Signal} signal2
   * @param {number} tau
   * @param {number} xMin
   * @param {number} xMax
   * @param {number} step
   */
  calculateCorrelationValue(signal1, signal2, tau, xMin, xMax, step) {
    let x = xMin
    let value = 0.0
    while (x <= xMax) {
      value += step * (this.getSignalValue(signal1, x) * this.getSignalValue(signal2, x - tau)
          + this.getSignalValue(signal1, x - step) * this.getSignalValue(signal2, x - step - tau)) / 2
      x += step
    }
    return value
  },

  /**
   * @param {Signal} signal
   * @param {number} x
   */
  getSignalValue(signal, x) {
    if (x > signal.params.xMax || x < signal.params.xMin) {
      return 0.0
    }
    let i = Math.round((x - signal.params.xMin) / signal.params.step)
    return signal.data[i].y
  },

  /**
   * @param {Signal[]} signals
   */
  makeCommonSignalsValueGrid(signals) {
    let step = signals[0].params.step
    let xMin = signals[0].params.xMin
    let xMax = signals[0].params.xMax
    for (let signal of signals) {
      if (signal.params.xMin < xMin) xMin = signal.params.xMin
      if (signal.params.xMax > xMax) xMax = signal.params.xMax
    }
    let grid = []
    let x = xMin
    while (x <= xMax) {
      grid.push(x)
      x += step
    }
    return grid
  }

}