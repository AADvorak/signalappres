Adder = {

  init(param) {
    let output = {
      title: {
        name: 'Adder output signal',
        description: `Sum of ${param.length} signals`
      },
      data: []
    }
    for (let data of param) {
      if (!output.data.length) {
        for (let item of data) output.data.push({
          x: item.x,
          y: parseFloat(item.y)
        })
      } else {
        for (let i = 0; i < data.length; i++) {
          if (output.data[i] && data[i].x === output.data[i].x) {
            output.data[i].y += parseFloat(data[i].y)
          }
        }
      }
    }
    Workspace.startModule({
      module: 'Cable',
      param: output
    }).then()
  }

}
