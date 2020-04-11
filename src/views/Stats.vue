<template>
  <div class="stats-container">
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

export default {
  name: 'Stats',
  components: { APE },
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
</style>
