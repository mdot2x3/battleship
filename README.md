# battleship

A Test Driven Development (TDD) implementation of the classic game "Battleship".

## Features

- Classic Battleship gameplay with Player vs Player and Player vs Computer game modes (with difficulty selection)
- Drag-and-drop ship placement with rotation
- Visual feedback for hits, misses, and sunk ships
- Responsive design and polished UI
- Game state and turn result display

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/battleship.git
cd battleship
npm install
```

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to the address shown in the terminal (e.g. `http://localhost:8080/`).

## Available Scripts

- **npm run dev**: Start the development server (`webpack serve`)
- **npm run build**: Build the production bundle (`webpack`)
- **npm test**: Run Jest tests

## Testing

This project uses [Jest](https://jestjs.io/) for unit testing.

To run all tests:

```bash
npm test
```

To run ESLint:

```bash
npx eslint yourfile.js
```

To run Prettier:

```bash
npx prettier --write .
```

## Contributing

Pull requests and suggestions are welcome!  
Please open an issue or submit a PR for improvements or bug fixes.
