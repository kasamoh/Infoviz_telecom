import React from 'react';
import {min, max, interpolateOrRd, median} from "d3";
import {scaleSequential} from "d3-scale";
import Plotly from "../../Plotly";
import createPlotlyComponent from "react-plotly.js/factory";
import regions from "../../data/regions"
import regionsConsumption from "../../data/regions_consumption"
const Plot = createPlotlyComponent(Plotly);

class ConsumptionMap extends React.Component {

    constructor(props) {
        super(props);
        console.log("constructor", props);
        const layers = this.getLayers();
        const layout = {
            autosize:false,
            height: this.props.height,
            width: this.props.width,
            margin:{
                l:10,
                r:10,
                b:10,
                t:10,
                pad:4
            },
            mapbox: {
                center: {
                    lat: 47.524905,
                    lon: 2.818787
                },
                style: 'light',
                zoom: 4.8,
                layers: layers
            },
            transition : {
                duration: 1000,
                easing: 'cubic-in-out'
            }

        };
        this.state = {
            data: [{
                type: 'scattermapbox',
                lat: [],
                lon: []
            }],
            layout: layout,
            frames: [],
            config: {
                mapboxAccessToken: 'pk.eyJ1IjoiY2hyaWRkeXAiLCJhIjoiRy1GV1FoNCJ9.yUPu7qwD_Eqf_gKNzDrrCQ'
            }
        };
    }

    getLayers (){
        const year = this.props.year;
        const ConsumptionArray = Object.values(regionsConsumption).flatMap(Object.values);
        const meanConsumption = median(ConsumptionArray);
        const colorInterpolar = scaleSequential()
            .domain([max(ConsumptionArray), min(ConsumptionArray)])
            .interpolator(interpolateOrRd);

        return Object.keys(regionsConsumption).map(function(key) {
            const consumption = year in regionsConsumption[key]?regionsConsumption[key][year]:meanConsumption;
            return {
                sourcetype: 'geojson',
                source: {"type": "FeatureCollection", 'features': [regions[key].feature]},
                type: 'fill',
                color: colorInterpolar(consumption).toString(),
                text: regions[key].name
            };
        }, {});
    }

    updateState(plotlyAnimate){
        const layers = this.getLayers();
        this.state.layout.mapbox.layers.forEach((l,i) => {
            l.color = layers[i].color;
        });
        if(plotlyAnimate) {
            Plotly.animate("comsuption-map", this.state, {
                duration: 1000,
                easing: 'cubic-in-out'
            });
        }else{
            Plotly.react("comsuption-map", this.state, {
                duration: 1000,
                easing: 'cubic-in-out'
            });
        }
    }

    getColorUpdates(){
        const year = this.props.year;
        const ConsumptionArray = Object.values(regionsConsumption).flatMap(Object.values);
        const meanConsumption = median(ConsumptionArray);
        const colorInterpolar = scaleSequential()
            .domain([max(ConsumptionArray), min(ConsumptionArray)])
            .interpolator(interpolateOrRd);

        const updates = {};
        Object.keys(regionsConsumption).forEach((key, i) => {
            const consumption = year in regionsConsumption[key]?regionsConsumption[key][year]:meanConsumption;
            updates["mapbox.layers["+i+"].color"] = colorInterpolar(consumption).toString();
        }, {});
        return updates;
    }

    render() {
        if(this.state.divId){
            console.log("Will update color");
//            const updates = this.getColorUpdates();
//            Plotly.relayout(this.state.divId, updates);
            this.updateState(false);
        }

        return (
            <Plot
                divId={"comsuption-map"}
                data={this.state.data}
                layout={this.state.layout}
                frames={this.state.frames}
                config={this.state.config}
                onInitialized={(figure) => {
                    figure.divId = "comsuption-map";
                    console.log("figure", figure);
                    this.setState(figure);
                    Plotly.react("comsuption-map", this.state.data, this.state.layout)
                }}
            />
        );
    }
}

export default ConsumptionMap;
