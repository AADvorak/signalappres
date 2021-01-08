ApiProvider = {

  async getText(url) {
    return await fetch(url)
        .then(response => response.text())
        .catch(error => {})
  },

  async getJson(url) {
    return await fetch(url)
        .then(response => response.json())
        .catch(error => {})
  },

  async postJson(url, data) {
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
        .then(response => response.json())
        .catch(error => {})
  },

  async putJson(url, data) {
    return await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
        .then(response => response.json())
        .catch(error => {})
  },

  async del(url, data) {
    return await fetch(url, {
      method: 'DELETE'
    })
        .then(response => response.json())
        .catch(error => {})
  },

}