import axios from 'axios';
import { AxiosRequestConfig, AxiosPromise } from 'axios';
import {detailedResponse} from "./response"
import {response} from "./response"
import getRequestedData from './api';
import {canvasElements} from "./canvas";
export class createtable{
    constructor(resp : response){
        let table = document.createElement("table");
        for(var d=0; d<resp.data[0].rates.length; d++){
            let row = document.createElement("tr");
            let cellask = document.createElement("td");
            let textask = document.createTextNode(resp.data[0].rates[d].ask.toString());
            let cellbid = document.createElement("td");
            let textbid = document.createTextNode(resp.data[0].rates[d].bid.toString());
            let cellcode = document.createElement("td");
            let textcode = document.createTextNode(resp.data[0].rates[d].code);
            let cellcurrency = document.createElement("td");
            let textcurrency = document.createTextNode(resp.data[0].rates[d].currency.toUpperCase());
            cellask.appendChild(textask);
            cellbid.appendChild(textbid);
            cellcode.appendChild(textcode);
            cellcurrency.appendChild(textcurrency);
            row.appendChild(cellcode);
            row.appendChild(cellcurrency);
            row.appendChild(cellbid);
            row.appendChild(cellask);
            row.classList.add("hide");
            let x:string =resp.data[0].rates[d].code;
            row.addEventListener("click", async ()=>{
                if(row.classList.contains("hide")){
                    let newRow=table.insertRow(Array.prototype.indexOf.call(table.children, row)+1) as HTMLTableRowElement;
                    let det : detailedResponse=JSON.parse(JSON.stringify(await getRequestedData("http://api.nbp.pl/api/exchangerates/rates/c/" + x + "/last/15/")));
                    let canvas = new canvasElements(det);
                    canvas.draw();
                    newRow.appendChild(canvas.wrapper);
                    let cell = newRow.firstElementChild as HTMLTableCellElement;
                    cell.colSpan=4;
                    row.classList.remove("hide");
                    row.classList.add("expanded");
                }
                else if(row.classList.contains("expanded")){
                    let canvas=row.nextElementSibling;
                    canvas?.classList.remove("visible");
                    canvas?.classList.add("_hide");
                    row.classList.remove("expanded");
                    row.classList.add("hidden"); 
                }
                else{
                    row.classList.add("expanded");
                    let canvas=row.nextElementSibling;
                    row.classList.remove("hidden");
                    canvas?.classList.add("visible");
                    canvas?.classList.remove("_hide");
                }
            }, false)
            
            table.appendChild(row);
        }
        let body=document.querySelector("body") as HTMLElement;
        table.classList.add("table");
        body.appendChild(table);
    }


}