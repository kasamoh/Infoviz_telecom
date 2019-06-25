import {d3} from "../../Plotly";

const plotGraphFrance = (data, nodeId, tooltipId, width, height) => {
    let root = data;

    var force = d3.layout.force()
        .linkDistance(150)
        .charge(-120)
        .gravity(.05)
        .size([width, height])
        .on("tick", tick);

    var svg = d3.select(nodeId)
        .attr("width", width)
        .attr("height", height);

    var tooltip = d3.select(tooltipId)
        .attr("class", "graph-tooltip")
        .style("opacity", 0);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");


    function update() {
        var nodes = flatten(root),
            links = d3.layout.tree().links(nodes);

        force
            .nodes(nodes)
            .links(links)
            .start();

        link = link.data(links, function(d) { return d.target.id; });

        link.exit().remove();

        link.enter().insert("line", ".node")
            .attr("class", "link");

        node = node.data(nodes, function(d) { return d.id; });

        node.exit().remove();

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .on("click", click)
            .call(force.drag);

        nodeEnter.append("circle")
        //.attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; });
            .attr("r", function(d) { return Math.sqrt(d.size) / 5 || 4.5; })
            .on('mouseover.graph-tooltip', function(d) {
                tooltip.transition()
                    .duration(300)
                    .style("opacity", .8);
                tooltip.html(d.value +" MW")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 10) + "px");
            })
            .on("mouseout.graph-tooltip", function() {
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 0);
            });

        nodeEnter.append("text")
            .attr("dy", ".35em")
            .text(function(d) { return d.name ; });

        node.select("circle")
            .style("fill", color);
    }

    function tick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    function color(d) {
        return d._children ? "#3182bd" // collapsed package
            : d.children ? "#c6dbef" // expanded package
                : "#fd8d3c"; // leaf node
    }


    function click(d) {
        if (d3.event.defaultPrevented) return; // ignore drag
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update();
    }

    function flatten(root) {
        var nodes = [], i = 0;

        function recurse(node) {
            if (node.children) node.children.forEach(recurse);
            if (!node.id) node.id = ++i;
            nodes.push(node);
        }
        recurse(root);
        return nodes;
    }

    function setParents(d, p){
        d._parent = p;
        if (d.children) {
            d.children.forEach(function(e){ setParents(e,d);});
        } else if (d._children) {
            d._children.forEach(function(e){ setParents(e,d);});
        }
    }

    function collapseAll(d){
        if (d.children){
            d.children.forEach(collapseAll);
            d._children = d.children;
            d.children = null;
        }
        else if (d._childred){
            d._children.forEach(collapseAll);
        }
    }

    update();
    flatten(root);
    setParents(root, null);
    collapseAll(root);
    root.children = root._children;
    root._children = null;
    update();

};

export default plotGraphFrance;