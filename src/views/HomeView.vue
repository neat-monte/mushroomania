<template>
  <ScatterPlot :data="data" />
  <SeasonTable :data="data" :style="{width: '50vw', height: '50vh'}"/>
</template>

<script setup>
import SeasonTable from "../components/SeasonTable.vue";
import ScatterPlot from "../components/ScatterPlot.vue";
import data from "../data/mushroom-data.json";
</script>
