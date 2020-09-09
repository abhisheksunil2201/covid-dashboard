import React from 'react'
import './Boxes.css'

function Boxes({confirmed, active, recovered, deceased, statename}) {

    return (
        <div>
            <div className="boxes">
                <div className="boxes__confirmed">
                    <h3>CONFIRMED</h3>
                    <p><strong>{confirmed}</strong></p>
                    
                </div>            
                <div className="boxes__active">
                    <h3>ACTIVE</h3>
                    <p><strong>{active}</strong></p>
                </div>            
                <div className="boxes__recovered">
                    <h3>RECOVERED</h3>
                    <p><strong>{recovered}</strong></p>
                </div>            
                <div className="boxes__deceased">
                    <h3>DECEASED</h3>
                    <p><strong>{deceased}</strong></p>
                </div>  
                         
            </div>
            {statename ? 
            (<h2 className="stateText">{statename}</h2>)
            : (<h2 className="stateText">TOTAL</h2>) 
            }
        </div>
    )
}

export default Boxes
