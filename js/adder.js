Adder = {

  /**
   * @param {Signal[]} param
   */
  init(param) {
    let output = {
      name: 'Adder output signal',
      description: this.makeNewSignalDescription(param),
      data: []
    }
    let commonGrid = SignalUtils.makeCommonSignalsValueGrid(param)
    for (let x of commonGrid) {
      let y = 0
      for (let signal of param) {
        y += SignalUtils.getSignalValue(signal, x)
      }
      output.data.push({x, y})
    }
    Workspace.startModule({
      module: 'Cable',
      param: output
    }).then()
  },

  /**
   * @param {Signal[]} signals
   * @returns {string}
   */
  makeNewSignalDescription(signals) {
    let description = `Sum of ${signals.length} signals:`
    for (let signal of signals) {
      description += `\n${signal.name},`
    }
    return description
  }

}
