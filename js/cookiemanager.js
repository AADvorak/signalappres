CookieManager = {

  writeObjectToCookie(key, object) {
    this.writeValueToCookie(key, JSON.stringify(object))
  },

  readObjectFromCookie(key) {
    let json = this.readValueFromCookie(key)
    if (json) return JSON.parse(json)
  },

  readValueFromCookie(key) {
    return document.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*\\=\\s*([^;]*).*$)|^.*$`), '$1')
  },

  writeValueToCookie(key, value) {
    document.cookie = `${key}=${value}; max-age=31540000`
  }

}
