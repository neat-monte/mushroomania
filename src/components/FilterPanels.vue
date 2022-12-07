<template>
  <div id="filter-panels">
    <div class="mb-4">
      <div class="font-italic text-caption ml-1 mb-2">
        Mushrooms found: {{ mushroomStore.data.length }}
      </div>
      <v-btn
        @click="mushroomStore.resetToDefault"
        size="x-small"
        variant="flat"
        color="blue-grey-lighten-4"
        prepend-icon="mdi-reload"
        class="mb-2"
      >
        Reset to defaults
      </v-btn>
    </div>
    <v-expansion-panels multiple>
      <EdibilityPanel />
      <OccurrencePanel />
      <CapPanel />
      <StemPanel />
    </v-expansion-panels>
  </div>
</template>

<script setup>
import EdibilityPanel from "@/components/panels/EdibilityPanel.vue";
import OccurrencePanel from "@/components/panels/OccurrencePanel.vue";
import CapPanel from "@/components/panels/CapPanel.vue";
import StemPanel from "@/components/panels/StemPanel.vue";

import useMushroomStore from "@/stores/mushrooms";

const mushroomStore = useMushroomStore();
</script>
