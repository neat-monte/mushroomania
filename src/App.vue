<template>
  <v-layout>
    <v-app-bar color="grey-lighten-2">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>
