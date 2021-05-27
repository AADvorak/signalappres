ChartDrawer = {

  /**
   * @param {Object} container
   * @param {Signal[]} signals
   */
  drawLines({container, signals}) {
    SignalUtils.calculateSignalsParams(signals)
    let commonGrid = SignalUtils.makeCommonSignalsValueGrid(signals)
    let categories = []
    for (let x of commonGrid) {
      categories.push(x.toFixed(2))
    }
    let series = []
    for (let signal of signals) {
      let data = []
      for (let x of commonGrid) {
        data.push(SignalUtils.getSignalValue(signal, x))
      }
      series.push({
        name: StringManager.restrictLength(signal.name, 50),
        data
      })
    }
    let containerId = container.attr('id')
    Highcharts.chart(containerId, {
      xAxis: {
        categories
      },
      title: {
        text: this.makeChartTitle(signals)
      },
      series,
      chart: {
        zoomType: 'xy'
      },
    });
  },

  /**
   * @param {Signal[]} signals
   * @returns {string}
   */
  makeChartTitle(signals) {
    return signals.length > 1 ? `Selected ${signals.length} signals` : StringManager.restrictLength(signals[0].name, 50)
  }

}
