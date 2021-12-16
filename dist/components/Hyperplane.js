"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hyperplane = void 0;
var types_1 = require("../types");
var VectorUtils_1 = require("../utils/VectorUtils");
var Random_1 = require("../utils/Random");
var Hyperplane = /** @class */ (function () {
    function Hyperplane(centroid) {
        if (centroid === void 0) { centroid = null; }
        this.w = [];
        this.b = 0;
        if (centroid !== null) {
            var dim = centroid.length;
            // 1. Get random number between 0 and 1
            var rand = Math.random();
            // 2. Get min and max bounds for a random point
            var minVector_1 = centroid.map(function (val) { return -5 * Math.abs(val); });
            var maxVector_1 = centroid.map(function (val) { return 5 * Math.abs(val); });
            // 3. Get random point
            var randPoint = __spreadArray([], new Array(dim), true).map(function (empty, i) { return (0, Random_1.getRand)(minVector_1[i], maxVector_1[i]); });
            // 4. Set random point as 'w'
            this.w = randPoint;
            // 5. Get determinant of centroid and random point, set as 'b'
            this.b = (0, VectorUtils_1.dot)(centroid, randPoint);
        }
    }
    Hyperplane.prototype.getSide = function (p) {
        var side = (0, VectorUtils_1.dot)(this.w, p);
        return side - this.b;
    };
    Hyperplane.prototype.toJson = function () {
        var _a;
        return _a = {},
            _a[types_1.HyperplaneJsonKey.w] = this.w,
            _a[types_1.HyperplaneJsonKey.b] = this.b,
            _a;
    };
    Hyperplane.prototype.fromJson = function (asJson) {
        this.w = asJson[types_1.HyperplaneJsonKey.w];
        this.b = asJson[types_1.HyperplaneJsonKey.b];
    };
    return Hyperplane;
}());
exports.Hyperplane = Hyperplane;
