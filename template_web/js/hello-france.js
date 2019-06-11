const w = 600;
const h = 600;
let dataset = [];

//Create SVG element
let svg = d3.select("#viz")
            .append("svg")
            .attr("id", "map")
                .attr("width",w)
                .attr("height", h);


var div = d3.select("#viz").append("div")   
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
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html("<b>City </b>: "+ d.place + "<br/>"
                    + "<b> Postal Code </b>: "+ d.codePostal + "<br/>"
                    + "<b> Population </b>: " + d.population + "<br/>"
                    + "<b> Densité </b>:" + d.density + "<br/>")
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
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

d3.tsv("data/france.tsv")
    .row( (d, i) => {
        return {
            codePostal: +d["Postal Code"],
            inseeCode: +d.inseecode,
            place: d.place,
            longitude: +d.x,
            latitude: -d.y,
            population: +d.population,
            density: +d.density
        };
    })
    .get( (error, rows) => {
        console.log("Loaded " + rows.length + " rows" );
        if (rows.length > 0) {
            console.log("First row: ", rows[0])
            console.log("Last row: ", rows[rows.length-1])
        }
        dataset = rows;
        x = d3.scaleLinear()
            .domain(d3.extent(rows, (row) => row.longitude))
            .range([0,w]);
        y = d3.scaleLinear()
            .domain(d3.extent(rows, (row) => row.latitude))
            .range([0,h]);
        size = d3.scaleLinear()
            .domain(d3.extent(rows, (row) => row.population))
            .range([1,30]);
        opac = d3.scaleLinear()
            .domain(d3.extent(rows, (row) => row.density))
            .range([0.1,0.7]);
        draw_map();
        toolbox();
        legend = svg.append("g")
            .attr("class","legend")
            .attr("transform","translate(50,30)")
            .style("font-size","12px")
            .call(d3.legend)
    }        
    )