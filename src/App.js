import React, {useState, useEffect} from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import RoomIcon from '@material-ui/icons/Room';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Map from './Map';
import ReactTooltip from 'react-tooltip';
import Chart from './Chart';

const columns = [
  { id: 'State', label: 'STATE/UT', minWidth: 100 },
  { 
    id: 'Confirmed', 
    label: 'CONFIRMED', 
    minWidth: 80,
    align: 'left'
  },
  {
    id: 'Active',
    label: 'ACTIVE',
    minWidth: 80,
    align: 'left',
  },
  {
    id: 'Recovered',
    label: 'RECOVERED',
    minWidth: 80,
    align: 'left',
  },
  {
    id: 'Deceased',
    label: 'DECEASED',
    minWidth: 80,
    align: 'left',
  },
];

const useStyles = makeStyles({
  root: {
    margin: 50,
    padding: 3,
    width: '90%',
    border: 1,
    borderRadius: 10
  },
  container: { 
    maxHeight: 460,
    paddingBottom: 15
  },
});

function App() {  
  const classes = useStyles();

  const [states, setStates] = useState([]);
  const [tooltipContent, setTooltipContent] = useState('');
  const [chartVal, setChartVal] = useState({'active': 0, 'recovered': 0, 'deceased': 0});

  useEffect(() => {
    //API
    const getStateData = async () => {
      await fetch("https://api.covid19india.org/data.json")
      .then((res) => res.json())
      .then((data) => {
        const cases = data.statewise.map((state) => ({
          state: state.state,
          active: state.active,
          confirmed: state.confirmed,
          recovered: state.recovered,
          deceased: state.deaths,
          id: state.statecode
        }));
        setStates(cases);
      })
    }
    getStateData();
  }, []);

  useEffect(() => {
    const donut = ({
      active: states[0]?.active,
      recovered: states[0]?.recovered,
      deceased: states[0]?.deceased
    })
    setChartVal(donut);
  },[states])
  

  const onMouseEnter = (val) => {
    return () => {
      states.map(e => {
        if(e.state === val)
        {
          console.log(e);
          const newdata = ({
            active: e?.active,
            recovered: e?.recovered,
            deceased: e?.deceased
          })
          setChartVal(newdata);
        }
      })
      setTooltipContent(val);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent('');
    const donut = ({
      active: states[0]?.active,
      recovered: states[0]?.recovered,
      deceased: states[0]?.deceased
    })
    setChartVal(donut);
  };
  
  return (
    <div className="app">
      <ReactTooltip>{tooltipContent}</ReactTooltip>
      <div className="app__header">
        <div className="header__left">
          <div className="header__icon">
            <RoomIcon />
          </div>
          <div className="headerLeft__text">
              <h1>INDIA COVID-19 Tracker</h1>
              <h3>Let's all pray to make our Earth Covid-19 free soon. Stay Safe </h3>
              <h3>and do TheLocate.</h3>
          </div>
        </div>
        <div className="header__right">
            <h1>INDIA MAP</h1>
            <h3>HOVER OVER A STATE FOR MORE DETAILS</h3>
        </div>
      </div>
      <div className="app__body">
        <div className="appbody__left">
          <Chart active={chartVal.active} recovered={chartVal.recovered} deceased={chartVal.deceased}/>
          <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, color: "orange", backgroundColor: 'white' }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {states.map((row) => {
                    if(row.state!=='Total' && row.state!=='State Unassigned')
                    return (
                      <TableRow 
                        key={row.state} 
                        onMouseEnter={onMouseEnter(row.state)}
                        onMouseLeave={onMouseLeave}>
                        <TableCell align="left">{row.state}</TableCell>
                        <TableCell align="left">{row.confirmed}</TableCell>
                        <TableCell align="left">{row.active}</TableCell>
                        <TableCell align="left">{row.recovered}</TableCell>
                        <TableCell align="left">{row.deceased}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
        <div className="appbody__right">
          <Map states={states}/>
        </div>
      </div>
    </div>
  );
}

export default App;
