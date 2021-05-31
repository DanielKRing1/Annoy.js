import Annoy from '../src';
import { AnnoyForestJson, AnnoyJson, DataPoint, Vector } from '../src/types';

// describe('Adding individual points and bulk-adding points to Annoy.js ', () => {
//     it('should have different performance', () => {
const FOREST_SIZE: number = 10;
const MAX_VALUES: number = 50;
const VECTOR_LEN: number = 10;
const K = 20;

const a1: Annoy = new Annoy(FOREST_SIZE, VECTOR_LEN, MAX_VALUES);
const a2: Annoy = new Annoy(FOREST_SIZE, VECTOR_LEN, MAX_VALUES);

// 1. Generate random points
const POINT_COUNT = 100000;
const dataPoints: DataPoint[] = [];
for (let i = 0; i < POINT_COUNT; i++) {
    const vector: Vector = [...new Array(VECTOR_LEN)].map(() => Math.random() * 40);

    const dp: DataPoint = {
        vector,
        data: i,
    };

    dataPoints.push(dp);
}

console.time('Add points individually');
for (let i = 0; i < dataPoints.length; i++) {
    const dp: DataPoint = dataPoints[i];

    // 2. Add random points
    a1.add(dp);
}
console.timeEnd('Add points individually');

console.time('Add points in bulk');
a2.addBulk(dataPoints);
console.timeEnd('Add points in bulk');

// const randVector: Vector = [...new Array(VECTOR_LEN)].map(() => Math.random() * 40);
// const knn1: DataPoint[] = a1.get(randVector, K);

// const knn2: DataPoint[] = a2.get(randVector, K);

// console.log(knn1[0]);
// console.log(knn1.length);

// console.log(knn2[0]);
// console.log(knn2.length);

//     });
// });
