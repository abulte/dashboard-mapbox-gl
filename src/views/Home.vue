<template>
  <div class="map-container">
    <mapbox
      accessToken=""
      :map-options="{
        style: 'https://etalab-tiles.fr/styles/osm-bright/style.json',
        bounds: [
          [-3.079, 42.173],
          [9.047, 49.963]
        ],
        zoom: 5,
      }"
      @map-load="loaded"
    />
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue'

export default {
  name: 'Home',
  components: { Mapbox },
  data () {
    return {
      departements: undefined,
      map: undefined
    }
  },
  methods: {
    loaded (map) {
      map.addSource('departements', {
        type: 'geojson',
        data: this.departements
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
    }
  },
  mounted () {
    const dptUrl = 'https://raw.githubusercontent.com/etalab/DVF-app/master/static/donneesgeo/departements-100m.geojson'
    this.$http.get(dptUrl).then(res => {
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
