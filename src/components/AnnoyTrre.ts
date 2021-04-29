import { Hyperplane } from './Hyperplane';
import { Vector } from '../types';
import { addVectors, divVectorScalar } from '../utils/VectorUtils';

export class AnnoyTree {
    public dividingHyperplane!: Hyperplane;
    public right!: AnnoyTree;
    public left!: AnnoyTree;
    public values!: Vector[];
    public maxValues: number;

    private isLeaf!: boolean;

    public depth: number;
    public side: string;

    constructor(maxValues: number, depth: number = 0, side: string = 'root') {
        this.maxValues = maxValues;

        if (depth > 20) throw new Error(`Too deep! Depth of ${depth}`);
        this.side = side;

        this.depth = depth;

        this.setAsLeaf();
    }

    public get(p: Vector): Vector[] {
        switch (this.isLeaf) {
            case true:
                return this.values;

            case false:
                const side: AnnoyTree = this.chooseSide(p);

                return side.get(p);
        }
    }

    public addPoint(newPoint: Vector) {
        switch (this.isLeaf) {
            // IF LEAF: Pool points into Leaf Nodes
            case true:
                // 1. Add new point to pool of points
                this.values.push(newPoint);

                // 2. Split Node if it owns "too many" points
                if (this.values.length >= this.maxValues) {
                    // 3. Cache Leaf's pool of points to local variable
                    const pool: Vector[] = this.values;

                    // 4. Reset this Node as an "Inner" Node instead of as a Leaf
                    // (Sets this.values = null)
                    // (Also sets this.dividingHyperplane with which to split the pool of points)
                    this.setAsInnerNode();

                    // 5. Split the pool of points into "right" and "left"
                    for (let i = 0; i < pool.length; i++) {
                        const point: Vector = pool[i];
                        this.trickleDown(point);
                    }
                }
                break;

            // IF INNER: Split points on this.dividingHyperplane; Trickle points down into Leaf Nodes
            case false:
                this.trickleDown(newPoint);
                break;
        }
    }

    // STATE MANAGEMENT

    private setAsLeaf(): void {
        this.isLeaf = true;

        this.values = [];
    }

    private setAsInnerNode(dividingHyperplane: Hyperplane = this.genDividingHyperplane()): void {
        this.isLeaf = false;

        this.dividingHyperplane = dividingHyperplane;
        this.right = new AnnoyTree(this.maxValues, this.depth + 1, `${this.side}-right`);
        this.left = new AnnoyTree(this.maxValues, this.depth + 1, `${this.side}-left`);
    }

    // SPLITTING UTILS

    private genDividingHyperplane(): Hyperplane {
        const dim: number = this.values[0].length;

        // 1. Sum Vectorsin this.values
        const vectorCount: number = this.values.length;
        let vectorSum: Vector = new Array(dim).fill(0);
        for (let i = 0; i < vectorCount; i++) {
            const curPoint = this.values[i];
            vectorSum = addVectors(vectorSum, curPoint);
        }

        // 2. Divide vectorSum by vectorCount to get average vector/ centroid
        const centroid: Vector = divVectorScalar(vectorSum, vectorCount);

        const dividingHyperplane: Hyperplane = new Hyperplane(centroid);
        return dividingHyperplane;
    }

    private chooseSide(p: Vector): AnnoyTree {
        const side: number = this.dividingHyperplane.getSide(p);

        return side >= 0 ? this.right : this.left;
    }

    private trickleDown(p: Vector): void {
        // Categorize a point as "right" or "left" based on distance from dividing line
        const side: AnnoyTree = this.chooseSide(p);

        side.addPoint(p);
    }
}
