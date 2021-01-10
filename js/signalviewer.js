SignalViewer = {

  /**
   * @param {Signal[]} signals
   */
  async init(signals) {
    let container = $('#SignalViewerChart')
    $('#SignalViewerBack').on('click', () => {
      Workspace.startModule({
        module: 'SignalManager'
      })
    })
    ChartDrawer.drawLines({container, signals})
  },

}
