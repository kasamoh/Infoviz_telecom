import React from "react";
import Spinner from "react-bootstrap/Spinner";
import plotMapFrance from "./MapFranceD3";
import region from "../../data/regions_new"
import data from '../../data/donnees_economix.csv';

class MapFrance extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            data: data,
            region:region
           // year :this.props.year
        };
    }

    componentDidMount() {
        if(this.state.data){
            console.log("calling plot");
            plotMapFrance(this.state.data,this.state.region,this.props.year,this.node, 600, 600, this.props.onRegionChange)
        }
    }

    componentDidUpdate() {
        if(this.state.data){
            console.log("calling plot");
            plotMapFrance(this.state.data,this.state.region,this.props.year,this.node, 600, 600, this.props.onRegionChange)
        }
    }
    render() {
        console.log("rendering",this.props.year)
        return (
            <div>
                <svg
                    ref={node => this.node = node}
                    width={this.props.width}
                    height={this.props.height}
                    year={this.props.year}/>
                {(!this.state.data)&&<Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>}

            </div>);
    }
}
export default MapFrance;