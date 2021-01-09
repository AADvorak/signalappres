FileManager = {

  saveToFile(txt) {
    const file = new File([txt], 'signal.txt', {type: 'application/octet-stream'})
    const blobUrl = (URL || webkitURL).createObjectURL(file)
    window.location = blobUrl
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
  }

}
