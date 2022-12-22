<template>
  <v-expansion-panel
    title="Search"
    elevation="0"
    bg-color="blue-grey-lighten-3"
  >
    <v-expansion-panel-text>
      <v-autocomplete
        v-model="mushroomStore.filterOptions.search.family"
        :items="mushroomStore.families"
        label="Family"
        hide-no-data
        hide-selected
        clearable
        variant="underlined"
      />
      <v-text-field
        v-model="mushroomStore.filterOptions.search.name"
        hint="Enter at least 3 characters"
        clearable
        label="Name"
        variant="underlined"
      />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup>
import useMushroomStore from "@/stores/mushrooms";

const mushroomStore = useMushroomStore();
</script>
