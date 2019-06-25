import * as d3 from "d3";

const NBR_TICKS = 6;

const plotMapFrance = (data, geojson, selectedyear, selectedDataType, node, width, height, onRegionChange) => {


    const path = d3.geoPath();
    const svgId = node.id;
    const projection = d3.geoConicConformal() // Lambert-93s
        .center([2.454071, 46.279229]) // Center on France
        .scale(2600)
        .translate([width / 2 - 10, height / 2]);

    path.projection(projection);

    const svg = d3.select(node)
        .attr("width", width)
        .attr("height", height)
        .attr("class", "Blues");


    svg.selectAll("*").remove();
    while (svg.firstChild) {
        svg.firstChild.remove();
    }

    const deps = svg.append("g");
    //const colors = ['#d4eac7', '#c6e3b5', '#b7dda2', '#a9d68f', '#9bcf7d', '#8cc86a', '#7ec157', '#77be4e', '#70ba45', '#65a83e', '#599537', '#4e8230', '#437029', '#385d22', '#2d4a1c', '#223815'];
    const colors = ['#006aff', '#4190ff', '#7cb2ff', '#b8d5ff', '#ffffff', '#ffc3c3', '#ff9494', '#ff5555', '#ff0000'];

    const plot = {};
    plot.year = selectedyear;
    plot.dataType = selectedDataType;
    plot.filteredData = data[plot.dataType]["Total"];
    plot.ready = false;

    function bootstrapMap() {

        const availableRegion = Object.keys(plot.filteredData);
        const availableRegionNames = {};

        deps
            .selectAll("path")
            .data(geojson.features.filter(f => availableRegion.includes(f.properties.code)))
            .enter()
            .append("path")
            .attr('id', function (d) {
                availableRegionNames[d.properties.code] = d.properties.nom;
                return svgId + "-d" + d.properties.code;
            })
            .attr("d", path);

        const allValues = Object.values(plot.filteredData)
            .map(region => Object.values(region))
            .reduce((acc, arr) => acc.concat(arr), []);

        const maxProduction = d3.max(allValues), minProduction = d3.min(allValues);

        var quantileTicks = d3.scaleQuantile()
            .domain([minProduction, maxProduction])
            .range(d3.range(NBR_TICKS));

        let quantileStep = Math.ceil((maxProduction - minProduction) / NBR_TICKS);

        var quantile = d3.scaleQuantile()
            .domain([minProduction, maxProduction])
            .range(d3.range(colors.length));

        function updateColorScale(filteredData){
            const allValues = Object.values(filteredData)
                .map(region => Object.values(region))
                .reduce((acc, arr) => acc.concat(arr), []);

            const maxProduction = d3.max(allValues), minProduction = d3.min(allValues);
            console.log("min before update: ", minProduction, quantile(minProduction));
            console.log("max before update: ", maxProduction, quantile(maxProduction));
            quantile.domain([minProduction, maxProduction]);
            console.log("min after update: ", minProduction, quantile(minProduction));
            console.log("max after update: ", maxProduction, quantile(maxProduction));
        }

        //////////////////////////////////////// legend /////////////////////////


        var legend = svg.append('g')
            .attr('transform', 'translate(' + (width - 63) + ', 150)')
            .attr('id', svgId + '-legend');

        legend.selectAll('.colorbar')
            .data(d3.range(minProduction, maxProduction, quantileStep))
            .enter().append('svg:rect')
            .attr('y', function (d) {
                return quantileTicks(d) * 20 + 'px';
            })
            .attr('id', d => svgId + '-legend-' + quantileTicks(d))
            .attr('height', '20px')
            .attr('width', '20px')
            .attr('x', '0px')
            .attr("class", d => "q" + quantileTicks(d) + "-9")
            .style("fill", d => {
                return colors[quantile(d)]
            });

        var legendScale = d3.scaleLinear()
            .domain([minProduction, maxProduction])
            .range([0, NBR_TICKS * 20]);

        svg.append("g")
            .attr("id", svgId + "-legend-text")
            .attr('transform', 'translate(' + (width - 40) + ', 150)')
            .call(d3.axisRight(legendScale).ticks(NBR_TICKS));


        function updateLegend(filteredData){
            const allValues = Object.values(filteredData)
                .map(region => Object.values(region))
                .reduce((acc, arr) => acc.concat(arr), []);

            const maxProduction = d3.max(allValues), minProduction = d3.min(allValues);

            quantileTicks.domain([minProduction, maxProduction]);

            quantileStep = Math.ceil((maxProduction - minProduction) / NBR_TICKS);

            d3.select("#" + svgId + "-legend").remove();

            svg.append('g')
                .attr('transform', 'translate(' + (width - 63) + ', 150)')
                .attr('id', svgId + '-legend')
                .selectAll('.colorbar')
                .data(d3.range(minProduction, maxProduction, quantileStep))
                .enter().append('svg:rect')
                .attr('y', function (d) {
                    return quantileTicks(d) * 20 + 'px';
                })
                .attr('id', d => svgId + '-legend-' + quantileTicks(d))
                .attr('height', '20px')
                .attr('width', '20px')
                .attr('x', '0px')
                .attr("class", d => "q" + quantileTicks(d) + "-9")
                .style("fill", d => {
                    return colors[quantile(d)]
                });

            legendScale.domain([minProduction, maxProduction]);

            d3.select("#" + svgId + "-legend-text").remove();
            svg.append("g")
                .attr("id", svgId + "-legend-text")
                .attr('transform', 'translate(' + (width - 40) + ', 150)')
                .call(d3.axisRight(legendScale).ticks(NBR_TICKS));

        }
        //////////////////////////////////////// tooltip /////////////////////////

        const tooltipDiv = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        //////////////////////////////////////// fillmap /////////////////////////
        function updateMapEvents() {
            availableRegion.forEach(function (regionCode, i) {

                const val = plot.filteredData[regionCode][plot.year];
                d3.select("#" + svgId + "-d" + regionCode)
                    .style("stroke", "white")
                    .style("opacity", "1")
                    .style("fill", colors[quantile(val)])
                    .attr("class", "region q" + quantile(val) + "-9")



                    ///////////////// mouselick ///////
                    .on("mouseover", function (d) {
                        tooltipDiv.transition()
                            .duration(200)
                            .style("opacity", .9);
                        d3.select("#" + svgId + "-d" + regionCode)
                            .style("stroke-width", "2")
                            .style("stroke", "black")
                            .style("opacity", 0.8)
                            .raise();

                        tooltipDiv.html("<b>Région : </b>" + availableRegionNames[regionCode] + "<br>"
                            + "<b>Production : </b>" + val + "<br>")
                            .style("left", (d3.event.pageX + 30) + "px")
                            .style("top", (d3.event.pageY - 30) + "px");
                    })
                    .on("click", function (d) {
                        const region = d.properties.code;
                        onRegionChange(region);
                        d3.select("#" + svgId + "-d" + regionCode)
                            .style("fill", function (d) {
                                return colors[quantile(+val)];
                            })
                            .style("stroke", "black");
                        tooltipDiv.html("")
                            .style("left", "-500px")
                            .style("top", "-500px");
                    })
                    .on("mouseout", function (d) {
                        d3.select("#" + svgId + "-d" + regionCode)
                            .style("fill", function (d) {
                                return colors[quantile(+val)];
                            })
                            .style("stroke-width", "1")
                            .style("stroke", "white")
                            .style("opacity", "1");
                        //div.style("opacity", 0);
                        tooltipDiv.html("")
                            .style("left", "-500px")
                            .style("top", "-500px");
                    });
            });
        }
        updateMapEvents();

        const updateDataType = (newDataType) => {
            plot.dataType = newDataType;
            plot.filteredData =  data[newDataType]["Total"];
            updateColorScale(plot.filteredData);
            updateLegend(plot.filteredData);
            availableRegion.forEach(function (regionCode) {
                const val = plot.filteredData[regionCode][plot.year];
                d3.select("#" + svgId + "-d" + regionCode)
                    .style("fill", colors[quantile(+val)])
                    .attr("class", "region q" + quantile(+val) + "-9");
            });
            updateMapEvents()
        };

        const updateYear = (newYear) => {
            plot.year = newYear;
            availableRegion.forEach(function (regionCode) {
                const val = plot.filteredData[regionCode][plot.year];
                d3.select("#" + svgId + "-d" + regionCode)
                    .style("fill", colors[quantile(+val)])
                    .attr("class", "region q" + quantile(+val) + "-9");
            });
            updateMapEvents()
        };

        d3.select("select").on("change", function () {
            d3.selectAll("svg").attr("class", this.value);
        });
        plot.updateDataType = updateDataType;
        plot.updateYear = updateYear;
        plot.ready = true;
    }

    bootstrapMap();
    return plot;
};

export default plotMapFrance;