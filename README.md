# 🔬 Graph Algorithm Visualizer

> Interactive visualization tool for graph algorithms - supporting BFS, DFS, Dijkstra, Prim, Kruskal, Eulerian Path, and Bipartite checking.

An educational project for demonstrating graph theory concepts through interactive visualization. Built with React and Vite.

## ✨ Features

- **7 Graph Algorithms**: BFS, DFS, Dijkstra, Prim, Kruskal, Eulerian Path, Bipartite
- **Interactive Canvas**: Create, edit, and visualize graphs in real-time
- **Step-by-Step Animation**: Control algorithm visualization with play/pause and step controls
- **Graph Properties**: Support for directed/undirected and weighted/unweighted graphs
- **Bilingual UI**: Vietnamese and English interface
- **Resizable Sidebars**: Customize layout to your preferences
- **Graph Import/Export**: Load and save graph configurations
- **Random Graph Generation**: Create random graphs for testing

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone and navigate to project
cd li-thuyet-do-thio

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

Outputs optimized files to `dist/` directory.

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── GraphCanvas.jsx  # Interactive graph visualization
│   ├── LeftSidebar.jsx  # Control panel
│   ├── RightSidebar.jsx # Information display
│   └── ErrorBoundary.jsx # Error handling
├── hooks/               # Custom React hooks
│   ├── useGraph.js      # Main graph state management
│   └── useResizable.js  # Sidebar resizing logic
├── algorithms/          # Algorithm implementations
│   ├── bfs.js
│   ├── dfs.js
│   ├── dijkstra.js
│   ├── prim.js
│   ├── kruskal.js
│   ├── eulerian.js
│   └── bipartite.js
├── utils/               # Helper functions
├── data/                # Sample graphs
└── App.jsx              # Main component
```

## 🔧 Technologies

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Cytoscape.js** - Graph visualization library
- **Lucide React** - Icon library
- **ESLint** - Code quality checking

## 📚 How to Use

1. **Create a Graph**
   - Double-click canvas to add nodes
   - Click node → click target node to create edges
   - Right-click to delete elements

2. **Run Algorithm**
   - Select algorithm from left sidebar
   - Set starting node (if applicable)
   - Click "Run" or "Play" to execute

3. **Control Visualization**
   - Use Play/Pause to animate
   - Use Step buttons to go frame-by-frame
   - Adjust animation speed slider

4. **Customize Layout**
   - Drag sidebar dividers to resize
   - Switch language between Vietnamese/English

## 📋 Supported Algorithms

| Algorithm | Type | Properties |
|-----------|------|-----------|
| BFS | Traversal | Works on any graph |
| DFS | Traversal | Works on any graph |
| Dijkstra | Shortest Path | Requires non-negative weights |
| Prim | MST | Requires weighted, undirected |
| Kruskal | MST | Requires weighted, undirected |
| Eulerian | Path Finding | Specific connectivity requirements |
| Bipartite | Classification | Checks if graph is 2-colorable |

## 🐛 Troubleshooting

**Application won't start**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Algorithms not running**
- Ensure graph is not empty
- Check if starting node is selected (for BFS/DFS)
- Verify graph properties match algorithm requirements

## 📝 License

This is an educational project.

## 👨‍💻 Author

Created by Phuoc for Graph Theory course.

---

**Made with ❤️ using React and Vite**
