import React from "react";
import Spinner from "react-bootstrap/Spinner";
import plotGraphFrance from "./GraphFranceD3";
import conso12 from "../../data/graph_consumption_2012"
import conso13 from "../../data/graph_consumption_2013"
//import conso14 from "../../data/graph_consumption_2014"
//import conso15 from "../../data/graph_consumption_2015"
import conso16 from "../../data/graph_consumption_2016"
import conso17 from "../../data/graph_consumption_2017"
import prod12 from "../../data/graph_production_2012"
import prod13 from "../../data/graph_production_2013"
import prod14 from "../../data/graph_production_2014"
import prod15 from "../../data/graph_production_2015"
//import prod16 from "../../data/graph_production_2016"
import prod17 from "../../data/graph_production_2017"
import "./Styles.css"

const datas = {
    "conso":{
        2012:conso12,
        2013:conso13,
//    2014:conso14,
//    2015:conso15,
        2016:conso16,
        2017:conso17,
    },
    "prod":{
        2012:prod12,
        2013:prod13,
        2014:prod14,
        2015:prod15,
//        2016:prod16,
        2017:prod17,
    }
};

class GraphFrance extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            data: datas[this.props.dataType][this.props.year]
        };
    }

    componentDidUpdate() {
        if(this.props.year in datas[this.props.dataType]){
            console.log(this.props.year, this.props.dataType);
            plotGraphFrance(datas[this.props.dataType][this.props.year], this.node, this.tooltipNode,this.props.width, this.props.height)
        }
    }

    componentDidMount() {
        if(this.props.year in datas[this.props.dataType]){
            plotGraphFrance(datas[this.props.dataType][this.props.year], this.node, this.tooltipNode,this.props.width, this.props.height)
        }
    }

    render() {
        return (
            <div>
                <svg
                    ref={node => this.node = node}
                    width={this.props.width}
                    height={this.props.height}/>
                <div
                    id={"graph-tooltip-div"}
                    ref={node => this.tooltipNode = node}/>
                {(!this.state.data)&&<Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>}
            </div>);
    }
}
export default GraphFrance;