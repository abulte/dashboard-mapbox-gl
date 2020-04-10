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

let map

export default {
  name: 'Home',
  components: { Mapbox },
  data () {
    return {
      departements: undefined,
      regions: undefined,
      centers: [],
      // dummy example data filled later
      regionsAides: {
        type: 'FeatureCollection',
        features: []
      }
    }
  },
  methods: {
    loaded (_map) {
      // NB: this.map = map leads to strange things, use global var instead
      map = _map

      // add regions source and layers
      map.addSource('regions', {
        type: 'geojson',
        data: this.regions
      })
      map.addLayer({
        id: 'regions-fill',
        type: 'fill',
        source: 'regions',
        layout: {},
        paint: {
          'fill-color': '#2a4ba9',
          'fill-outline-color': '#627BC1',
          'fill-opacity': 0.2
        }
      })
      map.addLayer({
        id: 'regions-lines',
        type: 'line',
        source: 'regions',
        layout: {},
        paint: {
          'line-color': '#627BC1',
          'line-width': 1
        }
      })
      // regions aides
      map.addSource('regions-aides', {
        type: 'geojson',
        data: this.regionsAides
      })
      map.addLayer({
        id: 'regions-aides',
        type: 'circle',
        source: 'regions-aides',
        paint: {
          'circle-opacity': 0.6,
          'circle-color': 'grey',
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['sqrt', ['number', ['get', 'montantAide']]],
            0,
            10,
            100,
            70
          ]
        }
      })
      map.addLayer({
        id: 'regions-aides-montants',
        type: 'symbol',
        source: 'regions-aides',
        layout: {
          'text-field': '{montantAide}k€',
          'text-size': 14
        }
      })
      map.on('click', 'regions-fill', this.onRegionClick)

      // add departements source (empty at first) and layers
      map.addSource('departements', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })
      map.addLayer({
        id: 'departements-fill',
        type: 'fill',
        source: 'departements',
        layout: {},
        paint: {
          'fill-color': '#2a4ba9',
          'fill-outline-color': '#627BC1',
          'fill-opacity': 0.2
        }
      })
      map.addLayer({
        id: 'departements-lines',
        type: 'line',
        source: 'departements',
        layout: {},
        paint: {
          'line-color': '#627BC1',
          'line-width': 1
        }
      })
      map.on('click', 'departements-fill', this.onDepartementClick)
    },
    onRegionClick (event) {
      const regionCode = event.features[0].properties.code
      this.goToRegion(regionCode)
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
      this.fit(data)
    },
    onDepartementClick (event) {
      console.log(event)
    },
    fit (geojson) {
      var _bbox = bbox(geojson)
      map.fitBounds(_bbox, { padding: 20, animate: true })
    },
    getRandomInteger () {
      return Math.round(Math.random() * (1000 - 10) + 10)
    }
  },
  mounted () {
    this.$http.get('/geodata/centers.json').then(res => {
      this.centers = res.body
    })
    this.$http.get('/geodata/regions-100m.geojson').then(res => {
      this.regions = res.body
      // fill dummy data for aides
      this.regionsAides.features = this.regions.features.map(reg => {
        const center = this.centers[`REG-${reg.properties.code}`]
        return {
          type: 'Feature',
          properties: {
            montantAide: this.getRandomInteger()
          },
          geometry: {
            type: 'Point',
            coordinates: center
          }
        }
      })
    })
    this.$http.get('/geodata/departements-100m.geojson').then(res => {
      this.departements = res.body
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
  /* background-color: #2a4ba9;
  background-color: #627BC1; */
}
</style>
