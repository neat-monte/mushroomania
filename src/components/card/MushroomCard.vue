<template>
  <v-card
    v-if="mushroomStore.isMushroomSelected()"
    id="mushroom-card"
    color="card"
    variant="text"
    height="100%"
  >
    <v-card-title>
      <div class="mb-2">
        <v-icon class="mx-4">mdi-mushroom-outline</v-icon>
        {{ `${mushroom.name} [${mushroom.family}]` }}
      </div>
      <v-divider />
    </v-card-title>
    <v-card-text>
      <div class="content d-flex mx-3">
        <div class="information-left mx-2">
          <InfoSection>
            <InfoProperty
              icon="mdi-food"
              name="Edible"
              :description="mushroom.edible"
            />
            <InfoProperty
              icon="mdi-sword"
              name="Damage"
              :description="mushroom.damage"
            />
          </InfoSection>
          <InfoSection title="Occurrence">
            <InfoProperty
              icon="mdi-forest"
              name="Habitats"
              :description="mushroom.habitats"
            />
            <InfoProperty
              icon="mdi-sun-snowflake-variant"
              name="Seasons"
              :description="mushroom.seasons"
            />
          </InfoSection>
          <InfoSection title="Shape & color">
            <InfoProperty
              icon="mdi-light-recessed"
              name="Cap shape"
              :description="mushroom.capShape"
            />
            <InfoProperty
              icon="mdi-palette"
              name="Cap color"
              :description="mushroom.capColor"
            />
            <InfoProperty
              icon="mdi-palette"
              name="Stem color"
              :description="mushroom.stemColor"
            />
            <InfoProperty
              icon="mdi-palette"
              name="Gill color"
              :description="mushroom.gillColor"
            />
          </InfoSection>
          <InfoSection v-if="mushroom.hasRing === 'Yes'" title="Ring">
            <InfoProperty
              icon="mdi-ring"
              name="Ring type"
              :description="mushroom.ringType"
            />
          </InfoSection>
        </div>
        <div class="information-right mx-2">
          <v-img
            class="bg-background rounded"
            width="100%"
            height="170"
            aspect-ratio="1"
            :src="mushroom.url"
            lazy-src="https://live.staticflickr.com/3280/2855209141_e2b1502342_b.jpg"
            cover
          />
          <InfoSection title="Dimensions">
            <InfoProperty
              icon="mdi-arrow-expand"
              name="Cap diameter"
              :description="mushroom.capDiameter"
            />
            <InfoProperty
              icon="mdi-arrow-expand-vertical"
              name="Stem height"
              :description="mushroom.stemHeight"
            />
            <InfoProperty
              icon="mdi-arrow-expand-horizontal"
              name="Stem width"
              :description="mushroom.stemWidth"
            />
          </InfoSection>
        </div>
      </div>
    </v-card-text>
  </v-card>
  <v-card v-else id="mushroom-card" color="card" variant="text" height="100%">
    <v-card-title>
      <div class="mb-2">
        <v-icon class="mx-4">mdi-mushroom-off-outline</v-icon>
        No mushroom selected
      </div>
      <v-divider />
    </v-card-title>
    <v-card-text>
      <div class="content d-flex mx-3">
        <v-alert
          icon="mdi-selection-ellipse-arrow-inside"
          density="compact"
          variant="text"
          class="inclusion-alert"
        >
          Select a mushroom from the table or the scatter plot to see the
          details.
        </v-alert>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import InfoSection from "@/components/card/InfoSection.vue";
import InfoProperty from "@/components/card/InfoProperty.vue";

import { computed } from "vue";
import useMushroomStore from "@/stores/mushrooms";

const mushroomStore = useMushroomStore();

const mushroom = computed(() => {
  return mushroomStore.getSelectedMushroomPresentation();
});
</script>

<style lang="sass" scoped>
.content

  .information-left
    flex: 4

  .information-right
    flex: 3
</style>
