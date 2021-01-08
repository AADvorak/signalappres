ModuleLoader = {

  async loadModule({module, container}) {
    await this.loadModuleScript(module)
    await this.loadHtmlToContainer({module, container})
    return window[module]
  },

  loadModuleScript(module) {
    return this.loadScript({
      src: this.getModuleScriptLink(module),
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

  async loadHtmlToContainer({module, container}) {
    if (container) {
      let html = await ApiProvider.getText(this.getModuleHtmlLink(module))
      if (html) container.html(html)
    }
  },

  getModuleScriptLink(module) {
    return '/js/' + module.toLowerCase() + '.js'
  },

  getModuleHtmlLink(module) {
    return '/html/' + module.toLowerCase() + '.html'
  },

}