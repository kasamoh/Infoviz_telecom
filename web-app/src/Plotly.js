import Plotly from 'plotly.js/lib/core';

Plotly.register([
    require('plotly.js/lib/scattermapbox'),
]);

export const d3= require('plotly.js/node_modules/d3/d3');
export default Plotly;