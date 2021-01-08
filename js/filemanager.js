FileManager = {

  saveToFile(txt) {
    const file = new File([txt], 'signal.txt', {type: 'application/octet-stream'})
    const blobUrl = (URL || webkitURL).createObjectURL(file)
    window.location = blobUrl
  }

}
