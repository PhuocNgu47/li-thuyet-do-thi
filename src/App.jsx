import { useEffect } from 'react';
import { useGraph } from './hooks/useGraph';
import { useResizable } from './hooks/useResizable';
import LeftSidebar from './components/LeftSidebar';
import GraphCanvas from './components/GraphCanvas';
import RightSidebar from './components/RightSidebar';
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Main App component - Graph Algorithm Visualizer
 * Manages layout, sidebars, and graph visualization
 */
export default function App() {
  const graphState = useGraph();
  const lang = graphState.language;

  const {
    leftWidth,
    rightWidth,
    isResizingLeft,
    isResizingRight,
    setIsResizingLeft,
    setIsResizingRight,
    handleMouseMove,
    handleMouseUp,
    updateCursorStyle
  } = useResizable();

  useEffect(() => {
    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      updateCursorStyle(true);
    } else {
      updateCursorStyle(false);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight, handleMouseMove, handleMouseUp, updateCursorStyle]);

  return (
    <ErrorBoundary>
      <div className="w-screen h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-250 select-none">
      
      {/* 1. Left Control Panel Sidebar */}
      <LeftSidebar 
        width={leftWidth}
        nodes={graphState.nodes}
        edges={graphState.edges}
        isDirected={graphState.isDirected}
        isWeighted={graphState.isWeighted}
        setIsDirected={graphState.setIsDirected}
        setIsWeighted={graphState.setIsWeighted}
        selectedAlgorithm={graphState.selectedAlgorithm}
        setSelectedAlgorithm={graphState.setSelectedAlgorithm}
        startNode={graphState.startNode}
        setStartNode={graphState.setStartNode}
        addNode={graphState.addNode}
        addEdge={graphState.addEdge}
        clearGraph={graphState.clearGraph}
        loadGraph={graphState.loadGraph}
        generateRandom={graphState.generateRandom}
        
        // Visualizer Controls
        steps={graphState.steps}
        currentStep={graphState.currentStep}
        isPlaying={graphState.isPlaying}
        animationSpeed={graphState.animationSpeed}
        setAnimationSpeed={graphState.setAnimationSpeed}
        runAlgorithm={graphState.runAlgorithm}
        stopAlgorithm={graphState.stopAlgorithm}
        stepForward={graphState.stepForward}
        stepBackward={graphState.stepBackward}
        togglePlay={graphState.togglePlay}

        // Theme
        darkMode={graphState.darkMode}
        setDarkMode={graphState.setDarkMode}

        // Language
        language={graphState.language}
        setLanguage={graphState.setLanguage}
      />

      {/* Left Resizer */}
      <div 
        className={`w-1.5 cursor-col-resize hover:bg-indigo-500/50 active:bg-indigo-500 transition-colors z-50 shrink-0 ${isResizingLeft ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}
        onMouseDown={(e) => { e.preventDefault(); setIsResizingLeft(true); }}
      />

      {/* 2. Central Graph Canvas Area */}
      <main className="flex-grow flex flex-col h-full p-4 overflow-hidden relative">
        <header className="mb-3 flex justify-between items-center px-2 select-none">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {lang === 'vi' ? '🔬 Bản vẽ Đồ thị Tương tác' : '🔬 Interactive Graph Canvas'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'vi' 
                ? `Mô phỏng trực quan • ${graphState.selectedAlgorithm} • ${graphState.isDirected ? 'Có hướng' : 'Vô hướng'}${graphState.isWeighted ? ' • Có trọng số' : ''}`
                : `Visual simulation • ${graphState.selectedAlgorithm} • ${graphState.isDirected ? 'Directed' : 'Undirected'}${graphState.isWeighted ? ' • Weighted' : ''}`
              }
            </p>
          </div>
          
          {/* Legend panel showing color codes */}
          <div className="flex gap-3 text-xs font-semibold">
            {graphState.steps.length > 0 && (
              <>
                <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-indigo-300 dark:ring-indigo-800" />
                  <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                    {graphState.selectedAlgorithm === 'Bipartite' 
                      ? (lang === 'vi' ? 'Nhóm A' : 'Color A') 
                      : (lang === 'vi' ? 'Đang duyệt' : 'Active')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-800" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                    {graphState.selectedAlgorithm === 'Bipartite' 
                      ? (lang === 'vi' ? 'Nhóm B' : 'Color B') 
                      : ['Prim', 'Kruskal'].includes(graphState.selectedAlgorithm) 
                        ? (lang === 'vi' ? 'Cạnh MST' : 'MST Edge') 
                        : (lang === 'vi' ? 'Đã duyệt' : 'Visited')}
                  </span>
                </div>
                {['Prim', 'Kruskal'].includes(graphState.selectedAlgorithm) && (
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-900/30">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-300 dark:ring-amber-800" />
                    <span className="text-amber-700 dark:text-amber-300 font-medium">
                      {lang === 'vi' ? 'Đang xét' : 'Evaluating'}
                    </span>
                  </div>
                )}
                {graphState.selectedAlgorithm === 'Kruskal' && (
                  <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/30 px-2.5 py-1 rounded-lg border border-rose-100 dark:border-rose-900/30">
                    <span className="w-2.5 h-2.5 border border-dashed border-rose-500 bg-rose-100 dark:bg-rose-950/30 rounded-full" />
                    <span className="text-rose-700 dark:text-rose-300 font-medium">
                      {lang === 'vi' ? 'Chu trình' : 'Cycle'}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </header>

        {/* The Graph interactive viewport */}
        <div className="flex-1 w-full relative">
          <GraphCanvas
            nodes={graphState.nodes}
            edges={graphState.edges}
            isDirected={graphState.isDirected}
            isWeighted={graphState.isWeighted}
            updateNodePosition={graphState.updateNodePosition}
            addNode={graphState.addNode}
            removeNode={graphState.removeNode}
            removeEdge={graphState.removeEdge}
            steps={graphState.steps}
            currentStep={graphState.currentStep}
            darkMode={graphState.darkMode}
            language={graphState.language}
          />
        </div>
      </main>

      {/* Right Resizer */}
      <div 
        className={`w-1.5 cursor-col-resize hover:bg-indigo-500/50 active:bg-indigo-500 transition-colors z-50 shrink-0 ${isResizingRight ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}
        onMouseDown={(e) => { e.preventDefault(); setIsResizingRight(true); }}
      />

      {/* 3. Right representation display & results Sidebar */}
      <RightSidebar 
        width={rightWidth}
        nodes={graphState.nodes}
        edges={graphState.edges}
        isDirected={graphState.isDirected}
        isWeighted={graphState.isWeighted}
        loadGraph={graphState.loadGraph}
        logs={graphState.logs}
        addLog={graphState.addLog}
        
        // Visualizer Controls
        steps={graphState.steps}
        currentStep={graphState.currentStep}
        selectedAlgorithm={graphState.selectedAlgorithm}
        activeTab={graphState.activeTab}
        setActiveTab={graphState.setActiveTab}

        // Language
        language={graphState.language}
      />
      
    </div>
    </ErrorBoundary>
  );
}
