"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = __importDefault(require("./api"));
var canvas_1 = require("./canvas");
var createtable = /** @class */ (function () {
    function createtable(resp) {
        var _this = this;
        var table = document.createElement("table");
        var _loop_1 = function () {
            var row = document.createElement("tr");
            var cellask = document.createElement("td");
            var textask = document.createTextNode(resp.data[0].rates[d].ask.toString());
            var cellbid = document.createElement("td");
            var textbid = document.createTextNode(resp.data[0].rates[d].bid.toString());
            var cellcode = document.createElement("td");
            var textcode = document.createTextNode(resp.data[0].rates[d].code);
            var cellcurrency = document.createElement("td");
            var textcurrency = document.createTextNode(resp.data[0].rates[d].currency.toUpperCase());
            cellask.appendChild(textask);
            cellbid.appendChild(textbid);
            cellcode.appendChild(textcode);
            cellcurrency.appendChild(textcurrency);
            row.appendChild(cellcode);
            row.appendChild(cellcurrency);
            row.appendChild(cellbid);
            row.appendChild(cellask);
            row.classList.add("hide");
            var x = resp.data[0].rates[d].code;
            row.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
                var newRow, det, _a, _b, _c, _d, canvas, cell, canvas, canvas;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!row.classList.contains("hide")) return [3 /*break*/, 2];
                            newRow = table.insertRow(Array.prototype.indexOf.call(table.children, row) + 1);
                            _b = (_a = JSON).parse;
                            _d = (_c = JSON).stringify;
                            return [4 /*yield*/, api_1.default("http://api.nbp.pl/api/exchangerates/rates/c/" + x + "/last/15/")];
                        case 1:
                            det = _b.apply(_a, [_d.apply(_c, [_e.sent()])]);
                            canvas = new canvas_1.canvasElements(det);
                            canvas.draw();
                            newRow.appendChild(canvas.wrapper);
                            cell = newRow.firstElementChild;
                            cell.colSpan = 4;
                            row.classList.remove("hide");
                            row.classList.add("expanded");
                            return [3 /*break*/, 3];
                        case 2:
                            if (row.classList.contains("expanded")) {
                                canvas = row.nextElementSibling;
                                canvas === null || canvas === void 0 ? void 0 : canvas.classList.remove("visible");
                                canvas === null || canvas === void 0 ? void 0 : canvas.classList.add("_hide");
                                row.classList.remove("expanded");
                                row.classList.add("hidden");
                            }
                            else {
                                row.classList.add("expanded");
                                canvas = row.nextElementSibling;
                                row.classList.remove("hidden");
                                canvas === null || canvas === void 0 ? void 0 : canvas.classList.add("visible");
                                canvas === null || canvas === void 0 ? void 0 : canvas.classList.remove("_hide");
                            }
                            _e.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); }, false);
            table.appendChild(row);
        };
        for (var d = 0; d < resp.data[0].rates.length; d++) {
            _loop_1();
        }
        var body = document.querySelector("body");
        table.classList.add("table");
        body.appendChild(table);
    }
    return createtable;
}());
exports.createtable = createtable;
