import { Vector } from '../types';

export function dot(a: Vector, b: Vector): number {
    const dim: number = a.length;
    let sum: number = 0;

    for (let i = 0; i < dim; i++) {
        const aVal: number = a[i];
        const bVal: number = b[i];

        const product: number = aVal * bVal;

        sum += product;
    }

    return sum;
}

export function addVectors(a: Vector, b: Vector) {
    const dim: number = a.length;
    const sum: Vector = Array(dim);

    for (let i = 0; i < dim; i++) {
        sum[i] = a[i] + b[i];
    }

    return sum;
}

export function subVectors(a: Vector, b: Vector) {
    const dim: number = a.length;
    const diff: Vector = Array(dim);

    for (let i = 0; i < dim; i++) {
        diff[i] = a[i] - b[i];
    }

    return diff;
}

export function multVectors(a: Vector, b: Vector) {
    const dim: number = a.length;
    const product: Vector = Array(dim);

    for (let i = 0; i < dim; i++) {
        product[i] = a[i] * b[i];
    }

    return product;
}
export function multVectorScalar(a: Vector, s: number) {
    const dim: number = a.length;
    const product: Vector = Array(dim);

    for (let i = 0; i < dim; i++) {
        product[i] = a[i] * s;
    }

    return product;
}

export function divVectors(a: Vector, b: Vector) {
    const dim: number = a.length;
    const quotient: Vector = Array(dim);

    for (let i = 0; i < dim; i++) {
        // TODO Prevent divide by 0
        quotient[i] = a[i] / b[i];
    }

    return quotient;
}
export function divVectorScalar(a: Vector, s: number) {
    const dim: number = a.length;
    const quotient: Vector = Array(dim);

    for (let i = 0; i < dim; i++) {
        quotient[i] = a[i] / s;
    }

    return quotient;
}

export function vectorDistSqr(a: Vector, b: Vector): number {
    const dim = a.length;
    let distance: number = 0;

    for (let i = 0; i < dim; i++) {
        const aVal: number = a[i];
        const bVal: number = b[i];
        const partialDistSqr: number = Math.pow(aVal - bVal, 2);

        distance += partialDistSqr;
    }

    return distance;
}

export function vectorLenSqr(v: Vector): number {
    const dim = v.length;
    let length: number = 0;

    for (let i = 0; i < dim; i++) {
        const val: number = v[i];

        length += val * val;
    }

    return length;
}
