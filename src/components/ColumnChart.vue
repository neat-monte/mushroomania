<template>
  <div id="column-chart" class="d-flex flex-column">
    <div id="column-chart-svg" ref="resizeRef" class="flex-grow-1">
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
        selects: 0,
        selectandhighlights: 0,
      };
    });

    const counter = (mushroomEntry, attribute) => {
      counts[categoryMapKeys.indexOf(attribute)].count++;
      if (mushroomStore.isHighlightedMushroom(mushroomEntry)) {
        counts[categoryMapKeys.indexOf(attribute)].highlights++;
      }
      if (mushroomStore.isSelectedMushroom(mushroomEntry)) {
        counts[categoryMapKeys.indexOf(attribute)].selects++;
      }
      if (
        mushroomStore.isHighlightedMushroom(mushroomEntry) &&
        mushroomStore.isSelectedMushroom(mushroomEntry)
      ) {
        counts[categoryMapKeys.indexOf(attribute)].selectandhighlights++;
      }
    };

    mushroomStore.data.forEach((mushroomEntry) => {
      const attribute = mushroomEntry[xAxisLabel.value];
      if (!Array.isArray(attribute)) {
        counter(mushroomEntry, attribute);
        return;
      }

      attribute.forEach((abbrv) => {
        counter(mushroomEntry, abbrv);
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

    const labels = chart.selectAll(".label").data(counts).enter();

    bars
      .append("rect")
      .on("click", (e, d) => {
        mushroomStore.setHighlightedMushrooms(
          mushroomStore.getFilteredMushrooms(d.prop, d.value),
          e.shiftKey,
          false
        );
      })
      .classed("bar", true)
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.count))
      .attr("x", (d) => xScale(d.value))
      .attr("y", (d) => yScale(d.count));

    bars
      .filter((d) => d.highlights > 0)
      .append("rect")
      .on("click", (e, d) => {
        mushroomStore.setHighlightedMushrooms(
          mushroomStore.getFilteredMushrooms(d.prop, d.value),
          e.shiftKey,
          true
        );
      })
      .classed("bar", true)
      .classed("highlighted", true)
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.highlights))
      .attr("x", (d) => xScale(d.value))
      .attr("y", (d) => yScale(d.highlights));

    if (mushroomStore.isMushroomSelected()) {
      bars
        .filter((d) => d.selects > 0)
        .append("rect")
        .on("click", () => {
          mushroomStore.setSelectedMushroom(mushroomStore.selectedMushroom);
        })
        .classed("bar", true)
        .classed("selected", true)
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => chartHeight - yScale(d.selects))
        .attr("x", (d) => xScale(d.value))
        .attr("y", (d) =>
          d.selectandhighlights > 0
            ? yScale(Math.ceil(d.highlights / 2))
            : yScale(Math.ceil(d.highlights + (d.count - d.highlights) / 2))
        );
    }

    labels
      .filter((d) => d.highlights > 0 && d.count > d.highlights)
      .append("text")
      .classed("label", true)
      .text((d) => d.highlights)
      .attr("x", (d) => xScale(d.value) + xScale.bandwidth() / 1.5)
      .attr("y", (d) => yScale(d.highlights) - marginForLabel / 2)
      .attr("text-anchor", "left")
      .attr("fill", "rgb(var(--v-theme-accent))");

    labels
      .append("text")
      .classed("label", true)
      .text((d) => d.count)
      .attr("x", (d) => xScale(d.value) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.count) - marginForLabel / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "rgb(var(--v-theme-primary))");
  });
});
</script>

<style lang="sass">
#column-chart-svg
  min-height: 300px

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
