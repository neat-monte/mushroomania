<template>
  <div id="bar-chart" class="d-flex flex-column">
    <div ref="resizeRef" class="flex-grow-1">
      <svg ref="svgRef" class="position-absolute"></svg>
    </div>
    <div class="controls d-flex mx-4 my-2">
      <v-select
        v-model="xAxisLabel"
        :items="dataProperties.categorical"
        item-title="name"
        item-value="prop"
        label="X axis"
        density="compact"
        variant="underlined"
        hide-details="true"
        class="x-axis-select"
      />
      <v-spacer />
      <v-alert
        color="accent"
        icon="mdi-information-outline"
        density="compact"
        variant="text"
        class="inclusion-alert"
        :style="{ visibility: canHaveMoreThanOneValue ? 'visible' : 'hidden' }"
      >
        A mushroom can be included in multiple bars
      </v-alert>
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
const canHaveMoreThanOneValue = ref("null");

onMounted(() => {
  const svg = select(svgRef.value);
  const margin = { top: 5, right: 10, bottom: 26, left: 26 };
  const marginForLabel = 10;

  watchEffect(() => {
    svg.selectAll("*").remove();

    const xLabelProperty = dataProperties.categorical.find(
      (cat) => cat.prop === xAxisLabel.value
    );

    canHaveMoreThanOneValue.value = xLabelProperty.canHaveMoreThanOneValue;

    const categories = xLabelProperty.values;

    const categoryMap = new Map(categories.map((c) => [c.value, c.name]));
    const categoryMapKeys = Array.from(categoryMap.keys());

    const counts = categories.map((c) => {
      return {
        prop: xAxisLabel.value,
        value: c.value,
        count: 0,
        highlights: 0,
      };
    });

    mushroomStore.data.forEach((mushroomEntry) => {
      const attribute = mushroomEntry[xAxisLabel.value];

      if (!Array.isArray(attribute)) {
        counts[categoryMapKeys.indexOf(attribute)].count++;
        if (mushroomStore.isHighlightedMushroom(mushroomEntry)) {
          counts[categoryMapKeys.indexOf(attribute)].highlights++;
        }
        return;
      }

      attribute.forEach((abbrv) => {
        counts[categoryMapKeys.indexOf(abbrv)].count++;
        if (mushroomStore.isHighlightedMushroom(mushroomEntry)) {
          counts[categoryMapKeys.indexOf(abbrv)].highlights++;
        }
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

    const bars = chart.selectAll(".bar").data(counts).enter();

    bars
      .append("rect")
      .on("click", (e, d) => {
        mushroomStore.setHighlightedMushrooms(d.prop, d.value);
      })
      .classed("bar", true)
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.count))
      .attr("x", (d) => xScale(d.value))
      .attr("y", (d) => yScale(d.count));

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

    bars
      .filter((d) => d.highlights > 0)
      .append("rect")
      .on("click", (e, d) => {
        console.log(d);
        mushroomStore.setHighlightedMushrooms(d.prop, d.value);
      })
      .classed("bar", true)
      .classed("highlighted", true)
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.highlights))
      .attr("x", (d) => xScale(d.value))
      .attr("y", (d) => yScale(d.highlights));

    if (mushroomStore.isMushroomSelected()) {
      let isFilteredOut = true;
      for (let mushroom of mushroomStore.data) {
        if (mushroomStore.isSelectedMushroom(mushroom)) {
          isFilteredOut = false;
          break;
        }
      }
      if (!isFilteredOut) {
        const selectedMushroom = mushroomStore.selectedMushroom;
        const highlightedProp = mushroomStore.highlightedProp;

        bars
          .filter((e) => e.value === selectedMushroom[xAxisLabel.value])
          .append("rect")
          .on("click", (e, d) => {
            mushroomStore.setHighlightedMushrooms(d.prop, d.value);
          })
          .classed("bar", true)
          .classed("selected", true)
          .attr("width", xScale.bandwidth())
          .attr("height", () => chartHeight - yScale(1))
          .attr("x", (d) => xScale(d.value))
          .attr("y", (d) =>
            highlightedProp.prop === null
              ? yScale(Math.ceil(d.count / 2))
              : selectedMushroom[highlightedProp.prop] == highlightedProp.value
              ? yScale(Math.ceil(d.highlights / 2))
              : yScale(Math.ceil(d.highlights + (d.count - d.highlights) / 2))
          );
      }
    }
  });
});
</script>

<style lang="sass">
.bar
  fill: rgb(var(--v-theme-primary))

  &:hover
    cursor: pointer
    fill: rgb(var(--v-theme-secondary)) !important

  &.highlighted
    fill: rgb(var(--v-theme-secondary)) !important
    stroke: rgb(var(--v-theme-accent))
    stroke-width: 1px

  &.selected
    fill: rgb(var(--v-theme-accent-lighten-2))
    stroke: rgb(var(--v-theme-accent))
    stroke-width: 2px
    stroke-linejoin: round

.controls
  .x-axis-select
    flex: 30
  .inclusion-alert
    flex: 60
</style>
