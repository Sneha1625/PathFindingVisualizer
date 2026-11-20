/* Weighted pathfinding extension
 * Adds terrain costs and correct Dijkstra/A* implementations without replacing
 * the original unweighted BFS, DFS, or Greedy Best First visualizations.
 */
(() => {
  const COSTS = { normal: 1, mud: 5, water: 10 };
  const COLORS = { normal: "#ffffff", mud: "#d6a45c", water: "#62c5df" };
  let paintMode = "normal";
  let mousePainting = false;
  let runToken = 0;

  const grid = document.querySelector(".grid-container");
  if (!grid) return;

  const status = document.getElementById("weighted-status");
  const stats = {
    explored: document.getElementById("stat-explored"),
    steps: document.getElementById("stat-steps"),
    cost: document.getElementById("stat-cost"),
    time: document.getElementById("stat-time")
  };

  function clearStats(message = "Choose terrain, then run a weighted algorithm.") {
    stats.explored.textContent = "—";
    stats.steps.textContent = "—";
    stats.cost.textContent = "—";
    stats.time.textContent = "—";
    status.textContent = message;
  }

  function paintTile(tile) {
    if (!tile || tile.number === startTile || tile.number === endTile || tile.isTileWall()) return;
    tile.weight = COSTS[paintMode];
    tile.element.dataset.weight = String(tile.weight);
    tile.element.textContent = tile.weight > 1 ? String(tile.weight) : "";
    tile.element.style.backgroundColor = COLORS[paintMode];
    tile.element.title = tile.weight === 1 ? "Normal terrain · cost 1" :
      paintMode.charAt(0).toUpperCase() + paintMode.slice(1) + " · cost " + tile.weight;
  }

  function clearAllWeights() {
    if (typeof tiles === "undefined") return;
    tiles.forEach(tile => {
      tile.weight = 1;
      if (tile.element) {
        delete tile.element.dataset.weight;
        tile.element.textContent = "";
        tile.element.title = "";
        if (!tile.isTileWall() && tile.number !== startTile && tile.number !== endTile) {
          tile.element.style.backgroundColor = "#ffffff";
        }
      }
    });
    clearStats("Terrain reset. Choose terrain, then run a weighted algorithm.");
  }

  function setMode(mode) {
    paintMode = mode;
    document.querySelectorAll("[data-terrain]").forEach(button => {
      button.classList.toggle("terrain-selected", button.dataset.terrain === mode);
      button.setAttribute("aria-pressed", button.dataset.terrain === mode ? "true" : "false");
    });
    status.textContent = mode === "normal"
      ? "Normal terrain selected (cost 1)."
      : mode.charAt(0).toUpperCase() + mode.slice(1) + " selected (cost " + COSTS[mode] + "). Click or drag cells to paint.";
  }

  grid.addEventListener("mousedown", event => {
    if (!event.target.classList.contains("tile")) return;
    mousePainting = true;
    const index = Array.prototype.indexOf.call(grid.children, event.target);
    paintTile(tiles[index]);
  });
  grid.addEventListener("mouseover", event => {
    if (!mousePainting || !event.target.classList.contains("tile")) return;
    const index = Array.prototype.indexOf.call(grid.children, event.target);
    paintTile(tiles[index]);
  });
  document.addEventListener("mouseup", () => { mousePainting = false; });

  document.querySelectorAll("[data-terrain]").forEach(button => {
    button.addEventListener("click", () => setMode(button.dataset.terrain));
  });

  function heuristic(tile, goal) {
    return Math.abs(tile.row - goal.row) + Math.abs(tile.col - goal.col);
  }

  function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom.has(current)) {
      current = cameFrom.get(current);
      path.push(current);
    }
    return path.reverse();
  }

  async function runWeighted(kind) {
    if (startTile < 0 || endTile < 0) {
      clearStats("Set both a start tile and an end tile first.");
      return;
    }

    runToken++;
    const token = runToken;
    resetOn = true;
    pathFindingDone = false;
    editMode = false;
    selectedColor = "";
    updateTileNeighbors();
    if (typeof resetVisitedTiles === "function") resetVisitedTiles();
    // Remove colors left by a previous run while preserving terrain and walls.
    tiles.forEach(tile => {
      if (tile.number === startTile) {
        tile.element.style.backgroundColor = "#008000";
      } else if (tile.number === endTile) {
        tile.element.style.backgroundColor = "#ff0000";
      } else if (tile.isTileWall()) {
        tile.element.style.backgroundColor = "#000000";
      } else {
        tile.element.style.backgroundColor = tile.weight === 5 ? COLORS.mud :
          tile.weight === 10 ? COLORS.water : COLORS.normal;
      }
    });
    resetOn = false;

    const startedAt = performance.now();
    const start = tiles[startTile];
    const goal = tiles[endTile];
    const gScore = new Map(tiles.map(tile => [tile.number, Infinity]));
    const cameFrom = new Map();
    const open = [{ id: start.number, priority: 0 }];
    const closed = new Set();
    const explored = new Set();
    gScore.set(start.number, 0);

    while (open.length) {
      if (token !== runToken) return;
      open.sort((a, b) => a.priority - b.priority);
      const currentId = open.shift().id;
      if (closed.has(currentId)) continue;
      const current = tiles[currentId];

      if (currentId === goal.number) break;
      closed.add(currentId);
      explored.add(currentId);

      if (currentId !== startTile && currentId !== endTile) {
        current.element.style.backgroundColor = "#75a7e6";
      }

      for (const neighbor of current.neighbors) {
        if (closed.has(neighbor.number)) continue;
        const tentative = gScore.get(currentId) + (neighbor.weight || 1);
        if (tentative < gScore.get(neighbor.number)) {
          cameFrom.set(neighbor.number, currentId);
          gScore.set(neighbor.number, tentative);
          const priority = kind === "astar"
            ? tentative + heuristic(neighbor, goal)
            : tentative;
          open.push({ id: neighbor.number, priority });
        }
      }
      await new Promise(resolve => setTimeout(resolve, 8));
    }

    if (token !== runToken) return;
    const found = start.number === goal.number || cameFrom.has(goal.number);
    const path = found ? reconstructPath(cameFrom, goal.number) : [];
    for (const id of path) {
      if (id !== startTile && id !== endTile) {
        tiles[id].element.style.backgroundColor = "#f5ff5e";
      }
      await new Promise(resolve => setTimeout(resolve, 12));
    }

    const elapsed = (performance.now() - startedAt).toFixed(2);
    const totalCost = found ? gScore.get(goal.number) : "—";
    stats.explored.textContent = String(explored.size);
    stats.steps.textContent = found ? String(Math.max(0, path.length - 1)) : "No path";
    stats.cost.textContent = String(totalCost);
    stats.time.textContent = elapsed + " ms";
    status.textContent = found
      ? (kind === "astar" ? "A* completed." : "Dijkstra completed.") + " Path cost includes the cost of entering each terrain cell."
      : "No route exists. Try removing some walls.";
    pathFindingDone = true;
  }

  document.getElementById("run-weighted-dijkstra").addEventListener("click", () => runWeighted("dijkstra"));
  document.getElementById("run-weighted-astar").addEventListener("click", () => runWeighted("astar"));
  document.getElementById("clear-terrain").addEventListener("click", clearAllWeights);

  // Keep weights consistent when the existing Reset / maze / random reset flows run.
  const originalReset = reset;
  reset = async function() {
    runToken++;
    await originalReset();
    clearAllWeights();
  };

  // Ensure newly-created cells have the default traversal cost.
  const originalCreateTiles = createTiles;
  createTiles = function() {
    originalCreateTiles();
    tiles.forEach(tile => { tile.weight = 1; });
  };

  setMode("normal");
})();
