FileManager = {

  /**
   * @param {Signal} signal
   */
  saveToFile(signal) {
    const txt = this.signalDataToTxt(signal.data)
    let element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt))
    element.setAttribute('download', signal.name + '.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  },

  readFile(fileInp) {
    return new Promise((resolve, reject) => {
      let file = fileInp.prop('files')[0]
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resolve(this.txtToSignalData(atob(reader.result.split(',')[1])))
      }
      reader.onerror = (error) => {
        reject(error)
      }
    })
  },

  txtToSignalData(txt) {
    let data = []
    let strArr = txt.split('\n')
    for (let str of strArr) {
      let values = str.split(' ')
      let item = {
        x: values[0],
        y: values[1]
      }
      if (item.x && item.y) {
        data.push({
          x: values[0],
          y: values[1]
        })
      }
    }
    return data
  },

  /**
   * @param {SignalData[]} data
   */
  signalDataToTxt(data) {
    let txt = ''
    for (let item of data) {
      txt += `${item.x} ${item.y}\n`
    }
    return txt
  }

}
