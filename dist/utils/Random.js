"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRand = void 0;
function getRand(min, max) {
    return Math.random() * (max - min) + min;
}
exports.getRand = getRand;
