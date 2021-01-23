ChartDrawer = {

  /**
   * @param {Object} container
   * @param {Signal[]} signals
   */
  drawLines({container, signals}) {
    let categories = []
    for (let point of signals[0].data) {
      categories.push(parseFloat(point.x).toFixed(2))
    }
    let series = []
    for (let signal of signals) {
      let data = []
      for (let item of signal.data) {
        data.push(parseFloat(item.y))
      }
      series.push({
        name: signal.name,
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
    });
  },

  /**
   * @param {Signal[]} signals
   * @returns {string}
   */
  makeChartTitle(signals) {
    return signals.length > 1 ? `Selected ${signals.length} signals` : signals[0].name
  }

}
