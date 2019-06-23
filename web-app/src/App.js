import React from 'react';
import './App.css';
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import franceLogo from "./img/france.png"
import graphLogo from "./img/graph.png"
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import Button from "react-bootstrap/Button";
import GraphFrance from "./components/GraphFrance/GraphFrance";
import MapFrance from "./components/MapFrance/MapFrance";
import BarChart from "./components/BarChart/BarChart";
import {CONSUMPTION, datatypes} from "./constant/DataTypes"
import {GRAPH_TAB, MAP_TAB} from "./constant/TabKeys"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";

const MIN_YEAR = 2013, MAX_YEAR = 2017;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: MIN_YEAR,
            chronoButtonText: "Play",
            playing: false,
            tab: MAP_TAB,
            region1: 0,
            region2: 0,
            dataType1: datatypes[0],
            dataType2: datatypes[1]
        };
        this.onYearChange = this.onYearChange.bind(this);
        this.onNavSelect = this.onNavSelect.bind(this);
        this.onChronoButton = this.onChronoButton.bind(this);
        this.onRegion1Change = this.onRegion1Change.bind(this);
        this.onRegion2Change = this.onRegion2Change.bind(this);
        this.onDataType1Select = this.onDataType1Select.bind(this);
        this.onDataType2Select = this.onDataType2Select.bind(this);
    }

    onNavSelect(eventKey) {
        console.log(eventKey);
        this.setState({tab: eventKey});
    }

    onYearChange(newYear) {
        console.log(newYear);
        this.setState({
            year: newYear
        })
    }

    onChronoButton() {
        if (!this.state.playing) {
            // Play
            console.log("Will play");
            this.setState({chronoButtonText: "Stop", playing: true});
            const chronoInterval = setInterval(() => {
                const nextYear = (this.state.year + 1 - MIN_YEAR) % (MAX_YEAR - MIN_YEAR + 1) + MIN_YEAR;
                if (nextYear === MIN_YEAR) {
                    clearInterval(this.state.chronoInterval);
                    this.setState({
                        chronoButtonText: "Play",
                        playing: false,
                        year: MIN_YEAR,
                        chronoInterval: undefined
                    });
                } else {
                    this.setState({year: nextYear});
                }
            }, 1000);
            this.setState({chronoInterval: chronoInterval})
        } else {
            clearInterval(this.state.chronoInterval);
            this.setState({chronoButtonText: "Play", playing: false, chronoInterval: undefined})
        }
    }

    onRegion1Change(newRegion) {
        console.log("State new region", newRegion);
        this.setState({region1: newRegion});
    }

    onRegion2Change(newRegion) {
        console.log("State new region", newRegion);
        this.setState({region2: newRegion});
    }

    onDataType1Select(newDataType){
        console.log("State new DataType1", newDataType);
        this.setState({dataType1: newDataType});
    }

    onDataType2Select(newDataType){
        console.log("State new DataType2", newDataType);
        this.setState({dataType2: newDataType});
    }

    render() {
        const labels = {};
        [...Array(MAX_YEAR - MIN_YEAR + 1).keys()].forEach(i => {
            const j = i + MIN_YEAR;
            labels[j] = j.toString()
        });
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
                                <Nav.Link eventKey={MAP_TAB}>
                                    <img src={franceLogo} alt={"france"} width={"auto"} height={50}/>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey={GRAPH_TAB}>
                                    <img src={graphLogo} alt={"graph"} width={"auto"} height={50}/>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <div id="viz">
                            <Tab.Container
                                activeKey={this.state.tab}
                                onSelect={this.onNavSelect}>
                                <Tab.Content>
                                    <Tab.Pane eventKey={MAP_TAB}>
                                        <Container>
                                            <Row>
                                                <Col>
                                                    <Col md={4}>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="success" id="dropdown-datatype-1"
                                                                         className={"dropdown"}>
                                                            {this.state.dataType1}
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu onSelect={this.onDataType1Select}>
                                                            {datatypes.map(
                                                                dt => (<Dropdown.Item eventKey={dt}>{dt}</Dropdown.Item>)
                                                            )}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                    </Col>
                                                    <MapFrance className="map"
                                                        id={"map-france-1"}
                                                        width={500}
                                                        height={500}
                                                        year={this.state.year}
                                                        onRegionChange={this.onRegion1Change}
                                                    />
                                                    <BarChart className="histogram"
                                                        id={"barchart-1"}
                                                        width={400}
                                                        height={200}
                                                        region={this.state.region1}
                                                        year={this.state.year}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Col md={4}>
                                                        <Dropdown>
                                                            <Dropdown.Toggle variant="success" id="dropdown-datatype-2"
                                                                             className={"dropdown"}>
                                                                {this.state.dataType2}
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu onSelect={this.onDataType2Select}>
                                                                {datatypes.map(
                                                                    dt => (<Dropdown.Item eventKey={dt}>{dt}</Dropdown.Item>)
                                                                )}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </Col>
                                                    <MapFrance className="map"
                                                               id={"map-france-2"}
                                                               width={500}
                                                               height={500}
                                                               year={this.state.year}
                                                               onRegionChange={this.onRegion2Change}
                                                    />
                                                    <BarChart className="histogram"
                                                              id={"barchart-2"}
                                                              width={400}
                                                              height={200}
                                                              region={this.state.region2}
                                                              year={this.state.year}
                                                    />
                                                </Col>
                                            </Row>
                                        </Container>
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
                        <div id="chrono">
                            <Button
                                variant={this.state.playing ? "danger" : "success"}
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
                </Container>
            </div>
        );
    }
}

export default App;
