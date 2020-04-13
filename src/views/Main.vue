<template>
  <div class="container">
    <Stats></Stats>
    <Map v-if="$mq === 'big'"></Map>
  </div>
</template>

<script>
import Map from './Map.vue'
import Stats from './Stats.vue'

export default {
  name: 'Main',
  components: { Map, Stats }
}
</script>

<style>
.container  {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
