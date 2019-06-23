import React from "react";
import Spinner from "react-bootstrap/Spinner";
import plotMapFrance from "./MapFranceD3";
import region from "../../data/regions_new"
import data from '../../data/donnees_economix.csv';
import './Style.css';

class MapFrance extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            id: this.props.id,
            data: data,
            region:region
           // year :this.props.year
        };
    }

    componentDidMount() {
        if(this.state.data){
            console.log("calling plot");
            const plot = plotMapFrance(this.state.data,this.state.region,this.props.year,this.node, this.props.width,
                this.props.height, this.props.onRegionChange, () => {
                    this.setState({plot: plot});
                });
        }
    }

    componentDidUpdate() {
        if(this.state.data){
            console.log("calling update plot");
            console.log(this.state.plot.updateYear);
            if(this.state.plot && this.state.plot.ready){
                this.state.plot.updateYear(this.props.year);
            }
        }
    }
    render() {
        console.log("rendering",this.props.year);
        return (
            <div className={this.props.className}>
                <svg
                    id={this.state.id}
                    ref={node => this.node = node}
                    width={this.props.width}
                    height={this.props.height}
                />
                {(!this.state.plot) &&<Spinner className={"spinner"} animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>}

            </div>);
    }
}
export default MapFrance;