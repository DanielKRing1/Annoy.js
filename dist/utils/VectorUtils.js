"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorLenSqr = exports.vectorDistSqr = exports.divVectorScalar = exports.divVectors = exports.multVectorScalar = exports.multVectors = exports.subVectors = exports.addVectors = exports.dot = void 0;
function dot(a, b) {
    var dim = a.length;
    var sum = 0;
    for (var i = 0; i < dim; i++) {
        var aVal = a[i];
        var bVal = b[i];
        var product = aVal * bVal;
        sum += product;
    }
    return sum;
}
exports.dot = dot;
function addVectors(a, b) {
    var dim = a.length;
    var sum = Array(dim);
    for (var i = 0; i < dim; i++) {
        sum[i] = a[i] + b[i];
    }
    return sum;
}
exports.addVectors = addVectors;
function subVectors(a, b) {
    var dim = a.length;
    var diff = Array(dim);
    for (var i = 0; i < dim; i++) {
        diff[i] = a[i] - b[i];
    }
    return diff;
}
exports.subVectors = subVectors;
function multVectors(a, b) {
    var dim = a.length;
    var product = Array(dim);
    for (var i = 0; i < dim; i++) {
        product[i] = a[i] * b[i];
    }
    return product;
}
exports.multVectors = multVectors;
function multVectorScalar(a, s) {
    var dim = a.length;
    var product = Array(dim);
    for (var i = 0; i < dim; i++) {
        product[i] = a[i] * s;
    }
    return product;
}
exports.multVectorScalar = multVectorScalar;
function divVectors(a, b) {
    var dim = a.length;
    var quotient = Array(dim);
    for (var i = 0; i < dim; i++) {
        // TODO Prevent divide by 0
        quotient[i] = a[i] / b[i];
    }
    return quotient;
}
exports.divVectors = divVectors;
function divVectorScalar(a, s) {
    var dim = a.length;
    var quotient = Array(dim);
    for (var i = 0; i < dim; i++) {
        quotient[i] = a[i] / s;
    }
    return quotient;
}
exports.divVectorScalar = divVectorScalar;
function vectorDistSqr(a, b) {
    var dim = a.length;
    var distance = 0;
    for (var i = 0; i < dim; i++) {
        var aVal = a[i];
        var bVal = b[i];
        var partialDistSqr = Math.pow(aVal - bVal, 2);
        distance += partialDistSqr;
    }
    return distance;
}
exports.vectorDistSqr = vectorDistSqr;
function vectorLenSqr(v) {
    var dim = v.length;
    var length = 0;
    for (var i = 0; i < dim; i++) {
        var val = v[i];
        length += val * val;
    }
    return length;
}
exports.vectorLenSqr = vectorLenSqr;
