<template>
  <BarChart :data="data" />
</template>

<script setup>
import BarChart from "../components/BarChart.vue";
import data from "../data/mushroom-data.json";
</script>
