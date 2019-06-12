import React from "react";
import {d3} from "plotly.js"
import Spinner from "react-bootstrap/Spinner";
import dataFile from "../../data/france.tsv";
import plotHelloFrance from "./HelloFranceD3";
import "./Styles.css"

class HelloFrance extends React.Component{
    constructor(props){
        super(props);
        this.state= {};
        d3.tsv(dataFile, (data) => {
            if(data){
                this.setState({data: data});
            }
        })
    }

    componentDidUpdate() {
        if(this.state.data){
            console.log("calling plot");
            plotHelloFrance(this.state.data, this.node, this.tooltipNode, 600, 600)
        }
    }

    render() {
        return (
            <div>
                <h3>Year: {this.props.year}</h3>
                <svg
                    ref={node => this.node = node}
                    width={this.props.width}
                    height={this.props.height}
                />
                <div
                    id={"tooltip-div"}
                    ref={node => this.tooltipNode = node}/>
                {(!this.state.data)&&<Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>}
            </div>);
    }
}
export default HelloFrance;