$(async function() {
  await ModuleLoader.loadModule({
    module: 'Workspace',
    container: $('body')
  }).init()
})
