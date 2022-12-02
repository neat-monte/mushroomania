<template>
  <div id="scatter-plot">
    <svg ref="svgRef">
      <g class="x-axis" />
      <g class="y-axis" />
    </svg>
  </div>
  <div class="d-flex">
    <v-select
      v-model="xAxisValue"
      :items="numericalProperties"
      item-title="displayName"
      item-value="propName"
      label="X-axis"
      density="compact"
      variant="underlined"
    />
    <v-select
      v-model="yAxisValue"
      :items="numericalProperties"
      item-title="displayName"
      item-value="propName"
      label="Y-axis"
      density="compact"
      variant="underlined"
    />
  </div>
</template>

<script>
import { onMounted, ref, watchEffect } from "vue";
import {
  select,
  line,
  scaleLinear,
  min,
  max,
  curveBasis,
  axisBottom,
  axisLeft,
} from "d3";

import { numericalProperties } from "../utils/controls";

export default {
  name: "ScatterPlot",
  props: ["data"],
  setup(props) {
    const svgRef = ref(null);

    const xAxisValue = ref(numericalProperties[1].propName);
    const yAxisValue = ref(numericalProperties[3].propName);

    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    onMounted(() => {
      const svg = select(svgRef.value)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      watchEffect(() => {
        svg.selectAll("*").remove();

        const xScale = scaleLinear()
          .domain([
            min(props.data, (d) => d[xAxisValue.value]) - 1,
            max(props.data, (d) => d[xAxisValue.value]) + 1,
          ])
          .range([0, width]);

        const yScale = scaleLinear()
          .domain([
            min(props.data, (d) => d[yAxisValue.value]) - 1,
            max(props.data, (d) => d[yAxisValue.value]) + 1,
          ])
          .range([height, 0]);

        const xAxis = axisBottom(xScale);
        svg
          .append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis);

        const yAxis = axisLeft(yScale);
        svg.append("g").call(yAxis);

        svg
          .append("g")
          .selectAll("dot")
          .data(props.data)
          .enter()
          .append("circle")
          .attr("cx", (d) => xScale(d[xAxisValue.value]))
          .attr("cy", (d) => yScale(d[yAxisValue.value]))
          .attr("r", 3)
          .style("fill", "red")
          .style("fill-opacity", 0.2);
      });
    });

    return {
      svgRef,
      xAxisValue,
      yAxisValue,
      numericalProperties,
    };
  },
};
</script>
