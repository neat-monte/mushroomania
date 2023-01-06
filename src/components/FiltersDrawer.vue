<template>
  <v-app-bar color="panel" class="d-lg-none" density="compact">
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>
    <v-toolbar-title class="title text-center text-uppercase text-accent">
      <h3 class="title text-center text-uppercase text-accent">
        Mushr<span class="text-accent-lighten-2">oo</span>mania
      </h3>
    </v-toolbar-title>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" color="panel">
    <v-container class="d-flex flex-column">
      <h2
        class="title mb-2 text-center text-uppercase text-accent d-none d-lg-block"
      >
        Mushr<span class="text-accent-lighten-2">oo</span>mania
      </h2>
      <div id="filter-panels">
        <v-expansion-panels multiple color="panel">
          <SearchPanel />
          <EdibilityPanel />
          <DamagePanel />
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
import { ref } from "vue";

import SearchPanel from "@/components/panels/SearchPanel.vue";
import EdibilityPanel from "@/components/panels/EdibilityPanel.vue";
import DamagePanel from "@/components/panels/DamagePanel.vue";
import OccurrencePanel from "@/components/panels/OccurrencePanel.vue";
import CapPanel from "@/components/panels/CapPanel.vue";
import StemPanel from "@/components/panels/StemPanel.vue";

import useMushroomStore from "@/stores/mushrooms";

const mushroomStore = useMushroomStore();

const drawer = ref(true);
</script>

<style lang="sass" scoped>
.title, .title *
  font-family: "Kodchasan"
</style>
