<template>
    <div id="bar-chart" class="d-flex flex-column pa-4">
        <div ref="resizeRef" class="flex-grow-1">
            <svg ref="svgRef" class="position-absolute"></svg>
        </div>
        <div class="d-flex mx-4 my-2">
            <v-select v-model="xAxisLabel" :items="categoricalProperties" item-title="displayName" item-value="propName"
                label="X axis" density="compact" variant="underlined" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import { select, scaleLinear, scaleBand, axisBottom, axisLeft } from "d3"

import useMushroomStore from "@/stores/mushrooms";
import { categoricalProperties } from "../utils/controls";
import useResizeObserver from "@/utils/resizeObserver";

const { resizeRef, resizeState } = useResizeObserver();

const mushroomStore = useMushroomStore();

const svgRef = ref(null);
const xAxisLabel = ref(categoricalProperties[0].propName);

onMounted(() => {
    const svg = select(svgRef.value);
    const margin = { top: 5, right: 10, bottom: 26, left: 26 };
    const marginForLabel = 20;

    watchEffect(() => {
        svg.selectAll("*").remove();

        const categories = categoricalProperties.find(obj =>
            obj.propName == xAxisLabel.value).values;
        const categoryAbbrv = Object.keys(categories);
        const speciesCount = categoryAbbrv.map(keys => {
            return { propName: keys, count: 0 };
        })
        mushroomStore.data.forEach(mushroomEntry => {
            let attribute = mushroomEntry[xAxisLabel.value];

            if (!Array.isArray(attribute)) {
                speciesCount[attribute ? 0 : 1].count++;
                return;
            }

            attribute.forEach(abbrv => {
                speciesCount[categoryAbbrv.indexOf(abbrv)].count++;
            });
        });

        const { width, height } = resizeState.dimensions;

        const chart = svg
            .attr("width", Math.floor(width))
            .attr("height", Math.floor(height))
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const f_width = Math.floor(width) - margin.left - margin.right;
        const f_height = Math.floor(height) - margin.top - margin.bottom;

        const xScale = scaleBand()
            .domain(categoryAbbrv)
            .rangeRound([0, f_width])
            .padding(0.3);

        const yScale = scaleLinear()
            .domain([0, mushroomStore.data.length + marginForLabel])
            .range([f_height, 0]);

        const xAxis = axisBottom(xScale)
            .tickSizeOuter(0)
            .tickFormat(d => {
                return categories[d];
            });
        chart.append('g')
            .attr("transform", `translate(0, ${f_height})`)
            .call(xAxis);

        const yAxis = axisLeft(yScale)
            .tickSizeOuter(0)
            .tickFormat(d => d)
            .ticks(10);
        chart.append('g')
            .call(yAxis);

        chart.selectAll(".bar")
            .data(speciesCount)
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('width', xScale.bandwidth())
            .attr('height', d => f_height - yScale(d.count))
            .attr('x', d => xScale(d.propName))
            .attr('y', d => yScale(d.count));

        chart.selectAll(".label")
            .data(speciesCount)
            .enter()
            .append('text')
            .classed('label', true)
            .text(d => d.count)
            .attr('x', d => xScale(d.propName) + (xScale.bandwidth() / 2))
            .attr('y', d => yScale(d.count) - marginForLabel)
            .attr('text-anchor', 'middle');
    });
});
</script>
