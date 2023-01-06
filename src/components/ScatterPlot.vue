<template>
  <div id="scatter-plot" class="d-flex flex-column">
    <v-tabs ref="selector" v-model="tab" density="compact">
      <v-tab :value="1">Points</v-tab>
      <v-tab :value="2">Aggregates</v-tab>
      <v-tab :value="3">Areas</v-tab>
    </v-tabs>
    <div id="scatter-plot-svg" ref="resizeRef" class="flex-grow-1">
      <svg ref="svgRef" class="position-absolute"></svg>
    </div>
    <div class="controls d-flex flex-wrap mx-4 my-2">
      <v-select
        v-model="xAxisLabel"
        :items="selectorOptions"
        item-title="name"
        item-value="prop"
        label="X-axis"
        density="compact"
        variant="underlined"
        hide-details="true"
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
        hide-details="true"
      />
      <v-spacer />
      <v-checkbox
        v-model="mushroomStore.showOnlyHighlighted"
        label="Show only highlighted"
        color="secondary"
        hide-details="true"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect, watch } from "vue";
import { select, scaleLinear, min, max, axisBottom, axisLeft, drag } from "d3";

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

const margin = { top: 5, right: 10, bottom: 26, left: 26 };

var svg;

var selectionRect = {
  element: null,
  previousElement: null,
  currentY: 0,
  currentX: 0,
  originX: 0,
  originY: 0,
  setElement: function (ele) {
    this.previousElement = this.element;
    this.element = ele;
  },
  getCurrentAttributes: function () {
    // use plus sign to convert string into number
    var x = +this.element.attr("x");
    var y = +this.element.attr("y");
    var width = +this.element.attr("width");
    var height = +this.element.attr("height");
    return {
      x1: x,
      y1: y,
      x2: x + width,
      y2: y + height,
    };
  },
  init: function (newX, newY) {
    var rectElement = svg
      .append("rect")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 0)
      .attr("height", 0)
      .classed("selection", true);
    this.setElement(rectElement);
    this.originX = newX;
    this.originY = newY;
    this.update(newX, newY);
  },
  update: function (newX, newY) {
    this.currentX = newX;
    this.currentY = newY;
    this.element
      .attr("x", this.currentX < this.originX ? this.currentX : this.originX)
      .attr("y", this.currentY < this.originY ? this.currentY : this.originY)
      .attr("width", Math.abs(this.currentX - this.originX))
      .attr("height", Math.abs(this.currentY - this.originY));
  },
  focus: function () {
    this.element.style("stroke", "#DE695B").style("stroke-width", "2.5");
  },
  remove: function () {
    this.element.remove();
    this.element = null;
  },
  removePrevious: function () {
    if (this.previousElement) {
      this.previousElement.remove();
    }
  },
};

let wasDragged = false;

function started(event) {
  var p = [event.x, event.y];
  selectionRect.init(p[0], p[1]);
  selectionRect.removePrevious();
}

function dragged(event) {
  wasDragged = true;
  var p = [event.x, event.y];
  selectionRect.update(p[0], p[1]);
}

function ended(event) {
  if (wasDragged) {
    var finalAttributes = selectionRect.getCurrentAttributes();
    event.sourceEvent.preventDefault();
    selectionRect.focus();
    const newHighlightedMushrooms = getMushroomsInsideRect(finalAttributes);
    mushroomStore.setHighlightedMushrooms(newHighlightedMushrooms, shift);
    selectionRect.remove();
    wasDragged = false;
  }
}

var shift = false;

function filter(event) {
  shift = event.shiftKey;
  return !event.ctrlKey && !event.button;
}

var dragBehavior = drag()
  .filter(filter)
  .on("drag", dragged)
  .on("start", started)
  .on("end", ended);

function getMushroomsInsideRect({ x1, x2, y1, y2 }) {
  return svg
    .selectAll(".mushroom")
    .filter(function () {
      const { x, y, width, height } = select(this).node().getBBox();
      const ox1 = x + margin.left;
      const oy1 = y + margin.top;
      const ox2 = ox1 + width;
      const oy2 = oy1 + height;

      return ox1 > x1 && ox2 < x2 && oy1 > y1 && oy2 < y2;
    })
    .data();
}

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
        selectorOptions.value = dataProperties.combinedNumerical;
        xAxisLabel.value = dataProperties.combinedNumerical[0].prop;
        yAxisLabel.value = dataProperties.combinedNumerical[1].prop;
      }
      break;
  }
});

onMounted(() => {
  svg = select(svgRef.value);
  svg.call(dragBehavior);

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

    let xMinLabel;
    let xMaxLabel;
    let yMinLabel;
    let yMaxLabel;
    let renderFunction;
    let type;

    switch (tab.value) {
      default:
      case 1:
        {
          xMinLabel = xAxisLabel.value;
          xMaxLabel = xAxisLabel.value;
          yMinLabel = yAxisLabel.value;
          yMaxLabel = yAxisLabel.value;
          type = "circle";

          renderFunction = function () {
            select(this)
              .attr("cx", (d) => xScale(d[xAxisLabel.value]))
              .attr("cy", (d) => yScale(d[yAxisLabel.value]))
              .attr("r", 5);
          };
        }
        break;
      case 2:
        {
          xMinLabel = `avg${xAxisLabel.value}`;
          xMaxLabel = `avg${xAxisLabel.value}`;
          yMinLabel = `avg${yAxisLabel.value}`;
          yMaxLabel = `avg${yAxisLabel.value}`;
          type = "circle";

          renderFunction = function () {
            return select(this)
              .attr("cx", (d) => xScale(d[`avg${xAxisLabel.value}`]))
              .attr("cy", (d) => yScale(d[`avg${yAxisLabel.value}`]))
              .attr("r", 5);
          };
        }
        break;
      case 3:
        {
          xMinLabel = `min${xAxisLabel.value}`;
          xMaxLabel = `max${xAxisLabel.value}`;
          yMinLabel = `min${yAxisLabel.value}`;
          yMaxLabel = `max${yAxisLabel.value}`;
          type = "rect";

          renderFunction = function (d) {
            const xRound = fieldWidth / 200;
            const yRound = fieldHeight / 200;
            let x = xScale(d[xMinLabel]);
            let y = yScale(d[yMaxLabel]);
            let width = xScale(d[xMaxLabel]) - xScale(d[xMinLabel]);
            let height = yScale(d[yMinLabel]) - yScale(d[yMaxLabel]);
            let widthValue = d[xMaxLabel] - d[xMinLabel];
            let heightValue = d[yMaxLabel] - d[yMinLabel];
            if (widthValue == 0) widthValue = (xMin - xMax) / 20;
            if (heightValue == 0) heightValue = (yMin - yMax) / 20;
            let transparency = 0.07 + 0.43 / (widthValue * heightValue);
            if (width < xRound) {
              x -= xRound;
              width += 2 * xRound;
            }
            if (height < yRound) {
              y -= yRound;
              height += 2 * yRound;
            }

            select(this)
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
    plot
      .append("g")
      .attr("transform", `translate(0, ${fieldHeight})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale).tickSizeOuter(0);
    plot.append("g").call(yAxis);

    const dots = plot
      .append("g")
      .selectAll("circle")
      .data(mushroomStore.data)
      .enter();

    if (!mushroomStore.showOnlyHighlighted) {
      dots
        .filter(
          (d) =>
            !mushroomStore.isSelectedMushroom(d) &&
            !mushroomStore.isHighlightedMushroom(d)
        )
        .append(type)
        .classed("mushroom", true);
    }

    dots
      .filter((d) => mushroomStore.isHighlightedMushroom(d))
      .append(type)
      .classed("mushroom", true)
      .classed("highlighted", true);

    dots
      .filter((d) => mushroomStore.isSelectedMushroom(d))
      .append(type)
      .classed("mushroom", true)
      .classed("selected", true);

    dots
      .selectAll(".mushroom")
      .on("click", (_, d) => {
        mushroomStore.setSelectedMushroom(d);
      })
      .each(renderFunction);
  });
});
</script>

<style lang="sass">
#scatter-plot-svg
  cursor: crosshair !important
  min-height: 250px

.plot
  position: relative

  circle.mushroom
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

  rect.mushroom
    position: absolute
    z-index: 1
    stroke-width: 2px
    stroke-linejoin: round

    &:hover
      cursor: pointer
      stroke: rgb(var(--v-theme-accent-lighten-2)) !important

    &.highlighted
      stroke: rgba(var(--v-theme-secondary), 0.3)

    &.selected
      stroke: rgb(var(--v-theme-accent))

rect.selection
  -webkit-touch-callout: none !important
  -webkit-user-select: none !important
  -khtml-user-select: none !important
  -moz-user-select: none !important
  -ms-user-select: none !important
  user-select: none !important
  stroke: #545454
  stroke-width: 2px
  stroke-opacity: 1
  fill: white
  fill-opacity: 0.5
</style>
