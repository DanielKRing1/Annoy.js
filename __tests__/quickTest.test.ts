import Annoy from '../src';
import { Vector } from '../src/types';

const POINT_COUNT = 100000;
const VECTOR_LEN = 10;
const K = 2;

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
