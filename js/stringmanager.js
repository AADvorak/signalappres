StringManager = {

  restrictLength(str, length) {
    return str.length > length ? str.substring(0, length) + '...' : str
  },

  onlyBeforeNewLine(str) {
    return str.includes('\n') ? str.split('\n')[0] + '...' : str
  }

}
