"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Canvas = /** @class */ (function () {
    function Canvas() {
        //private paint: boolean;
        this.mouseX = [];
        this.mouseY = [];
        var canvas = document.querySelector('.canvas');
        var context = canvas.getContext("2d");
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        this.canvas = canvas;
        this.context = context;
        console.log("hej");
    }
    return Canvas;
}());
exports.Canvas = Canvas;
