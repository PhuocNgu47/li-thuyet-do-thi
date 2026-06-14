import { useState } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Trash2, Plus, 
  Download, Upload, Shuffle, ToggleLeft, ToggleRight, Moon, Sun
} from 'lucide-react';
import { 
  bipartiteSample, directedSample, undirectedSample,
  gpsScenario, networkScenario, socialScenario, matchingScenario,
  flightScenario, mazeScenario,
  oneStrokeScenario, garbageTruckScenario, cncRoutingScenario,
  maxFlowScenario, fleuryScenario
} from '../data/sampleGraphs';

/**
 * LeftSidebar component - Control panel for graph manipulation and algorithm execution
 * Provides graph creation, algorithm selection, and visualization controls
 */

// Localization text dictionary
const t = {
  en: {
    canvasSettings: "Canvas Settings",
    directed: "Directed Graph",
    weighted: "Weighted Edges",
    clearGraph: "Clear Graph",
    resetSample: "Reset Sample",
    graphEditor: "Graph Editor",
    nodePlaceholder: "Node Name (e.g. G)",
    addNode: "Add Node",
    addEdge: "Add Edge",
    sourcePlaceholder: "Source",
    targetPlaceholder: "Target",
    weightLabel: "Weight:",
    presets: "Presets (Abstract)",
    directedSample: "📈 Directed Weighted (6 Nodes)",
    undirectedSample: "📉 Undirected Weighted (MST)",
    bipartiteSample: "☯️ Bipartite 2-Coloring (6 Nodes)",
    scenarios: "Real-World Applications",
    demoRoadmap: "Quick Demo Roadmap",
    demoRoadmapHint: "Use these presets to present the core requirements in a few clicks.",
    coreChecklist: "Requirement Checklist",
    gpsScenario: "🗺️ GPS Driving Router (Dijkstra)",
    networkScenario: "⚡ Campus Fiber Cabling (MST)",
    socialScenario: "👥 Social Network Graph (BFS)",
    matchingScenario: "💼 Job Match Bipartite Check",
    flightScenario: "✈️ Flight Route Network (Dijkstra)",
    mazeScenario: "🎮 Maze Pathfinding (BFS/DFS)",
    oneStrokeScenario: "✍️ One-Stroke Game (Eulerian)",
    garbageTruckScenario: "🚛 Garbage Truck Route (Eulerian)",
    cncRoutingScenario: "🖨️ CNC/PCB Routing (Eulerian)",
    maxFlowScenario: "🌊 Water Pipeline (Ford-Fulkerson)",
    fleuryScenario: "🌉 Bridge Walking (Fleury)",
    randomGen: "Random Graph Generator",
    nodes: "Nodes",
    density: "Edge Density",
    generate: "Generate Graph",
    algConfig: "Algorithm Config",
    startNode: "Start Node:",
    animationCtrl: "Animation Controller",
    delay: "Delay:",
    startVis: "Start Visualization",
    saveJson: "Save JSON",
    loadJson: "Load JSON",
    step: "Step",
    loopsError: "Loops are not allowed.",
    source: "Source",
    target: "Target"
  },
  vi: {
    canvasSettings: "Cấu hình đồ thị",
    directed: "Đồ thị có hướng",
    weighted: "Cạnh có trọng số",
    clearGraph: "Xóa đồ thị",
    resetSample: "Đặt lại mẫu",
    graphEditor: "Công cụ chỉnh sửa",
    nodePlaceholder: "Tên đỉnh (ví dụ: G)",
    addNode: "Thêm Đỉnh",
    addEdge: "Thêm Cạnh",
    sourcePlaceholder: "Nguồn",
    targetPlaceholder: "Đích",
    weightLabel: "Trọng số:",
    presets: "Các mẫu cơ bản",
    directedSample: "📈 Đồ thị có hướng (6 Đỉnh)",
    undirectedSample: "📉 Đồ thị vô hướng (Tìm cây khung)",
    bipartiteSample: "☯️ Đồ thị phân đôi (Tô 2 màu)",
    scenarios: "Ứng dụng thực tế",
    demoRoadmap: "Lộ trình demo nhanh",
    demoRoadmapHint: "Dùng các mẫu này để trình bày yêu cầu chính chỉ với vài lần bấm.",
    coreChecklist: "Checklist yêu cầu",
    gpsScenario: "🗺️ Bản đồ dẫn đường GPS (Dijkstra)",
    networkScenario: "⚡ Lắp đặt mạng cáp quang (MST)",
    socialScenario: "👥 Mạng xã hội bạn bè (BFS)",
    matchingScenario: "💼 Phân cặp Tuyển dụng (Phân đôi)",
    flightScenario: "✈️ Săn vé máy bay (Dijkstra)",
    mazeScenario: "🎮 Giải cứu Mê cung (BFS/DFS)",
    oneStrokeScenario: "✍️ Trò chơi vẽ 1 nét (Euler)",
    garbageTruckScenario: "🚛 Lộ trình Xe rác (Euler)",
    cncRoutingScenario: "🖨️ Mạch in CNC/PCB (Euler)",
    maxFlowScenario: "🌊 Mạng ống nước (Ford-Fulkerson)",
    fleuryScenario: "🌉 Dạo qua cầu (Fleury)",
    randomGen: "Tạo đồ thị ngẫu nhiên",
    nodes: "Số đỉnh",
    density: "Mật độ cạnh",
    generate: "Tạo đồ thị mới",
    algConfig: "Chọn thuật toán",
    startNode: "Đỉnh xuất phát:",
    animationCtrl: "Điều khiển mô phỏng",
    delay: "Độ trễ:",
    startVis: "Bắt đầu mô phỏng",
    saveJson: "Lưu file JSON",
    loadJson: "Tải file JSON",
    step: "Bước",
    loopsError: "Khuyên không được phép tự nối.",
    source: "Đỉnh đầu",
    target: "Đỉnh cuối"
  }
};

// Algorithm descriptions for the selector badge tooltips
const algorithmDescriptions = {
  vi: {
    BFS: 'Duyệt theo chiều rộng — khám phá tất cả đỉnh kề trước khi đi sâu hơn',
    DFS: 'Duyệt theo chiều sâu — đi sâu nhất có thể trước khi quay lui',
    Dijkstra: 'Tìm đường đi ngắn nhất từ đỉnh nguồn đến mọi đỉnh khác',
    Prim: 'Xây dựng cây khung nhỏ nhất bằng cách chọn cạnh nhỏ nhất liền kề',
    Kruskal: 'Xây dựng cây khung nhỏ nhất bằng cách sắp xếp và chọn cạnh',
    Bipartite: 'Kiểm tra đồ thị có thể tô bằng 2 màu hay không',
    Eulerian: 'Tìm đường đi Euler bằng Hierholzer (vẽ một nét liên tục)',
    FordFulkerson: 'Tìm luồng cực đại trong mạng bằng Edmonds-Karp (BFS)',
    Fleury: 'Tìm đường đi Euler bằng Fleury (tránh cạnh cầu)'
  },
  en: {
    BFS: 'Explores all neighbors at the current depth before moving deeper',
    DFS: 'Explores as far as possible along each branch before backtracking',
    Dijkstra: 'Finds shortest paths from a source vertex to all other vertices',
    Prim: 'Builds MST by greedily picking the minimum adjacent edge',
    Kruskal: 'Builds MST by sorting edges and adding them without cycles',
    Bipartite: 'Checks if the graph can be colored with exactly 2 colors',
    Eulerian: 'Finds Eulerian path/circuit using Hierholzer\'s algorithm',
    FordFulkerson: 'Finds maximum flow using Edmonds-Karp (BFS augmenting paths)',
    Fleury: 'Finds Eulerian path by avoiding bridge edges at each step'
  }
};

// Algorithm icon badges
const algorithmBadges = {
  BFS: '🔍',
  DFS: '🌲',
  Dijkstra: '🛤️',
  Prim: '🌿',
  Kruskal: '🔗',
  Bipartite: '🎨',
  Eulerian: '✍️',
  FordFulkerson: '🌊',
  Fleury: '🎯'
};

/* ─── Collapsible Section Component ─── */
function SidebarSection({ title, defaultOpen = true, accentFrom, accentTo, tintClass, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`flex flex-col rounded-2xl border border-slate-100 dark:border-slate-800/60 overflow-hidden transition-all duration-300 ${tintClass || 'bg-slate-50 dark:bg-slate-900/40'}`}>
      {/* Gradient accent bar */}
      <div className={`h-0.5 bg-gradient-to-r ${accentFrom || 'from-indigo-500'} ${accentTo || 'to-purple-500'}`} />

      {/* Clickable header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer group select-none"
      >
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
          {title}
        </h2>
        <span
          className={`text-slate-400 text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        >
          ▾
        </span>
      </button>

      {/* Collapsible body */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-3.5 pb-3.5 flex flex-col gap-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function LeftSidebar({
  width,
  nodes,
  edges,
  isDirected,
  isWeighted,
  setIsDirected,
  setIsWeighted,
  selectedAlgorithm,
  setSelectedAlgorithm,
  startNode,
  setStartNode,
  addNode,
  addEdge,
  clearGraph,
  loadGraph,
  generateRandom,
  
  // Visualizer states
  steps,
  currentStep,
  isPlaying,
  animationSpeed,
  setAnimationSpeed,
  runAlgorithm,
  stopAlgorithm,
  stepForward,
  stepBackward,
  togglePlay,

  // Theme states
  darkMode,
  setDarkMode,

  // Language
  language,
  setLanguage,

  // Ford-Fulkerson sink node
  sinkNode,
  setSinkNode
}) {
  // Input states
  const [nodeName, setNodeName] = useState('');
  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');
  const [edgeWeight, setEdgeWeight] = useState(1);
  
  // Randomizer states
  const [randomNodeCount, setRandomNodeCount] = useState(6);
  const [randomDensity, setRandomDensity] = useState(0.4);

  // Translation shortcut
  const text = t[language];

  // Form handlers
  const handleAddNode = (e) => {
    e.preventDefault();
    if (addNode(nodeName)) {
      setNodeName('');
    }
  };

  const handleAddEdge = (e) => {
    e.preventDefault();
    if (addEdge(edgeSource, edgeTarget, isWeighted ? edgeWeight : 1)) {
      setEdgeSource('');
      setEdgeTarget('');
      setEdgeWeight(1);
    }
  };

  const handleRandomize = () => {
    generateRandom(randomNodeCount, randomDensity);
  };

  const exportGraphJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        isDirected,
        isWeighted,
        nodes,
        edges
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `graph_${selectedAlgorithm.toLowerCase()}_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importGraphJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed && Array.isArray(parsed.nodes)) {
            loadGraph(parsed);
          } else {
            alert(language === 'vi' ? "Cấu trúc tệp không hợp lệ. Phải chứa đỉnh và cạnh." : "Invalid file format. Must contain nodes and edges.");
          }
        } catch (err) {
          alert(language === 'vi' ? "Lỗi khi đọc tệp JSON." : "Error parsing JSON file.");
        }
      };
    }
  };

  const needsStartNode = ['BFS', 'DFS', 'Dijkstra', 'Prim', 'FordFulkerson', 'Fleury', 'Eulerian'].includes(selectedAlgorithm);
  const needsSinkNode = selectedAlgorithm === 'FordFulkerson';
  const progressPercent = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <aside 
      style={{ width: width ? `${width}px` : '320px', maxWidth: '85vw' }}
      className="shrink-0 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden select-none relative"
    >
      {/* Gradient right border */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-indigo-400 via-purple-500 to-pink-400 opacity-40 dark:opacity-30" />

      {/* ─── Brand Header ─── */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent leading-tight tracking-tight">
            GraphTheory
          </h1>
          {/* Animated gradient underline */}
          <div className="mt-1 h-0.5 w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse opacity-60" />
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'vi' ? 'Mô Phỏng Thuật Toán Đồ Thị' : 'Algorithm Visualizer v1.0'}
          </span>
        </div>
        
        {/* Language & Theme switches */}
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 hover:from-indigo-50 hover:to-indigo-100 dark:from-slate-800 dark:to-slate-700 dark:hover:from-indigo-950 dark:hover:to-indigo-900 text-slate-700 dark:text-slate-200 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm"
            title="Switch Language / Thay đổi ngôn ngữ"
          >
            {language === 'en' ? '🇻🇳 VI' : '🇺🇸 EN'}
          </button>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 hover:from-amber-50 hover:to-amber-100 dark:from-slate-800 dark:to-slate-700 dark:hover:from-indigo-950 dark:hover:to-indigo-900 text-slate-700 dark:text-slate-200 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm"
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {/* ─── Scrollable Content ─── */}
      <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto scroll-smooth min-h-0">
        
        {/* ═══ Canvas Settings ═══ */}
        <SidebarSection
          title={text.canvasSettings}
          accentFrom="from-indigo-500"
          accentTo="to-blue-500"
          tintClass="bg-blue-50/40 dark:bg-blue-950/10"
        >
          <div className="flex items-center justify-between text-sm py-1">
            <span className="text-slate-600 dark:text-slate-300">{text.directed}</span>
            <button 
              onClick={() => {
                setIsDirected(!isDirected);
                stopAlgorithm();
              }}
              className="text-indigo-500 hover:text-indigo-600 focus:outline-none cursor-pointer transition-transform duration-200 hover:scale-110"
            >
              {isDirected ? <ToggleRight size={38} className="text-indigo-500" /> : <ToggleLeft size={38} className="text-slate-400" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm py-1">
            <span className="text-slate-600 dark:text-slate-300">{text.weighted}</span>
            <button 
              onClick={() => {
                setIsWeighted(!isWeighted);
                stopAlgorithm();
              }}
              className="text-indigo-500 hover:text-indigo-600 focus:outline-none cursor-pointer transition-transform duration-200 hover:scale-110"
            >
              {isWeighted ? <ToggleRight size={38} className="text-indigo-500" /> : <ToggleLeft size={38} className="text-slate-400" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button 
              onClick={clearGraph}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 bg-gradient-to-br from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 dark:from-rose-950/30 dark:to-red-950/30 dark:hover:from-rose-950/50 dark:hover:to-red-950/50 rounded-lg transition-all duration-200 cursor-pointer border border-rose-100/50 dark:border-rose-900/20 hover:scale-105 hover:shadow-sm"
            >
              <Trash2 size={13} />
              {text.clearGraph}
            </button>
            <button 
              onClick={() => loadGraph(isDirected ? directedSample : undirectedSample)}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-gradient-to-br from-slate-100 to-slate-150 hover:from-slate-200 hover:to-slate-250 dark:text-slate-200 dark:from-slate-800 dark:to-slate-750 dark:hover:from-slate-700 dark:hover:to-slate-650 rounded-lg transition-all duration-200 cursor-pointer border border-slate-200/20 hover:scale-105 hover:shadow-sm"
            >
              {text.resetSample}
            </button>
          </div>
        </SidebarSection>

        {/* ═══ Real-World Scenarios ═══ */}
        <SidebarSection
          title={text.scenarios}
          defaultOpen={false}
          accentFrom="from-emerald-400"
          accentTo="to-teal-500"
          tintClass="bg-emerald-50/30 dark:bg-emerald-950/10"
        >
          <div className="grid grid-cols-1 gap-1.5">
            <button 
              onClick={() => {
                loadGraph(gpsScenario);
                setSelectedAlgorithm('Dijkstra');
                setStartNode('HN');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/50"
            >
              {text.gpsScenario}
            </button>
            <button 
              onClick={() => {
                loadGraph(networkScenario);
                setSelectedAlgorithm('Prim');
                setStartNode('ADMIN');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/50"
            >
              {text.networkScenario}
            </button>
            <button 
              onClick={() => {
                loadGraph(socialScenario);
                setSelectedAlgorithm('BFS');
                setStartNode('AN');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/50"
            >
              {text.socialScenario}
            </button>
            <button 
              onClick={() => {
                loadGraph(matchingScenario);
                setSelectedAlgorithm('Bipartite');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/50"
            >
              {text.matchingScenario}
            </button>
            <button 
              onClick={() => {
                loadGraph(flightScenario);
                setSelectedAlgorithm('Dijkstra');
                setStartNode('SGN');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/50"
            >
              {text.flightScenario}
            </button>
            <button 
              onClick={() => {
                loadGraph(mazeScenario);
                setSelectedAlgorithm('BFS');
                setStartNode('START');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/50"
            >
              {text.mazeScenario}
            </button>
            <button 
              onClick={() => {
                loadGraph(oneStrokeScenario);
                setSelectedAlgorithm('Eulerian');
                setStartNode('D');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/50"
            >
              {text.oneStrokeScenario}
            </button>
            <button 
              onClick={() => {
                loadGraph(garbageTruckScenario);
                setSelectedAlgorithm('Eulerian');
                setStartNode('N1');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/50"
            >
              {text.garbageTruckScenario}
            </button>
            <button 
              onClick={() => {
                loadGraph(cncRoutingScenario);
                setSelectedAlgorithm('Eulerian');
                setStartNode('P1');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/50"
            >
              {text.cncRoutingScenario}
            </button>
            <button 
              onClick={() => {
                loadGraph(maxFlowScenario);
                setSelectedAlgorithm('FordFulkerson');
                setStartNode('S');
                setSinkNode('T');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/50"
            >
              {text.maxFlowScenario}
            </button>
            <button 
              onClick={() => {
                loadGraph(fleuryScenario);
                setSelectedAlgorithm('Fleury');
                setStartNode('A');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/50"
            >
              {text.fleuryScenario}
            </button>
          </div>
        </SidebarSection>

        {/* ═══ Quick Demo Roadmap ═══ */}
        <SidebarSection
          title={text.demoRoadmap}
          defaultOpen={false}
          accentFrom="from-sky-400"
          accentTo="to-cyan-500"
          tintClass="bg-sky-50/30 dark:bg-sky-950/10"
        >
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-white/80 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 rounded-xl p-2.5">
            {text.demoRoadmapHint}
          </p>

          <div className="grid grid-cols-1 gap-1.5">
            <button
              onClick={() => {
                loadGraph(directedSample);
                setSelectedAlgorithm('BFS');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-sky-50 dark:hover:bg-sky-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-sm hover:border-sky-200 dark:hover:border-sky-800/50"
            >
              1. {language === 'vi' ? 'Vẽ đồ thị mẫu để giới thiệu giao diện' : 'Show a sample graph to introduce the UI'}
            </button>
            <button
              onClick={() => {
                loadGraph(gpsScenario);
                setSelectedAlgorithm('Dijkstra');
                setStartNode('HN');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-sky-50 dark:hover:bg-sky-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-sm hover:border-sky-200 dark:hover:border-sky-800/50"
            >
              2. {language === 'vi' ? 'Lưu đồ thị + mô phỏng đường đi ngắn nhất' : 'Save graph + demo shortest path'}
            </button>
            <button
              onClick={() => {
                loadGraph(socialScenario);
                setSelectedAlgorithm('BFS');
                setStartNode('AN');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-sky-50 dark:hover:bg-sky-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-sm hover:border-sky-200 dark:hover:border-sky-800/50"
            >
              3. {language === 'vi' ? 'BFS / DFS để giải thích cách duyệt' : 'Use BFS / DFS to explain traversal'}
            </button>
            <button
              onClick={() => {
                loadGraph(bipartiteSample);
                setSelectedAlgorithm('Bipartite');
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-sky-50 dark:hover:bg-sky-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-sm hover:border-sky-200 dark:hover:border-sky-800/50"
            >
              4. {language === 'vi' ? 'Kiểm tra đồ thị hai phía và biểu diễn đồ thị' : 'Check bipartite and graph representations'}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              '1. Vẽ',
              '2. Lưu',
              '3. Dijkstra',
              '4. BFS/DFS',
              '5. Bipartite',
              '6. Biểu diễn',
              '7. Prim/Kruskal',
              '8. Ford-Fulkerson',
              '9. Fleury/Hierholzer'
            ].map((chip) => (
              <span key={chip} className="px-2 py-1 rounded-full text-[10px] font-semibold bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900/40">
                {chip}
              </span>
            ))}
          </div>
        </SidebarSection>

        {/* ═══ Presets ═══ */}
        <SidebarSection
          title={text.presets}
          defaultOpen={false}
          accentFrom="from-amber-400"
          accentTo="to-orange-500"
          tintClass="bg-amber-50/30 dark:bg-amber-950/10"
        >
          <div className="grid grid-cols-1 gap-1.5">
            <button 
              onClick={() => loadGraph(directedSample)}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-amber-50 dark:hover:bg-amber-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:border-amber-200 dark:hover:border-amber-800/50"
            >
              {text.directedSample}
            </button>
            <button 
              onClick={() => loadGraph(undirectedSample)}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-amber-50 dark:hover:bg-amber-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:border-amber-200 dark:hover:border-amber-800/50"
            >
              {text.undirectedSample}
            </button>
            <button 
              onClick={() => loadGraph(bipartiteSample)}
              className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-slate-950 hover:bg-amber-50 dark:hover:bg-amber-950/20 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm hover:border-amber-200 dark:hover:border-amber-800/50"
            >
              {text.bipartiteSample}
            </button>
          </div>
        </SidebarSection>

        {/* ═══ Graph Editor ═══ */}
        <SidebarSection
          title={text.graphEditor}
          accentFrom="from-violet-500"
          accentTo="to-fuchsia-500"
          tintClass="bg-violet-50/30 dark:bg-violet-950/10"
        >
          <form onSubmit={handleAddNode} className="flex gap-2">
            <input 
              type="text"
              placeholder={text.nodePlaceholder}
              maxLength={15}
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all duration-200"
            />
            <button 
              type="submit"
              className="px-3 py-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md shadow-sm"
              title={text.addNode}
            >
              <Plus size={16} />
            </button>
          </form>

          <form onSubmit={handleAddEdge} className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <select
                value={edgeSource}
                onChange={(e) => setEdgeSource(e.target.value)}
                className="px-2 py-1.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all duration-200"
              >
                <option value="">{text.sourcePlaceholder}</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.label || n.id}</option>)}
              </select>
              <select
                value={edgeTarget}
                onChange={(e) => setEdgeTarget(e.target.value)}
                className="px-2 py-1.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all duration-200"
              >
                <option value="">{text.targetPlaceholder}</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.label || n.id}</option>)}
              </select>
            </div>
            
            {isWeighted && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">{text.weightLabel}</span>
                <input 
                  type="number"
                  min={-99}
                  max={9999}
                  value={edgeWeight}
                  onChange={(e) => setEdgeWeight(Number(e.target.value) || 1)}
                  className="w-20 px-2 py-1 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-center font-mono transition-all duration-200"
                />
              </div>
            )}

            <button 
              type="submit"
              disabled={!edgeSource || !edgeTarget}
              className="w-full py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 disabled:hover:from-indigo-500 disabled:hover:to-purple-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md shadow-sm disabled:hover:scale-100 disabled:hover:shadow-sm"
            >
              <Plus size={14} /> {text.addEdge}
            </button>
          </form>
        </SidebarSection>

        {/* ═══ Random Graph Generator ═══ */}
        <SidebarSection
          title={text.randomGen}
          defaultOpen={false}
          accentFrom="from-cyan-400"
          accentTo="to-blue-500"
          tintClass="bg-cyan-50/30 dark:bg-cyan-950/10"
        >
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{text.nodes}: {randomNodeCount}</span>
            </div>
            <input 
              type="range"
              min={3}
              max={15}
              value={randomNodeCount}
              onChange={(e) => setRandomNodeCount(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{text.density}: {Math.round(randomDensity * 100)}%</span>
            </div>
            <input 
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={randomDensity}
              onChange={(e) => setRandomDensity(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <button 
            onClick={handleRandomize}
            className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md shadow-sm"
          >
            <Shuffle size={13} /> {text.generate}
          </button>
        </SidebarSection>

        {/* ═══ Algorithm Configuration ═══ */}
        <SidebarSection
          title={text.algConfig}
          accentFrom="from-pink-500"
          accentTo="to-rose-500"
          tintClass="bg-pink-50/30 dark:bg-pink-950/10"
        >
          <div className="flex flex-col gap-2">
            {/* Algorithm card selector */}
            <div className="flex flex-col gap-1.5">
              {[
                { group: language === 'vi' ? 'Thuật toán duyệt' : 'Traversals', items: ['BFS', 'DFS'] },
                { group: language === 'vi' ? 'Đường đi ngắn nhất' : 'Shortest Paths', items: ['Dijkstra'] },
                { group: language === 'vi' ? 'Cây khung nhỏ nhất' : 'Spanning Trees (MST)', items: ['Prim', 'Kruskal'] },
                { group: language === 'vi' ? 'Kiểm tra tính chất' : 'Properties', items: ['Bipartite'] },
                { group: language === 'vi' ? 'Đường đi Euler' : 'Eulerian Path', items: ['Eulerian', 'Fleury'] },
                { group: language === 'vi' ? 'Luồng cực đại' : 'Max Flow', items: ['FordFulkerson'] }
              ].map((section) => (
                <div key={section.group} className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium px-1">{section.group}</span>
                  {section.items.map((alg) => (
                    <button
                      key={alg}
                      type="button"
                      onClick={() => {
                        setSelectedAlgorithm(alg);
                        stopAlgorithm();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs cursor-pointer transition-all duration-200 border ${
                        selectedAlgorithm === alg
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-400 shadow-md shadow-indigo-200/50 dark:shadow-indigo-900/30 scale-[1.02]'
                          : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900 hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{algorithmBadges[alg]}</span>
                        <div className="flex flex-col">
                          <span className="font-semibold">{alg === 'Bipartite' ? (language === 'vi' ? 'Kiểm tra Phân đôi' : 'Bipartite Check') : alg === 'Eulerian' ? 'Hierholzer' : alg === 'FordFulkerson' ? 'Ford-Fulkerson' : alg}</span>
                          <span className={`text-xs mt-0.5 leading-tight ${selectedAlgorithm === alg ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'}`}>
                            {algorithmDescriptions[language][alg]}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {needsStartNode && (
              <div className="flex items-center justify-between gap-2 text-sm mt-1 px-1">
                <span className="text-slate-600 dark:text-slate-400">{text.startNode}</span>
                <select
                  value={startNode}
                  onChange={(e) => {
                    setStartNode(e.target.value);
                    stopAlgorithm();
                  }}
                  className="w-24 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-center cursor-pointer font-semibold transition-all duration-200"
                >
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.label || n.id}</option>)}
                </select>
              </div>
            )}

            {needsSinkNode && (
              <div className="flex items-center justify-between gap-2 text-sm mt-1 px-1">
                <span className="text-slate-600 dark:text-slate-400">{language === 'vi' ? 'Đỉnh đích (Sink):' : 'Sink Node:'}</span>
                <select
                  value={sinkNode}
                  onChange={(e) => {
                    setSinkNode(e.target.value);
                    stopAlgorithm();
                  }}
                  className="w-24 px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-center cursor-pointer font-semibold transition-all duration-200"
                >
                  {nodes.filter(n => n.id !== startNode).map(n => <option key={n.id} value={n.id}>{n.label || n.id}</option>)}
                </select>
              </div>
            )}
          </div>
        </SidebarSection>
      </div>

      {/* ─── Fixed Bottom Controls ─── */}
      <div className="p-4 pt-2 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-900 flex flex-col gap-3">
        {/* ═══ Animation Controls ═══ */}
        <div className="flex flex-col rounded-2xl border border-indigo-100/50 dark:border-indigo-950/30 overflow-hidden bg-gradient-to-br from-indigo-50/60 to-purple-50/40 dark:from-indigo-950/20 dark:to-purple-950/10 shadow-sm">
          {/* Gradient accent bar */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="px-3.5 py-3 flex flex-col gap-3">
            <h2 className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">{text.animationCtrl}</h2>

            {steps.length > 0 ? (
              <div className="flex flex-col gap-3">
                {/* Playback controls */}
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={stepBackward}
                    disabled={currentStep <= 0}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl transition-all duration-200 cursor-pointer hover:scale-110"
                    title="Lùi một bước"
                  >
                    <SkipBack size={18} />
                  </button>

                  {/* Large Play/Pause button with progress ring */}
                  <div className="relative flex items-center justify-center">
                    {/* SVG Progress ring — visible when playing */}
                    <svg
                      className={`absolute w-14 h-14 transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
                      viewBox="0 0 56 56"
                    >
                      {/* Background ring track */}
                      <circle
                        cx="28" cy="28" r="25"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-indigo-200 dark:text-indigo-900"
                      />
                      {/* Animated progress arc */}
                      <circle
                        cx="28" cy="28" r="25"
                        fill="none"
                        stroke="url(#progressGrad)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={`${(progressPercent / 100) * 157} 157`}
                        className="transition-all duration-300"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                      />
                      <defs>
                        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <button 
                      onClick={togglePlay}
                      className="relative z-10 p-4 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full transition-all duration-300 shadow-lg shadow-indigo-300/50 dark:shadow-indigo-900/40 hover:scale-110 flex items-center justify-center cursor-pointer"
                      title={isPlaying ? "Tạm dừng" : "Phát mô phỏng"}
                    >
                      {isPlaying ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" className="translate-x-0.5" />}
                    </button>
                  </div>

                  <button 
                    onClick={stepForward}
                    disabled={currentStep >= steps.length - 1}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl transition-all duration-200 cursor-pointer hover:scale-110"
                    title="Tiến một bước"
                  >
                    <SkipForward size={18} />
                  </button>
                  <button 
                    onClick={stopAlgorithm}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 cursor-pointer hover:scale-110"
                    title="Đặt lại"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 font-mono">
                    <span>{text.step}: {currentStep + 1} / {steps.length}</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-200"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Speed slider */}
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 font-mono">
                    <span>{text.delay} {animationSpeed}ms</span>
                  </div>
                  <input 
                    type="range"
                    min={150}
                    max={2000}
                    step={50}
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <button 
                onClick={runAlgorithm}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-200/60 dark:shadow-indigo-900/30 hover:shadow-indigo-300/70 hover:scale-[1.02] transition-all duration-300"
              >
                <Play size={16} fill="white" /> {text.startVis}
              </button>
            )}
          </div>
        </div>

        {/* ═══ Save / Load ═══ */}
        <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-slate-100 dark:border-slate-800/80">
          <button 
            onClick={exportGraphJSON}
            className="flex items-center justify-center gap-1.5 py-2 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-all duration-200 cursor-pointer font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
          >
            <Download size={13} /> {text.saveJson}
          </button>
          <label className="flex items-center justify-center gap-1.5 py-2 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 cursor-pointer font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all duration-200">
            <Upload size={13} /> {text.loadJson}
            <input 
              type="file" 
              accept=".json"
              onChange={importGraphJSON}
              className="hidden"
            />
          </label>
        </div>

      </div>
    </aside>
  );
}
