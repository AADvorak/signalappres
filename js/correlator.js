Correlator = {

  /**
   * @param {Signal[]} param
   */
  init(param) {
    let output = {
      name: 'Correlator output signal',
      description: this.makeNewSignalDescription(param),
      data: SignalUtils.estimateCorrelationFunction(param[0], param[1])
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
    let description = `Correlation of signals:`
    for (let signal of signals) {
      description += `\n${signal.name},`
    }
    return description
  }

}