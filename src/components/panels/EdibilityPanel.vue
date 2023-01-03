<template>
  <v-expansion-panel title="Edibility" elevation="0" bg-color="panel">
    <v-expansion-panel-text>
      <v-select
        v-model="mushroomStore.filterOptions.edibility.edibility"
        :items="filterOptions.edibility.edibility"
        item-title="name"
        item-value="value"
        label="Edibility"
        variant="underlined"
        hide-details="true"
      />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup>
import filterOptions from "@/data/filterOptions";
import useMushroomStore from "@/stores/mushrooms";

const mushroomStore = useMushroomStore();
</script>
