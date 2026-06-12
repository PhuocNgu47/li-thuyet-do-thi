import { useState, useEffect } from 'react';
import { 
  graphToAdjacencyMatrix, 
  graphToAdjacencyList, 
  graphToEdgeList,
  parseAdjacencyMatrix,
  parseAdjacencyList,
  parseEdgeList
} from '../utils/graphHelpers';

/**
 * RightSidebar component - Information display and graph representations
 * Shows algorithm results, graph properties, and various graph representations
 */

// Translation dictionary
const t = {
  en: {
    visualizerConsole: "Visualizer Console",
    graphDatabase: "Graph Database",
    stepCommentary: "Step Commentary",
    noCommentary: "Start the visualization to view step explanations here.",
    queue: "Queue",
    stack: "Recursion Stack",
    sortedEdges: "Sorted Edges Pool",
    priorityQueue: "Priority Queue",
    empty: "Empty",
    distanceRelaxation: "Distance Relaxation Table",
    node: "Node",
    distance: "Distance",
    parent: "Parent",
    activityConsoleLogs: "Activity Console Logs",
    matrixEditor: "Adjacency Matrix Editor",
    listEditor: "Adjacency List Editor",
    edgeEditor: "Edge List Editor",
    matrixHelp: "Edit weights in matrix (values > 0). Row is source, col is target.",
    listHelp: "Format: Source: Target(Weight), Target(Weight)... Separated by commas.",
    edgeHelp: "Format: Source Target Weight. One edge per line.",
    syncMatrix: "Sync Matrix to Canvas",
    syncList: "Sync List to Canvas",
    syncEdge: "Sync Edge List to Canvas",
    step: "Step",
    matrixTab: "Matrix",
    listTab: "Adj List",
    edgeTab: "Edge List",
  },
  vi: {
    visualizerConsole: "Bộ mô phỏng thuật toán",
    graphDatabase: "Biểu diễn đồ thị",
    stepCommentary: "Giải thích chi tiết",
    noCommentary: "Nhấn nút Khởi chạy mô phỏng thuật toán để xem bình luận từng bước.",
    queue: "Hàng đợi (Queue)",
    stack: "Ngăn xếp đệ quy (Stack)",
    sortedEdges: "Cạnh đã sắp xếp",
    priorityQueue: "Hàng đợi ưu tiên (Priority Queue)",
    empty: "Trống",
    distanceRelaxation: "Bảng tối ưu khoảng cách (Relaxing)",
    node: "Đỉnh",
    distance: "Khoảng cách",
    parent: "Đỉnh cha",
    activityConsoleLogs: "Nhật ký hệ thống",
    matrixEditor: "Chỉnh sửa Ma trận kề",
    listEditor: "Chỉnh sửa Danh sách kề",
    edgeEditor: "Chỉnh sửa Danh sách cạnh",
    matrixHelp: "Chỉnh sửa các ô ma trận kề (trọng số > 0). Hàng biểu diễn nguồn, cột biểu diễn đích.",
    listHelp: "Định dạng: ĐỉnhNguồn: ĐỉnhĐích(TrọngSố), ĐỉnhĐích(TrọngSố)... Phân cách bởi dấu phẩy.",
    edgeHelp: "Định dạng: ĐỉnhĐầu ĐỉnhCuối TrọngSố. Mỗi dòng đại diện cho một cạnh.",
    syncMatrix: "Đồng bộ Ma trận kề",
    syncList: "Đồng bộ Danh sách kề",
    syncEdge: "Đồng bộ Danh sách cạnh",
    step: "Bước",
    matrixTab: "Ma trận kề",
    listTab: "Danh sách kề",
    edgeTab: "Danh sách cạnh",
  }
};

export default function RightSidebar({
  width,
  nodes,
  edges,
  isDirected,
  isWeighted,
  loadGraph,
  logs,
  addLog,
  
  // Visualizer states
  steps,
  currentStep,
  selectedAlgorithm,
  activeTab,
  setActiveTab,

  // Language
  language
}) {
  // Representation raw texts
  const [matrixText, setMatrixText] = useState('');
  const [listText, setListText] = useState('');
  const [edgeListText, setEdgeListText] = useState('');
  
  // Representation sub-tabs
  const [repSubTab, setRepSubTab] = useState('matrix'); // 'matrix', 'list', 'edge'

  // Translation lookup shortcut
  const text = t[language];

  // Update text representations when graph changes
  useEffect(() => {
    if (nodes.length > 0) {
      const mat = graphToAdjacencyMatrix(nodes, edges, isDirected);
      const lst = graphToAdjacencyList(nodes, edges, isDirected);
      const edg = graphToEdgeList(edges);

      setMatrixText(mat.text);
      setListText(lst.text);
      setEdgeListText(edg.text);
    } else {
      setMatrixText('');
      setListText('');
      setEdgeListText('');
    }
  }, [nodes, edges, isDirected]);

  // Apply manual text representation edits
  const handleApplyMatrix = () => {
    try {
      const parsed = parseAdjacencyMatrix(matrixText, isDirected, isWeighted);
      loadGraph({
        nodes: parsed.nodes,
        edges: parsed.edges,
        isDirected,
        isWeighted
      });
      addLog(language === 'vi' ? "Đồng bộ thành công Ma trận kề lên bản vẽ." : "Successfully parsed and synced Adjacency Matrix to canvas.");
    } catch (e) {
      addLog(language === 'vi' ? `Lỗi đọc ma trận: ${e.message}` : `Matrix parsing failed: ${e.message}`);
      alert(language === 'vi' ? `Biên dịch thất bại: ${e.message}` : `Parsing failed: ${e.message}`);
    }
  };

  const handleApplyList = () => {
    try {
      const parsed = parseAdjacencyList(listText, isDirected, isWeighted);
      loadGraph({
        nodes: parsed.nodes,
        edges: parsed.edges,
        isDirected,
        isWeighted
      });
      addLog(language === 'vi' ? "Đồng bộ thành công Danh sách kề lên bản vẽ." : "Successfully parsed and synced Adjacency List to canvas.");
    } catch (e) {
      addLog(language === 'vi' ? `Lỗi đọc danh sách kề: ${e.message}` : `Adjacency List parsing failed: ${e.message}`);
      alert(language === 'vi' ? `Biên dịch thất bại: ${e.message}` : `Parsing failed: ${e.message}`);
    }
  };

  const handleApplyEdgeList = () => {
    try {
      const parsed = parseEdgeList(edgeListText, isDirected, isWeighted);
      loadGraph({
        nodes: parsed.nodes,
        edges: parsed.edges,
        isDirected,
        isWeighted
      });
      addLog(language === 'vi' ? "Đồng bộ thành công Danh sách cạnh lên bản vẽ." : "Successfully parsed and synced Edge List to canvas.");
    } catch (e) {
      addLog(language === 'vi' ? `Lỗi đọc danh sách cạnh: ${e.message}` : `Edge List parsing failed: ${e.message}`);
      alert(language === 'vi' ? `Biên dịch thất bại: ${e.message}` : `Parsing failed: ${e.message}`);
    }
  };

  // Extract current step state
  const stepState = (currentStep >= 0 && steps[currentStep]) ? steps[currentStep] : null;

  return (
    <aside 
      style={{ width: width ? `${width}px` : '384px' }}
      className="shrink-0 flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-hidden select-none"
    >
      
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* Animated Gradient Tab Buttons                                        */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="relative flex bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/80">
        {/* Visualizer Tab */}
        <button
          onClick={() => setActiveTab('visualizer')}
          className={`relative flex-1 py-3.5 text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
            activeTab === 'visualizer'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {text.visualizerConsole}
          </span>
          {/* Animated gradient underline */}
          <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-500 ease-out ${
            activeTab === 'visualizer'
              ? 'w-4/5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
              : 'w-0 bg-transparent'
          }`} />
        </button>

        {/* Representations Tab */}
        <button
          onClick={() => setActiveTab('representations')}
          className={`relative flex-1 py-3.5 text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
            activeTab === 'representations'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            {text.graphDatabase}
          </span>
          {/* Animated gradient underline */}
          <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-500 ease-out ${
            activeTab === 'representations'
              ? 'w-4/5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
              : 'w-0 bg-transparent'
          }`} />
        </button>

        {/* Bottom separator line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200/80 dark:bg-slate-700/50" />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* Tab Content with smooth transitions                                  */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'visualizer' ? (
          /* ================================================================= */
          /* Tab: Visualizer Console & Logs                                    */
          /* ================================================================= */
          <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-4 animate-[fadeIn_0.3s_ease-out]">
            
            {/* ──────────────────────────────────────────────────────────────── */}
            {/* 1. Step Commentary — Card with gradient left border             */}
            {/* ──────────────────────────────────────────────────────────────── */}
            <div className={`relative rounded-xl overflow-hidden transition-all duration-500 ${
              stepState 
                ? 'bg-white dark:bg-slate-800/70 shadow-lg shadow-indigo-500/5 dark:shadow-indigo-500/10 ring-1 ring-slate-200/70 dark:ring-slate-700/50' 
                : 'bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60'
            }`}>
              {/* Gradient left border accent — visible when step is active */}
              {stepState && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-l-xl" />
              )}
              <div className={`p-4 ${stepState ? 'pl-5' : ''}`}>
                <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  {text.stepCommentary}
                </h2>
                {stepState ? (
                  <div className="flex flex-col gap-2.5">
                    <div className="inline-flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20">
                        {text.step} {currentStep + 1}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {selectedAlgorithm}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {/* Render bilingual description based on current language */}
                      {stepState.description[language]}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500 italic leading-relaxed">
                    {text.noCommentary}
                  </p>
                )}
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────────────── */}
            {/* 2. Dynamic Queue / Stack / Edge structure                       */}
            {/* ──────────────────────────────────────────────────────────────── */}
            {stepState && (
              <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl ring-1 ring-slate-200/70 dark:ring-slate-700/40 shadow-sm">
                <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="text-base">
                    {['DFS', 'Eulerian'].includes(selectedAlgorithm) ? '📚' : 
                     selectedAlgorithm === 'Kruskal' ? '🔗' : 
                     ['Prim', 'Dijkstra'].includes(selectedAlgorithm) ? '⚡' : '📬'}
                  </span>
                  {['DFS', 'Eulerian'].includes(selectedAlgorithm) ? text.stack : 
                   selectedAlgorithm === 'Kruskal' ? text.sortedEdges : 
                   ['Prim', 'Dijkstra'].includes(selectedAlgorithm) ? text.priorityQueue : text.queue}
                </h2>
                
                {stepState.queueStack && stepState.queueStack.length > 0 ? (
                  ['DFS', 'Eulerian'].includes(selectedAlgorithm) ? (
                    /* ── DFS / Eulerian Stack: Vertical blocks with "top" animated arrow ── */
                    <div className="relative flex flex-col-reverse gap-1.5 max-h-56 overflow-y-auto pt-1">
                      {stepState.queueStack.map((item, idx) => {
                        const isTop = idx === stepState.queueStack.length - 1;
                        return (
                          <div 
                            key={idx}
                            className="flex items-center gap-2 transition-all duration-300"
                            style={{
                              animation: 'fadeIn 0.3s ease-out forwards',
                              animationDelay: `${idx * 50}ms`,
                            }}
                          >
                            {/* Animated top indicator arrow */}
                            <div className={`w-5 flex items-center justify-center shrink-0 transition-all duration-300 ${isTop ? 'opacity-100' : 'opacity-0'}`}>
                              <span className="text-indigo-500 dark:text-indigo-400 text-sm animate-bounce font-bold">▶</span>
                            </div>
                            {/* Stack block */}
                            <div className={`flex-1 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-300 border ${
                              isTop
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 border-indigo-400/50 scale-[1.02]'
                                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span>
                                  {isTop 
                                    ? (language === 'vi' ? `📌 Đỉnh ngăn xếp: ${item}` : `📌 Stack Top: ${item}`) 
                                    : `${language === 'vi' ? 'Đỉnh' : 'Node'}: ${item}`}
                                </span>
                                {isTop && (
                                  <span className="text-[10px] font-semibold opacity-70 uppercase tracking-wider">TOP</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* ── BFS Queue / Others: Horizontal capsule pills ── */
                    <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto">
                      {stepState.queueStack.map((item, idx) => {
                        const isFront = idx === 0 && selectedAlgorithm === 'BFS';
                        return (
                          <div 
                            key={idx}
                            className={`relative px-3.5 py-2 rounded-full text-xs font-mono font-bold transition-all duration-300 ${
                              isFront
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/40'
                                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 ring-1 ring-slate-200/80 dark:ring-slate-600/40 hover:ring-indigo-300 dark:hover:ring-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                            style={{
                              animation: 'fadeIn 0.3s ease-out forwards',
                              animationDelay: `${idx * 40}ms`,
                            }}
                          >
                            {/* Pulsing glow ring for front item */}
                            {isFront && (
                              <span className="absolute inset-0 rounded-full animate-ping bg-amber-400/30 pointer-events-none" />
                            )}
                            <span className="relative z-10">
                              {isFront ? `Front ➔ ${item}` : item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500 italic flex items-center gap-1.5">
                    <span className="text-base">📭</span> {text.empty}
                  </p>
                )}
              </div>
            )}

            {/* ──────────────────────────────────────────────────────────────── */}
            {/* 3. Dijkstra Distance Relaxation Table                           */}
            {/* ──────────────────────────────────────────────────────────────── */}
            {stepState && selectedAlgorithm === 'Dijkstra' && stepState.distances && (
              <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl ring-1 ring-slate-200/70 dark:ring-slate-700/40 shadow-sm overflow-hidden">
                <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="text-base">📊</span>
                  {text.distanceRelaxation}
                </h2>
                <div className="overflow-x-auto rounded-lg ring-1 ring-slate-200/60 dark:ring-slate-700/40">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/80">
                        <th className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-bold text-[11px] uppercase tracking-wider border-b-2 border-indigo-500/30">{text.node}</th>
                        <th className="py-2.5 px-3 text-center text-slate-500 dark:text-slate-400 font-bold text-[11px] uppercase tracking-wider border-b-2 border-indigo-500/30">{text.distance}</th>
                        <th className="py-2.5 px-3 text-right text-slate-500 dark:text-slate-400 font-bold text-[11px] uppercase tracking-wider border-b-2 border-indigo-500/30">{text.parent}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nodes.map((n, rowIdx) => {
                        const distVal = stepState.distances[n.id];
                        const isVisited = stepState.visited.includes(n.id);
                        const isCurrentlyRelaxing = stepState.currentNode === n.id;
                        return (
                          <tr 
                            key={n.id} 
                            className={`border-b border-slate-100 dark:border-slate-700/40 transition-all duration-300 ${
                              isCurrentlyRelaxing
                                ? 'bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-500/10 dark:via-yellow-500/10 dark:to-orange-500/10'
                                : isVisited 
                                  ? 'bg-emerald-50/70 dark:bg-emerald-500/5' 
                                  : rowIdx % 2 === 0
                                    ? 'bg-white dark:bg-transparent'
                                    : 'bg-slate-50/50 dark:bg-slate-800/30'
                            }`}
                          >
                            <td className={`py-2 px-3 font-sans transition-all duration-300 ${
                              isVisited ? 'font-extrabold text-emerald-600 dark:text-emerald-400' : 'font-semibold text-slate-700 dark:text-slate-300'
                            }`}>
                              <span className="flex items-center gap-1.5">
                                {isVisited && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                {isCurrentlyRelaxing && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                {n.id}
                              </span>
                            </td>
                            <td className={`py-2 px-3 text-center transition-all duration-300 ${
                              isVisited ? 'font-extrabold text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              {distVal === Infinity 
                                ? <span className="text-base font-serif text-slate-300 dark:text-slate-600 select-none">∞</span>
                                : <span className={`${isCurrentlyRelaxing ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}>{distVal}</span>
                              }
                            </td>
                            <td className={`py-2 px-3 text-right transition-all duration-300 ${
                              isVisited ? 'font-extrabold text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              {stepState.parent && stepState.parent[n.id] ? stepState.parent[n.id] : <span className="text-slate-300 dark:text-slate-600">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ──────────────────────────────────────────────────────────────── */}
            {/* 4. Activity Console Logs — Terminal Style                       */}
            {/* ──────────────────────────────────────────────────────────────── */}
            <div className="flex-1 min-h-[180px] flex flex-col rounded-xl overflow-hidden ring-1 ring-slate-800/80 shadow-xl shadow-slate-950/20">
              {/* Mock terminal header bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 dark:bg-slate-800/90 border-b border-slate-700/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm shadow-rose-500/30" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/90 shadow-sm shadow-amber-400/30" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm shadow-emerald-500/30" />
                </div>
                <h2 className="flex-1 text-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono">
                  {text.activityConsoleLogs}
                </h2>
                <div className="w-[54px]" /> {/* Spacer to balance the dots */}
              </div>
              {/* Terminal body with scanline overlay */}
              <div className="relative flex-1 bg-slate-950 dark:bg-slate-950/90 p-4 overflow-hidden">
                {/* Subtle scanline effect */}
                <div 
                  className="pointer-events-none absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)',
                  }}
                />
                {/* CRT glow overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-500/[0.02] to-transparent" />
                
                <div className="relative z-10 h-full overflow-y-auto flex flex-col gap-0.5 pr-1 font-mono text-[11px] leading-relaxed">
                  {logs.map((log, index) => {
                    let logColor = "text-emerald-400/70";
                    let prefix = "$";
                    if (log.includes("Error") || log.includes("Lỗi")) {
                      logColor = "text-rose-400 font-semibold";
                      prefix = "✗";
                    }
                    else if (log.includes("Success") || log.includes("thành công") || log.includes("kết thúc") || log.includes("hoàn thành")) {
                      logColor = "text-emerald-400 font-semibold";
                      prefix = "✓";
                    }
                    else if (log.includes("Added") || log.includes("thêm") || log.includes("Đã")) {
                      logColor = "text-indigo-400";
                      prefix = "›";
                    }
                    
                    return (
                      <div 
                        key={index} 
                        className={`flex items-start gap-2 py-0.5 border-b border-slate-800/30 hover:bg-white/[0.02] transition-colors ${logColor}`}
                      >
                        <span className="shrink-0 opacity-50 select-none">{prefix}</span>
                        <span className="break-all">{log}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* ================================================================= */
          /* Tab: Graph Database Representations (Matrix, List, Edge List)     */
          /* ================================================================= */
          <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4 animate-[fadeIn_0.3s_ease-out]">
            
            {/* Sub-tabs — Segmented control with pill indicators */}
            <div className="flex bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-xl ring-1 ring-slate-200/50 dark:ring-slate-700/30">
              {[
                { key: 'matrix', label: text.matrixTab, icon: '▦' },
                { key: 'list', label: text.listTab, icon: '☰' },
                { key: 'edge', label: text.edgeTab, icon: '⟋' },
              ].map(tab => (
                <button 
                  key={tab.key}
                  onClick={() => setRepSubTab(tab.key)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-1 ${
                    repSubTab === tab.key 
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md shadow-slate-200/50 dark:shadow-slate-900/50 ring-1 ring-slate-200/50 dark:ring-slate-600/30' 
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <span className="text-[10px] opacity-70">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Representation Editor Box */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-800/40 p-4 rounded-xl ring-1 ring-slate-200/60 dark:ring-slate-700/40 shadow-sm overflow-hidden">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-gradient-to-br from-indigo-500 to-purple-500" />
                {repSubTab === 'matrix' ? text.matrixEditor :
                 repSubTab === 'list' ? text.listEditor : text.edgeEditor}
              </h3>
              
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border-l-2 border-indigo-500/30">
                {repSubTab === 'matrix' ? text.matrixHelp :
                 repSubTab === 'list' ? text.listHelp : text.edgeHelp}
              </p>

              {repSubTab === 'matrix' && (
                <div className="flex-grow flex flex-col gap-3">
                  {/* LIVE VISUAL MATRIX GRID */}
                  {(() => {
                    if (nodes.length === 0 || nodes.length > 12) return null;
                    const matrixSize = nodes.length;
                    const visualMatrix = Array(matrixSize).fill(null).map(() => Array(matrixSize).fill(0));
                    const nodeIndices = {};
                    nodes.forEach((n, i) => { nodeIndices[n.id] = i; });
                    edges.forEach(e => {
                      const u = nodeIndices[e.source];
                      const v = nodeIndices[e.target];
                      if (u !== undefined && v !== undefined) {
                        visualMatrix[u][v] = e.weight || 1;
                        if (!isDirected) visualMatrix[v][u] = e.weight || 1;
                      }
                    });
                    const activeCellIndices = new Set();
                    if (stepState && stepState.activeEdges) {
                      stepState.activeEdges.forEach(edgeId => {
                        const edge = edges.find(e => e.id === edgeId);
                        if (edge) {
                          const u = nodeIndices[edge.source];
                          const v = nodeIndices[edge.target];
                          if (u !== undefined && v !== undefined) {
                            activeCellIndices.add(`${u}-${v}`);
                            if (!isDirected) activeCellIndices.add(`${v}-${u}`);
                          }
                        }
                      });
                    }
                    return (
                      <div className="flex flex-col items-center overflow-x-auto bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl ring-1 ring-slate-200/50 dark:ring-slate-700/50">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          {language === 'vi' ? 'Lưới ma trận hoạt động trực tiếp' : 'Live Activity Matrix Grid'}
                        </div>
                        <table className="border-collapse text-xs font-mono">
                          <thead>
                            <tr>
                              <th className="p-1"></th>
                              {nodes.map((n, i) => {
                                const isNodeActive = stepState && (stepState.currentNode === n.id || (stepState.activeNodes && stepState.activeNodes.includes(n.id)));
                                const isNodeVisited = stepState && stepState.visited && stepState.visited.includes(n.id);
                                return (
                                  <th key={`h-${i}`} className={`w-7 h-7 text-center font-bold border-b-2 border-slate-300 dark:border-slate-600 transition-colors duration-300 ${isNodeActive ? 'text-indigo-500' : isNodeVisited ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {n.id}
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {nodes.map((rowNode, rIdx) => {
                              const isRowActive = stepState && (stepState.currentNode === rowNode.id || (stepState.activeNodes && stepState.activeNodes.includes(rowNode.id)));
                              const isRowVisited = stepState && stepState.visited && stepState.visited.includes(rowNode.id);
                              return (
                                <tr key={`r-${rIdx}`}>
                                  <th className={`w-7 h-7 text-center font-bold border-r-2 border-slate-300 dark:border-slate-600 pr-1.5 transition-colors duration-300 ${isRowActive ? 'text-indigo-500' : isRowVisited ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {rowNode.id}
                                  </th>
                                  {visualMatrix[rIdx].map((val, cIdx) => {
                                    const isCellActive = activeCellIndices.has(`${rIdx}-${cIdx}`);
                                    return (
                                      <td key={`c-${rIdx}-${cIdx}`} className={`w-7 h-7 text-center border border-slate-200 dark:border-slate-700/80 transition-all duration-300 ${
                                        isCellActive 
                                          ? 'bg-amber-400 text-slate-900 font-bold scale-110 shadow-md shadow-amber-400/40 z-10 relative rounded-sm ring-1 ring-amber-500' 
                                          : val !== 0 
                                            ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold' 
                                            : 'text-slate-300 dark:text-slate-600 bg-white dark:bg-slate-800'
                                      }`}>
                                        {val}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}

                  <div className="relative flex-1 rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700/50">
                    {/* Line number gutter visual */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-100/80 dark:bg-slate-800/60 border-r border-slate-200/50 dark:border-slate-700/40 pointer-events-none" />
                    <textarea
                      value={matrixText}
                      onChange={(e) => setMatrixText(e.target.value)}
                      className="w-full h-full p-3 pl-10 font-mono text-xs bg-white dark:bg-slate-900/60 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 leading-[1.8] text-slate-700 dark:text-slate-300 transition-all"
                      rows={10}
                      spellCheck={false}
                    />
                  </div>
                  <button
                    onClick={handleApplyMatrix}
                    className="py-2.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]"
                  >
                    {text.syncMatrix}
                  </button>
                </div>
              )}

              {repSubTab === 'list' && (
                <div className="flex-grow flex flex-col gap-3">
                  <div className="relative flex-1 rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700/50">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-100/80 dark:bg-slate-800/60 border-r border-slate-200/50 dark:border-slate-700/40 pointer-events-none" />
                    <textarea
                      value={listText}
                      onChange={(e) => setListText(e.target.value)}
                      className="w-full h-full p-3 pl-10 font-mono text-xs bg-white dark:bg-slate-900/60 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 leading-[1.8] text-slate-700 dark:text-slate-300 transition-all"
                      rows={10}
                      spellCheck={false}
                    />
                  </div>
                  <button
                    onClick={handleApplyList}
                    className="py-2.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]"
                  >
                    {text.syncList}
                  </button>
                </div>
              )}

              {repSubTab === 'edge' && (
                <div className="flex-grow flex flex-col gap-3">
                  <div className="relative flex-1 rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700/50">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-100/80 dark:bg-slate-800/60 border-r border-slate-200/50 dark:border-slate-700/40 pointer-events-none" />
                    <textarea
                      value={edgeListText}
                      onChange={(e) => setEdgeListText(e.target.value)}
                      className="w-full h-full p-3 pl-10 font-mono text-xs bg-white dark:bg-slate-900/60 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 leading-[1.8] text-slate-700 dark:text-slate-300 transition-all"
                      rows={10}
                      spellCheck={false}
                    />
                  </div>
                  <button
                    onClick={handleApplyEdgeList}
                    className="py-2.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]"
                  >
                    {text.syncEdge}
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Global animation keyframes via inline style */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </aside>
  );
}
