<template>
  <div id="scatter-plot" class="d-flex flex-column">
    <v-tabs ref="selector" v-model="tab" center-active>
      <v-tab :value="1">Points</v-tab>
      <v-tab :value="2">Average</v-tab>
      <v-tab :value="3">Boxes</v-tab>
    </v-tabs>
    <div ref="resizeRef" class="flex-grow-1">
      <svg ref="svgRef" class="position-absolute"></svg>
    </div>
    <div class="d-flex mx-4 my-2">
      <v-select
        v-model="xAxisLabel"
        :items="selectorOptions"
        item-title="name"
        item-value="prop"
        label="X-axis"
        density="compact"
        variant="underlined"
      />
      <v-spacer />
      <v-select
        v-model="yAxisLabel"
        :items="selectorOptions"
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
import { onMounted, ref, watchEffect, watch } from "vue";
import { select, scaleLinear, min, max, axisBottom, axisLeft } from "d3";

import useMushroomStore from "@/stores/mushrooms";
import dataProperties from "@/data/dataProperties";
import useResizeObserver from "@/utils/resizeObserver";

const mushroomStore = useMushroomStore();

const tab = ref(null);
const svgRef = ref(null);
const selector = ref(null);

const { resizeRef, resizeState } = useResizeObserver();

const selectorOptions = ref(dataProperties.numerical);

const xAxisLabel = ref(dataProperties.numerical[1].prop);
const yAxisLabel = ref(dataProperties.numerical[3].prop);

watch(tab, async (newTab, oldTab) => {
  switch (newTab) {
    default:
    case 1:
      {
        selectorOptions.value = dataProperties.numerical;
        xAxisLabel.value = dataProperties.numerical[1].prop;
        yAxisLabel.value = dataProperties.numerical[3].prop;
      }
      break;
    case 2:
    case 3:
      {
        if ([2, 3].includes(oldTab)) return;
        console.log("changing");
        selectorOptions.value = dataProperties.combinedNumerical;
        xAxisLabel.value = dataProperties.combinedNumerical[0].prop;
        yAxisLabel.value = dataProperties.combinedNumerical[1].prop;
      }
      break;
  }
});

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

    const fieldWidth = Math.floor(width) - margin.left - margin.right;
    const fieldHeight = Math.floor(height) - margin.top - margin.bottom;

    let xMinLabel;
    let xMaxLabel;
    let yMinLabel;
    let yMaxLabel;
    let renderFunction;

    switch (tab.value) {
      default:
      case 1:
        {
          xMinLabel = xAxisLabel.value;
          xMaxLabel = xAxisLabel.value;
          yMinLabel = yAxisLabel.value;
          yMaxLabel = yAxisLabel.value;

          renderFunction = function () {
            return select(this)
              .append("circle")
              .classed("mushroom", true)
              .on("click", (e, d) => {
                selectMushroom(e);
                mushroomStore.selectMushroom(d);
              })
              .attr("cx", (d) => xScale(d[xAxisLabel.value]))
              .attr("cy", (d) => yScale(d[yAxisLabel.value]))
              .attr("r", 5)
              .style("fill-opacity", 0.3);
          };
        }
        break;
      case 2:
        {
          xMinLabel = `avg${xAxisLabel.value}`;
          xMaxLabel = `avg${xAxisLabel.value}`;
          yMinLabel = `avg${yAxisLabel.value}`;
          yMaxLabel = `avg${yAxisLabel.value}`;

          renderFunction = function () {
            return select(this)
              .append("circle")
              .classed("mushroom", true)
              .on("click", (e, d) => {
                selectMushroom(e);
                mushroomStore.selectMushroom(d);
              })
              .attr("cx", (d) => xScale((d[xMinLabel] + d[xMaxLabel]) / 2))
              .attr("cy", (d) => yScale((d[yMinLabel] + d[yMaxLabel]) / 2))
              .attr("r", 5)
              .style("fill-opacity", 0.3);
          };
        }
        break;
      case 3:
        {
          xMinLabel = `min${xAxisLabel.value}`;
          xMaxLabel = `max${xAxisLabel.value}`;
          yMinLabel = `min${yAxisLabel.value}`;
          yMaxLabel = `max${yAxisLabel.value}`;

          renderFunction = function (d) {
            const xRound = xScale(0.2) - xScale(0);
            const yRound = yScale(0) - yScale(0.2);
            let x = xScale(d[xMinLabel]);
            let y = yScale(d[yMaxLabel]);
            let width = xScale(d[xMaxLabel]) - xScale(d[xMinLabel]);
            let height = yScale(d[yMinLabel]) - yScale(d[yMaxLabel]);
            let widthValue = d[xMaxLabel] - d[xMinLabel];
            let heightValue = d[yMaxLabel] - d[yMinLabel];
            if (widthValue == 0) widthValue = 0.4;
            if (heightValue == 0) heightValue = 0.4;
            let transparency = 0.07 + 0.43 / (widthValue * heightValue);
            if (width < xRound) {
              x -= xRound;
              width += 2 * xRound;
            }
            if (height < yRound) {
              y -= yRound;
              height += 2 * yRound;
            }
            return select(this)
              .append("rect")
              .classed("mushroom", true)
              .on("click", (e, d) => {
                selectMushroom(e);
                mushroomStore.selectMushroom(d);
              })
              .attr("x", x)
              .attr("y", y)
              .attr("width", width)
              .attr("height", height)
              .attr("rx", xRound)
              .attr("rx", yRound)
              .style("fill-opacity", transparency)
              .style("fill", () => {
                curr += inc;
                return `hsl(${curr}, 100%, 50%)`;
              });
          };
          const inc = 360 / mushroomStore.data.length;
          let curr = 0;
        }
        break;
    }

    const xMin = min(mushroomStore.data, (d) => d[xMinLabel]);
    const xMax = max(mushroomStore.data, (d) => d[xMaxLabel]);

    const xScale = scaleLinear()
      .domain([xMin - 1 <= 0 ? 0 : xMin - 1, xMax + 1])
      .range([0, fieldWidth]);

    const yMin = min(mushroomStore.data, (d) => d[yMinLabel]);
    const yMax = max(mushroomStore.data, (d) => d[yMaxLabel]);

    const yScale = scaleLinear()
      .domain([yMin - 1 <= 0 ? 0 : yMin - 1, yMax + 1])
      .range([fieldHeight, 0]);

    const xAxis = axisBottom(xScale).tickSizeOuter(0);
    field
      .append("g")
      .attr("transform", `translate(0, ${fieldHeight})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale).tickSizeOuter(0);
    field.append("g").call(yAxis);

    field
      .append("g")
      .selectAll("circle")
      .data(mushroomStore.data)
      .enter()
      .each(renderFunction);

    const selectMushroom = (event) => {
      field.selectAll(".mushroom").classed("selected", false);
      select(event.currentTarget).classed("selected", true);
    };
  });
});
</script>

<style lang="sass">
.mushroom
  &.selected
    fill: red
    stroke: #646464
    stroke-width: 2px
    stroke-linejoin: round
</style>
