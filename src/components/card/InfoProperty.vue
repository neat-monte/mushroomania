<template>
  <div class="property d-flex flex-row align-center">
    <div class="name">
      <v-icon v-if="props.icon">{{ props.icon }}</v-icon> {{ props.name }}:
    </div>
    <p class="description font-weight-medium">{{ props.description }}</p>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  icon: String,
  name: { type: String, required: true },
  description: { type: String, required: true },
});
</script>

<style lang="sass" scoped>
.property
  .name
    flex: 5
  .description
    flex: 5
</style>
