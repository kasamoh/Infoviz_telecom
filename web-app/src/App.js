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
import {datatypes} from "./constant/DataTypes"
import {GRAPH_TAB, MAP_TAB} from "./constant/TabKeys"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Accordion from "react-bootstrap/Accordion";
import allData from "./data/all_map"

const MIN_YEAR = 2013, MAX_YEAR = 2017;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: MIN_YEAR,
            chronoButtonText: "Play",
            playing: false,
            tab: MAP_TAB,
            region1: 11,
            region2: 11,
            dataType1: datatypes[0],
            dataType2: datatypes[1],
            showCompare: "1"
        };
        this.onYearChange = this.onYearChange.bind(this);
        this.onNavSelect = this.onNavSelect.bind(this);
        this.onChronoButton = this.onChronoButton.bind(this);
        this.onRegion1Change = this.onRegion1Change.bind(this);
        this.onRegion2Change = this.onRegion2Change.bind(this);
        this.onDataType1Select = this.onDataType1Select.bind(this);
        this.onDataType2Select = this.onDataType2Select.bind(this);
        this.onCompareButton = this.onCompareButton.bind(this);
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

    onCompareButton(){
        if(this.state.showCompare === "0"){
            this.setState({
                showCompare:"1"
            })
        } else {
            this.setState({
                showCompare:"0"
            })

        }
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
                                            <Accordion activeKey={this.state.showCompare}>
                                            <Row>
                                                <Col>
                                                    <Row className={"datatype-select"}>
                                                    <Col md={4}>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="success" id="dropdown-datatype-1"
                                                                         className={"dropdown"}>
                                                            {this.state.dataType1.label}
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu
                                                            alignRight={true}>
                                                            {datatypes.map(
                                                                (dt,i) => (<Dropdown.Item
                                                                    key={i}
                                                                    eventKey={i}
                                                                    onSelect={() => this.onDataType1Select(dt)}
                                                                >{dt.label}</Dropdown.Item>)
                                                            )}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                    </Col>
                                                    <Col md={{span:4, offset:4}}>
                                                        <Accordion.Toggle
                                                            as={Button}
                                                            variant="link"
                                                            eventKey="0"
                                                            onClick={this.onCompareButton}
                                                        >
                                                            {this.state.showCompare === "0"?"Hide second map":"Compare in second map"}
                                                        </Accordion.Toggle>
                                                    </Col>
                                                    </Row>
                                                    <MapFrance className="map"
                                                        id={"map-france-1"}
                                                        width={500}
                                                        height={500}
                                                        year={this.state.year}
                                                        data={allData}
                                                        dataType={this.state.dataType1.key}
                                                        onRegionChange={this.onRegion1Change}
                                                    />
                                                    <BarChart className="histogram"
                                                        id={"barchart-1"}
                                                        width={400}
                                                        height={200}
                                                        region={this.state.region1}
                                                        data={allData}
                                                        dataType={this.state.dataType1.key}
                                                        year={this.state.year}
                                                    />
                                                </Col>
                                                <Accordion.Collapse eventKey="0">
                                                    {this.state.showCompare && (
                                                        <Col>

                                                            <Row className={"datatype-select"}>
                                                                <Col md={4}>
                                                                    <Dropdown>
                                                                        <Dropdown.Toggle variant="success" id="dropdown-datatype-2"
                                                                                         className={"dropdown"}>
                                                                            {this.state.dataType2.label}
                                                                        </Dropdown.Toggle>

                                                                        <Dropdown.Menu
                                                                            alignRight={true}>
                                                                            {datatypes.map(
                                                                                (dt,i) => (<Dropdown.Item
                                                                                    eventKey={i}
                                                                                    key={i}
                                                                                    onSelect={() => this.onDataType2Select(dt)}
                                                                                >{dt.label}</Dropdown.Item>)
                                                                            )}
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>
                                                                </Col>
                                                            </Row>
                                                            <MapFrance className="map"
                                                                       id={"map-france-2"}
                                                                       width={500}
                                                                       height={500}
                                                                       year={this.state.year}
                                                                       data={allData}
                                                                       dataType={this.state.dataType2.key}
                                                                       onRegionChange={this.onRegion2Change}
                                                            />
                                                            <BarChart className="histogram"
                                                                      id={"barchart-2"}
                                                                      width={400}
                                                                      height={200}
                                                                      data={allData}
                                                                      dataType={this.state.dataType2.key}
                                                                      region={this.state.region2}
                                                                      year={this.state.year}
                                                            />
                                                        </Col>
                                                    )}
                                            </Accordion.Collapse>
                                            </Row>
                                            </Accordion>
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
