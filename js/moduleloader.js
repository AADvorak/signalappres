ModuleLoader = {

  async loadModule({module, container, isUserModule}) {
    await this.loadModuleScript({module, isUserModule})
    await this.loadHtmlToContainer({module, container, isUserModule})
    return window[module]
  },

  loadModuleScript({module, isUserModule}) {
    return this.loadScript({
      src: this.getModuleResourceLink({module, isUserModule, extension: 'js'}),
      id: 'script_' + module
    })
  },

  loadScript({src, id}) {
    return new Promise((resolve, reject) => {
      let newScript = document.createElement('script')
      newScript.setAttribute('src', src)
      newScript.setAttribute('id', id)
      newScript.onload = () => {
        resolve()
      }
      document.head.appendChild(newScript)
    })
  },

  async loadHtmlToContainer({module, container, isUserModule}) {
    if (container) {
      let html = await ApiProvider.getText(this.getModuleResourceLink({module, isUserModule, extension: 'html'}))
      if (html) container.html(html)
    }
  },

  getModuleResourceLink({module, isUserModule, extension}) {
    let path = isUserModule ? '/modules/' + module.toLowerCase() + '/' : '/' + extension + '/'
    return path + module.toLowerCase() + '.' + extension
  },

}