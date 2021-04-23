ChartDrawer = {

  /**
   * @param {Object} container
   * @param {Signal[]} signals
   */
  drawLines({container, signals}) {
    let categories = []
    for (let point of signals[0].data) {
      categories.push(point.x.toFixed(2))
    }
    let series = []
    for (let signal of signals) {
      let data = []
      for (let item of signal.data) {
        data.push(item.y)
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
