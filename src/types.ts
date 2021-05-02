export type Dict<T> = Record<string, T>;
export type Vector = number[];

export type AnnoyJson = {
    forest: AnnoyForestJson;
    dimensions: number;
    maxValues: number;
};
export enum AnnoyForestJsonKey {
    FOREST = 'forest',
    DIMENSIONS = 'dimensions',
    MAX_VALUES = 'maxValues',
}

export type AnnoyForestJson = AnnoyTreeJson[];

export type AnnoyTreeJson = InnerNode | LeafNode;
export interface InnerNode {
    [AnnoyInnerNodeJsonKey.HYPERPLANE]: HyperplaneJson;
    [AnnoyInnerNodeJsonKey.LEFT]: InnerNode | LeafNode;
    [AnnoyInnerNodeJsonKey.RIGHT]: InnerNode | LeafNode;
}
export type LeafNode = Vector[];

export type HyperplaneJson = {
    [HyperplaneJsonKey.w]: Vector;
    [HyperplaneJsonKey.b]: number;
};

export enum AnnoyInnerNodeJsonKey {
    HYPERPLANE = 'h',
    LEFT = 'l',
    RIGHT = 'r',
}

export enum HyperplaneJsonKey {
    w = 'w',
    b = 'b',
}
