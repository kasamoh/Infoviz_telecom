//import d3 from 'd3';
import * as d3 from "d3";

//https://bl.ocks.org/JulienAssouline/04d96969efe0c9fb80a9fcd8a2b53d2c

const plotMapFrance = (data, region, selectedyear, nodeId, width, height, onRegionChange) => {


    const path = d3.geoPath();

    const projection = d3.geoConicConformal() // Lambert-93s
        .center([2.454071, 46.279229]) // Center on France
        .scale(2600)
        .translate([width / 2 - 50, height / 2]);

    path.projection(projection);


    const svg = d3.select(nodeId)//.append("svg")
        .attr("id", "svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "Blues");


    svg.selectAll("*").remove();
    while (svg.firstChild) {
        svg.firstChild.remove();
    }

    const deps = svg.append("g");
    const colors = ['#d4eac7', '#c6e3b5', '#b7dda2', '#a9d68f', '#9bcf7d', '#8cc86a', '#7ec157', '#77be4e', '#70ba45', '#65a83e', '#599537', '#4e8230', '#437029', '#385d22', '#2d4a1c', '#223815'];
    var year = selectedyear;

    console.log("map france !!!!!!!!!!!!");
    console.log(selectedyear);

    var promises = [];
    promises.push(region);
    promises.push(d3.csv(data));

    Promise.all(promises).then(function (values) {


        const geojson = values[0]; // Récupération de la première promesse : le contenu du fichier JSON
        const csv = values[1]; // Récupération de la deuxième promesse : le contenu du fichier csv


        console.log("data !!!!!!!!!!!!");
        console.log(csv);

        var color_imp = d3.scaleThreshold()
            .domain([0, 1688, 206684, 747204.800, 3652593.657, 1000000000, 2338271127])
            .range(["#ede9f3", "#cbbedd", "#a993c7", "#8767b0", "#653c9a", "#54278f", "#431f72"]);

        var features = deps
            .selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr('id', function (d) {
                return "d" + d.properties.code;
            })
            .attr("d", path);

        var quantile = d3.scaleQuantile()
            .domain([0, d3.max(csv, function (e) {
                return (+e.Production_totale) + 1;
            })])
            .range(d3.range(9));
        //console.log(quantile)

        //////////////////////////////////////// legend /////////////////////////


        var legend = svg.append('g')
            .attr('transform', 'translate(525, 150)')
            .attr('id', 'legend');

        legend.selectAll('.colorbar')
            .data(d3.range(9))
            .enter().append('svg:rect')
            .attr('y', function (d) {
                return d * 20 + 'px';
            })
            .attr('height', '20px')
            .attr('width', '20px')
            .attr('x', '0px')
            .attr("class", function (d) {
                return "q" + d + "-9";
            })
            .style("fill", function (d) {
                return colors[d];
            });

        var legendScale = d3.scaleLinear()
            .domain([0, d3.max(csv, function (e) {
                return +e.Production_totale;
            })])
            .range([0, 9 * 20]);

        var legendAxis = svg.append("g")
            .attr('transform', 'translate(550, 150)')
            .call(d3.axisRight(legendScale).ticks(6));


        //////////////////////////////////////// tooltip /////////////////////////

        var div = d3.select("body").append("div")
            .attr("className", "tooltip")
            .style("opacity", 0);


        //////////////////////////////////////// fillmap /////////////////////////
        csv.forEach(function (e, i) {
            e.annee = +e.annee;
//        console.log(e);
            d3.select("#d" + e.code)
                .filter(function (d) {
                    return e.annee == selectedyear
                })  // <== This line
                .style("stroke", "white")
                .style("opacity", "1")
                .style("fill", function (d) {
                    return colors[quantile(+e.Production_totale)];
                })
                .attr("class", function (d) {
                    return "region q" + quantile(+e.Production_totale) + "-9";
                })



                ///////////////// mouselick ///////
                .on("mouseover", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    d3.select("#d" + e.code)
//                        .clone(true)
//                        .attr("id", "region-hover")
//                        .style("fill", function (d) {
//                            return colors[quantile(+e.Production_totale)];
//                        })
                        .style("stroke-width", "2")
                        .style("stroke", "black")
                        .style("opacity", 0.8)
                        .raiseToTop();

                    div.html("<b>Région : </b>" + e.NOM_REGION + "<br>"
                        + "<b>Production : </b>" + e.Production_totale + "<br>")
                        .style("left", (d3.event.pageX + 30) + "px")
                        .style("top", (d3.event.pageY - 30) + "px");
                })
                .on("click", function (d) {
                    const region = d.properties.code;
                    onRegionChange(region);
                    d3.select("#d" + e.code)
                        .style("fill", function (d) {
                            return colors[quantile(+e.Production_totale)];
                        })
                        .style("stroke", "black");
                    div.html("")
                        .style("left", "-500px")
                        .style("top", "-500px");
                })
                .on("mouseout", function (d) {
                    d3.select("#d" + e.code)
                        .style("fill", function (d) {
                            return colors[quantile(+e.Production_totale)];
                        })
                        .style("stroke-width", "1")
                        .style("stroke", "white")
                        .style("opacity", "1");
                    //div.style("opacity", 0);
                    div.html("")
                        .style("left", "-500px")
                        .style("top", "-500px");
                });
        });


        d3.select("select").on("change", function () {
            d3.selectAll("svg").attr("class", this.value);
        });
    });

};

export default plotMapFrance;