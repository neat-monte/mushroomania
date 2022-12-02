<template>
  <ScatterPlot :data="data" />
</template>

<script setup>
import ScatterPlot from "../components/ScatterPlot.vue";
import data from "../data/mushroom-data.json";
</script>
