
import React, { Component } from 'react'
import Chart from 'chart.js'


export default class PieChart extends Component {

  componentDidMount() {

    const { chart } = this.refs
    const { data, options } = this.props

    const pieChart = new Chart(chart, {
      data,
      options,
      type: 'pie'
    })

    this.setState({ pieChart })
  }


  render() {

    const { width, height } = this.props

    return <canvas ref='chart' { ...{ width, height } }></canvas>
  }
}
