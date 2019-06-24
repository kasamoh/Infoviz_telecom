import * as d3 from "d3";

const plotBarChart = (databar, selectedYear, selectedRegion, selectedDataType, node) => {

    var svg = d3.select(node);
    const svgId = node.id;
    var margin = {
        top: 10,
        right: 20,
        bottom: 20,
        left: 20
    };
    const width = 300 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;
    console.log(height, width);
    svg.selectAll(".g").remove();
    svg.selectAll("g").remove();

    const plot = {};
    plot.region = selectedRegion;
    plot.year = selectedYear;
    plot.dataType = selectedDataType;
    plot.ready = false;

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //////////////////////////////////////// tooltip /////////////////////////

    var tooltipDiv = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height-1, 1]);

    var colorColumn = "typeshort";

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    function bootstrapChart(){

        if(databar[plot.dataType].histogram !== 1){
            console.log("No data for this type: ", plot.dataType);
            return;
        }

        const labels = Object.keys(databar[plot.dataType]).filter(l => l !== "Total" && l !== "histogram");

        plot.filteredData = databar[plot.dataType];

        console.log(plot.filteredData);
        const values = labels.map( l => {
            return plot.filteredData[l][plot.region][plot.year]
        });

        colorScale.domain(values);

        x.domain(labels);
        y.domain([d3.min(values), d3.max(values)]);

        g.selectAll("*").remove();

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Value");


        g.selectAll(".bar")
            .data(labels.map((l,i) => ({
                index:i,
                label:l,
                val: values[i]
            })))
            .enter()
            .append("rect")
            .attr("id", d => svgId + "-bar-" + d.index)
            .attr("fill", function (d) {
                console.log(d.label, colorScale(d.val));
                return colorScale(d.val);
            })
            //.attr("class", "bar")
            .attr("x", function (d) {
                return x(d.label);
            })
            .attr("y", function (d) {
                console.log(d.label, y(Number(d.val)));
                return y(Number(d.val));
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(Number(d.val));
            })
            .on("mouseover", function (d) {
                tooltipDiv.transition()
                    .duration(200)
                    .style("opacity", .9);

                tooltipDiv.html("<b>Production : </b>" + d.val + "<br>" +
                    "<b>Type : </b>" + d.type)
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            })
            .on("mouseout", function (d) {

                //div.style("opacity", 0);
                tooltipDiv.html("")
                    .style("left", "-500px")
                    .style("top", "-500px");
            });
            
        function updateRegion(newRegionCode) {
            console.log("update region", newRegionCode);
            plot.region = newRegionCode;
            const labels = Object.keys(databar[plot.dataType]).filter(l => l !== "Total" && l !== "histogram");

            const values = labels.map( l => {
                return plot.filteredData[l][plot.region][plot.year]
            });

            colorScale.domain(values);
            y.domain([d3.min(values), d3.max(values)]);

            labels.map((l,i) => ({
                index:i,
                label:l,
                val: values[i]
            })).forEach(d => {
                console.log(d);
                d3.select("#"+svgId + "-bar-" + d.index)
                    .attr("fill", function (d) {
                        console.log(d.label, colorScale(d.val));
                        return colorScale(d.val);
                    })
                    .attr("y", function (d) {
                        return y(Number(d.val));
                    })
                    .attr("height", function (d) {
                        console.log(d.label, y(Number(d.val)));
                        return height + 1 - y(Number(d.val));
                    })

            })
        }

        function updateYear(newYear) {
            plot.year = newYear;
            const labels = Object.keys(databar[plot.dataType]).filter(l => l !== "Total" && l !== "histogram");

            const values = labels.map( l => {
                return plot.filteredData[l][plot.region][plot.year]
            });

            colorScale.domain(values);
            y.domain([d3.min(values), d3.max(values)]);

            labels.map((l,i) => ({
                index:i,
                label:l,
                val: values[i]
            })).forEach(d => {
                console.log(d);
                d3.select("#"+svgId + "-bar-" + d.index)
                    .attr("fill", function (d) {
                        console.log(d.label, colorScale(d.val));
                        return colorScale(d.val);
                    })
                    .attr("y", function (d) {
                        return y(Number(d.val));
                    })
                    .attr("height", function (d) {
                        console.log(d.label, y(Number(d.val)));
                        return height + 1 - y(Number(d.val));
                    })
            })
        }

        plot.updateRegion = updateRegion;
        plot.updateYear = updateYear;

    }

    bootstrapChart();
    plot.ready = true;
    return plot;


};

export default plotBarChart;