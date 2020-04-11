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
    aidesGeo: {
      departements: {
        type: 'FeatureCollection',
        features: []
      },
      regions: {
        type: 'FeatureCollection',
        features: []
      }
    },
    aides: {
      departements: [],
      regions: []
    }
  },
  mutations: {
    setCenters (state, data) {
      state.contours.centers = data
    },
    setDepartements (state, data) {
      state.contours.departements = data
    },
    setDepartementsAides (state, data) {
      state.aidesGeo.departements.features = data.map(dep => {
        const center = state.contours.centers[`DEP-${dep.dep}`]
        return {
          type: 'Feature',
          properties: {
            montantMillions: parseFloat((parseFloat(dep.montant) / 1000 / 1000).toFixed(2)),
            montant: parseFloat(dep.montant),
            nombre: dep.nombre
          },
          geometry: {
            type: 'Point',
            coordinates: center
          }
        }
      })
    },
    setRegions (state, data) {
      state.contours.regions = data
    },
    setRegionsAides (state, data) {
      state.aides.regions = data
      state.aidesGeo.regions.features = data.map(reg => {
        const center = state.contours.centers[`REG-${reg.reg}`]
        return {
          type: 'Feature',
          properties: {
            montantMillions: parseFloat((parseFloat(reg.montant) / 1000 / 1000).toFixed(2)),
            montant: parseFloat(reg.montant),
            nombre: reg.nombre
          },
          geometry: {
            type: 'Point',
            coordinates: center
          }
        }
      })
    }
  },
  actions: {
    getInitialData (context) {
      return api.get('/geodata/centers.json').then(data => {
        context.commit('setCenters', data)
      })
    },
    getRegionsData (context) {
      return Promise.all([
        api.get('/geodata/regions-100m.geojson').then(data => {
          context.commit('setRegions', data)
        }),
        api.get('/data/aides-maille-regional.json').then(data => {
          context.commit('setRegionsAides', data)
        })
      ])
    },
    getDepartementsData (context) {
      return Promise.all([
        api.get('/geodata/departements-100m.geojson').then(data => {
          context.commit('setDepartements', data)
        }),
        api.get('/data/aides-maille-departemental.json').then(data => {
          context.commit('setDepartementsAides', data)
        })
      ])
    }
  },
  modules: {
  }
})
