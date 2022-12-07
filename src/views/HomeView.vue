<template>
  <v-layout full-height>
    <v-container class="pa-0">
      <v-row no-gutters>
        <v-col>
          <v-sheet class="d-flex flex-column" min-height="50vh">
            <ScatterPlot />
          </v-sheet>
        </v-col>

        <v-col>
          <v-sheet min-height="50vh">Mushroom info</v-sheet>
        </v-col>

        <v-responsive width="100%"></v-responsive>

        <v-col>
          <v-sheet min-height="50vh">Bar chart</v-sheet>
        </v-col>

        <v-col>
          <v-sheet min-height="50vh">Table</v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script setup>
import ScatterPlot from "@/components/ScatterPlot.vue";
</script>
