<template>
  <div class="exploration-grid">
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

.exploration-grid
  display: grid
  gap: $padding
  padding: $padding
  width: 100%
  height: 100%
  grid-template-columns: repeat(2, 1fr)
  --secondary-theme: #9E9E9E
  background: linear-gradient(45deg, #E0E0E0, var(--secondary-theme))

  #scatter-plot, #bar-chart, #season-table
    height: calc(50vh - $padding * 2)
</style>
