import { useState, useEffect, useCallback, useRef } from 'react';
import { directedSample, undirectedSample } from '../data/sampleGraphs';
import { generateRandomGraph } from '../utils/graphHelpers';

/**
 * Custom hook for managing graph state and algorithm execution
 * Handles nodes, edges, algorithms, and visualization steps
 * 
 * @returns {Object} Graph state and methods
 */

// Algorithms
import { runBFS } from '../algorithms/bfs';
import { runDFS } from '../algorithms/dfs';
import { runDijkstra } from '../algorithms/dijkstra';
import { checkBipartite } from '../algorithms/bipartite';
import { runPrim } from '../algorithms/prim';
import { runKruskal } from '../algorithms/kruskal';
import { runEulerian } from '../algorithms/eulerian';
import { runFordFulkerson } from '../algorithms/fordFulkerson';
import { runFleury } from '../algorithms/fleury';

// Log translation database
const logTranslations = {
  initialized: {
    en: 'App initialized with default directed sample graph.',
    vi: 'Ứng dụng đã khởi tạo với đồ thị có hướng mẫu.'
  },
  nodeExists: (id) => ({
    en: `Error: Node "${id}" already exists.`,
    vi: `Lỗi: Đỉnh "${id}" đã tồn tại.`
  }),
  nodeAdded: (id) => ({
    en: `Added Node "${id}"`,
    vi: `Đã thêm Đỉnh "${id}"`
  }),
  nodeRemoved: (id) => ({
    en: `Removed Node "${id}" (and its connected edges).`,
    vi: `Đã xóa Đỉnh "${id}" (và các cạnh liên kết).`
  }),
  loopError: {
    en: 'Error: Loops are not allowed.',
    vi: 'Lỗi: Không được tạo khuyên (tự nối chính nó).'
  },
  nodesNotExist: {
    en: 'Error: Source or Target node does not exist.',
    vi: 'Lỗi: Đỉnh bắt đầu hoặc Đỉnh kết thúc không tồn tại.'
  },
  edgeExists: (u, v) => ({
    en: `Error: Edge already exists between "${u}" and "${v}".`,
    vi: `Lỗi: Cạnh nối giữa "${u}" và "${v}" đã tồn tại.`
  }),
  edgeAdded: (u, v, w) => ({
    en: `Added edge "${u}" ➔ "${v}" (weight: ${w})`,
    vi: `Đã thêm cạnh "${u}" ➔ "${v}" (trọng số: ${w})`
  }),
  edgeRemoved: {
    en: 'Removed edge.',
    vi: 'Đã xóa cạnh.'
  },
  edgeWeightUpdated: {
    en: 'Updated edge weight.',
    vi: 'Đã cập nhật trọng số cạnh.'
  },
  cleared: {
    en: 'Cleared entire graph canvas.',
    vi: 'Đã xóa sạch đồ thị trên màn hình.'
  },
  loaded: {
    en: 'Loaded graph configuration.',
    vi: 'Đã tải cấu hình đồ thị.'
  },
  randomGenerated: (n, d) => ({
    en: `Generated random graph with ${n} nodes (density: ${d}).`,
    vi: `Đã tạo đồ thị ngẫu nhiên với ${n} đỉnh (mật độ: ${d}).`
  }),
  reset: {
    en: 'Visualizer reset.',
    vi: 'Đã đặt lại bộ mô phỏng.'
  },
  emptyError: {
    en: 'Error: Cannot run algorithm on empty graph.',
    vi: 'Lỗi: Không thể chạy thuật toán trên đồ thị trống.'
  },
  compiling: (alg) => ({
    en: `Compiling steps for ${alg}...`,
    vi: `Đang biên dịch các bước cho thuật toán ${alg}...`
  }),
  noSteps: {
    en: 'Warning: No steps generated. Check if graph has nodes.',
    vi: 'Cảnh báo: Không có bước nào được tạo ra. Hãy kiểm tra xem đồ thị có đỉnh nào không.'
  },
  successCompile: (n, alg) => ({
    en: `Successfully loaded ${n} animation frames for ${alg}.`,
    vi: `Tải thành công ${n} khung hình mô phỏng cho ${alg}.`
  }),
  compileError: (msg) => ({
    en: `Error during compilation: ${msg}`,
    vi: `Lỗi trong quá trình biên dịch: ${msg}`
  })
};

export function useGraph() {
  // Graph structure states
  const [nodes, setNodes] = useState(directedSample.nodes);
  const [edges, setEdges] = useState(directedSample.edges);
  const [isDirected, setIsDirected] = useState(true);
  const [isWeighted, setIsWeighted] = useState(true);

  // UI Selection states
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('BFS');
  const [startNode, setStartNode] = useState('A');
  const [sinkNode, setSinkNode] = useState('');
  
  // Localization state
  const [language, setLanguage] = useState('vi'); // 'en' or 'vi'

  // Activity Console logs
  const [logs, setLogs] = useState([]);

  // Initialize logs with language
  useEffect(() => {
    setLogs([`[${new Date().toLocaleTimeString()}] ${logTranslations.initialized[language]}`]);
  }, [language]);

  // Visualizer timeline state
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(800); // ms delay

  // Active UI Tabs
  const [activeTab, setActiveTab] = useState('visualizer'); // 'representations' or 'visualizer'
  const [darkMode, setDarkMode] = useState(true);

  // Playback timer ref
  const timerRef = useRef(null);

  // Initialize start node when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      const exists = nodes.some(n => n.id === startNode);
      if (!exists) {
        setStartNode(nodes[0].id);
      }
    } else {
      setStartNode('');
    }
  }, [nodes, startNode]);

  // Log logger helper
  const addLog = useCallback((msgObj) => {
    const time = new Date().toLocaleTimeString();
    // Support raw string or bilingual object
    const text = typeof msgObj === 'string' ? msgObj : msgObj[language];
    setLogs((prev) => [`[${time}] ${text}`, ...prev.slice(0, 49)]); // Cap at 50 logs
  }, [language]);

  // Sync dark mode class
  useEffect(() => {
    const rootClass = window.document.body.classList;
    if (darkMode) {
      rootClass.add('dark');
    } else {
      rootClass.remove('dark');
    }
  }, [darkMode]);

  // Node operations
  const addNode = useCallback((id, x = null, y = null) => {
    const cleanId = id.trim().toUpperCase();
    if (!cleanId) return false;
    
    if (nodes.some(n => n.id === cleanId)) {
      addLog(logTranslations.nodeExists(cleanId));
      return false;
    }

    const newNode = {
      id: cleanId,
      label: cleanId,
      x: x !== null ? x : Math.round(150 + Math.random() * 400),
      y: y !== null ? y : Math.round(100 + Math.random() * 250)
    };

    setNodes(prev => [...prev, newNode]);
    addLog(logTranslations.nodeAdded(cleanId));
    return true;
  }, [nodes, addLog]);

  const removeNode = useCallback((id) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
    addLog(logTranslations.nodeRemoved(id));
  }, [addLog]);

  const updateNodePosition = useCallback((id, x, y) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  }, []);

  // Edge operations
  const addEdge = useCallback((source, target, weight = 1) => {
    if (source === target) {
      addLog(logTranslations.loopError);
      return false;
    }

    if (!nodes.some(n => n.id === source) || !nodes.some(n => n.id === target)) {
      addLog(logTranslations.nodesNotExist);
      return false;
    }

    const exists = edges.some(e => {
      if (isDirected) {
        return e.source === source && e.target === target;
      } else {
        return (e.source === source && e.target === target) || (e.source === target && e.target === source);
      }
    });

    if (exists) {
      addLog(logTranslations.edgeExists(source, target));
      return false;
    }

    const newEdge = {
      id: `e_${source}_${target}_${Date.now()}`,
      source,
      target,
      weight: Number(weight) || 1
    };

    setEdges(prev => [...prev, newEdge]);
    addLog(logTranslations.edgeAdded(source, target, weight));
    return true;
  }, [nodes, edges, isDirected, addLog]);

  const removeEdge = useCallback((id) => {
    setEdges(prev => prev.filter(e => e.id !== id));
    addLog(logTranslations.edgeRemoved);
  }, [addLog]);

  const updateEdgeWeight = useCallback((id, newWeight) => {
    setEdges(prev => prev.map(e => e.id === id ? { ...e, weight: Number(newWeight) || 1 } : e));
    addLog(logTranslations.edgeWeightUpdated);
  }, [addLog]);

  const clearGraph = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSteps([]);
    setCurrentStep(-1);
    setIsPlaying(false);
    addLog(logTranslations.cleared);
  }, [addLog]);

  const loadGraph = useCallback((graphData) => {
    if (!graphData) return;
    setNodes(graphData.nodes || []);
    setEdges(graphData.edges || []);
    setIsDirected(graphData.isDirected !== undefined ? graphData.isDirected : true);
    setIsWeighted(graphData.isWeighted !== undefined ? graphData.isWeighted : true);
    setSteps([]);
    setCurrentStep(-1);
    setIsPlaying(false);
    addLog(logTranslations.loaded);
  }, [addLog]);

  const loadSample = useCallback((type) => {
    if (type === 'directed') {
      loadGraph(directedSample);
    } else if (type === 'undirected') {
      loadGraph(undirectedSample);
    }
  }, [loadGraph]);

  const generateRandom = useCallback((nodeCount, density) => {
    const graph = generateRandomGraph(nodeCount, density, isDirected, isWeighted);
    loadGraph(graph);
    addLog(logTranslations.randomGenerated(nodeCount, density));
  }, [isDirected, isWeighted, loadGraph, addLog]);

  // Algorithm playback control
  const stopAlgorithm = useCallback(() => {
    setIsPlaying(false);
    setSteps([]);
    setCurrentStep(-1);
    addLog(logTranslations.reset);
  }, [addLog]);

  const runAlgorithm = useCallback(() => {
    setIsPlaying(false);
    
    if (nodes.length === 0) {
      addLog(logTranslations.emptyError);
      return;
    }

    addLog(logTranslations.compiling(selectedAlgorithm));

    let resultSteps = [];
    try {
      switch (selectedAlgorithm) {
        case 'BFS':
          resultSteps = runBFS(nodes, edges, startNode, isDirected);
          break;
        case 'DFS':
          resultSteps = runDFS(nodes, edges, startNode, isDirected);
          break;
        case 'Dijkstra':
          resultSteps = runDijkstra(nodes, edges, startNode, isDirected);
          break;
        case 'Bipartite':
          resultSteps = checkBipartite(nodes, edges, isDirected);
          break;
        case 'Prim':
          resultSteps = runPrim(nodes, edges, startNode);
          break;
        case 'Kruskal':
          resultSteps = runKruskal(nodes, edges);
          break;
        case 'Eulerian':
          resultSteps = runEulerian(nodes, edges, startNode, isDirected);
          break;
        case 'FordFulkerson':
          resultSteps = runFordFulkerson(nodes, edges, startNode, sinkNode || (nodes.length > 1 ? nodes[nodes.length - 1].id : startNode), isDirected);
          break;
        case 'Fleury':
          resultSteps = runFleury(nodes, edges, startNode, isDirected);
          break;
        default:
          return;
      }

      if (resultSteps.length === 0) {
        addLog(logTranslations.noSteps);
        return;
      }

      setSteps(resultSteps);
      setCurrentStep(0);
      setActiveTab('visualizer');
      addLog(logTranslations.successCompile(resultSteps.length, selectedAlgorithm));
    } catch (e) {
      addLog(logTranslations.compileError(e.message));
    }
  }, [selectedAlgorithm, startNode, sinkNode, nodes, edges, isDirected, addLog]);

  const stepForward = useCallback(() => {
    if (steps.length === 0) return;
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps]);

  const stepBackward = useCallback(() => {
    if (steps.length === 0) return;
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, [steps]);

  // Handle auto-play ticking
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            clearInterval(timerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, animationSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps, animationSpeed]);

  const togglePlay = useCallback(() => {
    if (steps.length === 0) {
      runAlgorithm();
      setIsPlaying(true);
    } else {
      if (currentStep >= steps.length - 1) {
        setCurrentStep(0);
        setIsPlaying(true);
      } else {
        setIsPlaying(prev => !prev);
      }
    }
  }, [steps, currentStep, runAlgorithm]);

  return {
    nodes,
    edges,
    isDirected,
    isWeighted,
    setIsDirected,
    setIsWeighted,
    selectedAlgorithm,
    setSelectedAlgorithm,
    startNode,
    sinkNode,
    setSinkNode,
    setStartNode,
    logs,
    addLog,
    
    // Localization
    language,
    setLanguage,

    // Node / Edge modification
    addNode,
    removeNode,
    updateNodePosition,
    addEdge,
    removeEdge,
    updateEdgeWeight,
    clearGraph,
    loadGraph,
    loadSample,
    generateRandom,

    // Visualization
    steps,
    currentStep,
    setCurrentStep,
    isPlaying,
    setIsPlaying,
    animationSpeed,
    setAnimationSpeed,
    runAlgorithm,
    stopAlgorithm,
    stepForward,
    stepBackward,
    togglePlay,

    // UI Tab / DarkMode
    activeTab,
    setActiveTab,
    darkMode,
    setDarkMode
  };
}
