// Kruskal's Minimum Spanning Tree (MST) Algorithm Visualizer - Bilingual & Real-World Labels Support

class UnionFind {
  constructor(nodeIds) {
    this.parent = {};
    this.rank = {};
    nodeIds.forEach(id => {
      this.parent[id] = id;
      this.rank[id] = 0;
    });
  }

  find(i) {
    if (this.parent[i] === i) {
      return i;
    }
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  union(i, j) {
    const rootI = this.find(i);
    const rootJ = this.find(j);

    if (rootI !== rootJ) {
      if (this.rank[rootI] < this.rank[rootJ]) {
        this.parent[rootI] = rootJ;
      } else if (this.rank[rootI] > this.rank[rootJ]) {
        this.parent[rootJ] = rootI;
      } else {
        this.parent[rootJ] = rootI;
        this.rank[rootI]++;
      }
      return true;
    }
    return false;
  }
}

export function runKruskal(nodes, edges) {
  const steps = [];
  const mstEdges = [];
  
  if (nodes.length === 0) return [];

  // Create label map for real-world names
  const labels = {};
  nodes.forEach(n => labels[n.id] = n.label || n.id);

  const sortedEdges = [...edges].sort((a, b) => (a.weight || 0) - (b.weight || 0));
  const nodeIds = nodes.map(n => n.id);
  const dsu = new UnionFind(nodeIds);

  const recordStep = (enDesc, viDesc, activeEdges = [], skippedEdges = []) => {
    // Format edge list with labels
    const queueList = sortedEdges.map(e => `${labels[e.source] || e.source}-${labels[e.target] || e.target}(w=${e.weight})`);
    
    const visitedNodes = new Set();
    edges.forEach(e => {
      if (mstEdges.includes(e.id)) {
        visitedNodes.add(e.source);
        visitedNodes.add(e.target);
      }
    });

    steps.push({
      visited: Array.from(visitedNodes),
      activeEdges: [...activeEdges],
      mstEdges: [...mstEdges],
      skippedEdges: [...skippedEdges], 
      queueStack: queueList, 
      description: {
        en: enDesc,
        vi: viDesc
      },
      type: 'Kruskal'
    });
  };

  recordStep(
    "Initialize Kruskal's MST: Sort all edges of the graph in non-decreasing order of weight.",
    "Khởi tạo Kruskal: Sắp xếp tất cả các phương án lắp đặt đường nối theo thứ tự chi phí tăng dần."
  );

  for (let i = 0; i < sortedEdges.length; i++) {
    const edge = sortedEdges[i];
    
    const sourceLabel = labels[edge.source];
    const targetLabel = labels[edge.target];

    recordStep(
      `Evaluating edge "${sourceLabel}" - "${targetLabel}" (weight: ${edge.weight}) as the next minimum edge.`,
      `Đánh giá phương án nối "${sourceLabel}" - "${targetLabel}" (chi phí: ${edge.weight}) vì có chi phí thấp nhất tiếp theo.`,
      [edge.id]
    );

    const rootSource = dsu.find(edge.source);
    const rootTarget = dsu.find(edge.target);

    if (rootSource !== rootTarget) {
      dsu.union(edge.source, edge.target);
      mstEdges.push(edge.id);

      recordStep(
        `Accept edge "${sourceLabel}" - "${targetLabel}". They belong to different components (roots: "${rootSource}" vs "${rootTarget}"). Union them.`,
        `Chấp nhận đường nối "${sourceLabel}" - "${targetLabel}". Hai khu vực này chưa thông nhau (nhóm gốc: "${rootSource}" và "${rootTarget}"). Tiến hành hợp nhất mạng lưới.`,
        [edge.id]
      );
    } else {
      recordStep(
        `Skip edge "${sourceLabel}" - "${targetLabel}" because they are already connected in the same component (root: "${rootSource}"). Adding this edge would create a cycle.`,
        `Bỏ qua đường nối "${sourceLabel}" - "${targetLabel}" vì hai khu vực đã liên kết gián tiếp từ trước (gốc liên thông: "${rootSource}"). Không cần thêm đường cáp này vì sẽ gây lãng phí/chu trình đóng.`,
        [],
        [edge.id]
      );
    }

    if (mstEdges.length === nodes.length - 1) {
      const totalWeight = edges
        .filter(e => mstEdges.includes(e.id))
        .reduce((sum, e) => sum + (e.weight || 0), 0);

      recordStep(
        `Kruskal's MST complete! Found ${mstEdges.length} edges connecting all components. Total MST weight is ${totalWeight}.`,
        `Hoàn thành thiết kế Kruskal! Đã chọn được ${mstEdges.length} đường nối kết nối toàn bộ khu vực. Tổng chi phí tối thiểu là ${totalWeight}.`,
        []
      );
      return steps;
    }
  }

  const totalWeight = edges
    .filter(e => mstEdges.includes(e.id))
    .reduce((sum, e) => sum + (e.weight || 0), 0);

  recordStep(
    `Kruskal's MST complete! Total MST weight is ${totalWeight}. Selected edges: ${mstEdges.length}.`,
    `Hoàn thành thuật toán Kruskal! Đã thiết lập xong cây khung nhỏ nhất. Tổng chi phí là ${totalWeight}. Số cạnh đã chọn: ${mstEdges.length}.`,
    []
  );
  return steps;
}
