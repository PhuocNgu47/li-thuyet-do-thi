// Ford-Fulkerson (Edmonds-Karp variant using BFS) - Max Flow Algorithm
// Bilingual & Real-World Labels Support

/**
 * Edmonds-Karp algorithm: Ford-Fulkerson method using BFS to find augmenting paths.
 * Time Complexity: O(V * E^2)
 * 
 * @param {Array} nodes - Array of node objects {id, label, x, y}
 * @param {Array} edges - Array of edge objects {id, source, target, weight}
 * @param {string} sourceNode - Source node ID
 * @param {string} sinkNode - Sink node ID  
 * @param {boolean} isDirected - Whether the graph is directed
 * @returns {Array} steps - Array of visualization steps
 */
export function runFordFulkerson(nodes, edges, sourceNode, sinkNode, isDirected) {
  const steps = [];

  // Create label map for real-world names
  const labels = {};
  nodes.forEach(n => labels[n.id] = n.label || n.id);

  const sourceLabel = labels[sourceNode] || sourceNode;
  const sinkLabel = labels[sinkNode] || sinkNode;

  // Validate source and sink
  if (!nodes.some(n => n.id === sourceNode)) {
    return [{
      visited: [], activeNodes: [], activeEdges: [], queueStack: [],
      flow: {}, maxFlow: 0,
      description: {
        en: `Error: Source node "${sourceLabel}" not found in graph.`,
        vi: `Lỗi: Đỉnh nguồn "${sourceLabel}" không tồn tại trong đồ thị.`
      },
      type: 'FordFulkerson'
    }];
  }

  if (!nodes.some(n => n.id === sinkNode)) {
    return [{
      visited: [], activeNodes: [], activeEdges: [], queueStack: [],
      flow: {}, maxFlow: 0,
      description: {
        en: `Error: Sink node "${sinkLabel}" not found in graph.`,
        vi: `Lỗi: Đỉnh đích "${sinkLabel}" không tồn tại trong đồ thị.`
      },
      type: 'FordFulkerson'
    }];
  }

  if (sourceNode === sinkNode) {
    return [{
      visited: [], activeNodes: [], activeEdges: [], queueStack: [],
      flow: {}, maxFlow: 0,
      description: {
        en: `Error: Source and Sink must be different nodes.`,
        vi: `Lỗi: Đỉnh nguồn và đỉnh đích phải khác nhau.`
      },
      type: 'FordFulkerson'
    }];
  }

  // Build capacity graph and flow tracking
  // capacity[u][v] = max capacity of edge u->v
  // flow[u][v] = current flow on edge u->v
  // edgeMap[u][v] = edge ID for visualization
  const capacity = {};
  const flow = {};
  const edgeMap = {};

  nodes.forEach(n => {
    capacity[n.id] = {};
    flow[n.id] = {};
    edgeMap[n.id] = {};
    nodes.forEach(m => {
      capacity[n.id][m.id] = 0;
      flow[n.id][m.id] = 0;
    });
  });

  edges.forEach(e => {
    capacity[e.source][e.target] += (e.weight || 1);
    edgeMap[e.source][e.target] = e.id;
    if (!isDirected) {
      capacity[e.target][e.source] += (e.weight || 1);
      edgeMap[e.target][e.source] = e.id;
    }
  });

  let maxFlow = 0;
  let iteration = 0;

  // Helper: get flow state for display
  const getFlowState = () => {
    const flowState = {};
    edges.forEach(e => {
      const f = flow[e.source][e.target];
      const c = capacity[e.source][e.target];
      flowState[e.id] = { flow: f, capacity: c };
    });
    return flowState;
  };

  const recordStep = (enDesc, viDesc, activeNodes = [], activeEdges = [], pathEdges = []) => {
    steps.push({
      visited: [],
      activeNodes: [...activeNodes],
      activeEdges: [...activeEdges],
      pathEdges: [...pathEdges],
      queueStack: [],
      flowState: getFlowState(),
      maxFlow: maxFlow,
      description: { en: enDesc, vi: viDesc },
      type: 'FordFulkerson'
    });
  };

  // Initial step
  recordStep(
    `Initialize Ford-Fulkerson (Edmonds-Karp): Source = "${sourceLabel}", Sink = "${sinkLabel}". All flows start at 0.`,
    `Khởi tạo Ford-Fulkerson (Edmonds-Karp): Nguồn = "${sourceLabel}", Đích = "${sinkLabel}". Tất cả luồng ban đầu = 0.`,
    [sourceNode, sinkNode]
  );

  // BFS to find augmenting path in residual graph
  function bfsAugmentingPath() {
    const parent = {};
    const parentEdge = {};
    const visited = new Set();
    const queue = [sourceNode];
    visited.add(sourceNode);

    while (queue.length > 0) {
      const u = queue.shift();

      for (const n of nodes) {
        const v = n.id;
        // Residual capacity = capacity - current flow
        const residual = capacity[u][v] - flow[u][v];
        if (!visited.has(v) && residual > 0) {
          visited.add(v);
          parent[v] = u;
          parentEdge[v] = edgeMap[u]?.[v] || edgeMap[v]?.[u] || null;
          queue.push(v);

          if (v === sinkNode) {
            // Reconstruct path
            const path = [];
            const pathEdgeIds = [];
            let curr = sinkNode;
            while (curr !== sourceNode) {
              const prev = parent[curr];
              path.unshift(curr);
              if (parentEdge[curr]) {
                pathEdgeIds.unshift(parentEdge[curr]);
              }
              curr = prev;
            }
            path.unshift(sourceNode);

            // Find bottleneck
            let bottleneck = Infinity;
            curr = sinkNode;
            while (curr !== sourceNode) {
              const prev = parent[curr];
              const residualCap = capacity[prev][curr] - flow[prev][curr];
              bottleneck = Math.min(bottleneck, residualCap);
              curr = prev;
            }

            return { path, pathEdgeIds, bottleneck, parent };
          }
        }
      }
    }

    return null; // No augmenting path
  }

  // Main Ford-Fulkerson loop
  while (true) {
    iteration++;
    const result = bfsAugmentingPath();

    if (!result) {
      recordStep(
        `Iteration ${iteration}: BFS found NO augmenting path from "${sourceLabel}" to "${sinkLabel}". Algorithm terminates.`,
        `Lần lặp ${iteration}: BFS không tìm thấy đường tăng luồng nào từ "${sourceLabel}" đến "${sinkLabel}". Thuật toán kết thúc.`,
        [sourceNode, sinkNode]
      );
      break;
    }

    const { path, pathEdgeIds, bottleneck } = result;
    const pathLabels = path.map(id => labels[id]).join(' → ');

    // Show found augmenting path
    recordStep(
      `Iteration ${iteration}: BFS found augmenting path: ${pathLabels}. Bottleneck (min residual capacity) = ${bottleneck}.`,
      `Lần lặp ${iteration}: BFS tìm được đường tăng luồng: ${pathLabels}. Nút thắt cổ chai (dung lượng dư nhỏ nhất) = ${bottleneck}.`,
      path,
      pathEdgeIds,
      pathEdgeIds
    );

    // Update flow along the path
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      flow[u][v] += bottleneck;
      flow[v][u] -= bottleneck; // Reverse edge for residual graph
    }
    maxFlow += bottleneck;

    // Show updated flow
    recordStep(
      `Update flow along path by +${bottleneck}. Total max flow so far = ${maxFlow}.`,
      `Cập nhật luồng trên đường đi thêm +${bottleneck}. Tổng luồng cực đại hiện tại = ${maxFlow}.`,
      [sourceNode, sinkNode],
      pathEdgeIds
    );

    // Safety: prevent infinite loop
    if (iteration > 100) break;
  }

  // Final result
  const flowDetails = edges
    .map(e => {
      const f = flow[e.source][e.target];
      const c = capacity[e.source][e.target];
      return `${labels[e.source]}→${labels[e.target]}: ${f}/${c}`;
    })
    .join(', ');

  recordStep(
    `Ford-Fulkerson complete! Maximum Flow from "${sourceLabel}" to "${sinkLabel}" = ${maxFlow}.\nFlow details: ${flowDetails}`,
    `Hoàn thành Ford-Fulkerson! Luồng cực đại từ "${sourceLabel}" đến "${sinkLabel}" = ${maxFlow}.\nChi tiết luồng: ${flowDetails}`,
    [sourceNode, sinkNode]
  );

  return steps;
}
