import { AnnoyTree } from './components/AnnoyTree';
import { vectorDistSqr } from './utils/VectorUtils';
import * as Types from './types';

export { Types };

export default class Annoy {
    private forest: AnnoyTree[];
    private dimensions: number;
    private maxValues: number;

    constructor(forestSize: number, dimensions: number, maxValues: number) {
        this.forest = [...new Array(forestSize)].map(() => new AnnoyTree(dimensions, maxValues));

        this.dimensions = dimensions;
        this.maxValues = maxValues;
    }

    public get(inputVector: Types.Vector, max: number): Types.DataPoint[] {
        const closestFromAllTrees: Set<Types.DataPoint> = new Set();

        for (let i = 0; i < this.forest.length; i++) {
            // 1. Get tree
            const tree: AnnoyTree = this.forest[i];

            // 2. Get points that tree has partitioned as "closest" to p
            const closestInTree: Types.DataPoint[] = tree.get(inputVector);

            closestInTree.forEach((closePoint: Types.DataPoint) => closestFromAllTrees.add(closePoint));
        }

        let result: Types.DataPoint[];

        if (max && closestFromAllTrees.size > max)
            result = Array.from(closestFromAllTrees)
                .sort((a: Types.DataPoint, b: Types.DataPoint) => vectorDistSqr(a.v, inputVector) - vectorDistSqr(b.v, inputVector))
                .slice(0, max);
        else result = Array.from(closestFromAllTrees);

        return result;
    }

    public add(p: Types.DataPoint) {
        for (let i = 0; i < this.forest.length; i++) {
            const tree: AnnoyTree = this.forest[i];

            tree.addPoint(p);
        }
    }

    public addBulk(bulkPoints: Types.DataPoint[]) {
        for (let i = 0; i < this.forest.length; i++) {
            const tree: AnnoyTree = this.forest[i];

            tree.addBulk(bulkPoints);
        }
    }

    // DE/SERIALIZATION UTILS

    public toJson(): Types.AnnoyJson {
        return {
            [Types.AnnoyForestJsonKey.FOREST]: this.forest.map((tree: AnnoyTree) => tree.toJson()),
            [Types.AnnoyForestJsonKey.DIMENSIONS]: this.dimensions,
            [Types.AnnoyForestJsonKey.MAX_VALUES]: this.maxValues,
        };
    }

    public fromJson(asJson: string): void {
        // 1. Get json string as Json Object
        const asAnnoyJson: Types.AnnoyJson = JSON.parse(asJson);

        const asAnnoyForestJson: Types.AnnoyForestJson = asAnnoyJson[Types.AnnoyForestJsonKey.FOREST];
        const dimensions: number = asAnnoyJson[Types.AnnoyForestJsonKey.DIMENSIONS];
        const maxValues: number = asAnnoyJson[Types.AnnoyForestJsonKey.MAX_VALUES];
        // 2. Override this.dimensions and this.maxValues with the amount serialized in input json
        this.dimensions = dimensions;
        this.maxValues = maxValues;

        // 3. Build forest of trees
        for (let i = 0; i < asAnnoyForestJson.length; i++) {
            // 3.1. Get tree json
            const asAnnoyTreeJson: Types.AnnoyTreeJson = asAnnoyForestJson[i];

            // 3.2. Load tree from Json Object
            const tree: AnnoyTree = new AnnoyTree(this.dimensions, this.maxValues);
            tree.fromJson(asAnnoyTreeJson);

            // 3.3. Add loaded tree to this.forest
            this.forest.push(tree);
        }
    }
}
