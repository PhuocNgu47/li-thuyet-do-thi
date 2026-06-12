const requiresUndirected = new Set(['prim', 'kruskal', 'eulerian', 'bipartite'])

export function parseGraphInput(text, weighted) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return { error: 'Vui lòng nhập ít nhất một cạnh theo định dạng: đỉnhA đỉnhB [trọng_số].' }
  }

  const edges = []
  const nodes = new Set()

  for (let i = 0; i < lines.length; i += 1) {
    const parts = lines[i].split(/\s+/)
    if (parts.length < 2) {
      return { error: `Dòng ${i + 1} không hợp lệ. Ví dụ đúng: A B 3` }
    }

    const [from, to] = parts
    let weight = 1

    if (weighted) {
      const parsedWeight = Number(parts[2] ?? 1)
      if (!Number.isFinite(parsedWeight)) {
        return { error: `Trọng số ở dòng ${i + 1} phải là số hợp lệ.` }
      }
      weight = parsedWeight
    }

    nodes.add(from)
    nodes.add(to)
    edges.push({
      id: `${from}-${to}-${i}`,
      from,
      to,
      weight,
    })
  }

  return { nodes: Array.from(nodes), edges }
}

export function buildAdjacency(nodes, edges, directed) {
  const adjacency = new Map(nodes.map((node) => [node, []]))

  for (const edge of edges) {
    adjacency.get(edge.from)?.push({
      to: edge.to,
      weight: edge.weight,
      edgeId: edge.id,
    })

    if (!directed) {
      adjacency.get(edge.to)?.push({
        to: edge.from,
        weight: edge.weight,
        edgeId: edge.id,
      })
    }
  }

  return adjacency
}

export function runAlgorithm({ algorithm, nodes, edges, startNode, directed }) {
  if (!nodes.includes(startNode)) {
    return {
      error: `Đỉnh bắt đầu "${startNode}" không tồn tại trong đồ thị.`,
    }
  }

  if (directed && requiresUndirected.has(algorithm)) {
    return {
      error: 'Thuật toán đã chọn yêu cầu đồ thị vô hướng. Hãy bỏ chọn chế độ có hướng.',
    }
  }

  const adjacency = buildAdjacency(nodes, edges, directed)

  switch (algorithm) {
    case 'bfs':
      return runBfs(adjacency, startNode)
    case 'dfs':
      return runDfs(adjacency, startNode)
    case 'dijkstra':
      return runDijkstra(adjacency, startNode)
    case 'prim':
      return runPrim(adjacency, startNode)
    case 'kruskal':
      return runKruskal(nodes, edges)
    case 'eulerian':
      return runEulerian(adjacency, nodes)
    case 'bipartite':
      return runBipartite(adjacency, nodes)
    default:
      return { error: 'Thuật toán không được hỗ trợ.' }
  }
}

function runBfs(adjacency, startNode) {
  const queue = [startNode]
  const visited = new Set([startNode])
  const order = []
  const treeEdgeIds = []

  while (queue.length > 0) {
    const node = queue.shift()
    order.push(node)

    for (const edge of adjacency.get(node) ?? []) {
      if (visited.has(edge.to)) {
        continue
      }
      visited.add(edge.to)
      queue.push(edge.to)
      treeEdgeIds.push(edge.edgeId)
    }
  }

  return {
    title: 'BFS (Duyệt theo chiều rộng)',
    summary: [
      `Thứ tự duyệt: ${order.join(' → ')}`,
      `Số đỉnh đã thăm: ${order.length}`,
    ],
    order,
    edgeHighlights: treeEdgeIds,
  }
}

function runDfs(adjacency, startNode) {
  const stack = [startNode]
  const visited = new Set()
  const order = []
  const treeEdgeIds = []

  while (stack.length > 0) {
    const node = stack.pop()
    if (visited.has(node)) {
      continue
    }

    visited.add(node)
    order.push(node)

    const neighbors = [...(adjacency.get(node) ?? [])].reverse()
    for (const edge of neighbors) {
      if (visited.has(edge.to)) {
        continue
      }
      stack.push(edge.to)
      treeEdgeIds.push(edge.edgeId)
    }
  }

  return {
    title: 'DFS (Duyệt theo chiều sâu)',
    summary: [
      `Thứ tự duyệt: ${order.join(' → ')}`,
      `Số đỉnh đã thăm: ${order.length}`,
    ],
    order,
    edgeHighlights: treeEdgeIds,
  }
}

function runDijkstra(adjacency, startNode) {
  const distances = new Map(Array.from(adjacency.keys()).map((node) => [node, Number.POSITIVE_INFINITY]))
  const previous = new Map()
  const unvisited = new Set(adjacency.keys())

  distances.set(startNode, 0)

  while (unvisited.size > 0) {
    let current = null
    let bestDistance = Number.POSITIVE_INFINITY

    for (const node of unvisited) {
      const distance = distances.get(node)
      if (distance < bestDistance) {
        bestDistance = distance
        current = node
      }
    }

    if (current === null || !Number.isFinite(bestDistance)) {
      break
    }

    unvisited.delete(current)

    for (const edge of adjacency.get(current) ?? []) {
      if (!unvisited.has(edge.to)) {
        continue
      }
      const candidate = bestDistance + edge.weight
      if (candidate < distances.get(edge.to)) {
        distances.set(edge.to, candidate)
        previous.set(edge.to, { node: current, edgeId: edge.edgeId })
      }
    }
  }

  const distanceRows = Array.from(distances.entries()).map(([node, distance]) => {
    const value = Number.isFinite(distance) ? distance : '∞'
    return `${startNode} → ${node}: ${value}`
  })

  return {
    title: 'Dijkstra (Đường đi ngắn nhất)',
    summary: distanceRows,
    order: Array.from(distances.entries())
      .filter(([, distance]) => Number.isFinite(distance))
      .sort((a, b) => a[1] - b[1])
      .map(([node]) => node),
    edgeHighlights: Array.from(previous.values()).map((entry) => entry.edgeId),
  }
}

function runPrim(adjacency, startNode) {
  const visited = new Set([startNode])
  const edgeHighlights = []
  let totalWeight = 0

  while (visited.size < adjacency.size) {
    let nextEdge = null

    for (const node of visited) {
      for (const edge of adjacency.get(node) ?? []) {
        if (visited.has(edge.to)) {
          continue
        }
        if (!nextEdge || edge.weight < nextEdge.weight) {
          nextEdge = edge
        }
      }
    }

    if (!nextEdge) {
      return {
        error: 'Đồ thị không liên thông nên không thể tìm cây khung nhỏ nhất bằng Prim.',
      }
    }

    visited.add(nextEdge.to)
    edgeHighlights.push(nextEdge.edgeId)
    totalWeight += nextEdge.weight
  }

  return {
    title: 'Prim (Cây khung nhỏ nhất)',
    summary: [
      `Số cạnh trong MST: ${edgeHighlights.length}`,
      `Tổng trọng số: ${totalWeight}`,
    ],
    order: Array.from(visited),
    edgeHighlights,
  }
}

function runKruskal(nodes, edges) {
  const parent = new Map(nodes.map((node) => [node, node]))
  const rank = new Map(nodes.map((node) => [node, 0]))

  const find = (node) => {
    const root = parent.get(node)
    if (root !== node) {
      const compressedRoot = find(root)
      parent.set(node, compressedRoot)
      return compressedRoot
    }
    return root
  }

  const union = (a, b) => {
    const rootA = find(a)
    const rootB = find(b)

    if (rootA === rootB) {
      return false
    }

    const rankA = rank.get(rootA)
    const rankB = rank.get(rootB)

    if (rankA < rankB) {
      parent.set(rootA, rootB)
    } else if (rankA > rankB) {
      parent.set(rootB, rootA)
    } else {
      parent.set(rootB, rootA)
      rank.set(rootA, rankA + 1)
    }

    return true
  }

  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight)
  const edgeHighlights = []
  let totalWeight = 0

  for (const edge of sortedEdges) {
    if (union(edge.from, edge.to)) {
      edgeHighlights.push(edge.id)
      totalWeight += edge.weight
    }
  }

  if (edgeHighlights.length !== nodes.length - 1) {
    return {
      error: 'Đồ thị không liên thông nên không thể tạo MST bằng Kruskal.',
    }
  }

  return {
    title: 'Kruskal (Cây khung nhỏ nhất)',
    summary: [
      `Số cạnh trong MST: ${edgeHighlights.length}`,
      `Tổng trọng số: ${totalWeight}`,
    ],
    order: nodes,
    edgeHighlights,
  }
}

function runEulerian(adjacency, nodes) {
  const nonIsolated = nodes.filter((node) => (adjacency.get(node) ?? []).length > 0)
  if (nonIsolated.length === 0) {
    return {
      title: 'Eulerian',
      summary: ['Đồ thị không có cạnh, được xem là Eulerian tầm thường.'],
      order: nodes,
      edgeHighlights: [],
    }
  }

  const stack = [nonIsolated[0]]
  const visited = new Set()

  while (stack.length > 0) {
    const node = stack.pop()
    if (visited.has(node)) {
      continue
    }
    visited.add(node)
    for (const edge of adjacency.get(node) ?? []) {
      if (!visited.has(edge.to)) {
        stack.push(edge.to)
      }
    }
  }

  if (visited.size !== nonIsolated.length) {
    return {
      title: 'Eulerian',
      summary: ['Đồ thị không liên thông (bỏ qua đỉnh cô lập), không phải đồ thị Euler.'],
      order: Array.from(visited),
      edgeHighlights: [],
    }
  }

  const oddDegreeNodes = nodes.filter((node) => ((adjacency.get(node) ?? []).length % 2) === 1)

  if (oddDegreeNodes.length === 0) {
    return {
      title: 'Eulerian',
      summary: ['Đồ thị có chu trình Euler (mọi đỉnh đều bậc chẵn).'],
      order: nodes,
      edgeHighlights: [],
    }
  }

  if (oddDegreeNodes.length === 2) {
    return {
      title: 'Eulerian',
      summary: [
        `Đồ thị có đường đi Euler (2 đỉnh bậc lẻ: ${oddDegreeNodes.join(', ')}).`,
      ],
      order: nodes,
      edgeHighlights: [],
    }
  }

  return {
    title: 'Eulerian',
    summary: [`Đồ thị không Euler (có ${oddDegreeNodes.length} đỉnh bậc lẻ).`],
    order: nodes,
    edgeHighlights: [],
  }
}

function runBipartite(adjacency, nodes) {
  const color = new Map()

  for (const start of nodes) {
    if (color.has(start)) {
      continue
    }

    color.set(start, 0)
    const queue = [start]

    while (queue.length > 0) {
      const node = queue.shift()
      const currentColor = color.get(node)

      for (const edge of adjacency.get(node) ?? []) {
        if (!color.has(edge.to)) {
          color.set(edge.to, 1 - currentColor)
          queue.push(edge.to)
          continue
        }

        if (color.get(edge.to) === currentColor) {
          return {
            title: 'Kiểm tra đồ thị hai phía',
            summary: ['Đồ thị không phải hai phía (phát hiện chu trình lẻ).'],
            order: nodes,
            edgeHighlights: [],
            partition: null,
          }
        }
      }
    }
  }

  const left = []
  const right = []

  for (const [node, value] of color.entries()) {
    if (value === 0) {
      left.push(node)
    } else {
      right.push(node)
    }
  }

  return {
    title: 'Kiểm tra đồ thị hai phía',
    summary: [
      'Đồ thị là hai phía.',
      `Tập U: ${left.join(', ') || '∅'}`,
      `Tập V: ${right.join(', ') || '∅'}`,
    ],
    order: [...left, ...right],
    edgeHighlights: [],
    partition: { left, right },
  }
}
