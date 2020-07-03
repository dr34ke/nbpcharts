import getRequestedData from "./api"
import {response} from "./response"
import { createtable } from "./cratetable";
import PromiseLoadingSpinner from 'promise-loading-spinner';
document.addEventListener("DOMContentLoaded", async()=>{
    let table=await getRequestedData("http://api.nbp.pl/api/exchangerates/tables/c/?format=json");
    let response : response = JSON.parse(JSON.stringify(table));
    new createtable(response);
})