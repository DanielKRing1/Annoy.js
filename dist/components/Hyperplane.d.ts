import { Vector, HyperplaneJson } from '../types';
export declare class Hyperplane {
    private w;
    private b;
    constructor(centroid?: Vector | null);
    getSide(p: Vector): number;
    toJson(): HyperplaneJson;
    fromJson(asJson: HyperplaneJson): void;
}
