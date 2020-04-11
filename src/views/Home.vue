<template>
  <div class="map-container">
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
  name: 'Home',
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
    }
  },
  data () {
    return {
      loadingData: null,
      hoveredStateId: {
        regions: null,
        departements: null
      },
      // dummy example data filled later
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
    }
  },
  methods: {
    loaded (_map) {
      map = _map
      console.log('map loaded')
      this.loadingData.then(() => {
        console.log('promise resolved')
        this.initMap()
      })
    },
    initMap () {
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

      // add departements source (empty at first) and layers
      map.addSource('departements', {
        type: 'geojson',
        generateId: true,
        data: {
          type: 'FeatureCollection',
          features: []
        }
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
      this.toggleAidesVisibility('regions', false)
    },
    toggleAidesVisibility (layer, isVisible) {
      const newVisibility = isVisible ? 'visible' : 'none'
      map.setLayoutProperty(`${layer}-aides`, 'visibility', newVisibility)
      map.setLayoutProperty(`${layer}-aides-montants`, 'visibility', newVisibility)
    },
    goToRegion (code) {
      const departements = this.departements.features.filter(dpt => {
        return dpt.properties.region === code
      })
      this.addDepartementsLayer(departements)
    },
    addDepartementsLayer (departements) {
      const data = {
        type: 'FeatureCollection',
        features: departements
      }
      map.getSource('departements').setData(data)
      this.toggleAidesVisibility('departements', true)
      this.fit(data)
    },
    onDepartementClick (event) {
      console.log(event)
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
    this.loadingData = this.$store.dispatch('getInitialData')
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
  /* background-color: #2a4ba9;
  background-color: #627BC1; */
}
</style>
