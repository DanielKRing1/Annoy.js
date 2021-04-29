import { AnnoyTree } from './components/AnnoyTrre';
import { vectorDistSqr } from './utils/VectorUtils';
import * as Types from './types';

export { Types };

export default class Annoy {
    private forest: AnnoyTree[];

    constructor(forestSize: number, maxValues: number) {
        this.forest = [...new Array(forestSize)].map(() => new AnnoyTree(maxValues));
    }

    public get(p: Types.Vector, max: number): Types.Vector[] {
        const closestFromAllTrees: Set<Types.Vector> = new Set();

        for (let i = 0; i < this.forest.length; i++) {
            // 1. Get tree
            const tree: AnnoyTree = this.forest[i];

            // 2. Get points that tree has partitioned as "closest" to p
            const closestInTree: Types.Vector[] = tree.get(p);

            closestInTree.forEach((closePoint: Types.Vector) => closestFromAllTrees.add(closePoint));
        }

        let result: Types.Vector[];

        if (max && closestFromAllTrees.size > max)
            result = Array.from(closestFromAllTrees)
                .sort((a: Types.Vector, b: Types.Vector) => vectorDistSqr(a, p) - vectorDistSqr(b, p))
                .slice(0, max);
        else result = Array.from(closestFromAllTrees);

        return result;
    }

    public add(p: Types.Vector) {
        for (let i = 0; i < this.forest.length; i++) {
            const tree: AnnoyTree = this.forest[i];

            tree.addPoint(p);
        }
    }
}
