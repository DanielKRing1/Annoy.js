import Annoy from '../src';
import { Vector } from '../src/types';

describe('Adding points and querying Annoy.js ', () => {
    it('should execute successfully', () => {
        const POINT_COUNT = 1000;
        const VECTOR_LEN = 2;
        const K = 20;

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
        const p: Vector = [...new Array(VECTOR_LEN)].map(() => Math.random() * 40);
        const knn: Vector[] = a.get(p, K);
        console.timeEnd('Annoy KNN');

        console.log(knn);
        console.log(p);
        console.log(knn.length);

        // const BASE_VECTOR = [1, 2, 3];
        // const p3 = [1, 1, 1];

        // for (let i = 0; i < 10; i++) {
        //     const rand: number = Math.random();

        //     const scaledVector = BASE_VECTOR.map((val) => rand * val);

        //     console.log(BASE_VECTOR);
        //     console.log(p3);

        //     const side: number = dot(BASE_VECTOR, p3);

        //     console.log(side);
        // }
    });
});
