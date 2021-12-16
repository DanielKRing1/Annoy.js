"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperplaneJsonKey = exports.AnnoyInnerNodeJsonKey = exports.AnnoyForestJsonKey = void 0;
var AnnoyForestJsonKey;
(function (AnnoyForestJsonKey) {
    AnnoyForestJsonKey["FOREST"] = "forest";
    AnnoyForestJsonKey["DIMENSIONS"] = "dimensions";
    AnnoyForestJsonKey["MAX_VALUES"] = "maxValues";
})(AnnoyForestJsonKey = exports.AnnoyForestJsonKey || (exports.AnnoyForestJsonKey = {}));
var AnnoyInnerNodeJsonKey;
(function (AnnoyInnerNodeJsonKey) {
    AnnoyInnerNodeJsonKey["HYPERPLANE"] = "h";
    AnnoyInnerNodeJsonKey["LEFT"] = "l";
    AnnoyInnerNodeJsonKey["RIGHT"] = "r";
})(AnnoyInnerNodeJsonKey = exports.AnnoyInnerNodeJsonKey || (exports.AnnoyInnerNodeJsonKey = {}));
var HyperplaneJsonKey;
(function (HyperplaneJsonKey) {
    HyperplaneJsonKey["w"] = "w";
    HyperplaneJsonKey["b"] = "b";
})(HyperplaneJsonKey = exports.HyperplaneJsonKey || (exports.HyperplaneJsonKey = {}));
