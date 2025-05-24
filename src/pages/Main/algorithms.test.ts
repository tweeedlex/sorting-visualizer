import * as React from 'react';
import SortingAlgorithmFactory, { ArrayElement, SortingStats } from './algorithms';

const mockSetArray = jest.fn() as React.Dispatch<React.SetStateAction<ArrayElement[]>>;

jest.mock('./algorithms', () => {
  const originalModule = jest.requireActual('./algorithms');

  return {
    ...originalModule,
    __esModule: true,
    default: originalModule.default,
  };
});

describe('SortingAlgorithmFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.performance.now as jest.Mock).mockReturnValue(0);
  });

  const createTestArray = (values: number[]): ArrayElement[] => {
    return values.map(value => ({
      value,
      isComparing: false,
      isSwapping: false,
    }));
  };

  const algorithms = ['quick', 'heap', 'smooth', 'intro'];

  algorithms.forEach(algorithmName => {
    describe(`${algorithmName} sort`, () => {
      test('should create algorithm instance', () => {
        const testArray = createTestArray([3, 1, 4, 1, 5]);
        const algorithm = SortingAlgorithmFactory.create(
          algorithmName,
          testArray,
          mockSetArray,
          0
        );

        expect(algorithm).toBeDefined();
        expect(typeof algorithm.sort).toBe('function');
      });

      test('should sort array correctly', async () => {
        const testArray = createTestArray([3, 1, 4, 1, 5, 9, 2, 6]);
        const expectedSorted = [1, 1, 2, 3, 4, 5, 6, 9];

        let timeCounter = 0;
        (global.performance.now as jest.Mock).mockImplementation(() => {
          timeCounter += 10;
          return timeCounter;
        });

        const algorithm = SortingAlgorithmFactory.create(
          algorithmName,
          testArray,
          mockSetArray,
          0
        );

        const result = await algorithm.sort();

        expect(result.array).toBeDefined();
        expect(result.stats).toBeDefined();

        const sortedValues = result.array.map(item => item.value);
        expect(sortedValues).toEqual(expectedSorted);

        expect(result.stats.comparisons).toBeGreaterThan(0);
        expect(result.stats.duration).toBeGreaterThanOrEqual(0);

        result.array.forEach(item => {
          expect(item.isComparing).toBe(false);
          expect(item.isSwapping).toBe(false);
        });
      });

      test('should handle empty array', async () => {
        const testArray: ArrayElement[] = [];
        const algorithm = SortingAlgorithmFactory.create(
          algorithmName,
          testArray,
          mockSetArray,
          0
        );

        const result = await algorithm.sort();
        expect(result.array).toEqual([]);
        expect(result.stats.comparisons).toBe(0);
        expect(result.stats.swaps).toBe(0);
      });

      test('should handle single element array', async () => {
        const testArray = createTestArray([42]);
        const algorithm = SortingAlgorithmFactory.create(
          algorithmName,
          testArray,
          mockSetArray,
          0
        );

        const result = await algorithm.sort();
        expect(result.array).toHaveLength(1);
        expect(result.array[0].value).toBe(42);
      });

      test('should handle already sorted array', async () => {
        const testArray = createTestArray([1, 2, 3, 4, 5]);
        const algorithm = SortingAlgorithmFactory.create(
          algorithmName,
          testArray,
          mockSetArray,
          0
        );

        const result = await algorithm.sort();
        const sortedValues = result.array.map(item => item.value);
        expect(sortedValues).toEqual([1, 2, 3, 4, 5]);
      });

      test('should handle reverse sorted array', async () => {
        const testArray = createTestArray([5, 4, 3, 2, 1]);
        const algorithm = SortingAlgorithmFactory.create(
          algorithmName,
          testArray,
          mockSetArray,
          0
        );

        const result = await algorithm.sort();
        const sortedValues = result.array.map(item => item.value);
        expect(sortedValues).toEqual([1, 2, 3, 4, 5]);
      });

      test('should handle duplicate values', async () => {
        const testArray = createTestArray([3, 1, 3, 1, 3]);
        const algorithm = SortingAlgorithmFactory.create(
          algorithmName,
          testArray,
          mockSetArray,
          0
        );

        const result = await algorithm.sort();
        const sortedValues = result.array.map(item => item.value);
        expect(sortedValues).toEqual([1, 1, 3, 3, 3]);
      });

      test('should call setArray during sorting', async () => {
        const testArray = createTestArray([3, 1, 2]);
        const algorithm = SortingAlgorithmFactory.create(
          algorithmName,
          testArray,
          mockSetArray,
          0
        );

        await algorithm.sort();

        expect(mockSetArray).toHaveBeenCalled();
      });
    });
  });

  test('should throw error for unknown algorithm', () => {
    const testArray = createTestArray([1, 2, 3]);

    expect(() => {
      SortingAlgorithmFactory.create(
        'unknown',
        testArray,
        mockSetArray,
        0
      );
    }).toThrow('Unknown algorithm: unknown');
  });
});

describe('ArrayElement type', () => {
  test('should have correct structure', () => {
    const element: ArrayElement = {
      value: 42,
      isComparing: false,
      isSwapping: true,
    };

    expect(element.value).toBe(42);
    expect(element.isComparing).toBe(false);
    expect(element.isSwapping).toBe(true);
  });
});

describe('SortingStats type', () => {
  test('should have correct structure', () => {
    const stats: SortingStats = {
      comparisons: 10,
      swaps: 5,
      duration: 123.45,
    };

    expect(stats.comparisons).toBe(10);
    expect(stats.swaps).toBe(5);
    expect(stats.duration).toBe(123.45);
  });
});