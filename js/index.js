$( window ).on( 'load', async () => {
  (await ModuleLoader.loadModule({
    module: 'Workspace',
    container: $('body')
  })).init()
})
