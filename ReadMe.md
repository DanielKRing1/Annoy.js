# Annoy.js

Annoy.js is a 0-dependency Hyperplane (Binary) Search Tree, inspired by Spotify Annoy as described by <a href="https://erikbern.com/2015/10/01/nearest-neighbors-and-vector-models-part-2-how-to-search-in-high-dimensional-spaces.html" target="_blank">This Blog Post</a>

Use this package to query for K Approximate Nearest Neighbors from a tree of n-dimensional vectors in O(logn) time.

\*Annoy.js is inspired by but not affiliated with Spotify Annoy.

## Installation

Install via NPM:

```bash
npm install annoy.js
```

## Example

```javascript
import Annoy from 'annoy.js';

// USING ANNOY TO QUERY K APPROXIMATE NEAREST NEIGHBORS

// 0. Define Annoy constants
const FOREST_SIZE: number = 10;
const MAX_LEAF_SIZE: number = 50;
const VECTOR_LEN: number = 10;

// 1. Init Annoy with constants
const a: Annoy = new Annoy(FOREST_SIZE, VECTOR_LEN, MAX_LEAF_SIZE);

// 2. Generate random data points to add to the Annoy forest
const POINT_COUNT = 100000;
const dataPoints: DataPoint[] = [];
for (let i = 0; i < POINT_COUNT; i++) {
    const vector: Vector = [...new Array(VECTOR_LEN)].map(() => Math.random() * 40);

    const dp: DataPoint = {
        // Include a 'vector' property
        vector,
        // Add random data to the 'data' property
        data: i,
    };

    dataPoints.push(dp);
}

// 3. Fill Annoy forest with our data points
for (let i = 0; i < dataPoints.length; i++) {
    const dp: DataPoint = dataPoints[i];

    a.add(dp);
}

// 4. Query K Approximate Nearest Neighbors to a random point
const K = 20;
const p: Vector = [...new Array(VECTOR_LEN)].map(() => Math.random() * 40);
const knn: DataPoint[] = a.get(p, K);

// 5. Log our random query point and its K approximate nearest neighbors
console.log(p);
console.log(knn.length);

// ----

// SAVING/LOADING ANNOY TO/FROM A JSON OBJECT

// 1. Serialize to json
const asJson: AnnoyJson = a.toJson();
const asJsonStr: string = JSON.stringify(asJson);

// 2. Deserialize back to an Annoy instance
const rebuiltTree: Annoy = new Annoy(FOREST_SIZE, VECTOR_LEN, MAX_LEAF_SIZE);
console.time('Rebuilt Annoy fromJson');
rebuiltTree.fromJson(asJsonStr);
console.timeEnd('Rebuilt Annoy fromJson');

// 3. Get KNN from rebuilt Annoy
console.time('Rebuilt Annoy KNN');
const rebuiltKnn: DataPoint[] = a.get(p, K);
console.timeEnd('Rebuilt Annoy KNN');

```

## Public Api

#### Constructor

Annoy(forestSize: number, maxLeafSize: number)

#### add(point: { vector: number[], data: any }): void

Add a single point to the Annoy forest

#### get(vector: number[], k: number): { vector: number[], data: any }[]

Get the 'k' approximate nearest neighbors to a given 'point'

## How it works

1. A user initializes Annoy.js with a 'forestSize' and a 'maxLeafSize';

2. As the user adds points, Annoy.js pools "nearby" points into the leaves of its trees.

3. Once a leaf (L) has pooled more points than some threshold value (maxLeafSize), L splits into a 'right' leaf (LR) and a 'left' leaf (LL), and the points in L trickle down into LR or LL.

3.1. Prior to splitting, L finds the centroid of its pooled points (C)<sup>1</sup> and defines an arbitrary hyperplane (H) that passes through C.

3.2. If a point (P) is on the "left" of the hyperplane, it trickles down to LL. If it is on the right, it trickles down to LR<sup>2</sup>.

4. Annoy.js builds 'forestSize' number of trees, where each tree splits its points on a distinct hyperplane, separating each set of points into a slightly different tree structure.

5. When a user queries Annoy for the "K" nearest neighbors to a point (Q), it traverses each tree in the forest for its pool of nearest neighbors and collects each pool into a set of points (S). If S contains more than K points, Annoy returns the K closest points to Q from S, else Annoy simply returns S.

<hr/>

NOTES:

1. The centroid of a set of pooled points is the sum of all points divided by the total number of points: (sum of points) / (total # points)

2. H is defined by 2 components: A vector 'w' that defines the normal to H and a scalar 'b' that defines some offset bias from the origin. A point (p) is on the "left" of H if w ⋅ p < 0. If w ⋅ p >= 0, then it is on the "right" of H.

## Benchmarks

My machine was able to index 1,000,000 128-point vectors into Annoy in 3 min 55 sec, while a KNN query of the points took a measly 0.365 ms.

## Improvements

## License

ISC
