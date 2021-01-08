$( document ).ready(function() {
  ModuleLoader.loadModule({module: 'Workspace', container: $('body')}).then((obj) => {
    obj.init()
  })
});
