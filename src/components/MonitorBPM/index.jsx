import React from "react";
import {MonitorContainer} from "./style";

export const MonitorBPM = ({ value }) => {
   return ( <MonitorContainer>
        <h1 style={{width: '100%'}}>BPM</h1>
           <div>
               <span>{value}</span>
           </div>
           <span style={{width: '100%', textAlign: 'end'}}>/min</span>
    </MonitorContainer>
   )
}
