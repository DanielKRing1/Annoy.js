"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Types = void 0;
var AnnoyTree_1 = require("./components/AnnoyTree");
var VectorUtils_1 = require("./utils/VectorUtils");
var Types = __importStar(require("./types"));
exports.Types = Types;
var Annoy = /** @class */ (function () {
    function Annoy(forestSize, dimensions, maxValues) {
        this.forest = __spreadArray([], new Array(forestSize), true).map(function () { return new AnnoyTree_1.AnnoyTree(dimensions, maxValues); });
        this.dimensions = dimensions;
        this.maxValues = maxValues;
    }
    Annoy.prototype.get = function (inputVector, max) {
        var closestFromAllTrees = new Set();
        for (var i = 0; i < this.forest.length; i++) {
            // 1. Get tree
            var tree = this.forest[i];
            // 2. Get points that tree has partitioned as "closest" to p
            var closestInTree = tree.get(inputVector);
            closestInTree.forEach(function (closePoint) { return closestFromAllTrees.add(closePoint); });
        }
        var result;
        if (max && closestFromAllTrees.size > max)
            result = Array.from(closestFromAllTrees)
                .sort(function (a, b) { return (0, VectorUtils_1.vectorDistSqr)(a.vector, inputVector) - (0, VectorUtils_1.vectorDistSqr)(b.vector, inputVector); })
                .slice(0, max);
        else
            result = Array.from(closestFromAllTrees);
        return result;
    };
    Annoy.prototype.add = function (p) {
        for (var i = 0; i < this.forest.length; i++) {
            var tree = this.forest[i];
            tree.addPoint(p);
        }
    };
    Annoy.prototype.addBulk = function (bulkPoints) {
        for (var i = 0; i < this.forest.length; i++) {
            var tree = this.forest[i];
            tree.addBulk(bulkPoints);
        }
    };
    // DE/SERIALIZATION UTILS
    Annoy.prototype.toJson = function () {
        var _a;
        return _a = {},
            _a[Types.AnnoyForestJsonKey.FOREST] = this.forest.map(function (tree) { return tree.toJson(); }),
            _a[Types.AnnoyForestJsonKey.DIMENSIONS] = this.dimensions,
            _a[Types.AnnoyForestJsonKey.MAX_VALUES] = this.maxValues,
            _a;
    };
    Annoy.prototype.fromJson = function (asJson) {
        // 1. Get json string as Json Object
        var asAnnoyJson = JSON.parse(asJson);
        var asAnnoyForestJson = asAnnoyJson[Types.AnnoyForestJsonKey.FOREST];
        var dimensions = asAnnoyJson[Types.AnnoyForestJsonKey.DIMENSIONS];
        var maxValues = asAnnoyJson[Types.AnnoyForestJsonKey.MAX_VALUES];
        // 2. Override this.dimensions and this.maxValues with the amount serialized in input json
        this.dimensions = dimensions;
        this.maxValues = maxValues;
        // 3. Build forest of trees
        for (var i = 0; i < asAnnoyForestJson.length; i++) {
            // 3.1. Get tree json
            var asAnnoyTreeJson = asAnnoyForestJson[i];
            // 3.2. Load tree from Json Object
            var tree = new AnnoyTree_1.AnnoyTree(this.dimensions, this.maxValues);
            tree.fromJson(asAnnoyTreeJson);
            // 3.3. Add loaded tree to this.forest
            this.forest.push(tree);
        }
    };
    return Annoy;
}());
exports.default = Annoy;
