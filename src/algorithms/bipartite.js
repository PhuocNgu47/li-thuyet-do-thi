// Bipartite Graph Checking Visualizer (2-Coloring BFS) - Bilingual & Real-World Labels Support

export function checkBipartite(nodes, edges, isDirected) {
  const steps = [];
  const visited = new Set();
  const colors = {}; // Maps nodeId -> color (0 or 1)
  const queue = [];

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

  const recordStep = (enDesc, viDesc, activeNodes = [], activeEdges = [], isConflict = false) => {
    // Format queue list with labels
    const queueList = queue.map(id => labels[id] || id);
    
    steps.push({
      visited: Array.from(visited),
      activeNodes: [...activeNodes],
      activeEdges: [...activeEdges],
      queueStack: queueList,
      bipartiteColors: { ...colors },
      description: {
        en: enDesc,
        vi: viDesc
      },
      isBipartiteConflict: isConflict,
      type: 'Bipartite'
    });
  };

  recordStep(
    "Initialize Bipartite Check: All nodes are uncolored. We will try to color them with 2 colors (Color A & Color B) without conflicts.",
    "Khởi tạo kiểm tra nhóm phân đôi (Bipartite): Tất cả các đối tượng đều chưa được phân nhóm. Ta thử chia thành 2 nhóm (Nhóm A & Nhóm B) sao cho các đối tượng kết nối không chung nhóm."
  );

  for (let startNode of nodes) {
    if (colors[startNode.id] === undefined) {
      colors[startNode.id] = 0; 
      queue.push(startNode.id);
      visited.add(startNode.id);
      
      const startLabel = labels[startNode.id] || startNode.id;
      recordStep(
        `Start new component: Assign Color A to node "${startLabel}" and add it to queue.`,
        `Bắt đầu nhóm mới: Gán Nhóm A cho đối tượng "${startLabel}" và thêm vào danh sách xử lý.`,
        [startNode.id]
      );

      while (queue.length > 0) {
        const u = queue.shift();
        visited.add(u);
        const currColor = colors[u];
        const nextColor = 1 - currColor; 
        const uLabel = labels[u];

        recordStep(
          `Dequeue node "${uLabel}" (Color ${currColor === 0 ? 'A' : 'B'}). Check its neighbors.`,
          `Lấy đối tượng "${uLabel}" (Nhóm ${currColor === 0 ? 'A' : 'B'}) ra kiểm tra các đối tượng kết nối trực tiếp.`,
          [u]
        );

        const neighbors = adj[u] || [];
        for (const neighbor of neighbors) {
          const v = neighbor.target;
          const edgeId = neighbor.edgeId;
          const vLabel = labels[v];

          if (colors[v] === undefined) {
            colors[v] = nextColor;
            queue.push(v);
            visited.add(v);
            
            recordStep(
              `Neighbor "${vLabel}" is uncolored. Assign it Color ${nextColor === 0 ? 'A' : 'B'} (opposite of "${uLabel}") and add to queue.`,
              `Đối tượng "${vLabel}" chưa phân nhóm. Gán Nhóm ${nextColor === 0 ? 'A' : 'B'} (ngược nhóm với "${uLabel}") và thêm vào hàng đợi.`,
              [u, v],
              [edgeId]
            );
          } else if (colors[v] === currColor) {
            recordStep(
              `Conflict found! Neighbor "${vLabel}" already has Color ${colors[v] === 0 ? 'A' : 'B'}, which is the same as "${uLabel}". The graph contains an odd-length cycle.`,
              `Xung đột xảy ra! Đối tượng "${vLabel}" đã thuộc Nhóm ${colors[v] === 0 ? 'A' : 'B'}, trùng nhóm với đối tượng kết nối "${uLabel}". Đồ thị chứa chu trình liên kết lẻ.`,
              [u, v],
              [edgeId],
              true 
            );

            recordStep(
              `Bipartite Check Failed: The graph is NOT bipartite because nodes "${uLabel}" and "${vLabel}" are connected but share the same color.`,
              `Kiểm tra phân đôi thất bại: Không thể chia thành 2 nhóm độc lập vì đối tượng "${uLabel}" và "${vLabel}" có kết nối nhưng chung một nhóm.`,
              [],
              [],
              true
            );
            return steps;
          } else {
            recordStep(
              `Neighbor "${vLabel}" is already colored with Color ${colors[v] === 0 ? 'A' : 'B'} (valid opposite coloring). Skip.`,
              `Đối tượng "${vLabel}" đã được gán Nhóm ${colors[v] === 0 ? 'A' : 'B'} (khác nhóm với "${uLabel}" - hợp lệ). Bỏ qua.`,
              [u],
              [edgeId]
            );
          }
        }
      }
    }
  }

  recordStep(
    `Bipartite Check Succeeded! The graph is BIPARTITE. We have successfully colored all vertices using 2 colors such that no adjacent vertices share a color.`,
    `Kiểm tra thành công! Đồ thị có cấu trúc PHÂN ĐÔI hoàn toàn. Các đối tượng được phân chia thành 2 nhóm độc lập không xảy ra xung đột liên kết nội bộ.`,
    []
  );
  return steps;
}
