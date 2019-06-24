import React from "react";
import Spinner from "react-bootstrap/Spinner";
import plotMapFrance from "./MapFranceD3";
import region from "../../data/regions_new"
import './Style.css';

class MapFrance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // year :this.props.year
        };
    }

    componentDidMount() {
        if (this.props.data) {
            const plot = plotMapFrance(this.props.data, region, this.props.year, this.props.dataType, this.node, this.props.width,
                this.props.height, this.props.onRegionChange);
            this.setState({plot: plot});
        }
    }

    componentDidUpdate() {
        if (this.state.plot) {
            if (this.state.plot && this.state.plot.ready) {
                if(this.state.plot.year !== this.props.year){
                    this.state.plot.updateYear(this.props.year);
                } else if(this.state.plot.dataType !== this.props.dataType) {
                    this.state.plot.updateDataType(this.props.dataType);
                }
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
                {(!this.state.plot) && <Spinner className={"spinner"} animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>}

            </div>);
    }
}

export default MapFrance;