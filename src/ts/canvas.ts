import {rates, detailedResponse} from "./response"
class Values{
    constructor(height : number, value :number) {
        this.height = height;
        this.value=value;
    }
    height : number;
    value : number;
}
class Points{
    constructor(x : number, y :number, tip :string, date :string) {
        this.x = x;
        this.y=y;
        this.radius = 3;
        this.rxr=9;
        this.tip1 = "Cena: "+tip;
        this.tip2= "Dnia:"+date;
    }
    x : number;
    y : number;
    radius: number;
    rxr: number;
    tip1: string;
    tip2: string;
}

export class canvasElements {
    constructor(rates : detailedResponse)
    {
        let table = document.querySelector(".table")as HTMLElement; 
        this.canvas=document.createElement("canvas") as HTMLCanvasElement;
        this.canvas.height = table.clientWidth/3;
        this.canvas.width = table.clientWidth-(0.05*table.clientWidth);
        this.canvas.classList.add("main-canvas");
        this.context= this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this._rates=rates;
        this.distance= this.calculateDistanceHorizontal(this.canvas, this._rates.data.rates.length-1);
        this.peakValue = 0;
        this.bottomValue =0;
        this.points= new Array<Points>();
        this.lines= new Array<Values>();
        let tooltip = document.createElement("canvas") as HTMLCanvasElement;
        tooltip.classList.add("tooltip");
        tooltip.height=60;
        tooltip.width=220;
        this.wrapper = document.createElement("td") as HTMLTableCellElement;
        this.wrapper.classList.add(this._rates.data.code);
        let context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.userEvents(tooltip);
        this.wrapper.appendChild(this.canvas);
        this.wrapper.appendChild(tooltip);
    }
    wrapper : HTMLElement;
    canvas: HTMLCanvasElement;
    _rates: detailedResponse;
    context : CanvasRenderingContext2D;
    lines: Array<Values>;
    points: Array<Points>;
    peakValue: number;
    bottomValue: number;
    distance : number;
    draw(){
        //START- draw horizontal and vertical lines
        for(var i=0; i<4; i++){
            this.drawLinesHorizontal(this.canvas, this.context, i*this.calculateDistanceVertical(this.canvas));
            this.lines.push(new Values(i*this.calculateDistanceVertical(this.canvas),0));
        }
        for(var i=0; i<this._rates.data.rates.length-1; i++){ 
            this.drawLinesVertical(this.canvas, this.context, i*this.distance);
            if(this.peakValue<this._rates.data.rates[i].ask) this.peakValue=this._rates.data.rates[i].ask;
            if(this.bottomValue > this._rates.data.rates[i].ask || i==0) this.bottomValue=this._rates.data.rates[i].ask;
        }
        //END- draw horizontal and vertical lines
        //calcualte scale
        this.lines=this.calculateScale(this.peakValue,this.bottomValue,this.lines);
       
        for(var i=0; i<this._rates.data.rates.length; i++){
            this.points.push(this.calcPoint(this._rates.data.rates[i], this.lines , i*this.distance, this.canvas));
        }
        this.drawPlace(this.canvas, this.points);
        for(var i =0; i<this.points.length-1; i++){
            this.context.beginPath(); 
            this.context.strokeStyle="#424242";
            this.context.moveTo(this.points[i].x,this.points[i].y);
            this.context.lineTo(this.points[i+1].x,this.points[i+1].y);
            this.context.stroke();
        }
        for(var i =0; i<this.points.length; i++){
            this.drawPoints(this.canvas, this.points[i])
        }
        //animate(_rates,canvas,context ,lines, points);
        //ADD user Events
    }

    calculateScale(peakValue : number, bottomValue: number, lines : Array<Values>) : Array<Values>{
        let lowest :number;
        let highest :number;
        if((Math.round((bottomValue)*100)/100)>bottomValue){
            if((Math.round((bottomValue- 0.004)*100)/100)>bottomValue){
                lowest  = Math.round((bottomValue- 0.004)*1000)/1000;
            }
            else {
                lowest  = Math.round((bottomValue- 0.004)*100)/100;
            }
        }
        else {
            lowest  = Math.round((bottomValue)*100)/100;
        }
        if((Math.round((peakValue)*100)/100)<peakValue){
            if((Math.round((peakValue+ 0.004)*100)/100)<peakValue){
                highest  = Math.round((peakValue+ 0.004)*1000)/1000;
            }
            else {
                highest  = Math.round((peakValue+ 0.004)*100)/100;
            }
        }
        else {
            highest  = Math.round((peakValue)*100)/100;
        }
        lines[0].value=lowest;
        lines[1].value=Math.round((lowest+ (highest-lowest)/3)*1000)/1000;
        lines[2].value=Math.round((lowest+ (highest-lowest)*2/3)*1000)/1000;;
        lines[3].value=highest;
        return lines;
    }
    drawPoints(canvas :HTMLCanvasElement, points : Points){
        let ctx =canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.beginPath();
        ctx.strokeStyle= "#7c7878";
        ctx.fillStyle="#7c7878";
        ctx.arc(points.x,points.y,4,0*Math.PI,2*Math.PI);
        ctx.fill();
        ctx.stroke();
    }
    calcPoint(rates :rates, lines : Array<Values>, x :number, canvas :HTMLCanvasElement):Points{
        let denominator : number =lines[3].value-lines[0].value;
        let numerator : number = rates.ask - lines[0].value;
        let y: number = canvas.height-lines[3].height*numerator/denominator;
        return new Points(x,y, rates.ask.toString() ,rates.effectiveDate);
    }
    drawPlace(canvas :HTMLCanvasElement, points :Array<Points>){
        let ctx  = canvas.getContext("2d") as CanvasRenderingContext2D;
        let r= Math.floor(Math.random()*255);
            let b=Math.floor(Math.random()*255);
            let g=Math.floor(Math.random()*255);
            ctx.fillStyle = "rgba("+r+","+g+","+b+", 0.7)";
        for(var i=1; i<points.length; i++){
            ctx.beginPath();
            ctx.moveTo((canvas.width/(points.length-1))*(i-1), canvas.height);
            ctx.lineTo((canvas.width/(points.length-1))*(i-1), points[i-1].y);
            ctx.lineTo((canvas.width/(points.length-1))*(i), points[i].y);
            ctx.lineTo((canvas.width/(points.length-1))*(i), canvas.height);
            ctx.fill();
        }
    }
    userEvents( tooltip : HTMLCanvasElement){
        let points = this.points;
        let canvas = this.canvas;
        this.canvas.addEventListener("mousemove", function (e: MouseEvent) {
            let mouseX : number =e.offsetX;
            let mouseY : number =e.offsetY;
            let tipCtx = tooltip.getContext("2d") as CanvasRenderingContext2D;
            var hit = false;
            for (var i = 0; i < points.length; i++) {
                var dot = points[i] as Points;
                var dx = mouseX - dot.x;
                var dy = mouseY - dot.y;
                if (dx * dx + dy * dy < dot.rxr) {
                    var rect = canvas.getBoundingClientRect();
                    tooltip.style.left = rect.left+(dot.x) + "px";
                    tooltip.style.visibility="visible";
                    tooltip.style.top =rect.y+(dot.y + 10) + "px";
                    tipCtx.font="20px Verdana";
                    tipCtx.fillStyle= "#f7ff00";
                    tipCtx.clearRect(0, 0, tooltip.width, tooltip.height);
                    tipCtx.fillText(dot.tip1, 10, 20);
                    tipCtx.fillText(dot.tip2, 10, 50);
                    hit = true;
                }
            }
            if (!hit) { tooltip.style.visibility = "hidden"; }
        })
    }
    calculateDistanceHorizontal(canvas :HTMLCanvasElement, length :number) : number{
        return (canvas.width)/length;
    }
    calculateDistanceVertical(canvas :HTMLCanvasElement) :number{
        let distance : number=(canvas.height*1.1)/4;
        return distance;
    }
    drawLinesHorizontal(canvas :HTMLCanvasElement, context :CanvasRenderingContext2D, number : number){
        context.beginPath();
        context.strokeStyle="#ccc8c8";
        context.moveTo(0, canvas.height-number)
        context.lineTo(canvas.width, canvas.height-number);
        context.stroke();
    }
    drawLinesVertical(canvas :HTMLCanvasElement, context :CanvasRenderingContext2D, number : number){
        context.beginPath();
        context.strokeStyle="#ccc8c8";
        context.moveTo(number, 0)
        context.lineTo(number, canvas.width);
        context.stroke();
    }
}


