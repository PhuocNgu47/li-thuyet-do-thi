// Hierholzer's Algorithm for Eulerian Path / Circuit

export function runEulerian(nodes, edges, userStartNode, isDirected) {
  const steps = [];
  const labels = {};
  nodes.forEach(n => labels[n.id] = n.label || n.id);

  const recordStep = (enDesc, viDesc, activeNodes = [], activeEdges = [], extraQueue = [], eulerEdges = []) => {
    steps.push({
      visited: [], // Not really node-visited logic for Eulerian, mostly edge-focused
      activeNodes: [...activeNodes],
      activeEdges: [...activeEdges],
      queueStack: [...extraQueue],
      eulerEdges: [...eulerEdges], // Special array to keep accumulated drawn edges permanently highlighted
      description: { en: enDesc, vi: viDesc },
      type: 'Eulerian'
    });
  };

  // Build Adjacency structure supporting multiple edges (via edgeId)
  const adj = {};
  const inDegree = {};
  const outDegree = {};
  const degree = {};

  nodes.forEach(n => {
    adj[n.id] = [];
    inDegree[n.id] = 0;
    outDegree[n.id] = 0;
    degree[n.id] = 0;
  });

  edges.forEach(e => {
    if (isDirected) {
      adj[e.source].push({ target: e.target, edgeId: e.id });
      outDegree[e.source]++;
      inDegree[e.target]++;
    } else {
      adj[e.source].push({ target: e.target, edgeId: e.id });
      adj[e.target].push({ target: e.source, edgeId: e.id });
      degree[e.source]++;
      degree[e.target]++;
    }
  });

  // Eulerian Condition Check
  let startNode = userStartNode;
  
  if (!isDirected) {
    let oddNodes = [];
    nodes.forEach(n => {
      if (degree[n.id] % 2 !== 0) oddNodes.push(n.id);
    });

    if (oddNodes.length !== 0 && oddNodes.length !== 2) {
      recordStep(
        `Error: Graph has ${oddNodes.length} nodes with odd degree. Eulerian Path requires exactly 0 or 2 odd nodes.`,
        `Lỗi toán học: Đồ thị có ${oddNodes.length} đỉnh bậc lẻ. Định lý Euler yêu cầu phải có đúng 0 hoặc 2 đỉnh bậc lẻ thì mới vẽ được 1 nét.`
      );
      return steps;
    }

    if (oddNodes.length === 2 && !oddNodes.includes(startNode)) {
      startNode = oddNodes[0];
      recordStep(
        `Note: Start node auto-changed to "${labels[startNode]}". To draw 1-stroke, you MUST start at an odd-degree node!`,
        `Lưu ý: Hệ thống tự động đổi điểm xuất phát sang "${labels[startNode]}". Theo định lý, với đồ thị có 2 đỉnh bậc lẻ, bạn BẮT BUỘC phải xuất phát từ 1 trong 2 đỉnh lẻ đó!`
      );
    }
  } else {
    // Directed conditions
    let startNodes = [];
    let endNodes = [];
    let badNodes = false;
    nodes.forEach(n => {
      let diff = outDegree[n.id] - inDegree[n.id];
      if (diff === 1) startNodes.push(n.id);
      else if (diff === -1) endNodes.push(n.id);
      else if (diff !== 0) badNodes = true;
    });

    if (badNodes || startNodes.length > 1 || endNodes.length > 1) {
      recordStep(
        `Error: Graph does not meet Eulerian Path conditions for directed graphs.`,
        `Lỗi toán học: Đồ thị có hướng này không thỏa mãn điều kiện tồn tại đường đi Euler (Bậc ra và Bậc vào không cân bằng).`
      );
      return steps;
    }

    if (startNodes.length === 1 && startNode !== startNodes[0]) {
      startNode = startNodes[0];
      recordStep(
        `Note: Start node auto-changed to "${labels[startNode]}". You must start at the node with out-degree = in-degree + 1.`,
        `Lưu ý: Tự động đổi điểm xuất phát sang "${labels[startNode]}". Bạn bắt buộc phải xuất phát tại đỉnh có (bậc ra - bậc vào = 1).`
      );
    }
  }

  // Hierholzer's Algorithm
  const currPath = [startNode];
  const circuit = [];
  const circuitEdges = []; // Track edges in the final circuit
  const usedEdges = new Set();
  const eulerEdgesAccumulator = []; // Track edges as they are discovered in final order (reversed later)

  recordStep(
    `Start Hierholzer's Algorithm at node "${labels[startNode]}".`,
    `Bắt đầu thuật toán Hierholzer tại đỉnh "${labels[startNode]}". Khởi tạo Stack.`,
    [startNode],
    [],
    [...currPath]
  );

  while (currPath.length > 0) {
    const u = currPath[currPath.length - 1]; // Peek
    
    // Find next unused edge
    let nextEdgeIndex = -1;
    for (let i = 0; i < adj[u].length; i++) {
      if (!usedEdges.has(adj[u][i].edgeId)) {
        nextEdgeIndex = i;
        break;
      }
    }

    if (nextEdgeIndex !== -1) {
      const edge = adj[u][nextEdgeIndex];
      const v = edge.target;
      const edgeId = edge.edgeId;
      
      usedEdges.add(edgeId);
      currPath.push(v);
      
      recordStep(
        `Explore edge to "${labels[v]}". Add "${labels[v]}" to Stack.`,
        `Đỉnh "${labels[u]}" vẫn còn đường đi chưa vẽ. Đi qua cạnh tới "${labels[v]}" và đẩy "${labels[v]}" vào Stack.`,
        [u, v],
        [edgeId],
        [...currPath]
      );
    } else {
      // Stuck, backtrack
      const popNode = currPath.pop();
      circuit.push(popNode);
      
      recordStep(
        `Node "${labels[popNode]}" has no unused edges left. Pop from Stack and add to final circuit.`,
        `Đỉnh "${labels[popNode]}" đã hết đường để đi tiếp. Rút đỉnh này khỏi Stack và đưa vào kết quả Lộ trình (Circuit).`,
        [popNode],
        [],
        [...currPath]
      );
    }
  }

  // The 'circuit' array contains nodes in REVERSE order.
  // Let's generate a final walkthrough animation of the successful Eulerian path.
  circuit.reverse();
  
  // Reconstruct edges used in order
  const finalEdges = [];
  for (let i = 0; i < circuit.length - 1; i++) {
    const u = circuit[i];
    const v = circuit[i+1];
    // Find the edge that connects u to v which is in the graph
    // (since multiple edges might exist, we just find any that matches, though theoretically we should track exact edgeIds pushed to circuit)
    // For simplicity, we find an edge. But to be perfect, we should have tracked edgeIds when popping.
    
    const possibleEdge = edges.find(e => 
      (e.source === u && e.target === v) || (!isDirected && e.source === v && e.target === u)
    );
    if (possibleEdge) {
      finalEdges.push(possibleEdge.id);
    }
  }

  // Animate the final path
  recordStep(
    `Hierholzer's Algorithm finished! Now animating the final One-Stroke path.`,
    `Thuật toán Hierholzer kết thúc! Dưới đây là mô phỏng nét vẽ hoàn hảo liên tục (One-Stroke).`,
    [circuit[0]],
    [],
    [],
    []
  );

  const accumulatedPathEdges = [];
  for (let i = 0; i < finalEdges.length; i++) {
    accumulatedPathEdges.push(finalEdges[i]);
    const currentNode = circuit[i+1];
    recordStep(
      `Tracing edge ${i+1}/${finalEdges.length} to "${labels[currentNode]}".`,
      `Đang vẽ nét thứ ${i+1}/${finalEdges.length} tiến tới "${labels[currentNode]}".`,
      [currentNode],
      [finalEdges[i]],
      [],
      [...accumulatedPathEdges]
    );
  }

  recordStep(
    `Eulerian Path/Circuit complete! All ${finalEdges.length} edges drawn exactly once.`,
    `Thành công! Đã vẽ xong một nét qua toàn bộ ${finalEdges.length} cạnh mà không bị nhấc bút hay đè nét!`,
    [],
    [],
    [],
    [...accumulatedPathEdges]
  );

  return steps;
}
