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
    for (let signal of param) {
      if (!output.data.length) {
        for (let item of signal.data) output.data.push({
          x: item.x,
          y: parseFloat(item.y)
        })
      } else {
        for (let i = 0; i < signal.data.length; i++) {
          if (output.data[i] && signal.data[i].x === output.data[i].x) {
            output.data[i].y += parseFloat(signal.data[i].y)
          }
        }
      }
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
