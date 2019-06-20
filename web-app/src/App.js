import React from 'react';
import './App.css';
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import franceLogo from "./img/france.png"
import graphLogo from "./img/graph.png"
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import ConsumptionMap from "./components/ConsumptionMap/ConsumptionMap";
import Button from "react-bootstrap/Button";
import GraphFrance from "./components/GraphFrance/GraphFrance";
import MapFrance from "./components/MapFrance/MapFrance";
import BarChart from "./components/BarChart/BarChart";
import {PRICE, PRODUCTION, CONSUMPTION, CO2_EMISSION} from "./constant/DataTypes"
import {MAP_TAB, GRAPH_TAB} from "./constant/TabKeys"

const MIN_YEAR = 2013, MAX_YEAR=2017;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: MIN_YEAR,
            chronoButtonText: "Play",
            playing: false,
            tab:MAP_TAB,
            region:0,
            dataType: CONSUMPTION
        };
        this.onYearChange = this.onYearChange.bind(this);
        this.onNavSelect = this.onNavSelect.bind(this);
        this.onChronoButton = this.onChronoButton.bind(this);
        this.onRegionChange = this.onRegionChange.bind(this);
    }

    onNavSelect(eventKey){
        console.log(eventKey);
        this.setState({tab:eventKey})    ;
    }

    onYearChange(newYear){
        console.log(newYear);
        this.setState({
            year:newYear
        })
    }
    onChronoButton(){
        if(!this.state.playing){
            // Play
            console.log("Will play");
            this.setState({chronoButtonText:"Stop", playing:true});
            const chronoInterval = setInterval(() => {
                const nextYear = (this.state.year + 1- MIN_YEAR)% (MAX_YEAR - MIN_YEAR + 1) + MIN_YEAR;
                if(nextYear === MIN_YEAR){
                    clearInterval(this.state.chronoInterval);
                    this.setState({chronoButtonText:"Play", playing:false, year:MIN_YEAR, chronoInterval:undefined});
                } else {
                    this.setState({year:nextYear});
                }
            },1000);
            this.setState({chronoInterval:chronoInterval})
        } else {
            clearInterval(this.state.chronoInterval);
            this.setState({chronoButtonText:"Play", playing:false, chronoInterval:undefined})
        }
    }
    onRegionChange(newRegion){
        console.log("State new region",newRegion);
        this.setState({region: newRegion});
    }
    render() {
        const labels = {};
        [...Array(MAX_YEAR - MIN_YEAR + 1).keys()].forEach(i => {
            const j = i+MIN_YEAR;
            labels[j] = j.toString()
        } );
        console.log("App.js render called", this.state);
        return (
            <div className="App">
                <header>
                    <h1>French Map - Energy Visualisation</h1>
                </header>
                <Container id={"app-container"}>
                    <div id={"tabs"}>
                        <Nav variant="tabs" onSelect={this.onNavSelect}>
                            <Nav.Item>
                                <Nav.Link eventKey={MAP_TAB} >
                                    <img src={franceLogo} alt={"france"} width={"auto"} height={50}/>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey={GRAPH_TAB} >
                                    <img src={graphLogo} alt={"graph"} width={"auto"} height={50}/>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <div id="viz" className={"tab-content"}>
                            <Tab.Container
                                activeKey={this.state.tab}
                                onSelect={this.onNavSelect}>
                                <Tab.Content>
                                    <Tab.Pane eventKey={MAP_TAB}>
                                        <MapFrance
                                            id={"grapho"}
                                            width={600}
                                            height={600}
                                            year={this.state.year}
                                            onRegionChange={this.onRegionChange}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={GRAPH_TAB}>
                                        <GraphFrance
                                            width={600}
                                            height={600}
                                            year={this.state.year}
                                        />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </div>
                        <div id="legend">
                            The legend will be here.
                        </div>
                        <div id="chrono">
                            <Button
                                variant={this.state.playing?"danger":"success"}
                            onClick={this.onChronoButton}>{this.state.chronoButtonText}</Button>
                            <Slider
                                value={this.state.year}
                                min={MIN_YEAR}
                                max={MAX_YEAR}
                                onChange={this.onYearChange}
                                labels={labels}
                                tooltip={false}
                            />
                        </div>
                    </div>

                    <div id="right-panel">
                        <h2>Color Mapping choice</h2>
                        <div id="color_map_button">
                            <button type="button" className="heatmap">Price</button>
                            <button type="button" className="heatmap">Production</button>
                            <button type="button" className="heatmap">Consumption</button>
                            <button type="button" className="heatmap">CO2 Emission</button>
                        </div>
                        <h2>Pictogram overlay</h2>
                        <div id="picto_button">
                            <button type="button" className="picto">Production Main Source</button>
                            <button type="button" className="picto">Consumption Main Source</button>
                        </div>
                        <div id="expert" name="expert">
                        <svg className='barchart'>
                           
                           <BarChart
                                  id={"barchart"}
                                  width={600}
                                  height={600}
                                  region={this.state.region}
                                  year={this.state.year}
                                  onRegionChange={this.onRegionChange}
                                        />
                           </svg>
                           
                            <h2>Expert</h2>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

export default App;
