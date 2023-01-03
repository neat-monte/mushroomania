<template>
  <v-navigation-drawer permanent color="panel">
    <v-container class="d-flex flex-column">
      <h2 class="title mb-2 text-center text-uppercase text-accent">
        Mushr<span class="text-accent-lighten-2">oo</span>mania
      </h2>
      <div id="filter-panels">
        <v-expansion-panels multiple color="panel">
          <SearchPanel />
          <EdibilityPanel />
          <OccurrencePanel />
          <CapPanel />
          <StemPanel />
        </v-expansion-panels>
      </div>
    </v-container>
    <template v-slot:append>
      <div class="d-flex flex-column justify-center pa-4">
        <div class="font-italic text-caption mb-2">
          Mushrooms found:
          <span class="font-weight-bold">{{ mushroomStore.data.length }}</span>
        </div>
        <v-btn
          @click="mushroomStore.resetToDefault"
          size="small"
          variant="flat"
          color="accent"
          prepend-icon="mdi-reload"
        >
          Reset to defaults
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import SearchPanel from "@/components/panels/SearchPanel.vue";
import EdibilityPanel from "@/components/panels/EdibilityPanel.vue";
import OccurrencePanel from "@/components/panels/OccurrencePanel.vue";
import CapPanel from "@/components/panels/CapPanel.vue";
import StemPanel from "@/components/panels/StemPanel.vue";

import useMushroomStore from "@/stores/mushrooms";

const mushroomStore = useMushroomStore();
</script>

<style lang="sass" scoped>
.title, .title > *
  font-family: "Kodchasan"
</style>
