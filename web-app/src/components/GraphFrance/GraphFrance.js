import React from "react";
import Spinner from "react-bootstrap/Spinner";
import plotGraphFrance from "./GraphFranceD3";
import consoData from "../../data/graph_consumption_2017"
import prodData from "../../data/graph_production_2017"
import "./Styles.css"

class GraphFrance extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            data: prodData
        };
    }

    componentDidMount() {
        if(this.state.data){
            plotGraphFrance(this.state.data, this.node, this.tooltipNode,600, 600)
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