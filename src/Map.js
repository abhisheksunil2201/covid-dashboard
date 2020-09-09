import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';
import './Map.css'
import Boxes from './Boxes';

const INDIA_TOPO_JSON = require('./india.topo.json');

const PROJECTION_CONFIG = {
  scale: 350,
  center: [78.9629, 22.5937] // always in [East Latitude, North Longitude]
};

// Red Variants
const COLOR_RANGE = [
  '#ffedea',
  '#ffcec5',
  '#ffad9f',
  '#ff8a75',
  '#ff5533',
  '#e2492d',
  '#be3d26',
  '#9a311f',
  '#782618'
];

const DEFAULT_COLOR = '#EEE';

const geographyStyle = {
  default: {
    outline: 'none'
  },
  hover: {
    fill: '#ccc',
    transition: 'all 250ms',
    outline: 'none'
  },
  pressed: {
    outline: 'none'
  }
};

function Map() {
  const [tooltipContent, setTooltipContent] = useState('');
  const [data, setStates] = useState([]);
  
  useEffect(() => {
    //API
    const getStateData = async () => {
      await fetch("https://api.covid19india.org/data.json")
      .then((res) => res.json())
      .then((data) => {
        const cases = data.statewise.map((state) => ({
          state: state.state,
          value: state.confirmed,
          active: state.active,
          recovered: state.recovered,
          deceased: state.deaths,
          id: state.statecode
        }));
        setStates(cases);
      })
    }
    getStateData();
  }, []);

  const [bval, setbval] = useState({'confirmed': 0, 'active': 0, 'recovered': 0, 'deceased': 0})

  useEffect(() => {
    const box = ({
      confirmed: data[0]?.value,
      active: data[0]?.active,
      recovered: data[0]?.recovered,
      deceased: data[0]?.deceased
    })
    setbval(box);
  },[data])

  const onMouseEnter = (geo, current = { value: 'NA' }) => {
    return () => {
      {
        data.map(e => {
          if(e.id === geo.id)
          {
            const newdata = ({
              confirmed: e?.value,
              active: e?.active,
              recovered: e?.recovered,
              deceased: e?.deceased,
              state: geo.properties.name
            })
            setbval(newdata);
          }
        })
      }
      setTooltipContent(`${geo.properties.name}: ${current.value}`);

    };
  };

  const onMouseLeave = () => {
    setTooltipContent('');
    const box = ({
      confirmed: data[0]?.value,
      active: data[0]?.active,
      recovered: data[0]?.recovered,
      deceased: data[0]?.deceased
    })
    setbval(box);
  };
  
  const colorScale = scaleQuantile()
    .domain(data.map(d => d.value))
    .range(COLOR_RANGE);

  return (
    <div className="full-width-height container">
      {/*console.log(bval)*/}
      <Boxes confirmed={bval.confirmed} active={bval.active} recovered={bval.recovered} deceased={bval.deceased} statename={bval.state}/>
      
      <ReactTooltip>{tooltipContent}</ReactTooltip>
      
        <ComposableMap
          projectionConfig={PROJECTION_CONFIG}
          projection="geoMercator"
          width={230}
          height={300}
          data-tip=""
        >
          
          <Geographies geography={INDIA_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map(geo => {
                const current = data.find(s => s.id === geo.id);
                return (
                  
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                    style={geographyStyle}
                    onMouseEnter={onMouseEnter(geo, current)}
                    onMouseLeave={onMouseLeave}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
    </div>
  );
}

export default Map;