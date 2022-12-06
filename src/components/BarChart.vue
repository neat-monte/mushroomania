<template>
    <div id="bar-chart">
        <svg></svg>
    </div>
    <div id="x-selector">
        <v-select
            v-model="xAxisLabel"
            :items="categoricalProperties"
            item-title="displayName"
            item-value="propName"
            label="X-axis"
            density="compact"
            variant="underlined"
        />
    </div>
</template>

<script>
import { onMounted, ref, watchEffect } from "vue";
import {select, scaleLinear, scaleBand, axisBottom, axisLeft} from "d3"

import {categoricalProperties} from "../utils/controls";

export default {
    name: "BarChart",
    props: ["data"],
    setup(props){

        const marginForLabel = 20;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = 700 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const xAxisLabel = ref(categoricalProperties[0].propName);
        
        const barColor = "#0000ff";
        const labelColor = "#ff4d4d";

        onMounted(() => {
            const svg = select("#bar-chart").select('svg')
                    .style('margin-left', margin.left)
                    .style('margin-top', margin.top)
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom);
            const chart = svg.append('g');
            
            watchEffect(() => {
                chart.selectAll("*").remove();

                const categories = categoricalProperties.find(obj => 
                    obj.propName == xAxisLabel.value).values;
                const categoryAbbrv = Object.keys(categories);
                const speciesCount = categoryAbbrv.map(keys => {
                    return {propName: keys, count:0};
                })
                props.data.forEach(mushroomEntry => {
                    mushroomEntry[xAxisLabel.value].forEach(abbrv => {
                        speciesCount[categoryAbbrv.indexOf(abbrv)].count++;
                    });
                });
                
                const xScale = scaleBand()
                    .domain(categoryAbbrv)
                    .rangeRound([0,width])
                    .padding(0.3);
                
                const yScale = scaleLinear()
                    .domain([0,props.data.length + marginForLabel])
                    .range([height,0]);
                
                const xAxis = axisBottom(xScale)
                    .tickFormat(d => {
                        return categories[d];
                    });
                chart.append('g')
                    .attr("transform", `translate(0, ${height})`)
                    .call(xAxis);
                
                const yAxis = axisLeft(yScale)
                    .tickFormat(d => d)
                    .ticks(10);
                chart.append('g')
                    .call(yAxis)
                    ; 
                
                const bars = chart.selectAll(".bar")
                    .data(speciesCount)
                    .enter()
                    .append('rect')
                    .classed('bar', true)
                    .style('fill', barColor)
                    .attr('width', xScale.bandwidth())
                    .attr('height', d => height - yScale(d.count))
                    .attr('x', d => xScale(d.propName))
                    .attr('y', d => yScale(d.count));
                
                const label = chart.selectAll(".label")
                    .data(speciesCount)
                    .enter()
                    .append('text')
                    .classed('label', true)
                    .style('fill', labelColor)
                    .text( d => d.count)
                    .attr('x', d => xScale(d.propName) + (xScale.bandwidth() / 2))
                    .attr('y', d => yScale(d.count) - marginForLabel)
                    .attr('text-anchor', 'middle');
            });

        });
        return {
            xAxisLabel, 
            categoricalProperties
        }
    },
};
</script>