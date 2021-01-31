CookieManager = {

  writeObjectToCookie(key, object) {
    let writtenKeys = ''
    for (let objKey in object) {
      if (object.hasOwnProperty(objKey)) {
        let value = object[objKey]
        if (typeof value !== 'object') {
          this.writeValueToCookie(key + objKey, value)
          writtenKeys += writtenKeys ? ',' + objKey : objKey
        }
      }
    }
    if (writtenKeys) this.writeValueToCookie(key + 'keys', writtenKeys)
  },

  readObjectFromCookie(key) {
    let object = {}
    let writtenKeys = this.readValueFromCookie(key + 'keys')
    if (writtenKeys && writtenKeys.length) {
      let writtenKeysArr = []
      if (writtenKeys.includes(',')) {
        writtenKeysArr = writtenKeys.split(',')
      } else {
        writtenKeysArr.push(writtenKeys)
      }
      for (let objKey of writtenKeysArr) {
        object[objKey] = this.readValueFromCookie(key + objKey)
      }
      return object
    }
  },

  readValueFromCookie(key) {
    return document.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*\\=\\s*([^;]*).*$)|^.*$`), '$1')
  },

  writeValueToCookie(key, value) {
    document.cookie = `${key}=${value}; max-age=31540000`
  }

}
