import Annoy from '../src';
import { AnnoyForestJson, AnnoyJson, DataPoint, Vector } from '../src/types';

describe('Adding points and querying Annoy.js ', () => {
    it('should execute successfully', () => {
        const FOREST_SIZE: number = 10;
        const MAX_VALUES: number = 2;
        const VECTOR_LEN: number = 5;
        const K = 20;

        const a: Annoy = new Annoy(FOREST_SIZE, VECTOR_LEN, MAX_VALUES);

        // 1. Generate random points
        const POINT_COUNT = 10;
        const dataPoints: DataPoint[] = [];
        for (let i = 0; i < POINT_COUNT; i++) {
            const v: Vector = [...new Array(VECTOR_LEN)].map(() => Math.random() * 40);

            const dp: DataPoint = {
                v,
                d: i,
            };

            dataPoints.push(dp);
        }

        console.time('Annoy setup');
        for (let i = 0; i < dataPoints.length; i++) {
            const dp: DataPoint = dataPoints[i];

            // 2. Add random points
            a.add(dp);
        }
        console.timeEnd('Annoy setup');

        // 3. Get KNN
        console.time('Annoy KNN');
        const p: Vector = [...new Array(VECTOR_LEN)].map(() => Math.random() * 40);
        const knn: DataPoint[] = a.get(p, K);
        console.timeEnd('Annoy KNN');

        // console.log(knn);
        console.log(p);
        console.log(knn.length);

        // 4. Serialize to json
        const asJson: AnnoyJson = a.toJson();
        const asJsonStr: string = JSON.stringify(asJson);

        var fs = require('fs');
        fs.writeFile('test_file.json', asJsonStr, 'utf8', (err: Error) => {});

        const rebuiltTree: Annoy = new Annoy(FOREST_SIZE, VECTOR_LEN, MAX_VALUES);
        console.time('Rebuilt Annoy fromJson');
        rebuiltTree.fromJson(asJsonStr);
        console.timeEnd('Rebuilt Annoy fromJson');

        // 5. Get KNN from rebuilt Annoy
        console.time('Rebuilt Annoy KNN');
        const rebuiltKnn: DataPoint[] = a.get(p, K);
        console.timeEnd('Rebuilt Annoy KNN');

        // console.log(rebuiltKnn);
        console.log(p);
        console.log(rebuiltKnn.length);

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
