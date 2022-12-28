<template>
  <v-card
    v-if="mushroomStore.isMushroomSelected()"
    id="mushroom-card"
    variant="tonal"
    height="100%"
  >
    <v-card-title>
      {{ mushroomStore.selectedMushroom.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ mushroomStore.selectedMushroom.family }}
    </v-card-subtitle>
    <v-card-text>
      <v-list lines="one">
        <!-- <v-list-item
          v-for="item in items"
          :key="item.title"
          :title="item.title"
          subtitle="..."
        ></v-list-item> -->
        <v-list-item
          :title="valueMaps.edibility.title"
          :subtitle="
            valueMaps.edibility.map.get(
              !mushroomStore.selectedMushroom.poisonous
            )
          "
        />
      </v-list>
    </v-card-text>
  </v-card>
  <v-card v-else id="mushroom-card" variant="tonal" height="100%">
    <v-card-title>
      <div class="placeholder"></div>
    </v-card-title>
    <v-card-subtitle>Placeholder family</v-card-subtitle>
    <v-card-text></v-card-text>
  </v-card>
</template>

<script setup>
import useMushroomStore from "@/stores/mushrooms";
import valueMaps from "@/data/valueMaps";

const mushroomStore = useMushroomStore();
</script>

<style lang="sass" scoped>
.placeholder
  height: 20px
  width: 100px
  background-color: var(--v-primary-base)
</style>
