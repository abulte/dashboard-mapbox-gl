<template>
  <div class="stats-container">
    <div v-if="$mq === 'small'">
      <select name="geo-level" id="geo-level" v-model="selectedLevel">
        <option :value="level.code" v-for="level in levels" :key="level.code">
          <span :class="{region: level.level === 'region'}">{{ level.nom }}</span>
        </option>
      </select>
    </div>
    <h2>{{ stats.level }}</h2>
    <div>
      <h3>Montant</h3>
      <span>{{ stats.montant }} €</span>
    </div>
    <div>
      <h3>Nombre</h3>
      <span>{{ stats.nombre }} aides</span>
    </div>
    <div class="charts-container">
      <APE :chart-data="APEChartData"></APE>
    </div>
  </div>
</template>

<script>
import APE from '@/charts/APE.vue'
import { departementsRegions } from '@/utils/departements-regions.js'

export default {
  name: 'Stats',
  components: { APE },
  data () {
    return {
      levels: departementsRegions,
      selectedLevel: 'france'
    }
  },
  computed: {
    stats () {
      return this.$store.state.stats
    },
    aides () {
      return this.$store.state.aides
    },
    charts () {
      return this.$store.state.charts
    },
    APEChartData () {
      return {
        labels: this.charts.ape.labels,
        datasets: [
          {
            yAxisID: 'montants',
            label: 'Montant',
            backgroundColor: '#004192',
            data: this.charts.ape.montants
          }, {
            yAxisID: 'nombres',
            label: 'Nombre',
            backgroundColor: '#D1335B',
            data: this.charts.ape.nombres
          }
        ]
      }
    }
  },
  mounted () {
    this.$store.dispatch('getFranceData').then(() => {
      this.$store.dispatch('setSelectedLevel', 'france')
    })
  },
  watch: {
    selectedLevel (val, oldVal) {
      if (oldVal !== val && oldVal !== null) {
        this.$store.dispatch('setSelectedLevel', val)
      }
    }
  }
}
</script>

<style scoped>
.stats-container {
  z-index: 1;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  box-shadow: rgb(201, 211, 223) 0px 1px 4px;
}

.region {
  font-weight: bold;
}
</style>
