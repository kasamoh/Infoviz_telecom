import * as d3 from "d3";
//import {d3} from "plotly.js"
//https://bl.ocks.org/JulienAssouline/04d96969efe0c9fb80a9fcd8a2b53d2c

const plotBarChart = (databar,region, selectedyear ,selectedregion,nodeId,onRegionChange) => {
    

    var svg = d3.select(".barchart")  ;
    var margin = {
        top: 10,
        right: 20,
        bottom: 20,
        left: 20
    }
    var width = 300 - margin.left - margin.right
    var  height = 150 - margin.top - margin.bottom
    svg.selectAll(".g").remove() ;
    svg.selectAll("g").remove() ;

    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var parseTime = d3.timeParse("%d-%b-%y");



    //////////////////////////////////////// tooltip /////////////////////////

    var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);



    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1);
    
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);
    


    var colorColumn = "typeshort";

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);


        d3.csv(databar).then(function (data) {
            data.forEach(function(e,i) {
                e.code=+e.code ;
                e.annee=+e.annee;
                e.typeshort=e.type.substring(11,16);
            })
        console.log(data)

        data = data.filter(function(d) { return d.code == selectedregion  & d.annee == selectedyear ;});  // <== This 
        colorScale.domain(data.map(function (d){ return d[colorColumn]; }));

        console.log("filterr");
        console.log(data)
        x.domain(data.map(function (d) {
                return d.typeshort;
            }));
        y.domain([0, d3.max(data, function (d) {
                    return Number(d.production);
                })]);

        g.selectAll("*").remove() ;

        g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
    
        g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Speed");


        
        g.selectAll(".bar")
        //.remove()
        //.exit()
        .data(data)
        .enter()
        .append("rect")
        .attr("fill", function (d){ return colorScale(d[colorColumn]); })
        //.attr("class", "bar")
        .attr("x", function (d) {
            return x( d.typeshort);
        })
        .attr("y", function (d) {
            return y(Number(d.production));
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return height - y(Number(d.production));
        })
        .on("mouseover", function(d) {
            div.transition()        
                .duration(200)      
                .style("opacity", .9);

            div.html("<b>Production : </b>"  +d.production+ "<br>"+
            "<b>Type : </b>"  +d.type)
                .style("left", (d3.event.pageX + 30) + "px")     
                .style("top", (d3.event.pageY - 30) + "px");
        })             
    .on("mouseout", function(d) {

            //div.style("opacity", 0);
            div.html("")
                .style("left", "-500px")
                .style("top", "-500px");
    });






    });


};

export default plotBarChart;