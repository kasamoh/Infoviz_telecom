import Plotly from 'plotly.js/lib/core';
import {d3 as plotlyD3} from 'plotly.js/node_modules/d3';
Plotly.register([
    require('plotly.js/lib/scattermapbox'),
]);

export const d3=plotlyD3;
export default Plotly;