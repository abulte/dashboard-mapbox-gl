import Vue from 'vue'

export default {
  get (url) {
    return Vue.http.get(url)
      .then((response) => Promise.resolve(response.data))
      .catch((error) => Promise.reject(error))
  }
}
