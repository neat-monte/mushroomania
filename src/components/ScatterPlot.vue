<template>
  <div id="scatter-plot" class="d-flex flex-column pa-4">
    <div ref="resizeRef" class="flex-grow-1">
      <svg ref="svgRef" class="position-absolute"></svg>
    </div>
    <div class="d-flex mx-4 my-2">
      <v-select
        v-model="xAxisValue"
        :items="numericalProperties"
        item-title="name"
        item-value="prop"
        label="X-axis"
        density="compact"
        variant="underlined"
      />
      <v-spacer />
      <v-select
        v-model="yAxisValue"
        :items="numericalProperties"
        item-title="name"
        item-value="prop"
        label="Y-axis"
        density="compact"
        variant="underlined"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { select, scaleLinear, min, max, axisBottom, axisLeft } from "d3";

import useMushroomStore from "@/stores/mushrooms";
import { numericalProperties } from "@/utils/controls";
import useResizeObserver from "@/utils/resizeObserver";

const mushroomStore = useMushroomStore();

const svgRef = ref(null);
const xAxisValue = ref(numericalProperties[1].prop);
const yAxisValue = ref(numericalProperties[3].prop);

const { resizeRef, resizeState } = useResizeObserver();

onMounted(() => {
  const svg = select(svgRef.value);
  const margin = { top: 5, right: 10, bottom: 26, left: 26 };

  watchEffect(() => {
    svg.selectAll("*").remove();

    const { width, height } = resizeState.dimensions;

    const field = svg
      .attr("width", Math.floor(width))
      .attr("height", Math.floor(height))
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const f_width = Math.floor(width) - margin.left - margin.right;
    const f_height = Math.floor(height) - margin.top - margin.bottom;

    const xMin = min(mushroomStore.data, (d) => d[xAxisValue.value]);
    const xMax = max(mushroomStore.data, (d) => d[xAxisValue.value]);

    const xScale = scaleLinear()
      .domain([xMin - 1 <= 0 ? 0 : xMin - 1, xMax + 1])
      .range([0, f_width]);

    const yMin = min(mushroomStore.data, (d) => d[yAxisValue.value]);
    const yMax = max(mushroomStore.data, (d) => d[yAxisValue.value]);

    const yScale = scaleLinear()
      .domain([yMin - 1 <= 0 ? 0 : yMin - 1, yMax + 1])
      .range([f_height, 0]);

    const xAxis = axisBottom(xScale).tickSizeOuter(0);
    field
      .append("g")
      .attr("transform", `translate(0, ${f_height})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale).tickSizeOuter(0);
    field.append("g").call(yAxis);

    field
      .append("g")
      .selectAll("dot")
      .data(mushroomStore.data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d[xAxisValue.value]))
      .attr("cy", (d) => yScale(d[yAxisValue.value]))
      .attr("r", 3)
      .style("fill-opacity", 0.3);
  });
});
</script>
