<template>
  <div id="scatter-plot" class="d-flex flex-column">
    <div ref="resizeRef" class="flex-grow-1">
      <svg ref="svgRef" class="position-absolute"></svg>
    </div>
    <div class="d-flex mx-4 my-2">
      <v-select
        v-model="xAxisLabel"
        :items="dataProperties.numerical"
        item-title="name"
        item-value="prop"
        label="X-axis"
        density="compact"
        variant="underlined"
      />
      <v-spacer />
      <v-select
        v-model="yAxisLabel"
        :items="dataProperties.numerical"
        item-title="name"
        item-value="prop"
        label="Y-axis"
        density="compact"
        variant="underlined"
      />
      <v-spacer />
      <v-checkbox v-model="showOnlyHighlighted" label="Show only highlighted" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { select, scaleLinear, min, max, axisBottom, axisLeft } from "d3";

import useMushroomStore from "@/stores/mushrooms";
import dataProperties from "@/data/dataProperties";
import useResizeObserver from "@/utils/resizeObserver";

const mushroomStore = useMushroomStore();

const showOnlyHighlighted = ref(false);

const svgRef = ref(null);
const xAxisLabel = ref(dataProperties.numerical[1].prop);
const yAxisLabel = ref(dataProperties.numerical[3].prop);

const { resizeRef, resizeState } = useResizeObserver();

onMounted(() => {
  const svg = select(svgRef.value);
  const margin = { top: 5, right: 10, bottom: 26, left: 26 };

  watchEffect(() => {
    svg.selectAll("*").remove();

    const { width, height } = resizeState.dimensions;

    const plot = svg
      .attr("width", Math.floor(width))
      .attr("height", Math.floor(height))
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .classed("plot", true);

    const fieldWidth = Math.floor(width) - margin.left - margin.right;
    const fieldHeight = Math.floor(height) - margin.top - margin.bottom;

    const xMin = min(mushroomStore.data, (d) => d[xAxisLabel.value]);
    const xMax = max(mushroomStore.data, (d) => d[xAxisLabel.value]);

    const xScale = scaleLinear()
      .domain([xMin - 1 <= 0 ? 0 : xMin - 1, xMax + 1])
      .range([0, fieldWidth]);

    const yMin = min(mushroomStore.data, (d) => d[yAxisLabel.value]);
    const yMax = max(mushroomStore.data, (d) => d[yAxisLabel.value]);

    const yScale = scaleLinear()
      .domain([yMin - 1 <= 0 ? 0 : yMin - 1, yMax + 1])
      .range([fieldHeight, 0]);

    const xAxis = axisBottom(xScale).tickSizeOuter(0);
    plot
      .append("g")
      .attr("transform", `translate(0, ${fieldHeight})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale).tickSizeOuter(0);
    plot.append("g").call(yAxis);

    const dots = plot
      .append("g")
      .selectAll("dot")
      .data(mushroomStore.data)
      .enter();

    if (!showOnlyHighlighted.value) {
      dots
        .filter(
          (d) =>
            !mushroomStore.isSelectedMushroom(d) &&
            !mushroomStore.isHighlightedMushroom(d)
        )
        .append("circle");
    }

    dots
      .filter((d) => mushroomStore.isHighlightedMushroom(d))
      .append("circle")
      .classed("highlighted", true);

    dots
      .filter((d) => mushroomStore.isSelectedMushroom(d))
      .append("circle")
      .classed("selected", true);

    dots
      .selectAll("circle")
      .on("click", (_, d) => {
        mushroomStore.setSelectedMushroom(d);
      })
      .attr("cx", (d) => xScale(d[xAxisLabel.value]))
      .attr("cy", (d) => yScale(d[yAxisLabel.value]))
      .attr("r", 5);
  });
});
</script>

<style lang="sass">
.plot
  position: relative

  circle
    fill: rgba(var(--v-theme-primary), 0.3)

    &:hover
      cursor: pointer
      fill: rgb(var(--v-theme-accent-lighten-2)) !important

    &.highlighted
      fill: rgb(var(--v-theme-secondary))

    &.selected
      fill: rgb(var(--v-theme-accent-lighten-2))
      stroke: rgb(var(--v-theme-accent))
      stroke-width: 2px
      stroke-linejoin: round
</style>
