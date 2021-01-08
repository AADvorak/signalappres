ChartDrawer = {

  drawLine({container, signal}) {
    let categories = []
    let data = []
    for (let point of signal.data) {
      categories.push(parseFloat(point.x).toFixed(2))
      data.push(parseFloat(point.y))
    }
    let containerId = container.attr('id')
    Highcharts.chart(containerId, {
      xAxis: {
        categories
      },
      title: {
        text: signal.title.name
      },
      series: [{data}],
    });
  }

}
