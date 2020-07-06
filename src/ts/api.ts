import axios from 'axios';
import {response} from "./response";
import { AxiosRequestConfig, AxiosPromise } from 'axios';
import PromiseLoadingSpinner from 'promise-loading-spinner';

export default async function getRequestedData (requestAddress :string) : Promise<response>{
    if(!document.querySelector(".loading")){
        let loading = document.createElement("div");
        
        let par= document.createElement("p");
        par.textContent="ŁADUJESIE";
        loading.classList.add("loading");
        loading.appendChild(par);
        document.querySelector("body")?.appendChild(loading);
    }
    else{
        let loading = document.querySelector(".loading") as HTMLElement;
        loading.style.visibility="visible";
    }
    return await axios.get("https://cors-anywhere.herokuapp.com/"+requestAddress, {
        params: {
            method :"get"
        },
        headers: {
            originWhitelist: [],
            requireHeader: ['origin', 'x-requested-with'],
        }
    }).then(response=>{
        let loading = document.querySelector(".loading") as HTMLElement;
        loading.style.visibility="hidden";
        return response;
    });
 }
