<template>
    <div class="grid-layout pa-0 ma-0">
      <ScatterPlot />
      <div>Mushroom info</div>
      <BarChart />
      <SeasonTable />
    </div>
</template>

<script setup>
import ScatterPlot from "@/components/ScatterPlot.vue";
import SeasonTable from "@/components/SeasonTable.vue";
import BarChart from "../components/BarChart.vue";
</script>

<style lang="sass">
.grid-layout
  display: grid
  width: 100%
  height: 100%
  grid-template-columns: repeat(2, 1fr)
  --secondary-theme: #9E9E9E
  background: linear-gradient(45deg, #E0E0E0, var(--secondary-theme))

  #scatter-plot, #bar-chart, #season-table
    height: 50vh
</style>