import React from 'react';
import './App.css';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import franceLogo from "./img/france.png"
import graphLogo from "./img/graph.png"
import HelloFrance from "./components/HelloFrance/HelloFrance";

function App() {
  return (
    <div className="App">
      <header>
          <h1>French Map - Energy Visualisation</h1>
      </header>
        <Container id={"app-container"}>
            <div id={"tabs"}>
                <Nav  variant="tabs" defaultActiveKey="/home">
                    <Nav.Item>
                        <Nav.Link href="/home">
                            <img src={franceLogo} alt={"france"} width={"auto"} height={50}/>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/graph">
                            <img src={graphLogo} alt={"graph"} width={"auto"} height={50}/>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <div id="viz" className={"ab-content"}>
                    <HelloFrance id={"grapho"} width={600} height={600}/>
                </div>
                <div id="legend">
                </div>
                <div id="chrono">
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
                    <h2>Expert</h2>
                </div>
            </div>
        </Container>
    </div>
  );
}

export default App;
