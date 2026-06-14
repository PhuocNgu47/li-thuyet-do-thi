// Fleury's Algorithm for Eulerian Path / Circuit
// Bilingual & Real-World Labels Support
//
// Key difference from Hierholzer:
// - Fleury checks for BRIDGE edges at each step
// - It avoids crossing bridges unless there's no other option
// - More intuitive but slower: O(E^2) vs Hierholzer's O(E)

/**
 * Fleury's Algorithm: Find Eulerian path/circuit by avoiding bridges.
 * 
 * Rule: At each step, prefer non-bridge edges. Only cross a bridge 
 * when no other option exists.
 * 
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects  
 * @param {string} userStartNode - Starting node ID
 * @param {boolean} isDirected - Whether graph is directed
 * @returns {Array} steps - Visualization steps
 */
export function runFleury(nodes, edges, userStartNode, isDirected) {
  const steps = [];
  const labels = {};
  nodes.forEach(n => labels[n.id] = n.label || n.id);

  const recordStep = (enDesc, viDesc, activeNodes = [], activeEdges = [], eulerEdges = [], bridgeEdges = []) => {
    steps.push({
      visited: [],
      activeNodes: [...activeNodes],
      activeEdges: [...activeEdges],
      queueStack: [],
      eulerEdges: [...eulerEdges],
      bridgeEdges: [...bridgeEdges], // Edges identified as bridges
      description: { en: enDesc, vi: viDesc },
      type: 'Fleury'
    });
  };

  // === Step 1: Check Eulerian conditions ===
  if (!isDirected) {
    const degree = {};
    nodes.forEach(n => degree[n.id] = 0);
    edges.forEach(e => {
      degree[e.source]++;
      degree[e.target]++;
    });

    const oddNodes = nodes.filter(n => degree[n.id] % 2 !== 0).map(n => n.id);

    if (oddNodes.length !== 0 && oddNodes.length !== 2) {
      recordStep(
        `Error: Graph has ${oddNodes.length} nodes with odd degree. Eulerian Path requires exactly 0 or 2 odd-degree nodes.`,
        `Lỗi: Đồ thị có ${oddNodes.length} đỉnh bậc lẻ. Đường đi Euler yêu cầu đúng 0 hoặc 2 đỉnh bậc lẻ.`
      );
      return steps;
    }

    // Auto-adjust start node for Euler path (must start at odd-degree node)
    if (oddNodes.length === 2 && !oddNodes.includes(userStartNode)) {
      userStartNode = oddNodes[0];
      recordStep(
        `Note: Start node auto-changed to "${labels[userStartNode]}". Euler path must start at an odd-degree node.`,
        `Lưu ý: Tự động đổi điểm xuất phát sang "${labels[userStartNode]}". Đường đi Euler phải bắt đầu từ đỉnh bậc lẻ.`
      );
    }
  } else {
    // Directed Eulerian conditions
    const inDeg = {}, outDeg = {};
    nodes.forEach(n => { inDeg[n.id] = 0; outDeg[n.id] = 0; });
    edges.forEach(e => { outDeg[e.source]++; inDeg[e.target]++; });

    let startNodes = [], endNodes = [], badNodes = false;
    nodes.forEach(n => {
      const diff = outDeg[n.id] - inDeg[n.id];
      if (diff === 1) startNodes.push(n.id);
      else if (diff === -1) endNodes.push(n.id);
      else if (diff !== 0) badNodes = true;
    });

    if (badNodes || startNodes.length > 1 || endNodes.length > 1) {
      recordStep(
        `Error: Directed graph does not satisfy Eulerian conditions.`,
        `Lỗi: Đồ thị có hướng không thỏa điều kiện Euler.`
      );
      return steps;
    }

    if (startNodes.length === 1 && userStartNode !== startNodes[0]) {
      userStartNode = startNodes[0];
      recordStep(
        `Note: Start node auto-changed to "${labels[userStartNode]}". Must start at node with out-degree = in-degree + 1.`,
        `Lưu ý: Tự động đổi điểm xuất phát sang "${labels[userStartNode]}". Phải bắt đầu tại đỉnh có bậc ra = bậc vào + 1.`
      );
    }
  }

  // === Step 2: Build working adjacency with edge tracking ===
  // We need to track which edges are still available (not yet used)
  const remainingEdges = new Set(edges.map(e => e.id));
  const edgeById = {};
  edges.forEach(e => edgeById[e.id] = e);

  // Get adjacent edges for a node from remaining edges
  function getAdjacentEdges(nodeId) {
    const result = [];
    for (const edgeId of remainingEdges) {
      const e = edgeById[edgeId];
      if (isDirected) {
        if (e.source === nodeId) result.push(e);
      } else {
        if (e.source === nodeId || e.target === nodeId) result.push(e);
      }
    }
    return result;
  }

  // Get the other end of an edge from given node
  function getOtherEnd(edge, nodeId) {
    if (isDirected) return edge.target;
    return edge.source === nodeId ? edge.target : edge.source;
  }

  // === Step 3: Bridge detection using DFS ===
  // An edge is a bridge if removing it disconnects the graph
  function isBridge(edge) {
    // Temporarily remove the edge
    remainingEdges.delete(edge.id);

    const startV = edge.source;
    const targetV = isDirected ? edge.target : (edge.source === edge.target ? edge.source : getOtherEnd(edge, edge.source));

    // Count reachable nodes from startV without this edge
    const visited = new Set();
    const stack = [startV];
    visited.add(startV);

    while (stack.length > 0) {
      const u = stack.pop();
      for (const eid of remainingEdges) {
        const e = edgeById[eid];
        let neighbor = null;
        if (isDirected) {
          if (e.source === u) neighbor = e.target;
        } else {
          if (e.source === u) neighbor = e.target;
          else if (e.target === u) neighbor = e.source;
        }
        if (neighbor && !visited.has(neighbor)) {
          visited.add(neighbor);
          stack.push(neighbor);
        }
      }
    }

    // Restore the edge
    remainingEdges.add(edge.id);

    // If targetV is not reachable from startV without this edge, it's a bridge
    return !visited.has(targetV);
  }

  // === Step 4: Fleury's Algorithm Main Loop ===
  recordStep(
    `Start Fleury's Algorithm at node "${labels[userStartNode]}". Rule: Always prefer non-bridge edges.`,
    `Bắt đầu thuật toán Fleury tại đỉnh "${labels[userStartNode]}". Quy tắc: Luôn ưu tiên đi qua cạnh KHÔNG phải cầu.`,
    [userStartNode]
  );

  const eulerPath = [userStartNode];
  const eulerEdgeIds = [];
  let currentNode = userStartNode;

  while (remainingEdges.size > 0) {
    const adjEdges = getAdjacentEdges(currentNode);

    if (adjEdges.length === 0) {
      recordStep(
        `Node "${labels[currentNode]}" has no remaining edges. Fleury's algorithm stops.`,
        `Đỉnh "${labels[currentNode]}" không còn cạnh nào. Thuật toán Fleury dừng lại.`,
        [currentNode], [], eulerEdgeIds
      );
      break;
    }

    if (adjEdges.length === 1) {
      // Only one edge — must take it (even if it's a bridge)
      const edge = adjEdges[0];
      const nextNode = getOtherEnd(edge, currentNode);

      recordStep(
        `Node "${labels[currentNode]}" has only 1 remaining edge → "${labels[nextNode]}". Must take it.`,
        `Đỉnh "${labels[currentNode]}" chỉ còn 1 cạnh duy nhất → "${labels[nextNode]}". Bắt buộc phải đi.`,
        [currentNode, nextNode], [edge.id], eulerEdgeIds
      );

      remainingEdges.delete(edge.id);
      eulerEdgeIds.push(edge.id);
      eulerPath.push(nextNode);
      currentNode = nextNode;
    } else {
      // Multiple edges — check which ones are bridges
      const bridgeList = [];
      const nonBridgeList = [];

      for (const edge of adjEdges) {
        if (isBridge(edge)) {
          bridgeList.push(edge);
        } else {
          nonBridgeList.push(edge);
        }
      }

      const bridgeIds = bridgeList.map(e => e.id);
      const adjLabels = adjEdges.map(e => {
        const other = getOtherEnd(e, currentNode);
        const isBr = bridgeList.includes(e);
        return `${labels[other]}${isBr ? '(cầu/bridge)' : ''}`;
      }).join(', ');

      recordStep(
        `Node "${labels[currentNode]}" has ${adjEdges.length} remaining edges: [${adjLabels}]. Checking for bridges...`,
        `Đỉnh "${labels[currentNode]}" có ${adjEdges.length} cạnh còn lại: [${adjLabels}]. Đang kiểm tra cạnh cầu...`,
        [currentNode],
        adjEdges.map(e => e.id),
        eulerEdgeIds,
        bridgeIds
      );

      // Choose non-bridge edge if available, otherwise take bridge
      let chosenEdge;
      if (nonBridgeList.length > 0) {
        chosenEdge = nonBridgeList[0];
        const nextNode = getOtherEnd(chosenEdge, currentNode);

        recordStep(
          `Choose non-bridge edge to "${labels[nextNode]}" (avoiding ${bridgeList.length} bridge(s)). Fleury's rule: never cross a bridge if alternatives exist.`,
          `Chọn cạnh KHÔNG phải cầu đến "${labels[nextNode]}" (tránh ${bridgeList.length} cạnh cầu). Quy tắc Fleury: không bao giờ đi qua cầu nếu còn lựa chọn khác.`,
          [currentNode, nextNode], [chosenEdge.id], eulerEdgeIds, bridgeIds
        );
      } else {
        chosenEdge = bridgeList[0];
        const nextNode = getOtherEnd(chosenEdge, currentNode);

        recordStep(
          `All remaining edges from "${labels[currentNode]}" are bridges. Forced to cross bridge to "${labels[nextNode]}".`,
          `Tất cả cạnh còn lại từ "${labels[currentNode]}" đều là cầu. Buộc phải đi qua cầu đến "${labels[nextNode]}".`,
          [currentNode, nextNode], [chosenEdge.id], eulerEdgeIds, bridgeIds
        );
      }

      const nextNode = getOtherEnd(chosenEdge, currentNode);
      remainingEdges.delete(chosenEdge.id);
      eulerEdgeIds.push(chosenEdge.id);
      eulerPath.push(nextNode);
      currentNode = nextNode;
    }
  }

  // Final result animation
  const pathStr = eulerPath.map(id => labels[id]).join(' → ');
  const isCircuit = eulerPath[0] === eulerPath[eulerPath.length - 1];

  recordStep(
    `Fleury's Algorithm complete! ${isCircuit ? 'Eulerian Circuit' : 'Eulerian Path'} found: ${pathStr}. Total edges traversed: ${eulerEdgeIds.length}/${edges.length}.`,
    `Hoàn thành thuật toán Fleury! Tìm được ${isCircuit ? 'Chu trình Euler' : 'Đường đi Euler'}: ${pathStr}. Tổng số cạnh đã đi: ${eulerEdgeIds.length}/${edges.length}.`,
    [], [], eulerEdgeIds
  );

  return steps;
}
