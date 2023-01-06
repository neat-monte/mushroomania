<template>
  <div id="exploration-grid" class="w-100 h-100">
    <ScatterPlot />
    <MushroomCard />
    <ColumnChart />
    <FloatingRowChart />
  </div>
</template>

<script setup>
import ScatterPlot from "@/components/ScatterPlot.vue";
import MushroomCard from "@/components/card/MushroomCard.vue";
import FloatingRowChart from "@/components/FloatingRowChart.vue";
import ColumnChart from "@/components/ColumnChart.vue";
</script>

<style lang="sass">
$padding: 6px

#exploration-grid
  display: grid
  grid-template-columns: repeat(1, 1fr)
  background: rbg(var(--v-theme-background))
  gap: $padding
  padding: $padding

  #scatter-plot
    order: 1
  #bar-chart
    order: 2
  #mushroom-card
    order: 3
  #season-table
    order: 4
    height: 55vh
    width: 100vw

@media screen and (min-width: 1025px)
  #exploration-grid
    grid-template-columns: repeat(2, 1fr)

    #scatter-plot
      order: 1
    #bar-chart
      order: 3
    #mushroom-card
      order: 2
    #season-table
      order: 4

    #scatter-plot, #bar-chart, #mushroom-card, #season-table
      height: calc(50vh - $padding * 2)
      width: 100%
</style>
