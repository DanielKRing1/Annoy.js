import { AnnoyTree } from './components/AnnoyTrre';
import { vectorDistSqr } from './utils/VectorUtils';
import { Vector } from './types';

export default class Annoy {
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

// TEST

const POINT_COUNT = 10000;
const VECTOR_LEN = 128;
const K = 500;

const a: Annoy = new Annoy(10, 50);

console.time('Annoy setup');
// 1. Generate random points
const points: Vector[] = [];
for (let i = 0; i < POINT_COUNT; i++) {
    const p: Vector = [...new Array(VECTOR_LEN)].map(() => Math.random() * 40);
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
