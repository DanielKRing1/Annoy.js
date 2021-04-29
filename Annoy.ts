const MyMatrix = require('@rayyamhk/matrix');

type Dict<T> = Record<string, T>;
type Vector = number[];

let negCount: number = 0;
let posCount: number = 0;

function dot(a: Vector, b: Vector): number {
    const dim: number = a.length;
    let sum: number = 0;

    for (let i = 0; i < dim; i++) {
        const aVal: number = a[i];
        const bVal: number = b[i];

        const product: number = aVal * bVal;

        sum += product;
    }

    return sum;
}

// // console.warn(dot([13, 8, 20, 57], [7, -1, -1, -1]));
// // console.warn(
//   dot(
//     [0.40625, 0.2500000000000001, 0.625, 1.7812500000000002],
//     [7, -1, -1, -1],
//   ),
// );

function addVectors(a: Vector, b: Vector) {
    const dim: number = a.length;
    const sum: Vector = Array(dim);

    for (let i = 0; i < dim; i++) {
        sum[i] = a[i] + b[i];
    }

    return sum;
}

function subVectors(a: Vector, b: Vector) {
    const dim: number = a.length;
    const diff: Vector = Array(dim);

    for (let i = 0; i < dim; i++) {
        diff[i] = a[i] - b[i];
    }

    return diff;
}

function multVectors(a: Vector, b: Vector) {
    const dim: number = a.length;
    const product: Vector = Array(dim);

    for (let i = 0; i < dim; i++) {
        product[i] = a[i] * b[i];
    }

    return product;
}
function multVectorScalar(a: Vector, s: number) {
    const dim: number = a.length;
    const product: Vector = Array(dim);

    for (let i = 0; i < dim; i++) {
        product[i] = a[i] * s;
    }

    return product;
}

function divVectors(a: Vector, b: Vector) {
    const dim: number = a.length;
    const quotient: Vector = Array(dim);

    for (let i = 0; i < dim; i++) {
        // TODO Prevent divide by 0
        quotient[i] = a[i] / b[i];
    }

    return quotient;
}
function divVectorScalar(a: Vector, s: number) {
    const dim: number = a.length;
    const quotient: Vector = Array(dim);

    for (let i = 0; i < dim; i++) {
        quotient[i] = a[i] / s;
    }

    return quotient;
}

function vectorDistSqr(a: Vector, b: Vector): number {
    const dim = a.length;
    let distance: number = 0;

    for (let i = 0; i < dim; i++) {
        const aVal: number = a[i];
        const bVal: number = b[i];
        const partialDistSqr: number = Math.pow(aVal - bVal, 2);

        distance += partialDistSqr;
    }

    return distance;
}

function vectorLenSqr(v: Vector): number {
    const dim = v.length;
    let length: number = 0;

    for (let i = 0; i < dim; i++) {
        const val: number = v[i];

        length += val * val;
    }

    return length;
}

function ndDistFromLine(line: Line, p: Vector): number {
    const [A, B] = line.getPoints();

    const pa: Vector = subVectors(p, A);
    const ba: Vector = subVectors(B, A);

    const t: number = dot(pa, ba) / dot(ba, ba);
    const d: number = vectorLenSqr(subVectors(pa, multVectorScalar(ba, t)));

    return d;
}

class Line {
    public start: Vector;
    public end: Vector;

    constructor(start: Vector, end: Vector) {
        this.start = start;
        this.end = end;
    }

    public getPoints(): Vector[] {
        return [this.start, this.end];
    }
}

class Hyperplane {
    private centroid: Vector = null;
    private normal: Vector = null;
    private b: number = 0;

    constructor(centroid: Vector) {
        this.centroid = centroid;

        const dim: number = this.centroid.length;
        const normal = new Array(dim).fill(0);
        const i0: number = centroid[0];
        const i1: number = -1 * centroid[1];
        normal[0] = i1;
        normal[1] = i0;

        this.normal = normal;
    }

    public getSide(p: Vector): number {
        const dim: number = this.normal.length;

        const side: number = dot(this.normal, p);

        // console.log(`normal: ${this.normal}`);
        // console.log(`p: ${p}`);
        // console.log(`dot: ${side}`);

        if (side - dim * this.b >= 0) posCount++;
        else negCount++;

        // TODO Uncomment and observe these outputs
        // // console.log('Hyperplane.getSide');
        // // console.log(`Points:`);
        // // console.log(this.points);
        // // // console.log(this.w);
        // // console.log(p);
        // // console.log(`b: ${this.b}`);
        // // console.log(side);
        // // console.log(`dot: ${side - dim * _b}`);

        // // console.log(`Positive count: ${posCount}`);
        // // console.log(`Negative count: ${negCount}`);

        return side - dim * this.b;
    }
}

// class Hyperplane {
//     private points: Vector[] = [];

//     private w: Vector = null;
//     private b: number = null;

//     constructor(points: Vector[] = []) {
//         this.points = points;
//     }

//     public addPoint(p: Vector): void {
//         this.points.push(p);
//     }

//     public printPoints() {
//         // console.log('Hyperplane Points');
//         // console.log(this.points);
//     }

//     public getSide(p: Vector): number {
//         const _w: Vector = this.getW();
//         const _b: number = this.getB();

//         const dim: number = _w.length;

//         const side: number = dot(_w, p);

//         if (side - dim * _b >= 0) posCount++;
//         else negCount++;

//         // TODO Uncomment and observe these outputs
//         // // console.log('Hyperplane.getSide');
//         // // console.log(`Points:`);
//         // // console.log(this.points);
//         // // // console.log(this.w);
//         // // console.log(p);
//         // // console.log(`b: ${this.b}`);
//         // // console.log(side);
//         // // console.log(`dot: ${side - dim * _b}`);

//         // // console.log(`Positive count: ${posCount}`);
//         // // console.log(`Negative count: ${negCount}`);

//         return side - dim * _b;
//     }

//     public getW(): Vector {
//         if (this.w === null) this.setWB();

//         return this.w;
//     }

//     public getB(): number {
//         if (this.b === null) this.setWB();

//         return this.b;
//     }

//     private setWB(): void {
//         const m: any = new MyMatrix(this.points);

//         // 1. Compute b
//         const _b: number = m.det();

//         // 2. Compute w
//         const e = new MyMatrix([...new Array(this.points.length)].map(() => [1]));
//         const solvedMyMatrix: any = MyMatrix.solve(m, e);
//         const _w: Vector = solvedMyMatrix._matrix;

//         // 2.1. Scale w by b
//         this.b = _b;
//         this.w = multVectorScalar(_w, _b);
//     }
// }

class AnnoyTree {
    public dividingHyperplane: Hyperplane;
    public right: AnnoyTree;
    public left: AnnoyTree;
    public values: Vector[];
    public maxValues: number;

    public depth: number;
    public side: string;

    public rightCount: number = 0;
    public leftCount: number = 0;

    constructor(maxValues: number, depth: number = 0, side: string = 'root') {
        this.maxValues = maxValues;

        if (depth > 20) throw new Error(`Too deep! Depth of ${depth}`);
        this.side = side;

        this.depth = depth;

        this.setAsLeaf();
    }

    public get(p: Vector): Vector[] {
        switch (this.isLeaf()) {
            case true:
                return this.values;

            case false:
                const side: AnnoyTree = this.chooseSide(p);

                return side.get(p);
        }
    }

    public addPoint(newPoint: Vector) {
        // console.warn('add point');

        switch (this.isLeaf()) {
            // IF LEAF: Pool points into Leaf Nodes
            case true:
                // console.warn('Case true');

                // 1. Add new point to pool of points
                this.values.push(newPoint);

                // 2. Split Node if it owns "too many" points
                if (this.values.length >= this.maxValues) {
                    // console.log(`${this.values.length} >= ${this.maxValues}`);
                    // console.warn('Past threshold');

                    // 3. Cache Leaf's pool of points to local variable
                    // console.warn('About to copy this.values');
                    const pool: Vector[] = this.values;

                    // 4. Reset this Node as an "Inner" Node instead of as a Leaf
                    // (Sets this.values = null)
                    // (Also sets this.dividingHyperplane with which to split the pool of points)
                    // console.warn('About to set as inner node');
                    this.setAsInnerNode();

                    // console.warn('About to enter for loop');
                    // 5. Split the pool of points into "right" and "left"
                    // console.log(`SPLIT ${this.side}-${this.depth}`);
                    this.rightCount = 0;
                    this.leftCount = 0;
                    for (let i = 0; i < pool.length; i++) {
                        // console.warn(`For loop ${i}`);
                        const point: Vector = pool[i];
                        // console.warn('About to call Trickle Down 1');
                        this.trickleDown(point);
                    }
                    // console.log(`${this.side}-${this.depth}`);
                    // console.log(`Right side count: ${this.rightCount}`);
                    // console.log(`Left side count: ${this.leftCount}`);
                    // console.log('\n\n');
                } else {
                    // console.warn('Not past threshold');
                }
                break;

            // IF INNER: Split points on this.dividingHyperplane; Trickle points down into Leaf Nodes
            case false:
                // console.warn('Case false');

                // console.warn('About to call Trickle Down 2');
                this.trickleDown(newPoint);
                break;
        }
        // if (this.values !== null) // console.log(`${this.side}-${this.depth} Total count: ${this.values.length}`);
    }

    // STATE MANAGEMENT

    private setAsLeaf(): void {
        this.dividingHyperplane = null;
        this.right = null;
        this.left = null;

        this.values = [];
    }

    private setAsInnerNode(dividingHyperplane: Hyperplane = this.genDividingHyperplane()): void {
        this.dividingHyperplane = dividingHyperplane;
        this.right = new AnnoyTree(this.maxValues, this.depth + 1, `${this.side}-right`);
        this.left = new AnnoyTree(this.maxValues, this.depth + 1, `${this.side}-left`);

        this.values = null;
    }

    private isLeaf(): boolean {
        // console.warn('is leaf');
        return this.dividingHyperplane === null && this.right === null && this.left === null && this.values !== null;
    }

    // SPLITTING UTILS

    private referencePoint: Vector;

    private genDividingHyperplane(): Hyperplane {
        const dim: number = this.values[0].length;

        // console.warn('Get dividing hyperplane');

        // // 1. Create reference point from first point
        // const referenceIndex: number = Math.floor(Math.random() * this.values.length);
        // const referencePoint: Vector = this.values[referenceIndex];
        // this.referencePoint = referencePoint;

        // // 2. Create n points from reference point
        // const dim: number = referencePoint.length;
        // const dividingHyperplane: Hyperplane = new Hyperplane();
        // dividingHyperplane.addPoint(referencePoint);
        // for (let i = 1; i < dim; i++) {
        //     const p: Vector = new Array(dim);

        //     for (let j = 0; j < dim; j++) {
        //         p[j] = Math.random() * referencePoint[i];
        //     }
        //     // p[i] = referencePoint[i];

        //     dividingHyperplane.addPoint(p);
        // }

        // 1. Get range of current points
        let _minVector: Vector = [...this.values[0]];
        let _maxVector: Vector = [...this.values[0]];
        for (let i = 1; i < this.values.length; i++) {
            const curPoint: Vector = this.values[i];

            // console.log('Current Point');
            // console.log(curPoint);

            for (let j = 0; j < curPoint.length; j++) {
                const val: number = curPoint[j];

                // 1.1. Replace current min or max
                if (val < _minVector[j]) _minVector[j] = val;
                else if (val > _maxVector[j]) _maxVector[j] = val;
            }
        }

        const minVector: Vector = _minVector.map((min: number, i: number) => min + (_maxVector[i] - min) * 0.3);
        const maxVector: Vector = _maxVector.map((max: number, i: number) => max - (max - _minVector[i]) * 0.3);

        // 2. Gen random points from range
        // const dividingHyperplane: Hyperplane = new Hyperplane();
        // for (let i = 0; i < dim; i++) {
        //     const randPoint: Vector = new Array(dim);

        //     // 2.1. Gen random value between [min[j], max[j]) for each vector index j
        //     randPoint[0] = (maxVector[0] + minVector[0]) / 2;
        //     for (let j = 1; j < dim; j++) {
        //         const min: number = minVector[j];
        //         const max: number = maxVector[j];

        //         randPoint[j] = Math.random() * (max - min) + min;

        //         // // console.log(max);
        //         // // console.log(min);
        //         // // console.log(`${Math.random()} * (${max} - ${min}) + ${min}`);
        //     }

        //     dividingHyperplane.addPoint(randPoint);
        // }

        // 1. Sum Vectorsin this.values
        const vectorCount: number = this.values.length;
        let vectorSum: Vector = new Array(dim).fill(0);
        for (let i = 0; i < vectorCount; i++) {
            const curPoint = this.values[i];
            vectorSum = addVectors(vectorSum, curPoint);

            // console.log('added');
            // console.log(vectorSum);
        }

        // Divide vectorSum by vectorCount to get average vector/ centroid
        const centroid: Vector = divVectorScalar(vectorSum, vectorCount);

        const dividingHyperplane: Hyperplane = new Hyperplane(centroid);
        // for (let i = 0; i < dim; i++) {
        //     const randScalar: number = Math.random();
        //     const randSign: number = Math.random() >= 0.5 ? 1 : -1;
        //     // console.log('rand scalar');
        //     // console.log(randScalar);
        //     // console.log('rand sign');
        //     // console.log(randSign);
        //     const randVector: Vector = [...new Array(dim)].map(() => randScalar * randSign);
        //     // console.log('values');
        //     // console.log(this.values);
        //     // console.log('vectorSum');
        //     // console.log(vectorSum);
        //     // console.log('vectorCount');
        //     // console.log(vectorCount);
        //     // console.log('centroid');
        //     // console.log(centroid);
        //     // console.log('rand vector');
        //     // console.log(randVector);
        //     const randPoint: Vector = multVectors(centroid, randVector);

        //     dividingHyperplane.addPoint(randPoint);
        // }

        // // console.log('\n\nMax/Min');
        // // console.log(_minVector);
        // // console.log(_maxVector);
        // // console.log(minVector);
        // // console.log(maxVector);
        // dividingHyperplane.printPoints();

        return dividingHyperplane;
    }

    private chooseSide(p: Vector): AnnoyTree {
        // console.warn('Choose side');

        const side: number = this.dividingHyperplane.getSide(p);
        if (side >= 0) this.rightCount++;
        else this.leftCount++;
        // console.log(`Trickle down ${this.side}-${this.depth} on side ${side >= 0 ? 'RIGHT' : 'LEFT'}`);

        return side >= 0 ? this.right : this.left;
    }

    private trickleDown(p: Vector): void {
        // console.warn(arguments.callee.caller.name);
        // console.warn('Trickle down');

        // Categorize a point as "right" or "left" based on distance from dividing line
        const side: AnnoyTree = this.chooseSide(p);

        side.addPoint(p);
    }
}

class Annoy {
    private forest: AnnoyTree[];

    constructor(forestSize: number, maxValues: number) {
        this.forest = [...new Array(forestSize)].map(() => new AnnoyTree(maxValues));
    }

    public get(p: Vector, max: number): Vector[] {
        const closestFromAllTrees: Set<Vector> = new Set();

        for (let i = 0; i < this.forest.length; i++) {
            // 1. Get tree
            const tree: AnnoyTree = this.forest[i];

            // 2. Get points that tree has partitioned as "closest" to p
            const closestInTree: Vector[] = tree.get(p);

            closestInTree.forEach((closePoint: Vector) => closestFromAllTrees.add(closePoint));
        }

        let result: Vector[];

        if (max && closestFromAllTrees.size > max) result = Array.from(closestFromAllTrees).sort((a: Vector, b: Vector) => vectorDistSqr(a, p) - vectorDistSqr(b, p));
        else result = Array.from(closestFromAllTrees);

        return result;
    }

    public add(p: Vector) {
        for (let i = 0; i < this.forest.length; i++) {
            const tree: AnnoyTree = this.forest[i];

            tree.addPoint(p);
        }
    }
}

// console.log('start');

const POINT_COUNT = 1000000;
const VECTOR_LEN = 128;
const K = 500;

const a: Annoy = new Annoy(10, 50);

console.time('Annoy setup');
// 1. Generate random points
const points: Vector[] = [];
for (let i = 0; i < POINT_COUNT; i++) {
    const p: Vector = [...new Array(VECTOR_LEN)].map(() => Math.random() * 40);

    // console.warn(i);

    // 2. Add each random point
    // console.log('\n\nADDING NEW POINT TO ANNOY');
    a.add(p);
}
console.timeEnd('Annoy setup');

// 3. Get KNN
console.time('Annoy KNN');
const knn: Vector[] = a.get(
    [...new Array(VECTOR_LEN)].map(() => Math.random() * 40),
    K
);
console.timeEnd('Annoy KNN');

console.log(knn.length);

// console.warn(knn);

const m = new MyMatrix([
    [40.99520446359626, 0],
    [0, 40.99520446359626],
]);
const e = new MyMatrix([[1], [1]]);

const _w = MyMatrix.solve(m, e);
// console.warn(_w);

// const hyperplane: Hyperplane = new Hyperplane();
// hyperplane.addPoint([1, 0, 0, 0]);
// hyperplane.addPoint([0, 2, 0, 0]);
// hyperplane.addPoint([0, 0, 3, 0]);
// hyperplane.addPoint([0, 0, 0, 4]);

// console.warn(hyperplane.getSide([1, 2, 3, 4]));
