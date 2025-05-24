import React from "react";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type ArrayElement = { value: number; isComparing: boolean; isSwapping: boolean };
export type SortingStats = { comparisons: number; swaps: number; duration: number };

abstract class SortingAlgorithm {
  protected array: ArrayElement[];
  protected stats: SortingStats;
  protected setArray: React.Dispatch<React.SetStateAction<ArrayElement[]>>;
  protected speed: number;

  constructor(
    array: ArrayElement[],
    setArray: React.Dispatch<React.SetStateAction<ArrayElement[]>>,
    speed: number
  ) {
    this.array = [...array];
    this.setArray = setArray;
    this.speed = speed;
    this.stats = { comparisons: 0, swaps: 0, duration: 0 };
  }

  protected async compare(i: number, j: number): Promise<boolean> {
    this.stats.comparisons++;
    this.array[i].isComparing = true;
    this.array[j].isComparing = true;
    this.setArray([...this.array]);
    await sleep(this.speed);

    const result = this.array[i].value < this.array[j].value;

    this.array[i].isComparing = false;
    this.array[j].isComparing = false;
    return result;
  }

  protected async swap(i: number, j: number): Promise<void> {
    this.stats.swaps++;
    this.array[i].isSwapping = true;
    this.array[j].isSwapping = true;
    this.setArray([...this.array]);
    await sleep(this.speed);

    [this.array[i], this.array[j]] = [this.array[j], this.array[i]];

    this.setArray([...this.array]);
    await sleep(this.speed);

    this.array[i].isSwapping = false;
    this.array[j].isSwapping = false;
  }

  public async sort(): Promise<{ array: ArrayElement[]; stats: SortingStats }> {
    const startTime = performance.now();
    await this.performSort();
    this.stats.duration = performance.now() - startTime;

    const finalArray = this.array.map(item => ({
      ...item,
      isComparing: false,
      isSwapping: false,
    }));

    return { array: finalArray, stats: this.stats };
  }

  protected abstract performSort(): Promise<void>;
}

class QuickSort extends SortingAlgorithm {
  protected async performSort(): Promise<void> {
    await this.quickSortHelper(0, this.array.length - 1);
  }

  private async quickSortHelper(low: number, high: number): Promise<void> {
    if (low < high) {
      const pivotIndex = await this.partition(low, high);
      await this.quickSortHelper(low, pivotIndex - 1);
      await this.quickSortHelper(pivotIndex + 1, high);
    }
  }

  private async partition(low: number, high: number): Promise<number> {
    const pivot = this.array[high].value;
    let i = low - 1;

    for (let j = low; j < high; j++) {
      this.stats.comparisons++;
      this.array[j].isComparing = true;
      this.array[high].isComparing = true;
      this.setArray([...this.array]);
      await sleep(this.speed);

      if (this.array[j].value < pivot) {
        i++;
        await this.swap(i, j);
      }

      this.array[j].isComparing = false;
      this.array[high].isComparing = false;
    }

    i++;
    await this.swap(i, high);
    return i;
  }
}

class HeapSort extends SortingAlgorithm {
  protected async performSort(): Promise<void> {
    for (let i = Math.floor(this.array.length / 2) - 1; i >= 0; i--) {
      await this.heapify(this.array.length, i);
    }

    for (let i = this.array.length - 1; i > 0; i--) {
      await this.swap(0, i);
      await this.heapify(i, 0);
    }
  }

  private async heapify(n: number, i: number): Promise<void> {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && await this.compare(largest, left)) {
      largest = left;
    }

    if (right < n && await this.compare(largest, right)) {
      largest = right;
    }

    if (largest !== i) {
      await this.swap(i, largest);
      await this.heapify(n, largest);
    }
  }
}

class SmoothSort extends SortingAlgorithm {
  private readonly LP = [1, 1];

  constructor(array: ArrayElement[], setArray: React.Dispatch<React.SetStateAction<ArrayElement[]>>, speed: number) {
    super(array, setArray, speed);
    for (let i = 2; i < 45; i++) {
      this.LP[i] = this.LP[i - 1] + this.LP[i - 2] + 1;
    }
  }

  protected async performSort(): Promise<void> {
    let p = 1;
    let pshift = 1;

    for (let i = 1; i < this.array.length; i++) {
      if ((p & 0x7) === 3) {
        await this.sift(pshift, i - 1);
        p >>>= 2;
        pshift += 2;
      } else if ((p & 0x3) === 1) {
        if (i + 1 < this.array.length) {
          await this.sift(pshift, i - 1);
        } else {
          await this.trinkle(p, pshift, i - 1, false);
        }
        p = (p >>> 1) | 0x1;
        pshift--;
      } else {
        p <<= 1;
        pshift--;
      }
    }

    for (let i = this.array.length - 1; i > 0; i--) {
      if (p === 1) {
        await this.trinkle(p, pshift, i, false);
      } else {
        await this.trinkle(p, pshift, i, true);
        const trail = this.trailingZeros(p & -p);
        p >>>= trail;
        pshift = trail;
      }
    }
  }

  private trailingZeros(n: number): number {
    if (n === 0) return 0;
    let count = 0;
    while ((n & 1) === 0) {
      n >>>= 1;
      count++;
    }
    return count;
  }

  private async sift(pshift: number, head: number): Promise<void> {
    const val = { ...this.array[head] };

    while (pshift > 1) {
      const rt = head - 1;
      const lf = head - 1 - this.LP[pshift - 2];

      await this.compare(head, lf);

      if (val.value >= this.array[lf].value) {
        await this.compare(head, rt);
        if (val.value >= this.array[rt].value) {
          break;
        }
        this.array[head] = { ...this.array[rt] };
        head = rt;
        pshift -= 1;
      } else {
        this.array[head] = { ...this.array[lf] };
        head = lf;
        pshift -= 2;
      }
      this.stats.swaps++;
      this.setArray([...this.array]);
      await sleep(this.speed);
    }

    this.array[head] = val;
    this.setArray([...this.array]);
  }

  private async trinkle(p: number, pshift: number, head: number, isTrusty: boolean): Promise<void> {
    const val = { ...this.array[head] };

    while (p !== 1) {
      let stepson = head - this.LP[pshift];

      await this.compare(stepson, head);

      if (this.array[stepson].value <= val.value) {
        break;
      }

      if (!isTrusty && pshift > 1) {
        const rt = head - 1;
        const lf = head - 1 - this.LP[pshift - 2];

        if (await this.compare(stepson, rt)) {
          stepson = rt;
        }
        if (await this.compare(stepson, lf)) {
          stepson = lf;
        }
      }

      this.array[head] = { ...this.array[stepson] };
      head = stepson;
      this.stats.swaps++;
      this.setArray([...this.array]);
      await sleep(this.speed);

      const trail = this.trailingZeros(p & -p);
      p >>>= trail;
      pshift = trail;
      isTrusty = false;
    }

    if (!isTrusty) {
      this.array[head] = val;
      this.setArray([...this.array]);
    }
  }
}

class IntroSort extends SortingAlgorithm {
  protected async performSort(): Promise<void> {
    const depthLimit = 2 * Math.floor(Math.log(this.array.length) / Math.log(2));
    await this.introSortHelper(0, this.array.length - 1, depthLimit);
  }

  private async introSortHelper(start: number, end: number, depthLimit: number): Promise<void> {
    if (start < end) {
      if (end - start < 16) {
        await this.insertionSort(start, end);
        return;
      }

      if (depthLimit === 0) {
        await this.heapSortHelper(start, end);
        return;
      }

      const pivot = await this.partition(start, end);
      await this.introSortHelper(start, pivot - 1, depthLimit - 1);
      await this.introSortHelper(pivot + 1, end, depthLimit - 1);
    }
  }

  private async insertionSort(left: number, right: number): Promise<void> {
    for (let i = left + 1; i <= right; i++) {
      let j = i;
      while (j > left && await this.compare(j, j - 1)) {
        await this.swap(j, j - 1);
        j--;
      }
    }
  }

  private async heapSortHelper(start: number, end: number): Promise<void> {
    for (let i = Math.floor((end - start + 1) / 2) - 1 + start; i >= start; i--) {
      await this.heapify(end + 1, i);
    }

    for (let i = end; i > start; i--) {
      await this.swap(start, i);
      await this.heapify(i, start);
    }
  }

  private async heapify(n: number, i: number): Promise<void> {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && await this.compare(largest, left)) {
      largest = left;
    }

    if (right < n && await this.compare(largest, right)) {
      largest = right;
    }

    if (largest !== i) {
      await this.swap(i, largest);
      await this.heapify(n, largest);
    }
  }

  private async partition(low: number, high: number): Promise<number> {
    const pivot = this.array[high].value;
    let i = low - 1;

    for (let j = low; j < high; j++) {
      this.stats.comparisons++;
      this.array[j].isComparing = true;
      this.array[high].isComparing = true;
      this.setArray([...this.array]);
      await sleep(this.speed);

      if (this.array[j].value <= pivot) {
        i++;
        await this.swap(i, j);
      }

      this.array[j].isComparing = false;
      this.array[high].isComparing = false;
    }

    i++;
    await this.swap(i, high);
    return i;
  }
}

export default class SortingAlgorithmFactory {
  static create(
    algorithm: string,
    array: ArrayElement[],
    setArray: React.Dispatch<React.SetStateAction<ArrayElement[]>>,
    speed: number
  ): SortingAlgorithm {
    switch (algorithm) {
      case "quick":
        return new QuickSort(array, setArray, speed);
      case "heap":
        return new HeapSort(array, setArray, speed);
      case "smooth":
        return new SmoothSort(array, setArray, speed);
      case "intro":
        return new IntroSort(array, setArray, speed);
      default:
        throw new Error(`Unknown algorithm: ${algorithm}`);
    }
  }
}