# Sorting Algorithms Visualizer

An interactive sorting algorithms visualizer built with React and TypeScript. This project demonstrates the working of various sorting algorithms with step-by-step animations and performance statistics.

## 🚀 Features

- **Multiple sorting algorithms**: Quick Sort, Heap Sort, Smooth Sort, Intro Sort
- **Interactive animations** with adjustable speed controls
- **Performance statistics**: comparisons, swaps, and execution time tracking
- **Responsive design** with Tailwind CSS
- **Comprehensive test coverage** with Jest and React Testing Library
- **Modern tech stack** powered by Vite and TypeScript

## 🛠 Tech Stack

- **React 18** - Modern UI library
- **TypeScript** - Type safety for reliable code
- **Tailwind CSS** - Utility-first CSS framework
- **Sass** - CSS preprocessor
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and quality
- **Jest** - Testing framework

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/tweeedlex/sorting-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🚀 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run preview      # Preview production build
```

### Building
```bash
npm run build        # Build for production
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

### Testing
```bash
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 🧪 Testing

The project includes comprehensive test coverage for:
- Sorting algorithm implementations
- React components
- State management
- Edge cases and error handling

Run tests with:
```bash
npm test
```

For continuous testing during development:
```bash
npm run test:watch
```

## 🎯 Sorting Algorithms

### Quick Sort
- **Time Complexity**: O(n log n) average, O(n²) worst case
- **Space Complexity**: O(log n)
- **Description**: Divide-and-conquer algorithm using pivot partitioning

### Heap Sort
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(1)
- **Description**: Uses binary heap data structure for sorting

### Smooth Sort
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(1)
- **Description**: Adaptive heapsort variant using Leonardo heap

### Intro Sort
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(log n)
- **Description**: Hybrid algorithm combining quicksort, heapsort, and insertion sort

## 🎨 UI Features

- **Real-time visualization** of array elements being compared and swapped
- **Speed control** to adjust animation timing
- **Statistics panel** showing algorithm performance metrics
- **Algorithm selection** with detailed information
- **Responsive design** for desktop and mobile devices

[Live Demo](https://sorting-visualizer.tappers.tech/) - See the visualizer in action
