<template>
  <div id="bar-chart" class="d-flex flex-column">
    <div ref="resizeRef" class="flex-grow-1">
      <svg ref="svgRef" class="position-absolute"></svg>
    </div>
    <div class="d-flex mx-4 my-2">
      <v-select
        v-model="xAxisLabel"
        :items="dataProperties.categorical"
        item-title="name"
        item-value="prop"
        label="X axis"
        density="compact"
        variant="underlined"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { select, scaleLinear, scaleBand, axisBottom, axisLeft, max } from "d3";

import useMushroomStore from "@/stores/mushrooms";
import dataProperties from "@/data/dataProperties";
import useResizeObserver from "@/utils/resizeObserver";

const { resizeRef, resizeState } = useResizeObserver();

const mushroomStore = useMushroomStore();

const svgRef = ref(null);
const xAxisLabel = ref(dataProperties.categorical[0].prop);

onMounted(() => {
  const svg = select(svgRef.value);
  const margin = { top: 5, right: 10, bottom: 26, left: 26 };
  const marginForLabel = 10;

  watchEffect(() => {
    svg.selectAll("*").remove();

    const categories = dataProperties.categorical.find(
      (cat) => cat.prop === xAxisLabel.value
    ).values;

    const categoryMap = new Map(categories.map((c) => [c.value, c.name]));
    const categoryMapKeys = Array.from(categoryMap.keys());
    const counts = categories.map((c) => {
      return { value: c.value, count: 0 };
    });

    mushroomStore.data.forEach((mushroomEntry) => {
      const attribute = mushroomEntry[xAxisLabel.value];

      if (!Array.isArray(attribute)) {
        counts[attribute ? 0 : 1].count++;
        return;
      }

      attribute.forEach((abbrv) => {
        counts[categoryMapKeys.indexOf(abbrv)].count++;
      });
    });

    const { width, height } = resizeState.dimensions;

    const chart = svg
      .attr("width", Math.floor(width))
      .attr("height", Math.floor(height))
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const chartWidth = Math.floor(width) - margin.left - margin.right;
    const chartHeight = Math.floor(height) - margin.top - margin.bottom;

    const xScale = scaleBand()
      .domain(categoryMapKeys)
      .rangeRound([0, chartWidth])
      .padding(0.3);

    const xAxis = axisBottom(xScale)
      .tickSizeOuter(0)
      .tickFormat((d) => {
        return categoryMap.get(d);
      });

    chart
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    const yScale = scaleLinear()
      .domain([0, max(counts, (d) => d.count) + marginForLabel])
      .range([chartHeight, 0]);

    const yAxis = axisLeft(yScale)
      .tickSizeOuter(0)
      .tickFormat((d) => d)
      .ticks(10);

    chart.append("g").call(yAxis);

    chart
      .selectAll(".bar")
      .data(counts)
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.count))
      .attr("x", (d) => xScale(d.value))
      .attr("y", (d) => yScale(d.count))
      .style("fill-opacity", 0.75);

    chart
      .selectAll(".label")
      .data(counts)
      .enter()
      .append("text")
      .classed("label", true)
      .text((d) => d.count)
      .attr("x", (d) => xScale(d.value) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.count) - marginForLabel / 2)
      .attr("text-anchor", "middle");
  });
});
</script>
