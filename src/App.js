import React, {useEffect, useRef, useState} from "react";
import CanvasJSReact from './assets/canvasjs.react.js';
import {ECGSContainer} from "./components/ECGSContainer";
import {MonitorBPM} from "./components/MonitorBPM";
import axios from "axios";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

var color = "black";
let dataFirstLine = [];
let dataSecondLine = []; //dataPoints.
let xVal = 1000;
let xVal2 = 0;
let yVal = 2.7;
let yVal2 = 0;
const baseUrl = "http://localhost:3001/baseR4/";
let chart = null;
let pos = 0;

const App = () => {
    const updateInterval = 3.9;
    let dataEcg = null;

    const getData = async () => {
        const response = axios.get(`${baseUrl}Observation/63b9f5024c8eac1c485d2b26/data/1`).then(res => res.data[0].data);
        return response;
    }

    const x = async () => {
        try {
            dataEcg = await getData();
            dataEcg = dataEcg.split(",")
        } catch (err) {

        } finally {
            console.log(dataEcg,`sera`)
            if (dataEcg) {
                let posX = 0;
                if (dataFirstLine.length === 0) {
                    for (let i = 0; i < 1000; i++) {
                        dataFirstLine.push({x: posX, y: Number(dataEcg[i])})
                        posX = posX + 1;
                        pos = pos + 1;
                    }
                }
                updateChart();
            }
        }

    }
    useEffect(  () => {
        x();
    }, [])
    const [bpmValue, setBpmValue] = useState();
    const updateChart = () => {
        if(chart) {
            let teste = new Date();

            console.log(teste.getMilliseconds(), `testeeeeee`, teste.getSeconds())

            let posY = Number(dataEcg[pos]);
            pos = pos + 1;
            setBpmValue(85);
            if (xVal === 1000) {
                dataSecondLine.push({x: xVal2,y: posY});
                if (xVal2 === 999) {
                    xVal = 0;
                }
                xVal2 = xVal2 + 1;

                dataFirstLine.splice(0, 1);
            }
            else {
                dataFirstLine.push({x: xVal,y: posY});
                if (xVal === 999) {
                    xVal2 = 0;
                }
                xVal = xVal + 1;
                dataSecondLine.splice(0, 1);
            }
            if (!yVal) return;
            chart.render();
            // setTimeout(updateChart, updateInterval);
        }
    }

    const options = {
        theme: "light2",
        backgroundColor: "black",
        axisY:{
            gridColor: color,
            lineColor: color,
            tickThickness: 0,
            labelFormatter: function(e){
                return "";
            }
        },
        axisX:{
            gridColor: color,
            lineColor: color,
            tickThickness: 0,
            labelFormatter: function(e){
                return "";
            }
        },
        data: [
            {
                type: "spline",
                color:"green",
                markerType: "none",
                dataPoints: dataFirstLine,
                lineThickness: 4
            },
            {
                type: "spline",
                color:"green",
                markerType: "none",
                dataPoints: dataSecondLine,
                lineThickness: 4

            }
        ]
    }

    useEffect(() => {


    }, [dataEcg]);
    return(
        <div style={{    height: '100vh',
            display: 'flex',
            flexDirection: 'column', backgroundColor: "black", justifyContent: 'space-around'}}>
        <ECGSContainer>
            <CanvasJSChart options = {options}
                           onRef={ref => chart = ref}
            />
        </ECGSContainer>
            <div style={{width: '100%', display: 'flex',     justifyContent: 'flex-end'}}>
                <MonitorBPM value={bpmValue} />

            </div>
        </div>
    )
}

export default App;
