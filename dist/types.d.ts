export declare type Dict<T> = Record<string, T>;
export declare type Vector = number[];
export declare type DataPoint = {
    data: any;
    vector: Vector;
};
export declare type AnnoyJson = {
    forest: AnnoyForestJson;
    dimensions: number;
    maxValues: number;
};
export declare enum AnnoyForestJsonKey {
    FOREST = "forest",
    DIMENSIONS = "dimensions",
    MAX_VALUES = "maxValues"
}
export declare type AnnoyForestJson = AnnoyTreeJson[];
export declare type AnnoyTreeJson = InnerNode | LeafNode;
export interface InnerNode {
    [AnnoyInnerNodeJsonKey.HYPERPLANE]: HyperplaneJson;
    [AnnoyInnerNodeJsonKey.LEFT]: InnerNode | LeafNode;
    [AnnoyInnerNodeJsonKey.RIGHT]: InnerNode | LeafNode;
}
export declare type LeafNode = DataPoint[];
export declare type HyperplaneJson = {
    [HyperplaneJsonKey.w]: Vector;
    [HyperplaneJsonKey.b]: number;
};
export declare enum AnnoyInnerNodeJsonKey {
    HYPERPLANE = "h",
    LEFT = "l",
    RIGHT = "r"
}
export declare enum HyperplaneJsonKey {
    w = "w",
    b = "b"
}
