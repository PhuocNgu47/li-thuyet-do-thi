// Prim's Minimum Spanning Tree (MST) Algorithm Visualizer - Bilingual & Real-World Labels Support

export function runPrim(nodes, edges, startNode) {
  const steps = [];
  const mstSet = new Set();
  const mstEdges = [];
  
  if (nodes.length === 0) return [];

  // Create label map for real-world names
  const labels = {};
  nodes.forEach(n => labels[n.id] = n.label || n.id);

  const actualStart = nodes.some(n => n.id === startNode) ? startNode : nodes[0].id;
  const startLabel = labels[actualStart] || actualStart;

  const recordStep = (enDesc, viDesc, activeNodes = [], activeEdges = [], crossingEdges = []) => {
    // Format crossing list with node labels
    const queueList = crossingEdges.map(e => `${labels[e.source] || e.source}-${labels[e.target] || e.target}(w=${e.weight})`);
    
    steps.push({
      visited: Array.from(mstSet),
      activeNodes: [...activeNodes],
      activeEdges: [...activeEdges],
      mstEdges: [...mstEdges],
      queueStack: queueList, 
      description: {
        en: enDesc,
        vi: viDesc
      },
      type: 'Prim'
    });
  };

  mstSet.add(actualStart);
  recordStep(
    `Initialize Prim's MST: Add start node "${startLabel}" to the MST.`,
    `Khởi tạo Prim: Thêm điểm bắt đầu mạng lưới "${startLabel}" vào cây khung.`,
    [actualStart]
  );

  while (mstSet.size < nodes.length) {
    const crossingEdges = [];
    edges.forEach(e => {
      const uIn = mstSet.has(e.source);
      const vIn = mstSet.has(e.target);
      if ((uIn && !vIn) || (!uIn && vIn)) {
        crossingEdges.push(e);
      }
    });

    if (crossingEdges.length === 0) {
      recordStep(
        `Prim's MST complete! The graph is disconnected, so we have found the MST for the connected component.`,
        `Hoàn thành! Đồ thị không liên thông, mạng kết nối tối ưu cho phân vùng liên thông hiện tại đã hoàn tất.`,
        []
      );
      break;
    }

    crossingEdges.sort((a, b) => a.weight - b.weight);

    // Get current MST list with labels
    const mstListStr = Array.from(mstSet).map(id => labels[id]).join(", ");
    recordStep(
      `Identify all crossing edges from nodes currently in the MST (${mstListStr}) to unvisited nodes.`,
      `Xác định các phương án lắp đặt đường cáp từ các điểm đã nối mạng (${mstListStr}) sang các điểm chưa được nối.`,
      [],
      [],
      crossingEdges
    );

    const minEdge = crossingEdges[0];
    const newVertex = mstSet.has(minEdge.source) ? minEdge.target : minEdge.source;
    
    const sourceLabel = labels[minEdge.source];
    const targetLabel = labels[minEdge.target];
    const newVertexLabel = labels[newVertex];

    mstSet.add(newVertex);
    mstEdges.push(minEdge.id);

    recordStep(
      `Select minimum weight crossing edge "${sourceLabel}" - "${targetLabel}" (weight: ${minEdge.weight}). Add node "${newVertexLabel}" and this edge to the MST.`,
      `Chọn phương án tốn ít chi phí nhất là kết nối "${sourceLabel}" - "${targetLabel}" (chi phí: ${minEdge.weight}). Thêm điểm "${newVertexLabel}" vào mạng lưới liên kết.`,
      [newVertex],
      [minEdge.id],
      crossingEdges
    );
  }

  const totalWeight = edges
    .filter(e => mstEdges.includes(e.id))
    .reduce((sum, e) => sum + (e.weight || 0), 0);

  recordStep(
    `Prim's MST complete! Total MST weight is ${totalWeight}. Selected edges: ${mstEdges.length}.`,
    `Hoàn thành thiết kế mạng lưới! Tổng chi phí lắp đặt tối thiểu là ${totalWeight}. Số đường nối được chọn: ${mstEdges.length}.`,
    []
  );
  return steps;
}
