import { Hyperplane } from './Hyperplane';
import { Vector } from '../types';
import { addVectors, divVectorScalar } from '../utils/VectorUtils';

export class AnnoyTree {
    private dimensions: number = -1;

    private dividingHyperplane!: Hyperplane;
    private right!: AnnoyTree;
    private left!: AnnoyTree;

    private maxValues: number;
    private values!: Vector[];

    private isLeaf!: boolean;

    constructor(maxValues: number) {
        this.maxValues = maxValues;

        this.setAsLeaf();
    }

    // PUBLIC API

    public get(p: Vector): Vector[] {
        this.validatePoint(p);

        switch (this.isLeaf) {
            case true:
                return this.values;

            case false:
                const side: AnnoyTree = this.chooseSide(p);

                return side.get(p);
        }
    }

    public addPoint(newPoint: Vector) {
        this.validatePoint(newPoint);

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

    // ERROR CHECKING

    private validatePoint(p: Vector): void {
        // Dimensionality has already been set
        if (this.dimensions !== -1) {
            // Confirm that the given point conforms to this dimensionality
            if (p.length !== this.dimensions) throw new Error(`Failed to 'get()'. Please provide a vector of ${this.dimensions} dimensionality`);
        } else {
            // Set dimensionality based on the first point provided
            this.dimensions = p.length;
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
        this.right = new AnnoyTree(this.maxValues);
        this.left = new AnnoyTree(this.maxValues);
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
