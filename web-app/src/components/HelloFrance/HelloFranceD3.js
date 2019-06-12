import * as d3 from "d3";
import d3Legend from "d3-svg-legend";

const plotHelloFrance = (data, nodeId, tooltipNode, width, height) => {
    const w = width;
    const h = height;
    let dataset = [];

//Create SVG element
    let svg = d3.select(nodeId)
        .attr("id", "map")
        .attr("width", w)
        .attr("height", h);


    var div = d3.select(tooltipNode)
        .attr("class", "tooltip")
        .style("opacity", 0);

    function draw_map() {
        svg.selectAll("rect")
            .data(dataset)
            .enter(svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0, " + h - 1 + ")")
                    .call(d3.axisBottom(x)),
                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(0, " + w - 1 + ")")
                    .call(d3.axisRight(y)))
            .append("circle")
            .attr("r", (d) => size(d.population))
            .attr("cx", (d) => x(d.longitude))
            .attr("cy", (d) => y(d.latitude))
            .attr('fill-opacity', (d) => opac(d.density))
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("<b>City </b>: " + d.place + "<br/>"
                    + "<b> Postal Code </b>: " + d.codePostal + "<br/>"
                    + "<b> Population </b>: " + d.population + "<br/>"
                    + "<b> Densité </b>:" + d.density + "<br/>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

    }


    function toolbox() {
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr('class', 'codePostal')
    }

//    d3.tsv("data/france.tsv")
    const rows = data.map(d => ({
            codePostal: +d["Postal Code"],
            inseeCode: +d.inseecode,
            place: d.place,
            longitude: +d.x,
            latitude: -d.y,
            population: +d.population,
            density: +d.density
        })
    );
    console.log("Loaded " + rows.length + " rows");
    if (rows.length > 0) {
        console.log("First row: ", rows[0]);
        console.log("Last row: ", rows[rows.length - 1])
    }
    dataset = rows;
    var x = d3.scaleLinear()
        .domain(d3.extent(rows, (row) => row.longitude))
        .range([0, w]);
    var y = d3.scaleLinear()
        .domain(d3.extent(rows, (row) => row.latitude))
        .range([0, h]);
    var size = d3.scaleLinear()
        .domain(d3.extent(rows, (row) => row.population))
        .range([1, 30]);
    var opac = d3.scaleLinear()
        .domain(d3.extent(rows, (row) => row.density))
        .range([0.1, 0.7]);
    draw_map();
    toolbox();

    var legend_auto = d3Legend
        .legendSize()
        .scale(size);

    svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(50,30)")
        .style("font-size", "12px")
        .call(legend_auto);
};

export default plotHelloFrance;