<template>
  <v-expansion-panel
    title="Occurrence"
    elevation="0"
    bg-color="blue-grey-lighten-3"
  >
    <v-expansion-panel-text>
      <v-select
        v-model="mushroomStore.filterOptions.occurrence.seasons"
        :items="filterOptions.occurrence.seasons"
        item-title="name"
        item-value="value"
        label="Seasons"
        chips
        multiple
        variant="underlined"
        hide-details="true"
        class="mb-2"
      ></v-select>
      <v-select
        v-model="mushroomStore.filterOptions.occurrence.habitats"
        :items="filterOptions.occurrence.habitats"
        item-title="name"
        item-value="value"
        label="Habitats"
        chips
        multiple
        variant="underlined"
        hide-details="true"
      ></v-select>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup>
import { filterOptions } from "@/utils/controls";
import useMushroomStore from "@/stores/mushrooms";

const mushroomStore = useMushroomStore();
</script>
