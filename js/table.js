class Table {

  constructor({id, container, fields, selectors}) {
    this.container = container
    this.fields = fields
    this.id = id
    this.selectors = selectors
    this.selectedData = []
    this.makeTableHeader()
  }

  makeTableHeader() {
    let id = this.id
    let colsHtml = ''
    if (this.selectors) {
      colsHtml += '<th>Select</th>'
    }
    for (let key in this.fields) {
      let field = this.fields[key]
      colsHtml += '<th id=' + id + '_' + key + '" scope="col">' + (field.name || '') + '</th>'
    }
    this.container.append('<table id="' + id + '" class="table">\n<thead>\n<tr>\n' +
        colsHtml + '</tr>\n</thead>\n<tbody id="' + id + '_body"></tbody>\n</table>')
    this.table = $('#' + id)
    this.tableBody = $('#' + id + '_body')
  }

  makeTableRow(data) {
    let html = ''
    let events = []
    let selectorId
    if (this.selectors) {
      selectorId = this.id + '_selector_' + data.id
      html += `<td style="text-align: center"><input class="form-check-input" style="position: relative;" type="checkbox" id="${selectorId}"></td>`
    }
    for (let key in this.fields) {
      let item = data[key] || ''
      let format = this.fields[key].format
      if (format) item = format(item, data)
      let cellId = ''
      if (data.id) {
        cellId = this.id + '_' + key + '_' + data.id
        let click = this.fields[key].click
        if (click) {
          events.push({
            data,
            cellId,
            click
          })
        }
      }
      html += `<td id="${cellId}">${item}</td>`
    }
    this.tableBody.append('<tr>' + html + '</tr>')
    for (let event of events) {
      $('#' + event.cellId).on('click', () => {
        event.click(event.data)
      })
    }
    if (this.selectors) {
      let selector = $('#' + selectorId)
      selector.on('click', () => {
        if (selector.prop('checked')) {
          this.selectedData.push(data)
        } else {
          for (let i = 0; i < this.selectedData.length; i++) {
            if (data.id === this.selectedData[i].id) this.selectedData.splice(i, 1)
          }
        }
      })
    }
  }

  makeTableRows(dataArr) {
    for (let data of dataArr) {
      this.makeTableRow(data)
    }
  }

  clearAll() {
    this.tableBody.html('')
  }

  getSelectedData() {
    return this.selectedData
  }

}