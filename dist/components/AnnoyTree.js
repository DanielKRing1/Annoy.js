"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnoyTree = void 0;
var Hyperplane_1 = require("./Hyperplane");
var types_1 = require("../types");
var VectorUtils_1 = require("../utils/VectorUtils");
var AnnoyTree = /** @class */ (function () {
    function AnnoyTree(dimensions, maxValues) {
        this.isLeaf = undefined;
        this.dimensions = dimensions;
        this.maxValues = maxValues;
        this.setAsLeaf();
    }
    // PUBLIC API
    AnnoyTree.prototype.get = function (p) {
        this.validatePoint(p);
        switch (this.isLeaf) {
            case false:
                var side = this.chooseSide(p);
                return side.get(p);
            default:
                return this.values;
        }
    };
    AnnoyTree.prototype.addPoint = function (newPoint) {
        this.validateDataPoint(newPoint);
        switch (this.isLeaf) {
            // IF LEAF: Pool points into Leaf Nodes
            case true:
                // 1. Add new point to pool of points
                this.values.push(newPoint);
                // 2. Split Node if it owns "too many" points
                if (this.values.length >= this.maxValues) {
                    // 3. Cache Leaf's pool of points to local variable
                    var pool = this.values;
                    // 4. Reset this Node as an "Inner" Node instead of as a Leaf
                    // (Sets this.values = null)
                    // (Also sets this.dividingHyperplane with which to split the pool of points)
                    this.setAsInnerNode();
                    // 5. Split the pool of points into "right" and "left"
                    for (var i = 0; i < pool.length; i++) {
                        var point = pool[i];
                        this.trickleDown(point);
                    }
                }
                break;
            // IF INNER: Split points on this.dividingHyperplane; Trickle points down into Leaf Nodes
            case false:
                this.trickleDown(newPoint);
                break;
        }
    };
    AnnoyTree.prototype.addBulkInefficient = function (bulkPoints) {
        for (var i = 0; i < bulkPoints.length; i++) {
            var newPoint = bulkPoints[i];
            this.addPoint(newPoint);
        }
    };
    AnnoyTree.prototype.addBulk = function (bulkPoints) {
        var _a, _b;
        switch (this.isLeaf) {
            // IF LEAF
            case true:
                // 1. Add bulk points to existing pool of points
                (_a = this.values).push.apply(_a, bulkPoints);
                // 2. IF TOO MANY POINTS TO REMAIN A LEAF, then split bulk points and pass down to left and right subtrees
                if (bulkPoints.length + this.values.length >= this.maxValues) {
                    // 3. Cache Leaf's pool of points to local variable
                    var pool = this.values;
                    // 4. Reset this Node as an "Inner" Node instead of as a Leaf
                    // (Sets this.values = null)
                    // (Also sets this.dividingHyperplane with which to split the pool of points)
                    this.setAsInnerNode();
                    // 5. Split the pool of points into "leftBulk" and "rightBulk"
                    var leftBulk_1 = [];
                    var rightBulk_1 = [];
                    while (pool.length > 0) {
                        var p = pool.pop();
                        // 5.1. Categorize a point as "right" or "left" based on distance from dividing line ( >= 0 is right, < 0 is left )
                        var side = this.dividingHyperplane.getSide(p.vector);
                        // 5.2. Add points to 'leftBulk' or 'rightBulk'
                        if (side >= 0)
                            rightBulk_1.push(p);
                        else
                            leftBulk_1.push(p);
                    }
                    // 6. Trickle-down bulk points to left and right subtrees
                    this.left.addBulk(leftBulk_1);
                    this.right.addBulk(rightBulk_1);
                }
                // REMAIN A LEAF
                else {
                    (_b = this.values).push.apply(_b, bulkPoints);
                }
                break;
            // IF NOT LEAF
            case false:
                var leftBulk = [];
                var rightBulk = [];
                // 1. Split points into bulk subsets for 'left' and 'right' subtrees
                while (bulkPoints.length > 0) {
                    var p = bulkPoints.pop();
                    // 1.1. Categorize a point as "right" or "left" based on distance from dividing line ( >= 0 is right, < 0 is left )
                    var side = this.dividingHyperplane.getSide(p.vector);
                    // 1.2. Add points to 'leftBulk' or 'rightBulk'
                    if (side >= 0)
                        rightBulk.push(p);
                    else
                        leftBulk.push(p);
                }
                // 2. Trickle-down bulk points to left and right subtrees
                this.left.addBulk(leftBulk);
                this.right.addBulk(rightBulk);
                break;
        }
    };
    // ERROR CHECKING
    AnnoyTree.prototype.validateDataPoint = function (vd) {
        this.validatePoint(vd.vector);
    };
    AnnoyTree.prototype.validatePoint = function (p) {
        // Dimensionality has already been set
        // Confirm that the given point conforms to this dimensionality
        if (p.length !== this.dimensions)
            throw new Error("Failed to 'get()'. A vector of ".concat(p.length, " dimensionality was provided. Please provide a vector of ").concat(this.dimensions, " dimensionality"));
    };
    // STATE MANAGEMENT
    AnnoyTree.prototype.setAsLeaf = function () {
        // 1. Already set as Leaf Node, short-circuit to prevent overwriting current Leaf Node properties
        if (this.isLeaf === true)
            return;
        // 2. Init Leaf Node properties
        this.isLeaf = true;
        this.values = [];
    };
    AnnoyTree.prototype.setAsInnerNode = function (dividingHyperplane, rightTree, leftTree) {
        if (dividingHyperplane === void 0) { dividingHyperplane = this.genDividingHyperplane(); }
        if (rightTree === void 0) { rightTree = null; }
        if (leftTree === void 0) { leftTree = null; }
        // 1. Already set as Inner Node, short-circuit to prevent overwriting current Inner Node properties
        if (this.isLeaf === false)
            return;
        // 2. Init Inner Node properties
        this.isLeaf = false;
        this.dividingHyperplane = dividingHyperplane;
        this.right = rightTree !== null ? rightTree : new AnnoyTree(this.dimensions, this.maxValues);
        this.left = leftTree !== null ? leftTree : new AnnoyTree(this.dimensions, this.maxValues);
        this.values = [];
    };
    // SPLITTING UTILS
    AnnoyTree.prototype.genDividingHyperplane = function () {
        var dim = this.values[0].vector.length;
        // 1. Sum Vectorsin this.values
        var vectorCount = this.values.length;
        var vectorSum = new Array(dim).fill(0);
        for (var i = 0; i < vectorCount; i++) {
            var curPoint = this.values[i];
            vectorSum = (0, VectorUtils_1.addVectors)(vectorSum, curPoint.vector);
        }
        // 2. Divide vectorSum by vectorCount to get average vector/ centroid
        var centroid = (0, VectorUtils_1.divVectorScalar)(vectorSum, vectorCount);
        var dividingHyperplane = new Hyperplane_1.Hyperplane(centroid);
        return dividingHyperplane;
    };
    AnnoyTree.prototype.chooseSide = function (p) {
        var side = this.dividingHyperplane.getSide(p);
        return side >= 0 ? this.right : this.left;
    };
    AnnoyTree.prototype.trickleDown = function (p) {
        // Categorize a point as "right" or "left" based on distance from dividing line
        var side = this.chooseSide(p.vector);
        side.addPoint(p);
    };
    AnnoyTree.prototype.toJson = function () {
        var _a;
        var children = this.isLeaf
            ? this.values
            : (_a = {},
                _a[types_1.AnnoyInnerNodeJsonKey.HYPERPLANE] = this.dividingHyperplane.toJson(),
                _a[types_1.AnnoyInnerNodeJsonKey.LEFT] = this.left.toJson(),
                _a[types_1.AnnoyInnerNodeJsonKey.RIGHT] = this.right.toJson(),
                _a);
        return children;
    };
    AnnoyTree.prototype.fromJson = function (asJson) {
        if (Array.isArray(asJson)) {
            // 1. Set values
            this.setAsLeaf();
            this.values = asJson;
        }
        else {
            // 2.2. Set right tree
            var rightTree = new AnnoyTree(this.dimensions, this.maxValues);
            rightTree.fromJson(asJson[types_1.AnnoyInnerNodeJsonKey.RIGHT]);
            // 2.3. Set left tree
            var leftTree = new AnnoyTree(this.dimensions, this.maxValues);
            leftTree.fromJson(asJson[types_1.AnnoyInnerNodeJsonKey.LEFT]);
            // 2.1. Set hyperplane
            var dividingHyperplane = new Hyperplane_1.Hyperplane();
            dividingHyperplane.fromJson(asJson[types_1.AnnoyInnerNodeJsonKey.HYPERPLANE]);
            this.setAsInnerNode(dividingHyperplane, rightTree, leftTree);
        }
    };
    return AnnoyTree;
}());
exports.AnnoyTree = AnnoyTree;
