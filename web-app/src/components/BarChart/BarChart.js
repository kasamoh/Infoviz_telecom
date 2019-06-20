import React from "react";
import Spinner from "react-bootstrap/Spinner";
import plotBarChart from "./BarChartD3";
import regions from "../../data/regions_new"
import data from '../../data/donnees_economix_pivot.csv';

class BarChart extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            data: data,
            regions:regions,
            year :this.props.year,
            regionselect:this.props.region
        };
    }

    componentDidMount() {
        if(this.state.data){
            console.log("calling plot");
            plotBarChart(this.state.data,this.state.regions,this.props.year,this.props.region,this.node, this.props.onRegionChange)
        }
    }

    componentDidUpdate() {
        if(this.state.data){
            console.log("calling plot");
            plotBarChart(this.state.data,this.state.regions,this.props.year,this.props.region,this.node, this.props.onRegionChange)
        }
    }
    render() {
        console.log("rendering",this.props.region)
        return (
            <div>
                <svg
                    ref={node => this.node = node}
                    year={this.props.year}
                    regionselect={this.props.region}
                    />
                {(!this.state.data)&&<Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>}

            </div>);
    }
}
export default BarChart;