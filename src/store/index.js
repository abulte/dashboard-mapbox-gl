import Vue from 'vue'
import Vuex from 'vuex'

import api from '@/services/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    contours: {
      departements: {
        type: 'FeatureCollection',
        features: []
      },
      regions: {
        type: 'FeatureCollection',
        features: []
      },
      centers: []
    },
    aides: {
      departements: {
        type: 'FeatureCollection',
        features: []
      },
      regions: {
        type: 'FeatureCollection',
        features: []
      }
    }
  },
  mutations: {
    setCenters (state, data) {
      state.contours.centers = data
    },
    setDepartements (state, data) {
      state.contours.departements = data
    },
    setRegions (state, data) {
      state.contours.regions = data
      console.log('setRegions done', data)
    }
  },
  actions: {
    getInitialData (context) {
      console.log('getInitialData launched')
      return Promise.all([
        api.get('/geodata/centers.json').then(data => {
          console.log('got data for centers', data)
          context.commit('setCenters', data)
        }),
        api.get('/geodata/regions-100m.geojson').then(data => {
          console.log('got data for regions', data)
          context.commit('setRegions', data)
        }),
        api.get('/geodata/departements-100m.geojson').then(data => {
          console.log('got data for departements', data)
          context.commit('setDepartements', data)
        })
      ])
    }
  },
  modules: {
  }
})
