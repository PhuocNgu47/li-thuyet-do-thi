// Breadth First Search (BFS) Visualizer Algorithm - Bilingual & Real-World Labels Support

export function runBFS(nodes, edges, startNode, isDirected) {
  const steps = [];
  const visited = new Set();
  const queue = [];
  const inQueue = new Set();
  
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

  const recordStep = (enDesc, viDesc, activeNodes = [], activeEdges = [], extraQueue = []) => {
    steps.push({
      visited: Array.from(visited),
      activeNodes: [...activeNodes],
      activeEdges: [...activeEdges],
      queueStack: [...queue, ...extraQueue],
      description: {
        en: enDesc,
        vi: viDesc
      },
      type: 'BFS'
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
      type: 'BFS'
    }];
  }

  queue.push(startNode);
  inQueue.add(startNode);
  recordStep(
    `Initialize BFS: Add start node "${startLabel}" to the queue.`,
    `Khởi tạo BFS: Thêm điểm xuất phát "${startLabel}" vào hàng đợi.`,
    [startNode]
  );

  while (queue.length > 0) {
    const u = queue.shift();
    visited.add(u);
    inQueue.delete(u);
    
    const uLabel = labels[u];
    recordStep(
      `Dequeue node "${uLabel}" and mark it as visited.`,
      `Lấy địa điểm "${uLabel}" ra khỏi hàng đợi và đánh dấu đã đi qua/duyệt.`,
      [u]
    );

    const neighbors = adj[u] || [];
    for (const neighbor of neighbors) {
      const v = neighbor.target;
      const edgeId = neighbor.edgeId;
      const vLabel = labels[v];

      if (!visited.has(v) && !inQueue.has(v)) {
        queue.push(v);
        inQueue.add(v);
        recordStep(
          `Explore neighbor "${vLabel}" from node "${uLabel}". Node "${vLabel}" is unvisited, adding it to the queue.`,
          `Duyệt điểm liên kết "${vLabel}" từ "${uLabel}". Địa điểm này chưa ghé qua, thêm "${vLabel}" vào hàng đợi.`,
          [v],
          [edgeId]
        );
      } else if (inQueue.has(v)) {
        recordStep(
          `Explore neighbor "${vLabel}" from node "${uLabel}". Node "${vLabel}" is already in the queue, skip.`,
          `Duyệt liên kết "${vLabel}" từ "${uLabel}". Địa điểm "${vLabel}" đã nằm sẵn trong hàng đợi, bỏ qua.`,
          [u],
          [edgeId]
        );
      } else {
        recordStep(
          `Explore neighbor "${vLabel}" from node "${uLabel}". Node "${vLabel}" has already been visited, skip.`,
          `Duyệt liên kết "${vLabel}" từ "${uLabel}". Địa điểm "${vLabel}" đã đi qua trước đó, bỏ qua.`,
          [u],
          [edgeId]
        );
      }
    }
  }

  recordStep(
    `BFS complete! All reachable nodes from start node "${startLabel}" have been visited.`,
    `Hoàn thành thuật toán BFS! Đã duyệt qua tất cả điểm có thể kết nối từ điểm xuất phát "${startLabel}".`,
    []
  );
  return steps;
}
