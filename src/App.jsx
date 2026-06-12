import { useMemo, useState } from 'react'
import './App.css'
import { parseGraphInput, runAlgorithm } from './algorithms'

const algorithmOptions = [
  { value: 'bfs', label: 'BFS' },
  { value: 'dfs', label: 'DFS' },
  { value: 'dijkstra', label: 'Dijkstra' },
  { value: 'prim', label: 'Prim' },
  { value: 'kruskal', label: 'Kruskal' },
  { value: 'eulerian', label: 'Eulerian' },
  { value: 'bipartite', label: 'Bipartite' },
]

const algorithmExplanations = {
  bfs: 'BFS duyệt theo từng lớp, phù hợp tìm đường đi ngắn nhất trên đồ thị không trọng số.',
  dfs: 'DFS đi sâu theo nhánh trước khi quay lui, thường dùng cho kiểm tra liên thông và phát hiện chu trình.',
  dijkstra: 'Dijkstra tìm đường đi ngắn nhất từ một đỉnh nguồn trên đồ thị có trọng số không âm.',
  prim: 'Prim xây cây khung nhỏ nhất bằng cách mở rộng từ một đỉnh và luôn chọn cạnh nhẹ nhất.',
  kruskal: 'Kruskal xây MST bằng cách sắp xếp cạnh tăng dần và tránh tạo chu trình bằng Union-Find.',
  eulerian: 'Kiểm tra điều kiện tồn tại đường đi/chu trình Euler dựa trên liên thông và bậc của các đỉnh.',
  bipartite: 'Đồ thị hai phía có thể tô 2 màu sao cho hai đỉnh kề nhau luôn khác màu.',
}

const defaultInput = `A B 2
A C 4
B C 1
B D 7
C D 3
C E 5
D E 2`

function App() {
  const [graphInput, setGraphInput] = useState(defaultInput)
  const [algorithm, setAlgorithm] = useState('bfs')
  const [startNode, setStartNode] = useState('A')
  const [directed, setDirected] = useState(false)
  const [weighted, setWeighted] = useState(true)
  const [result, setResult] = useState({
    title: 'Sẵn sàng mô phỏng',
    summary: ['Nhập dữ liệu đồ thị ở thanh bên trái rồi nhấn “Chạy thuật toán”.'],
    order: [],
    edgeHighlights: [],
    partition: null,
  })

  const parsedGraph = useMemo(() => parseGraphInput(graphInput, weighted), [graphInput, weighted])

  const layout = useMemo(() => {
    if (!parsedGraph.nodes || parsedGraph.nodes.length === 0) {
      return { nodePositions: [], edges: [] }
    }

    const count = parsedGraph.nodes.length
    const centerX = 280
    const centerY = 220
    const radius = Math.max(90, Math.min(160, count * 18))

    const nodePositions = parsedGraph.nodes.map((node, index) => {
      const angle = (2 * Math.PI * index) / count - Math.PI / 2
      return {
        node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    const pointByNode = new Map(nodePositions.map((item) => [item.node, item]))

    const edges = parsedGraph.edges.map((edge) => ({
      ...edge,
      fromPoint: pointByNode.get(edge.from),
      toPoint: pointByNode.get(edge.to),
    }))

    return { nodePositions, edges }
  }, [parsedGraph])

  const runSelectedAlgorithm = () => {
    if (parsedGraph.error) {
      setResult({ title: 'Lỗi dữ liệu', summary: [parsedGraph.error], order: [], edgeHighlights: [] })
      return
    }

    const nextResult = runAlgorithm({
      algorithm,
      nodes: parsedGraph.nodes,
      edges: parsedGraph.edges,
      startNode,
      directed,
    })

    setResult(
      nextResult.error
        ? { title: 'Không thể chạy thuật toán', summary: [nextResult.error], order: [], edgeHighlights: [] }
        : nextResult,
    )
  }

  const highlightedEdges = new Set(result.edgeHighlights ?? [])
  const orderedNodes = new Map((result.order ?? []).map((node, index) => [node, index]))

  return (
    <main className="app-layout">
      <aside className="panel panel-left">
        <h1>Graph Theory Lab</h1>
        <p className="muted">Mô phỏng thuật toán đồ thị trực quan cho sinh viên.</p>

        <label htmlFor="algorithm">Thuật toán</label>
        <select id="algorithm" value={algorithm} onChange={(event) => setAlgorithm(event.target.value)}>
          {algorithmOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label htmlFor="start-node">Đỉnh bắt đầu</label>
        <input
          id="start-node"
          value={startNode}
          onChange={(event) => setStartNode(event.target.value.trim())}
          placeholder="Ví dụ: A"
        />

        <div className="option-row">
          <label>
            <input
              type="checkbox"
              checked={directed}
              onChange={(event) => setDirected(event.target.checked)}
            />
            Có hướng
          </label>
          <label>
            <input
              type="checkbox"
              checked={weighted}
              onChange={(event) => setWeighted(event.target.checked)}
            />
            Có trọng số
          </label>
        </div>

        <label htmlFor="graph-input">Danh sách cạnh (mỗi dòng: u v w)</label>
        <textarea
          id="graph-input"
          value={graphInput}
          onChange={(event) => setGraphInput(event.target.value)}
          rows={10}
        />

        <div className="button-row">
          <button type="button" onClick={runSelectedAlgorithm}>
            Chạy thuật toán
          </button>
          <button type="button" className="button-ghost" onClick={() => setGraphInput(defaultInput)}>
            Mẫu
          </button>
          <button type="button" className="button-ghost" onClick={() => setGraphInput('')}>
            Xóa
          </button>
        </div>
      </aside>

      <section className="panel panel-center" aria-label="Graph visualization">
        <div className="canvas-header">
          <h2>Canvas trực quan</h2>
          <p className="muted">
            {parsedGraph.error
              ? parsedGraph.error
              : `${parsedGraph.nodes?.length ?? 0} đỉnh • ${parsedGraph.edges?.length ?? 0} cạnh`}
          </p>
        </div>

        <svg viewBox="0 0 560 440" role="img" aria-label="Graph drawing">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb" />
            </marker>
          </defs>

          {layout.edges.map((edge) => {
            if (!edge.fromPoint || !edge.toPoint) {
              return null
            }

            const isHighlighted = highlightedEdges.has(edge.id)
            const middleX = (edge.fromPoint.x + edge.toPoint.x) / 2
            const middleY = (edge.fromPoint.y + edge.toPoint.y) / 2

            return (
              <g key={edge.id}>
                <line
                  x1={edge.fromPoint.x}
                  y1={edge.fromPoint.y}
                  x2={edge.toPoint.x}
                  y2={edge.toPoint.y}
                  className={isHighlighted ? 'edge edge-highlight' : 'edge'}
                  markerEnd={directed ? 'url(#arrow)' : undefined}
                />
                {weighted ? (
                  <text x={middleX} y={middleY - 6} className="weight-label">
                    {edge.weight}
                  </text>
                ) : null}
              </g>
            )
          })}

          {layout.nodePositions.map((point) => {
            const orderIndex = orderedNodes.get(point.node)
            const isVisited = orderIndex !== undefined
            const isLeftPartition = result.partition?.left?.includes(point.node)
            const isRightPartition = result.partition?.right?.includes(point.node)

            let className = 'node'
            if (isLeftPartition) {
              className = 'node node-left'
            } else if (isRightPartition) {
              className = 'node node-right'
            } else if (isVisited) {
              className = 'node node-visited'
            }

            return (
              <g key={point.node} transform={`translate(${point.x}, ${point.y})`}>
                <circle r="20" className={className} />
                <text className="node-label" textAnchor="middle" dominantBaseline="middle">
                  {point.node}
                </text>
                {isVisited ? (
                  <text className="order-label" textAnchor="middle" y="36">
                    #{orderIndex + 1}
                  </text>
                ) : null}
              </g>
            )
          })}
        </svg>
      </section>

      <aside className="panel panel-right">
        <h2>Giải thích & kết quả</h2>
        <p className="muted">{algorithmExplanations[algorithm]}</p>

        <article className="result-card">
          <h3>{result.title}</h3>
          <ul>
            {(result.summary ?? []).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </article>
      </aside>
    </main>
  )
}

export default App
