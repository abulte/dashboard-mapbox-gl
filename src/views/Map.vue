<template>
  <div class="map-container" :class="{container: this.$route.path === '/map'}">
    <mapbox
      accessToken=""
      :map-options="{
        style: 'https://etalab-tiles.fr/styles/osm-bright/style.json',
        bounds: [-5.141277, 41.333907, 9.560053, 51.088991],
      }"
      @map-load="loaded"
    />
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue'
import bbox from '@turf/bbox'
import { layers } from '@/map/layers'

let map

export default {
  name: 'Map',
  components: { Mapbox },
  computed: {
    departements () {
      return this.$store.state.contours.departements
    },
    regions () {
      return this.$store.state.contours.regions
    },
    centers () {
      return this.$store.state.contours.centers
    },
    aides () {
      return this.$store.state.aidesGeo
    }
  },
  data () {
    return {
      loadingPromises: {
        departements: null,
        regions: null
      },
      hoveredStateId: {
        departements: null,
        regions: null
      }
    }
  },
  methods: {
    loaded (_map) {
      map = _map
      this.loadingPromises.regions.then(() => {
        this.initMapRegions()
      })
      this.loadingPromises.departements.then(() => {
        this.initMapDepartements()
      })
    },
    initMapRegions () {
      map.addSource('regions', {
        type: 'geojson',
        generateId: true,
        data: this.regions
      })
      map.addLayer(layers.regions)
      map.addLayer(layers.regionsLines)
      // regions aides
      map.addSource('regions-aides', {
        type: 'geojson',
        data: this.aides.regions
      })
      map.addLayer(layers.regionsAides)
      map.addLayer(layers.regionsAidesMontants)
      map.on('click', 'regions-fill', this.onRegionClick)
      // hover
      map.on('mousemove', 'regions-fill', e => { this.onMouseMove(e, 'regions') })
      map.on('mouseleave', 'regions-fill', e => { this.onMouseLeave(e, 'regions') })
    },
    initMapDepartements () {
      // add departements source (empty at first) and layers
      map.addSource('departements', {
        type: 'geojson',
        generateId: true,
        data: this.departements
      })
      map.addLayer(layers.departements)
      map.addLayer(layers.departementsLines)
      // departements aides
      map.addSource('departements-aides', {
        type: 'geojson',
        data: this.aides.departements
      })
      map.addLayer(layers.departementsAides)
      map.addLayer(layers.departementsAidesMontants)
      map.on('click', 'departements-fill', this.onDepartementClick)
      // hover
      map.on('mousemove', 'departements-fill', e => { this.onMouseMove(e, 'departements') })
      map.on('mouseleave', 'departements-fill', e => { this.onMouseLeave(e, 'departements') })
    },
    onRegionClick (event) {
      const regionCode = event.features[0].properties.code
      this.goToRegion(regionCode)
      this.$store.dispatch('setSelectedLevel', `region:${regionCode}`)
    },
    goToRegion (code) {
      const departements = this.departements.features.filter(dpt => {
        return dpt.properties.region === code
      })
      // FIXME: fit on region instead of department collection (perf)
      this.fit({
        type: 'FeatureCollection',
        features: departements
      })
    },
    onDepartementClick (event) {
      const dptCode = event.features[0].properties.code
      this.$store.dispatch('setSelectedLevel', `departement:${dptCode}`)
    },
    fit (geojson) {
      var _bbox = bbox(geojson)
      map.fitBounds(_bbox, { padding: 20, animate: true })
    },
    onMouseMove (event, source) {
      const canvas = map.getCanvas()
      canvas.style.cursor = 'pointer'
      if (event.features.length > 0) {
        if (this.hoveredStateId[source] !== null) {
          map.setFeatureState({ source, id: this.hoveredStateId[source] }, { hover: false }) // clean all sources to prevent error
        }
        this.hoveredStateId[source] = event.features[0].id
        map.setFeatureState({ source, id: this.hoveredStateId[source] }, { hover: true })
      }
    },
    onMouseLeave (event, source) {
      const canvas = map.getCanvas()
      canvas.style.cursor = ''
      if (this.hoveredStateId[source] !== null) {
        map.setFeatureState({ source, id: this.hoveredStateId[source] }, { hover: false })
      }
    }
  },
  mounted () {
    this.$store.dispatch('getInitialData').then(() => {
      this.loadingPromises.regions = this.$store.dispatch('getRegionsData')
      this.loadingPromises.departements = this.$store.dispatch('getDepartementsData')
    })
  }
}
</script>

<style scoped>
.map-container {
  flex: 1;
  height: 100%;
}
#map {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
