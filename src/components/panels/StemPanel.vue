<template>
  <v-expansion-panel title="Stem" elevation="0" bg-color="panel">
    <v-expansion-panel-text>
      <v-select
        v-model="mushroomStore.filterOptions.stem.color"
        :items="filterOptions.stem.color"
        item-title="name"
        item-value="value"
        label="Stem color"
        chips
        multiple
        variant="underlined"
        hide-details="true"
        class="mb-2"
      />
      <v-select
        v-model="mushroomStore.filterOptions.stem.hasRing"
        :items="filterOptions.stem.hasRing"
        item-title="name"
        item-value="value"
        label="Has ring"
        variant="underlined"
        hide-details="true"
      />
      <v-select
        v-model="mushroomStore.filterOptions.stem.ringType"
        :items="filterOptions.stem.ringType"
        item-title="name"
        item-value="value"
        label="Ring type"
        chips
        multiple
        variant="underlined"
        hide-details="true"
        class="mb-2"
      />
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup>
import filterOptions from "@/data/filterOptions";
import useMushroomStore from "@/stores/mushrooms";

const mushroomStore = useMushroomStore();
</script>
