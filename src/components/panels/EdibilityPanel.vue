<template>
  <v-expansion-panel
    title="Edibility"
    elevation="0"
    bg-color="blue-grey-lighten-3"
  >
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
import { filterOptions } from "@/utils/controls";
import useMushroomStore from "@/stores/mushrooms";

const mushroomStore = useMushroomStore();
</script>
