<template>
  <v-expansion-panel title="Damage" elevation="0" bg-color="panel">
    <v-expansion-panel-text>
      <v-select
        v-model="mushroomStore.filterOptions.damage.damage"
        :items="filterOptions.damage.damage"
        item-title="name"
        item-value="value"
        label="Damage"
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
