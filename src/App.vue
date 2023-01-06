<template>
  <v-app>
    <FiltersDrawer />
    <v-main id="main" color="blue-grey">
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup>
import { RouterView } from "vue-router";
import FiltersDrawer from "@/components/FiltersDrawer.vue";
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Kodchasan|Lato')

html
  & *
    font-family: "Lato"
    user-select: none

  & > ::-webkit-scrollbar
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
