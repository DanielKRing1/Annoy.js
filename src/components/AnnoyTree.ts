import { Hyperplane } from './Hyperplane';
import { InnerNode, Vector, AnnoyInnerNodeJsonKey, LeafNode, AnnoyTreeJson } from '../types';
import { addVectors, divVectorScalar } from '../utils/VectorUtils';

export class AnnoyTree {
    private dimensions: number;

    private dividingHyperplane!: Hyperplane;
    private right!: AnnoyTree;
    private left!: AnnoyTree;

    private maxValues: number;
    private values!: Vector[];

    private isLeaf!: boolean;

    constructor(dimensions: number, maxValues: number) {
        this.dimensions = dimensions;
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
        // Confirm that the given point conforms to this dimensionality
        if (p.length !== this.dimensions) throw new Error(`Failed to 'get()'. A vector of ${p.length} dimensionality was provided. Please provide a vector of ${this.dimensions} dimensionality`);
    }

    // STATE MANAGEMENT

    private setAsLeaf(): void {
        this.isLeaf = true;

        this.values = [];
    }

    private setAsInnerNode(dividingHyperplane: Hyperplane = this.genDividingHyperplane(), rightTree: AnnoyTree | null = null, leftTree: AnnoyTree | null = null): void {
        this.isLeaf = false;

        this.dividingHyperplane = dividingHyperplane;
        this.right = rightTree !== null ? rightTree : new AnnoyTree(this.dimensions, this.maxValues);
        this.left = leftTree !== null ? leftTree : new AnnoyTree(this.dimensions, this.maxValues);

        this.values = [];
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

    public toJson(): InnerNode | LeafNode {
        const children: InnerNode | LeafNode = this.isLeaf
            ? this.values
            : {
                  [AnnoyInnerNodeJsonKey.HYPERPLANE]: this.dividingHyperplane.toJson(),
                  [AnnoyInnerNodeJsonKey.LEFT]: this.left.toJson(),
                  [AnnoyInnerNodeJsonKey.RIGHT]: this.right.toJson(),
              };

        return children;
    }

    public fromJson(asJson: AnnoyTreeJson): void {
        if (Array.isArray(asJson)) {
            // 1. Set values
            this.setAsLeaf();
            this.values = asJson;
        } else {
            // 2.2. Set right tree
            const rightTree: AnnoyTree = new AnnoyTree(this.dimensions, this.maxValues);
            rightTree.fromJson(asJson[AnnoyInnerNodeJsonKey.RIGHT]);

            // 2.3. Set left tree
            const leftTree: AnnoyTree = new AnnoyTree(this.dimensions, this.maxValues);
            leftTree.fromJson(asJson[AnnoyInnerNodeJsonKey.LEFT]);

            // 2.1. Set hyperplane
            const dividingHyperplane: Hyperplane = new Hyperplane();
            dividingHyperplane.fromJson(asJson[AnnoyInnerNodeJsonKey.HYPERPLANE]);
            this.setAsInnerNode(dividingHyperplane, rightTree, leftTree);
        }
    }
}
