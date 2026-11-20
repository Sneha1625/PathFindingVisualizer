# Pathfinding & Sorting Visualizer

An interactive browser-based visualizer for exploring graph search, shortest-path algorithms, weighted terrain, mazes, and sorting algorithms.

## Run locally

This is a static HTML/CSS/JavaScript project; no package installation is required.

1. Clone or download this repository.
2. Open the project folder in VS Code.
3. Install the **Live Server** extension.
4. Right-click `index.html` and select **Open with Live Server**.

You can also open `index.html` directly in a modern browser, although Live Server is recommended.

## Pathfinding features

- Interactive grid with draggable start and end nodes.
- Draw and erase walls by clicking or dragging.
- Visualize BFS, DFS, Dijkstra, A*, and Greedy Best-First Search.
- Generate random wall layouts and DFS-backtracking mazes.
- **Weighted terrain mode:** paint normal cells (cost 1), mud (cost 5), and water (cost 10).
- **Weighted Dijkstra and A*:** find minimum-cost routes using the cost of entering each cell.
- Live result metrics: explored nodes, path steps, total path cost, and execution time.

### Weighted pathfinding

Select a terrain brush and click or drag across the grid to paint cells. Set start and end tiles using the existing controls, then run the dedicated weighted Dijkstra or A* button.

The cost of a route is the sum of the traversal costs of the cells entered (the starting cell is not charged). Dijkstra uses cumulative path cost. A* uses cumulative path cost plus a Manhattan-distance heuristic. Since the minimum terrain cost is 1 and movement is four-directional, this heuristic is admissible and consistent.

BFS and DFS are retained as unweighted traversal demonstrations; they do not optimize terrain cost. Greedy Best-First Search is heuristic-driven and is not guaranteed to find a minimum-cost route.

## Algorithms

| Algorithm | Weighted costs | Guarantees optimal route? |
|---|---:|---:|
| BFS | No | Yes, when all moves have equal cost |
| DFS | No | No |
| Dijkstra | Yes | Yes, for non-negative costs |
| A* | Yes | Yes, with the implemented admissible Manhattan heuristic |
| Greedy Best-First | No | No |

## Sorting visualizer

The project also includes a separate sorting page with Linear Search, Bubble, Selection, Insertion, Merge, Quick, Heap, and Bogo demonstrations. Open `sorting.html` from the main page.

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
