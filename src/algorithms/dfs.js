// Depth First Search (DFS) Visualizer Algorithm - Bilingual & Real-World Labels Support

export function runDFS(nodes, edges, startNode, isDirected) {
  const steps = [];
  const visited = new Set();
  const stack = []; // Simulates the recursion call stack
  
  // Create label map for real-world names
  const labels = {};
  nodes.forEach(n => labels[n.id] = n.label || n.id);

  const adj = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    adj[e.source].push({ target: e.target, edgeId: e.id });
    if (!isDirected) {
      adj[e.target].push({ target: e.source, edgeId: e.id });
    }
  });

  const recordStep = (enDesc, viDesc, activeNodes = [], activeEdges = []) => {
    steps.push({
      visited: Array.from(visited),
      activeNodes: [...activeNodes],
      activeEdges: [...activeEdges],
      queueStack: [...stack], 
      description: {
        en: enDesc,
        vi: viDesc
      },
      type: 'DFS'
    });
  };

  const startLabel = labels[startNode] || startNode;

  if (!nodes.some(n => n.id === startNode)) {
    return [{
      visited: [],
      activeNodes: [],
      activeEdges: [],
      queueStack: [],
      description: {
        en: `Error: Start node "${startLabel}" not found in graph.`,
        vi: `Lỗi: Đỉnh xuất phát "${startLabel}" không tồn tại trong đồ thị.`
      },
      type: 'DFS'
    }];
  }

  recordStep(
    `Initialize DFS: Start recursion from node "${startLabel}".`,
    `Khởi tạo DFS: Bắt đầu gọi đệ quy từ điểm "${startLabel}".`,
    [startNode]
  );

  function dfsVisit(u, parentEdgeId = null) {
    visited.add(u);
    stack.push(u);
    
    const uLabel = labels[u];

    recordStep(
      `Visit node "${uLabel}". Push it onto the recursion stack.`, 
      `Duyệt địa điểm "${uLabel}". Đẩy địa điểm này vào ngăn xếp cuộc gọi đệ quy.`,
      [u], 
      parentEdgeId ? [parentEdgeId] : []
    );

    const neighbors = adj[u] || [];
    for (const neighbor of neighbors) {
      const v = neighbor.target;
      const edgeId = neighbor.edgeId;
      const vLabel = labels[v];

      if (!visited.has(v)) {
        recordStep(
          `Explore edge from "${uLabel}" to "${vLabel}". Node "${vLabel}" is unvisited. Recurse into "${vLabel}".`,
          `Duyệt đường nối từ "${uLabel}" sang "${vLabel}". Điểm "${vLabel}" chưa đi qua. Bắt đầu đi sâu đệ quy vào "${vLabel}".`,
          [u, v],
          [edgeId]
        );
        dfsVisit(v, edgeId);
      } else {
        const isBacktrackNode = stack.includes(v);
        recordStep(
          `Explore edge from "${uLabel}" to "${vLabel}". Node "${vLabel}" has already been visited${isBacktrackNode ? ' (ancestor in stack, back edge)' : ''}. Backtrack.`,
          `Duyệt đường nối từ "${uLabel}" sang "${vLabel}". Điểm "${vLabel}" đã được đi qua từ trước${isBacktrackNode ? ' (đang nằm trong nhánh đệ quy hiện tại)' : ''}. Quay lui.`,
          [u],
          [edgeId]
        );
      }
    }

    stack.pop();
    recordStep(
      `All neighbors of "${uLabel}" explored. Pop "${uLabel}" from the stack and backtrack.`,
      `Đã duyệt hết các ngả đường từ "${uLabel}". Rút điểm "${uLabel}" ra khỏi ngăn xếp đệ quy và quay lui về điểm trước đó.`,
      [u]
    );
  }

  dfsVisit(startNode);
  recordStep(
    `DFS complete! All reachable nodes from start node "${startLabel}" have been visited.`,
    `Hoàn thành thuật toán DFS! Đã thăm dò tất cả các tuyến đường liên thông từ điểm xuất phát "${startLabel}".`,
    []
  );
  return steps;
}
