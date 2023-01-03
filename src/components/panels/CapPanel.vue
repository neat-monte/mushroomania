<template>
  <v-expansion-panel title="Cap" elevation="0" bg-color="panel">
    <v-expansion-panel-text>
      <v-select
        v-model="mushroomStore.filterOptions.cap.shape"
        :items="filterOptions.cap.shape"
        item-title="name"
        item-value="value"
        label="Cap shape"
        chips
        multiple
        variant="underlined"
        hide-details="true"
        class="mb-2"
      ></v-select>
      <v-select
        v-model="mushroomStore.filterOptions.cap.color"
        :items="filterOptions.cap.color"
        item-title="name"
        item-value="value"
        label="Cap color"
        chips
        multiple
        variant="underlined"
        hide-details="true"
      ></v-select>
      <v-select
        v-model="mushroomStore.filterOptions.cap.gillColor"
        :items="filterOptions.cap.gillColor"
        item-title="name"
        item-value="value"
        label="Gill color"
        chips
        multiple
        variant="underlined"
        hide-details="true"
      ></v-select>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup>
import filterOptions from "@/data/filterOptions";
import useMushroomStore from "@/stores/mushrooms";

const mushroomStore = useMushroomStore();
</script>
