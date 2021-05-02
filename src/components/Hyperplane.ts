import { Vector, HyperplaneJson, HyperplaneJsonKey } from '../types';
import { dot } from '../utils/VectorUtils';

import { getRand } from '../utils/Random';

export class Hyperplane {
    private w: Vector = [];
    private b: number = 0;

    constructor(centroid: Vector | null = null) {
        if (centroid !== null) {
            const dim: number = centroid.length;

            // 1. Get random number between 0 and 1
            const rand: number = Math.random();

            // 2. Get min and max bounds for a random point
            const minVector: Vector = centroid.map((val: number) => -5 * Math.abs(val));
            const maxVector: Vector = centroid.map((val: number) => 5 * Math.abs(val));

            // 3. Get random point
            const randPoint: Vector = [...new Array(dim)].map((empty, i) => getRand(minVector[i], maxVector[i]));

            // 4. Set random point as 'w'
            this.w = randPoint;

            // 5. Get determinant of centroid and random point, set as 'b'
            this.b = dot(centroid, randPoint);
        }
    }

    public getSide(p: Vector): number {
        const side: number = dot(this.w, p);

        return side - this.b;
    }

    public toJson(): HyperplaneJson {
        return {
            [HyperplaneJsonKey.w]: this.w,
            [HyperplaneJsonKey.b]: this.b,
        };
    }

    public fromJson(asJson: HyperplaneJson) {
        this.w = asJson[HyperplaneJsonKey.w];
        this.b = asJson[HyperplaneJsonKey.b];
    }
}
