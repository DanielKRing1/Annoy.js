import { Vector } from '../types';
import { dot } from '../utils/VectorUtils';

export class Hyperplane {
    private centroid: Vector;
    private w: Vector;
    private b: number = 0;

    constructor(centroid: Vector) {
        this.centroid = centroid;
        const i0: number = centroid[0];
        const i1: number = -1 * centroid[1];

        const dim: number = this.centroid.length;
        const normal = new Array(dim).fill(0);
        normal[0] = i1;
        normal[1] = i0;

        this.w = normal;
    }

    public getSide(p: Vector): number {
        const dim: number = this.w.length;
        const side: number = dot(this.w, p);

        return side - dim * this.b;
    }
}
