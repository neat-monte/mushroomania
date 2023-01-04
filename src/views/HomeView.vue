<template>
  <div id="exploration-grid">
    <ScatterPlot />
    <MushroomCard />
    <BarChart />
    <SeasonTable />
  </div>
</template>

<script setup>
import ScatterPlot from "@/components/ScatterPlot.vue";
import MushroomCard from "@/components/MushroomCard.vue";
import SeasonTable from "@/components/SeasonTable.vue";
import BarChart from "@/components/BarChart.vue";
</script>

<style lang="sass">
$padding: 6px

#exploration-grid
  display: grid
  gap: $padding
  padding: $padding
  width: 100%
  height: 100%
  grid-template-columns: repeat(2, 1fr)
  background: rbg(var(--v-theme-background))

  #scatter-plot, #bar-chart, #season-table, #mushroom-card
    height: calc(50vh - $padding * 2)
</style>
