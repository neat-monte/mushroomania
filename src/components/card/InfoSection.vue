<template>
  <div class="d-flex flex-column">
    <div v-if="props.title" class="d-flex align-center">
      <div class="mr-2 my-1 font-weight-bold">
        {{ props.title }}
      </div>
      <v-divider class="divider" />
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  title: String,
});
</script>

<style lang="sass" scoped>
.divider
  flex: 1 1
</style>
