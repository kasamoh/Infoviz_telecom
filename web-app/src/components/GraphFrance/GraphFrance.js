import React from "react";
import Spinner from "react-bootstrap/Spinner";
import plotGraphFrance from "./GraphFranceD3";
import data from "../../data/graph"
import "./Styles.css"

class GraphFrance extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            data: data
        };
    }

    componentDidMount() {
        if(this.state.data){
            console.log("calling plot");
            plotGraphFrance(this.state.data, this.node, 600, 600)
        }
    }

    render() {
        return (
            <div>
                <svg
                    ref={node => this.node = node}
                    width={this.props.width}
                    height={this.props.height}/>
                {(!this.state.data)&&<Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>}
            </div>);
    }
}
export default GraphFrance;