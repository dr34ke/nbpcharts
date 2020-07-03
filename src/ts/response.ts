export interface response{
    data : Array<_arr>;
}
interface _arr{
    table :string;
    effectiveDate :string;
    rates : Array<rates>
}
export interface rates{
    ask :number;
    bid:number;
    code:string;
    effectiveDate :string;
    currency:string;
}

export interface detailedResponse{
    data : _response;
} 
interface _response{
    code :string;
    
    currency :string;
    rates : Array<rates>;
}
