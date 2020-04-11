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
      regions: [],
      france: []
    },
    stats: {
      montant: 0,
      nombre: 0,
      level: ''
    },
    charts: {
      ape: {
        labels: [],
        montants: [],
        nombres: []
      },
      effectifs: {
        labels: [],
        montants: [],
        nombres: []
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
    setDepartementsAides (state, data) {
      state.aides.departements = data
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
    },
    setFrance (state, data) {
      state.aides.france = data
    },
    setAPEChartData (state, { labels, montants, nombres }) {
      state.charts.ape.labels = labels
      state.charts.ape.montants = montants
      state.charts.ape.nombres = nombres
    },
    setStats (state, { montant, nombre, level }) {
      state.stats.montant = montant
      state.stats.nombre = nombre
      state.stats.level = level
    }
  },
  actions: {
    setSelectedLevel ({ state, commit }, level) {
      console.log(level)
      // compute charts data based on selected
      // better yet: watch a "selectedLevel" property and act on it
      if (level === 'france') {
        const aides = state.aides.france
        commit('setAPEChartData', {
          labels: aides.kpi_top_10_naf.map(d => d.libelle_division_naf),
          montants: aides.kpi_top_10_naf.map(d => d.montant),
          nombres: aides.kpi_top_10_naf.map(d => d.nombre)
        })
        commit('setStats', {
          montant: aides.montant,
          nombre: aides.nombre,
          level: 'France'
        })
      // departement comes before region because we also get a click
      // on region when clicking on departement (fix on map if possible)
      } else if (level.startsWith('departement:')) {
        const code = level.replace('departement:', '')
        const aides = state.aides.departements.find(r => r.dep === code)
        commit('setAPEChartData', {
          labels: aides.kpi_top_10_naf.map(d => d.libelle_division_naf),
          montants: aides.kpi_top_10_naf.map(d => d.montant),
          nombres: aides.kpi_top_10_naf.map(d => d.nombre)
        })
        commit('setStats', {
          montant: aides.montant,
          nombre: aides.nombre,
          level: `Département ${aides.libelle}`
        })
      } else if (level.startsWith('region:')) {
        const code = level.replace('region:', '')
        const aides = state.aides.regions.find(r => r.reg === code)
        commit('setAPEChartData', {
          labels: aides.kpi_top_10_naf.map(d => d.libelle_division_naf),
          montants: aides.kpi_top_10_naf.map(d => d.montant),
          nombres: aides.kpi_top_10_naf.map(d => d.nombre)
        })
        commit('setStats', {
          montant: aides.montant,
          nombre: aides.nombre,
          level: `Région ${aides.libelle}`
        })
      }
    },
    getInitialData (context) {
      return api.get('/geodata/centers.json').then(data => {
        context.commit('setCenters', data)
      })
    },
    getFranceData (context) {
      return api.get('/data/aides-maille-national.json').then(data => {
        context.commit('setFrance', data[0])
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
