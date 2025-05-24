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

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type safety for reliable code
- **Tailwind CSS** - Utility-first CSS framework
- **Sass** - CSS preprocessor

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and quality
- **Jest** - Testing framework

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
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
npm run ngrok        # Expose local server via ngrok
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

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── store/              # Redux store configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles and Sass files
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [Live Demo](#) - See the visualizer in action
- [Documentation](#) - Detailed algorithm explanations
- [Issues](https://github.com/your-repo/issues) - Report bugs or request features