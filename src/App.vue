<template>
  <v-app>
    <v-navigation-drawer permanent color="blue-grey-lighten-3">
      <v-container class="d-flex flex-column h-100">
        <h2 class="mb-2">Mushroomania</h2>
        <FilterPanels />
      </v-container>
    </v-navigation-drawer>
    <v-main id="main" color="blue-grey">
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup>
import { RouterView } from "vue-router";
import FilterPanels from "@/components/FilterPanels.vue";
</script>

<style lang="sass">
html > ::-webkit-scrollbar
    display: none

::-webkit-scrollbar
  width: 6px
  height: 6px

::-webkit-scrollbar-track
  border-radius: 10px
  background: rgba(0,0,0,0.1)

::-webkit-scrollbar-thumb
  border-radius: 10px
  background: rgba(0,0,0,0.2)

  &:hover
    background: rgba(0,0,0,0.4)

  &:active
    background: rgba(0,0,0,.9)
</style>
