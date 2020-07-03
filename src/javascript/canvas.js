"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Values = /** @class */ (function () {
    function Values(height, value) {
        this.height = height;
        this.value = value;
    }
    return Values;
}());
var Points = /** @class */ (function () {
    function Points(x, y, tip, date) {
        this.x = x;
        this.y = y;
        this.radius = 3;
        this.rxr = 9;
        this.tip1 = "Cena: " + tip;
        this.tip2 = "Dnia:" + date;
    }
    return Points;
}());
var canvasElements = /** @class */ (function () {
    function canvasElements(rates) {
        var table = document.querySelector(".table");
        this.canvas = document.createElement("canvas");
        this.canvas.height = table.clientWidth / 3;
        this.canvas.width = table.clientWidth - (0.05 * table.clientWidth);
        this.canvas.classList.add("main-canvas");
        this.context = this.canvas.getContext("2d");
        this._rates = rates;
        this.distance = this.calculateDistanceHorizontal(this.canvas, this._rates.data.rates.length - 1);
        this.peakValue = 0;
        this.bottomValue = 0;
        this.points = new Array();
        this.lines = new Array();
        var tooltip = document.createElement("canvas");
        tooltip.classList.add("tooltip");
        tooltip.height = 60;
        tooltip.width = 220;
        this.wrapper = document.createElement("td");
        this.wrapper.classList.add(this._rates.data.code);
        var context = this.canvas.getContext("2d");
        this.userEvents(tooltip);
        this.wrapper.appendChild(this.canvas);
        this.wrapper.appendChild(tooltip);
    }
    canvasElements.prototype.draw = function () {
        //START- draw horizontal and vertical lines
        for (var i = 0; i < 4; i++) {
            this.drawLinesHorizontal(this.canvas, this.context, i * this.calculateDistanceVertical(this.canvas));
            this.lines.push(new Values(i * this.calculateDistanceVertical(this.canvas), 0));
        }
        for (var i = 0; i < this._rates.data.rates.length - 1; i++) {
            this.drawLinesVertical(this.canvas, this.context, i * this.distance);
            if (this.peakValue < this._rates.data.rates[i].ask)
                this.peakValue = this._rates.data.rates[i].ask;
            if (this.bottomValue > this._rates.data.rates[i].ask || i == 0)
                this.bottomValue = this._rates.data.rates[i].ask;
        }
        //END- draw horizontal and vertical lines
        //calcualte scale
        this.lines = this.calculateScale(this.peakValue, this.bottomValue, this.lines);
        for (var i = 0; i < this._rates.data.rates.length; i++) {
            this.points.push(this.calcPoint(this._rates.data.rates[i], this.lines, i * this.distance, this.canvas));
        }
        this.drawPlace(this.canvas, this.points);
        for (var i = 0; i < this.points.length - 1; i++) {
            this.context.beginPath();
            this.context.strokeStyle = "#424242";
            this.context.moveTo(this.points[i].x, this.points[i].y);
            this.context.lineTo(this.points[i + 1].x, this.points[i + 1].y);
            this.context.stroke();
        }
        for (var i = 0; i < this.points.length; i++) {
            this.drawPoints(this.canvas, this.points[i]);
        }
        //animate(_rates,canvas,context ,lines, points);
        //ADD user Events
    };
    canvasElements.prototype.calculateScale = function (peakValue, bottomValue, lines) {
        var lowest;
        var highest;
        if ((Math.round((bottomValue) * 100) / 100) > bottomValue) {
            if ((Math.round((bottomValue - 0.004) * 100) / 100) > bottomValue) {
                lowest = Math.round((bottomValue - 0.004) * 1000) / 1000;
            }
            else {
                lowest = Math.round((bottomValue - 0.004) * 100) / 100;
            }
        }
        else {
            lowest = Math.round((bottomValue) * 100) / 100;
        }
        if ((Math.round((peakValue) * 100) / 100) < peakValue) {
            if ((Math.round((peakValue + 0.004) * 100) / 100) < peakValue) {
                highest = Math.round((peakValue + 0.004) * 1000) / 1000;
            }
            else {
                highest = Math.round((peakValue + 0.004) * 100) / 100;
            }
        }
        else {
            highest = Math.round((peakValue) * 100) / 100;
        }
        lines[0].value = lowest;
        lines[1].value = Math.round((lowest + (highest - lowest) / 3) * 1000) / 1000;
        lines[2].value = Math.round((lowest + (highest - lowest) * 2 / 3) * 1000) / 1000;
        ;
        lines[3].value = highest;
        return lines;
    };
    canvasElements.prototype.drawPoints = function (canvas, points) {
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = "#7c7878";
        ctx.fillStyle = "#7c7878";
        ctx.arc(points.x, points.y, 4, 0 * Math.PI, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    };
    canvasElements.prototype.calcPoint = function (rates, lines, x, canvas) {
        var denominator = lines[3].value - lines[0].value;
        var numerator = rates.ask - lines[0].value;
        var y = canvas.height - lines[3].height * numerator / denominator;
        return new Points(x, y, rates.ask.toString(), rates.effectiveDate);
    };
    canvasElements.prototype.drawPlace = function (canvas, points) {
        var ctx = canvas.getContext("2d");
        var r = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ", 0.7)";
        for (var i = 1; i < points.length; i++) {
            ctx.beginPath();
            ctx.moveTo((canvas.width / (points.length - 1)) * (i - 1), canvas.height);
            ctx.lineTo((canvas.width / (points.length - 1)) * (i - 1), points[i - 1].y);
            ctx.lineTo((canvas.width / (points.length - 1)) * (i), points[i].y);
            ctx.lineTo((canvas.width / (points.length - 1)) * (i), canvas.height);
            ctx.fill();
        }
    };
    canvasElements.prototype.userEvents = function (tooltip) {
        var points = this.points;
        var canvas = this.canvas;
        this.canvas.addEventListener("mousemove", function (e) {
            var mouseX = e.offsetX;
            var mouseY = e.offsetY;
            var tipCtx = tooltip.getContext("2d");
            var hit = false;
            for (var i = 0; i < points.length; i++) {
                var dot = points[i];
                var dx = mouseX - dot.x;
                var dy = mouseY - dot.y;
                if (dx * dx + dy * dy < dot.rxr) {
                    var rect = canvas.getBoundingClientRect();
                    tooltip.style.left = rect.left + (dot.x) + "px";
                    tooltip.style.visibility = "visible";
                    tooltip.style.top = rect.y + (dot.y + 10) + "px";
                    tipCtx.font = "20px Verdana";
                    tipCtx.fillStyle = "#f7ff00";
                    tipCtx.clearRect(0, 0, tooltip.width, tooltip.height);
                    tipCtx.fillText(dot.tip1, 10, 20);
                    tipCtx.fillText(dot.tip2, 10, 50);
                    hit = true;
                }
            }
            if (!hit) {
                tooltip.style.visibility = "hidden";
            }
        });
    };
    canvasElements.prototype.calculateDistanceHorizontal = function (canvas, length) {
        return (canvas.width) / length;
    };
    canvasElements.prototype.calculateDistanceVertical = function (canvas) {
        var distance = (canvas.height * 1.1) / 4;
        return distance;
    };
    canvasElements.prototype.drawLinesHorizontal = function (canvas, context, number) {
        context.beginPath();
        context.strokeStyle = "#ccc8c8";
        context.moveTo(0, canvas.height - number);
        context.lineTo(canvas.width, canvas.height - number);
        context.stroke();
    };
    canvasElements.prototype.drawLinesVertical = function (canvas, context, number) {
        context.beginPath();
        context.strokeStyle = "#ccc8c8";
        context.moveTo(number, 0);
        context.lineTo(number, canvas.width);
        context.stroke();
    };
    return canvasElements;
}());
exports.canvasElements = canvasElements;
