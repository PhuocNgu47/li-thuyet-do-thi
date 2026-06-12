// Dijkstra's Shortest Path Algorithm Visualizer - Bilingual & Real-World Labels Support

export function runDijkstra(nodes, edges, startNode, isDirected) {
  const steps = [];
  const visited = new Set();
  
  // Create label map for real-world names
  const labels = {};
  nodes.forEach(n => labels[n.id] = n.label || n.id);

  const dist = {};
  const parent = {};
  nodes.forEach(n => {
    dist[n.id] = Infinity;
    parent[n.id] = null;
  });
  dist[startNode] = 0;

  const adj = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    adj[e.source].push({ target: e.target, weight: e.weight || 1, edgeId: e.id });
    if (!isDirected) {
      adj[e.target].push({ target: e.source, weight: e.weight || 1, edgeId: e.id });
    }
  });

  const pq = [[startNode, 0]];

  const recordStep = (enDesc, viDesc, activeNodes = [], activeEdges = []) => {
    // Format queue list with labels
    const queueList = pq.map(([id, d]) => `${labels[id] || id}(d=${d === Infinity ? '∞' : d})`);
    
    steps.push({
      visited: Array.from(visited),
      activeNodes: [...activeNodes],
      activeEdges: [...activeEdges],
      queueStack: queueList,
      distances: { ...dist },
      parent: { ...parent },
      description: {
        en: enDesc,
        vi: viDesc
      },
      type: 'Dijkstra'
    });
  };

  const startLabel = labels[startNode] || startNode;

  if (!nodes.some(n => n.id === startNode)) {
    return [{
      visited: [],
      activeNodes: [],
      activeEdges: [],
      queueStack: [],
      distances: {},
      description: {
        en: `Error: Start node "${startLabel}" not found in graph.`,
        vi: `Lỗi: Đỉnh xuất phát "${startLabel}" không tồn tại trong đồ thị.`
      },
      type: 'Dijkstra'
    }];
  }

  recordStep(
    `Initialize Dijkstra: Set distance of start node "${startLabel}" to 0 and all other nodes to ∞.`,
    `Khởi tạo Dijkstra: Đặt khoảng cách tới điểm khởi hành "${startLabel}" là 0 và mọi địa điểm khác là vô hạn (∞).`,
    [startNode]
  );

  while (pq.length > 0) {
    pq.sort((a, b) => a[1] - b[1]);
    const [u, d] = pq.shift();

    if (visited.has(u)) {
      continue;
    }

    visited.add(u);
    const uLabel = labels[u];

    recordStep(
      `Extract node "${uLabel}" with the minimum distance (${d}) from the priority queue. Mark it as visited (settled).`,
      `Lấy địa điểm "${uLabel}" có khoảng cách ngắn nhất (${d}) ra khỏi hàng đợi ưu tiên. Đánh dấu đã chốt/khóa tuyến đường tối ưu đến đỉnh này.`,
      [u]
    );

    const neighbors = adj[u] || [];
    for (const neighbor of neighbors) {
      const v = neighbor.target;
      const weight = neighbor.weight;
      const edgeId = neighbor.edgeId;
      const vLabel = labels[v];

      if (visited.has(v)) {
        recordStep(
          `Check neighbor "${vLabel}" from node "${uLabel}". Node "${vLabel}" is already visited. Skip.`,
          `Kiểm tra tuyến nối "${vLabel}" từ "${uLabel}". Điểm này đã được tối ưu tuyến đường trước đó. Bỏ qua.`,
          [u],
          [edgeId]
        );
        continue;
      }

      const alt = dist[u] + weight;
      if (alt < dist[v]) {
        const oldDist = dist[v];
        dist[v] = alt;
        parent[v] = u;
        
        const existingIdx = pq.findIndex(item => item[0] === v);
        if (existingIdx !== -1) {
          pq[existingIdx][1] = alt;
        } else {
          pq.push([v, alt]);
        }

        recordStep(
          `Relax edge "${uLabel}" ➔ "${vLabel}" (weight: ${weight}). Distance to "${vLabel}" improves from ${oldDist === Infinity ? '∞' : oldDist} to ${alt}. Update parent of "${vLabel}" to "${uLabel}".`,
          `Tối ưu tuyến "${uLabel}" ➔ "${vLabel}" (khoảng cách chặng: ${weight}). Tổng khoảng cách đến "${vLabel}" cải thiện từ ${oldDist === Infinity ? '∞' : oldDist} xuống còn ${alt}. Cập nhật chặng trước của "${vLabel}" là từ "${uLabel}".`,
          [u, v],
          [edgeId]
        );
      } else {
        recordStep(
          `Check edge "${uLabel}" ➔ "${vLabel}" (weight: ${weight}). Distance through "${uLabel}" is ${alt}, which is not better than current distance ${dist[v]}. Skip.`,
          `Kiểm tra chặng "${uLabel}" ➔ "${vLabel}" (khoảng cách chặng: ${weight}). Đi vòng qua "${uLabel}" tốn ${alt}, không tối ưu hơn hành trình hiện tại (${dist[v]}). Bỏ qua.`,
          [u, v],
          [edgeId]
        );
      }
    }
  }

  let pathsSummaryEn = "Shortest distances:\n";
  let pathsSummaryVi = "Hành trình tối ưu từ nguồn:\n";
  nodes.forEach(n => {
    pathsSummaryEn += `- Node ${labels[n.id]}: dist = ${dist[n.id] === Infinity ? '∞' : dist[n.id]}\n`;
    pathsSummaryVi += `- Địa điểm ${labels[n.id]}: tổng khoảng cách = ${dist[n.id] === Infinity ? '∞' : dist[n.id]}\n`;
  });

  recordStep(
    `Dijkstra complete! ${pathsSummaryEn.trim()}`,
    `Hoàn thành tìm đường tối ưu! ${pathsSummaryVi.trim()}`,
    []
  );
  return steps;
}
