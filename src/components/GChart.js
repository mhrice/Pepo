import React, { Component } from 'react';
import { render } from 'react-dom';
import { Chart } from 'react-google-charts';

export default class GChart extends React.Component {
  constructor(props){
    super(props);
    this.state = {
     options: {
       title: 'Age vs. Weight comparison',
       hAxis: { title: 'Age', minValue: 0, maxValue: 15 },
       vAxis: { title: 'Weight', minValue: 0, maxValue: 15 },
       legend: 'none',
     },
     rows: [
       ["hi", 12, 15],
       ["no", 5.5, 12],
       ["he", 14, 5],
       ["ok", 5, 2],
       ["u", 3.5, 8],
       ["suck", 7, 1],
     ],
     columns: [
       {
         type: 'string',
         label: 'Age',
       },
       {
         type: 'number',
         label: 'Weight',
       },
       {
       type: 'number',
       label: 'Size'
      }
     ],
   };
 }
  render(){
    return(
    <Chart
      chartType="BubbleChart"
      rows={this.state.rows}
      columns={this.state.columns}
      options={this.state.options}
      graph_id="ScatterChart"
      width={'100%'}
      height={'400px'}
      legend_toggle
      />
    );
  }
}
