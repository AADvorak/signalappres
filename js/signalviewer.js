SignalViewer = {

  async init(param) {
    this.signal = param
    let container = $('#SignalViewerChart')
    $('#SignalViewerBack').on('click', () => {
      Workspace.startModule({
        module: 'SignalManager'
      })
    })
    ChartDrawer.drawLine({container, signal: this.signal})
  },

}
