import React from "react";
import Spinner from "react-bootstrap/Spinner";
import plotBarChart from "./BarChartD3";
import regions from "../../data/regions_new"
import data from '../../data/donnees_economix_pivot.csv';

class BarChart extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            plot:undefined
        };
    }

    componentDidMount() {
        if(this.props.data){
            const  plot = plotBarChart(this.props.data, this.props.year, this.props.region, this.props.dataType,
                this.node, this.props.width, this.props.height);
            this.setState({plot:plot});
        }
    }

    componentDidUpdate() {
        if(this.state.plot){
            if(this.props.year !== this.state.plot.year || this.props.region !== this.state.plot.region){
                this.state.plot.updateRegionYear(this.props.region, this.props.year);
            } else if(this.props.dataType !== this.state.plot.dataType){
                this.state.plot.updateDataType(this.props.dataType);
            }
        }
    }
    render() {
        return (
            <div className={this.props.className}>
                <svg
                    id={this.props.id}
                    ref={node => this.node = node}
                    width={this.props.width}
                    height={this.props.height}
                    />
                {(!this.state.plot)&&<Spinner
                    className="spinner"
                    animation="border"
                    role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>}
            </div>);
    }
}
export default BarChart;