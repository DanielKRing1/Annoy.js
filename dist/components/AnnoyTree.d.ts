import { InnerNode, Vector, DataPoint, LeafNode, AnnoyTreeJson } from '../types';
export declare class AnnoyTree {
    private dimensions;
    private dividingHyperplane;
    private right;
    private left;
    private maxValues;
    private values;
    private isLeaf;
    constructor(dimensions: number, maxValues: number);
    get(p: Vector): DataPoint[];
    addPoint(newPoint: DataPoint): void;
    addBulkInefficient(bulkPoints: DataPoint[]): void;
    addBulk(bulkPoints: DataPoint[]): void;
    private validateDataPoint;
    private validatePoint;
    private setAsLeaf;
    private setAsInnerNode;
    private genDividingHyperplane;
    private chooseSide;
    private trickleDown;
    toJson(): InnerNode | LeafNode;
    fromJson(asJson: AnnoyTreeJson): void;
}
