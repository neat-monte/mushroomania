<template>
  <div>
    <v-btn
      @click="mushroomStore.resetToDefault"
      size="x-small"
      variant="flat"
      color="blue-grey-lighten-4"
      prepend-icon="mdi-reload"
      class="mb-4"
    >
      Reset to defaults
    </v-btn>
    <v-expansion-panels multiple>
      <EdibilityPanel />
      <OccurrencePanel />
      <CapPanel />
    </v-expansion-panels>
  </div>
  <div class="mt-auto">
    <div class="font-italic text-caption">
      Total records: {{ mushroomStore.data.length }}
    </div>
  </div>
</template>

<script setup>
import EdibilityPanel from "@/components/panels/EdibilityPanel.vue";
import OccurrencePanel from "@/components/panels/OccurrencePanel.vue";
import CapPanel from "@/components/panels/CapPanel.vue";

import useMushroomStore from "@/stores/mushrooms";

const mushroomStore = useMushroomStore();
</script>
