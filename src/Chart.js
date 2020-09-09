import React from 'react'
import { LineChart, PieChart } from 'react-chartkick'
import 'chart.js'
import './Chart.css'

function Chart({active, recovered, deceased}) {
    const linedata = [
        {"name":"Active", "data": {"1": 3848981, "2": 3933137, "3": 4020252, "4": 4110852,"5": 4202575, "6": 4277597, "7": 4367449}},
        {"name":"Recovered", "data": {"1": 2967389, "2": 3034880, "3": 3104505, "4": 3177666,"5": 3247290, "6": 3321413, "7": 3396020}},
        {"name":"Deceased", "data": {"1": 67250, "2": 68229, "3": 69179, "4": 70095,"5": 71103, "6": 72232, "7": 73339}}
      ]; 
    const donutdata = [["Active", active], ["Recovered", recovered], ["Deceased", deceased]]  
    return (
        <div className="chart">
            <PieChart colors={["#0d89d6","#00c44f","#afbcc4"]}legend="bottom" donut={true} data={donutdata} />
            <LineChart legend="bottom" data={linedata} />
        </div>
    )
}

export default Chart
