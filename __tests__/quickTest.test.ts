import Annoy from '../src';
import { Vector } from '../src/types';

describe('Annoy default export', () => {
    it('should execute successfully', () => {
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
    });
});
