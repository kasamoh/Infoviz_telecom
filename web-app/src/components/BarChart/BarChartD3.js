import * as d3 from "d3";

const plotBarChart = (databar, selectedYear, selectedRegion, selectedDataType, node, initialWidth, initialHeight) => {

    console.log(initialWidth, initialHeight);
    const svg = d3.select(node);
    const svgId = node.id;
    const margin = {
        top: 20,
        right: 20,
        bottom: 10,
        left: 35
    };
    const width = initialWidth - margin.left - margin.right;
    const height = initialHeight - 25 - margin.top - margin.bottom;
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

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    function bootstrapChart(){

        if(databar[plot.dataType].histogram !== 1){
            plot.filteredData = undefined;
            return;
        }

        const labels = Object.keys(databar[plot.dataType]).filter(l => l !== "Total" && l !== "histogram");

        const ys = labels.map( l => d3.scaleLinear().rangeRound([height-10, 0]));

        plot.filteredData = databar[plot.dataType];

        console.log(plot.filteredData);
        const values = labels.map( l => {
            return plot.filteredData[l][plot.region][plot.year]
        });

        const labelsValues = labels.map( l =>
            Object.values(plot.filteredData[l]).map(o => Object.values(o)).reduce((ac,ar) => ac.concat(ar), [])
        );

        colorScale.domain(values);

        x.domain(labels);
        ys.forEach((y,i) => {
            y.domain([d3.min(labelsValues[i]), d3.max(labelsValues[i])])
        });

        g.selectAll("*").remove();

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        const d3Data = labels.map((l,i) => ({
            index:i,
            label:l,
            val: values[i]
        }));

        g.selectAll(".bar")
            .data(d3Data)
            .enter()
            .append("rect")
            .attr("id", d => svgId + "-bar-" + d.index)
            .attr("fill", function (d) {
                return colorScale(d.val);
            })
            //.attr("class", "bar")
            .attr("x", function (d) {
                return x(d.label);
            })
            .attr("y", height)
            .attr("height", 0)
            .attr("width", x.bandwidth())
            .on("mouseover", function (d) {
                tooltipDiv.transition()
                    .duration(200)
                    .style("opacity", .9);

                tooltipDiv.html("<b>" +d.label+"</b><br><b>" + plot.dataType + "</b> : " + d.val)
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
            })
            .on("mouseout", function (d) {

                //div.style("opacity", 0);
                tooltipDiv.html("")
                    .style("left", "-500px")
                    .style("top", "-500px");
            }).transition()
            .duration(500)
            .attr("height", d => height - ys[d.index](Number(d.val)))
            .attr("y", d => ys[d.index](Number(d.val)));
            
        function updateRegionYear(newRegionCode, newYear) {
            plot.region = newRegionCode;
            plot.year = newYear;

            if(plot.filteredData === undefined){
                console.log("No data for this type: ", plot.dataType);
                return;
            }

            const labels = Object.keys(plot.filteredData).filter(l => l !== "Total" && l !== "histogram");

            const values = labels.map( l => {
                return plot.filteredData[l][plot.region][plot.year]
            });

//            colorScale.domain(values);
//            y.domain([d3.min(values), d3.max(values)]);

            const d3Data = labels.map((l,i) => ({
                index:i,
                label:l,
                val: values[i]
            }));
            console.log(d3Data);
            d3Data.forEach(d => {
                console.log(d.label, d.index, d.val);
                d3.select("#"+svgId + "-bar-" + d.index)
                  .transition().delay((d, i) => i * 300)
                    .duration(500)
                    .attr("height", height + 1 - ys[d.index](d.val))
                    .attr("y", ys[d.index](d.val));
            });
        }
        plot.updateRegionYear = updateRegionYear;

    }
    function clean() {

        const labels = Object.keys(plot.filteredData).filter(l => l !== "Total" && l !== "histogram");
        labels.forEach((d,i) => {
            d3.select("#" + svgId + "-bar-" + i)
                .transition()
                .duration(500)
                .attr("height", 0)
                .attr("y", height);
        });
        g.transition()
            .delay(200)
            .duration(300)
            .style("opacity",0);
        setTimeout( () => g.selectAll("*").remove(), 500);
    }
    function updateDataType(newDataType){

        if(databar[plot.dataType].histogram !== 1){
            console.log("No data for this type: ", plot.dataType);
            plot.dataType = newDataType;
            plot.filteredData = undefined;
            return;
        }

        if(plot.filteredData !== undefined){
            clean();
        }

        plot.dataType = newDataType;
        plot.filteredData = databar[plot.dataType];

        setTimeout( bootstrapChart, 600);


    }
    plot.updateDataType = updateDataType;

    bootstrapChart();
    plot.ready = true;
    return plot;


};

export default plotBarChart;