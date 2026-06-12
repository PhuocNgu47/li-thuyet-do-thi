// Graph helper utilities for representation conversion and random graph generation

// Generate a random graph with visual positioning
export function generateRandomGraph(nodeCount, density, isDirected, isWeighted) {
  const nodes = [];
  const edges = [];
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
  
  // 1. Generate nodes in a circle layout for neat default representation
  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;

  for (let i = 0; i < Math.min(nodeCount, labels.length); i++) {
    const angle = (i * 2 * Math.PI) / nodeCount;
    nodes.push({
      id: labels[i],
      label: labels[i],
      x: Math.round(centerX + radius * Math.cos(angle)),
      y: Math.round(centerY + radius * Math.sin(angle))
    });
  }

  // 2. Generate edges based on density
  let edgeIdCounter = 1;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      
      // For undirected graph, only consider i < j to avoid duplicate edges
      if (!isDirected && i > j) continue;

      if (Math.random() < density) {
        const weight = isWeighted ? Math.floor(Math.random() * 9) + 1 : 1;
        edges.push({
          id: `e${edgeIdCounter++}`,
          source: nodes[i].id,
          target: nodes[j].id,
          weight: weight
        });
      }
    }
  }

  return { isDirected, isWeighted, nodes, edges };
}

// Convert graph state to Adjacency Matrix format (returns 2D array and string)
export function graphToAdjacencyMatrix(nodes, edges, isDirected) {
  const n = nodes.length;
  const nodeIds = nodes.map(n => n.id);
  const matrix = Array(n).fill(null).map(() => Array(n).fill(0));

  // Build ID to index map
  const idMap = {};
  nodeIds.forEach((id, idx) => { idMap[id] = idx; });

  edges.forEach(edge => {
    const u = idMap[edge.source];
    const v = idMap[edge.target];
    if (u !== undefined && v !== undefined) {
      matrix[u][v] = edge.weight || 1;
      if (!isDirected) {
        matrix[v][u] = edge.weight || 1;
      }
    }
  });

  // Convert to formatted string
  let text = "   " + nodeIds.join("  ") + "\n";
  for (let i = 0; i < n; i++) {
    text += `${nodeIds[i]}  ` + matrix[i].map(val => String(val).padStart(2, ' ')).join(" ") + "\n";
  }

  return { matrix, nodeIds, text };
}

// Convert graph state to Adjacency List format (returns dictionary and string)
export function graphToAdjacencyList(nodes, edges, isDirected) {
  const adjList = {};
  nodes.forEach(node => {
    adjList[node.id] = [];
  });

  edges.forEach(edge => {
    if (adjList[edge.source]) {
      adjList[edge.source].push({ target: edge.target, weight: edge.weight || 1 });
    }
    if (!isDirected && adjList[edge.target]) {
      adjList[edge.target].push({ target: edge.source, weight: edge.weight || 1 });
    }
  });

  // Convert to formatted string
  let text = "";
  nodes.forEach(node => {
    const targets = adjList[node.id].map(t => `${t.target}(${t.weight})`).join(", ");
    text += `${node.id}: ${targets}\n`;
  });

  return { adjList, text };
}

// Convert graph state to Edge List format (returns array and string)
export function graphToEdgeList(edges) {
  const list = edges.map(e => ({ source: e.source, target: e.target, weight: e.weight || 1 }));
  
  let text = "";
  list.forEach(e => {
    text += `${e.source} ${e.target} ${e.weight}\n`;
  });

  return { list, text };
}

// Parse Adjacency Matrix text back to nodes and edges
export function parseAdjacencyMatrix(text, isDirected, isWeighted) {
  const lines = text.trim().split("\n").map(l => l.trim().split(/\s+/)).filter(l => l.length > 0);
  if (lines.length === 0) throw new Error("Empty matrix input");

  // Determine headers
  let headers = [];
  let rowStartIndex = 0;

  // Check if first line contains only node names
  // If first line has length equal to lines.length or lines.length - 1, and contains alphabetical names
  const firstLine = lines[0];
  const hasHeaderRow = isNaN(Number(firstLine[firstLine.length - 1]));

  if (hasHeaderRow) {
    headers = firstLine.filter(h => h !== "" && h !== "index");
    rowStartIndex = 1;
  } else {
    // Generate default headers A, B, C...
    const count = lines.length;
    for (let i = 0; i < count; i++) {
      headers.push(String.fromCharCode(65 + i));
    }
    rowStartIndex = 0;
  }

  const nodes = headers.map((id, index) => {
    const angle = (index * 2 * Math.PI) / headers.length;
    return {
      id,
      label: id,
      x: Math.round(300 + 150 * Math.cos(angle)),
      y: Math.round(200 + 150 * Math.sin(angle))
    };
  });

  const edges = [];
  let edgeId = 1;

  for (let i = rowStartIndex; i < lines.length; i++) {
    const row = lines[i];
    // If row starts with row label, skip it
    const startIdx = (row.length === headers.length + 1) ? 1 : 0;
    const sourceId = headers[i - rowStartIndex];

    for (let j = startIdx; j < row.length; j++) {
      const colIdx = j - startIdx;
      const targetId = headers[colIdx];
      const weight = Number(row[j]);

      if (weight > 0 && sourceId && targetId) {
        // For undirected, only add u -> v where u < v index to avoid duplicates
        if (!isDirected && headers.indexOf(sourceId) > headers.indexOf(targetId)) {
          continue;
        }
        edges.push({
          id: `e${edgeId++}`,
          source: sourceId,
          target: targetId,
          weight: isWeighted ? weight : 1
        });
      }
    }
  }

  return { nodes, edges };
}

// Parse Adjacency List text back to nodes and edges
export function parseAdjacencyList(text, isDirected, isWeighted) {
  const lines = text.trim().split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const nodes = [];
  const edges = [];
  const nodeSet = new Set();
  let edgeId = 1;

  // First pass: collect all unique nodes
  lines.forEach(line => {
    const parts = line.split(":");
    const sourceId = parts[0].trim();
    if (sourceId && !nodeSet.has(sourceId)) {
      nodeSet.add(sourceId);
    }
  });

  // If node set is empty, do nothing
  if (nodeSet.size === 0) return { nodes: [], edges: [] };

  // Arrange nodes in a circle
  const nodeIds = Array.from(nodeSet);
  nodeIds.forEach((id, idx) => {
    const angle = (idx * 2 * Math.PI) / nodeIds.length;
    nodes.push({
      id,
      label: id,
      x: Math.round(300 + 150 * Math.cos(angle)),
      y: Math.round(200 + 150 * Math.sin(angle))
    });
  });

  // Second pass: parse edges
  lines.forEach(line => {
    const parts = line.split(":");
    const sourceId = parts[0].trim();
    if (!parts[1]) return;
    
    // Split targets by comma
    const targetsText = parts[1].split(",");
    targetsText.forEach(targetText => {
      const clean = targetText.trim();
      if (!clean) return;

      // Extract target ID and weight, e.g. B(4) or B
      const match = clean.match(/^([^\s(]+)(?:\((\d+)\))?$/);
      if (match) {
        const targetId = match[1];
        const weight = match[2] ? Number(match[2]) : 1;

        if (!nodeSet.has(targetId)) {
          // Add dynamically if not present
          nodeSet.add(targetId);
          const angle = Math.random() * 2 * Math.PI;
          nodes.push({
            id: targetId,
            label: targetId,
            x: Math.round(300 + 150 * Math.cos(angle)),
            y: Math.round(200 + 150 * Math.sin(angle))
          });
        }

        // Avoid adding reverse edge if undirected to prevent duplicate edges
        if (!isDirected && nodeIds.indexOf(sourceId) > nodeIds.indexOf(targetId)) {
          return;
        }

        edges.push({
          id: `e${edgeId++}`,
          source: sourceId,
          target: targetId,
          weight: isWeighted ? weight : 1
        });
      }
    });
  });

  return { nodes, edges };
}

// Parse Edge List text back to nodes and edges
export function parseEdgeList(text, isDirected, isWeighted) {
  const lines = text.trim().split("\n").map(l => l.trim().split(/\s+/)).filter(l => l.length > 0);
  const nodeSet = new Set();
  const edges = [];
  let edgeId = 1;

  // First pass: collect node IDs
  lines.forEach(line => {
    if (line.length >= 2) {
      nodeSet.add(line[0]);
      nodeSet.add(line[1]);
    }
  });

  const nodeIds = Array.from(nodeSet);
  const nodes = nodeIds.map((id, idx) => {
    const angle = (idx * 2 * Math.PI) / nodeIds.length;
    return {
      id,
      label: id,
      x: Math.round(300 + 150 * Math.cos(angle)),
      y: Math.round(200 + 150 * Math.sin(angle))
    };
  });

  lines.forEach(line => {
    if (line.length >= 2) {
      const source = line[0];
      const target = line[1];
      const weight = line[2] ? Number(line[2]) : 1;

      if (!isDirected) {
        // Avoid duplicate edges in undirected graph
        const duplicate = edges.some(e => 
          (e.source === source && e.target === target) || 
          (e.source === target && e.target === source)
        );
        if (duplicate) return;
      }

      edges.push({
        id: `e${edgeId++}`,
        source,
        target,
        weight: isWeighted ? weight : 1
      });
    }
  });

  return { nodes, edges };
}
