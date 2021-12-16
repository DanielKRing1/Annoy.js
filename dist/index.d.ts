import * as Types from './types';
export { Types };
export default class Annoy {
    private forest;
    private dimensions;
    private maxValues;
    constructor(forestSize: number, dimensions: number, maxValues: number);
    get(inputVector: Types.Vector, max: number): Types.DataPoint[];
    add(p: Types.DataPoint): void;
    addBulk(bulkPoints: Types.DataPoint[]): void;
    toJson(): Types.AnnoyJson;
    fromJson(asJson: string): void;
}
