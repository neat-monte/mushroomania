<template>
  <v-expansion-panel title="Occurrence" elevation="0" bg-color="panel">
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
      />
      <v-switch
        v-model="mushroomStore.filterOptions.occurrence.isSeasonsStrict"
        hide-details
        :label="`${
          mushroomStore.filterOptions.occurrence.isSeasonsStrict
            ? 'Strict seasons'
            : 'Any season'
        }`"
      />
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
      />
      <v-switch
        v-model="mushroomStore.filterOptions.occurrence.isHabitatsStrict"
        hide-details
        :label="`${
          mushroomStore.filterOptions.occurrence.isHabitatsStrict
            ? 'Strict habitats'
            : 'Any habitat'
        }`"
      />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup>
import filterOptions from "@/data/filterOptions";
import useMushroomStore from "@/stores/mushrooms";

const mushroomStore = useMushroomStore();
</script>
