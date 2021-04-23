DSolver = {

  /**
   *
   * @param {SignalData[]} inData
   * @param {function[]} equations
   * @param {Object} params
   * @param {number[]} initial
   * @param {number} outNumber
   * @returns {SignalData[]}
   */
  solveEulerMethod({inData, equations, params, initial, outNumber}) {
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
  }

}