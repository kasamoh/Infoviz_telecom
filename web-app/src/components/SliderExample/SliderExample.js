import React from "react";
import Plot from 'react-plotly.js';

class SliderExample extends React.Component{

    plot(){
        return {
            data: [{
            x: [1, 2, 3],
            y: [2, 1, 3]
        }],
        layout:{
            sliders: [{
                pad: {t: 30},
                currentvalue: {
                    xanchor: 'right',
                    prefix: 'color: ',
                    font: {
                        color: '#888',
                        size: 20
                    }
                },
                steps: [{
                    label: 'red',
                    method: 'restyle',
                    args: ['line.color', 'red']
                }, {
                    label: 'green',
                    method: 'restyle',
                    args: ['line.color', 'green']
                }, {
                    label: 'blue',
                    method: 'restyle',
                    args: ['line.color', 'blue']
                }]
            }]
        }};
    }
    render() {
        const plotdata = this.plot();
        return (<Plot
                data={plotdata.data}
                layout={plotdata.layout}
                onRestyle={(e) => console.log("restyle event catched: ",e)}/>)
    }
}
export default SliderExample;