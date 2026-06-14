import { useState, useEffect } from 'react';
import { useGraph } from './hooks/useGraph';
import { useResizable } from './hooks/useResizable';
import LeftSidebar from './components/LeftSidebar';
import GraphCanvas from './components/GraphCanvas';
import RightSidebar from './components/RightSidebar';
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Main App component - Graph Algorithm Visualizer
 * Responsive layout: sidebars collapse on small screens with toggle buttons
 */
export default function App() {
  const graphState = useGraph();
  const lang = graphState.language;

  // Sidebar toggle state for small screens
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

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

  // Close mobile panels when clicking backdrop
  const closeAllPanels = () => {
    setShowLeftPanel(false);
    setShowRightPanel(false);
  };

  return (
    <ErrorBoundary>
      <div className="w-screen h-[100dvh] min-h-0 flex overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-250 select-none relative">
      
      {/* ═══ Mobile Toggle Buttons (visible on small screens) ═══ */}
      <div className="lg:hidden fixed top-3 left-3 z-[60] flex gap-2">
        <button
          onClick={() => { setShowLeftPanel(!showLeftPanel); setShowRightPanel(false); }}
          className={`p-2.5 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 cursor-pointer ${
            showLeftPanel 
              ? 'bg-indigo-500 text-white shadow-indigo-500/30' 
              : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/50 dark:border-slate-700/50'
          }`}
          title={lang === 'vi' ? 'Bảng điều khiển' : 'Control Panel'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {showLeftPanel 
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            }
          </svg>
        </button>
      </div>

      <div className="lg:hidden fixed top-3 right-3 z-[60] flex gap-2">
        <button
          onClick={() => { setShowRightPanel(!showRightPanel); setShowLeftPanel(false); }}
          className={`p-2.5 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 cursor-pointer ${
            showRightPanel 
              ? 'bg-indigo-500 text-white shadow-indigo-500/30' 
              : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/50 dark:border-slate-700/50'
          }`}
          title={lang === 'vi' ? 'Biểu diễn & Kết quả' : 'Results & Data'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {showRightPanel
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            }
          </svg>
        </button>
      </div>

      {/* ═══ Mobile Backdrop Overlay ═══ */}
      {(showLeftPanel || showRightPanel) && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] transition-opacity duration-300"
          onClick={closeAllPanels}
        />
      )}

      {/* 1. Left Control Panel Sidebar */}
      {/* Desktop: always visible | Mobile: slide-in overlay */}
      <div className={`
        lg:relative lg:block lg:z-auto
        fixed top-0 left-0 h-full min-h-0 z-[50] transition-transform duration-300 ease-in-out
        ${showLeftPanel ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
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

          // Ford-Fulkerson
          sinkNode={graphState.sinkNode}
          setSinkNode={graphState.setSinkNode}
        />
      </div>

      {/* Left Resizer (desktop only) */}
      <div 
        className={`hidden lg:block w-1.5 cursor-col-resize hover:bg-indigo-500/50 active:bg-indigo-500 transition-colors z-50 shrink-0 ${isResizingLeft ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}
        onMouseDown={(e) => { e.preventDefault(); setIsResizingLeft(true); }}
      />

      {/* 2. Central Graph Canvas Area - Always visible, takes full width on mobile */}
      <main className="flex-grow flex flex-col h-full min-h-0 p-2 pt-14 lg:p-4 lg:pt-4 overflow-hidden relative min-w-0">
        <header className="mb-2 lg:mb-3 flex flex-wrap justify-between items-center px-2 select-none gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-sm lg:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate">
              {lang === 'vi' ? '🔬 Đồ thị Tương tác' : '🔬 Interactive Graph'}
            </h1>
            <p className="text-[10px] lg:text-xs text-slate-500 dark:text-slate-400 truncate">
              {lang === 'vi' 
                ? `${graphState.selectedAlgorithm} • ${graphState.isDirected ? 'Có hướng' : 'Vô hướng'}${graphState.isWeighted ? ' • Trọng số' : ''}`
                : `${graphState.selectedAlgorithm} • ${graphState.isDirected ? 'Directed' : 'Undirected'}${graphState.isWeighted ? ' • Weighted' : ''}`
              }
            </p>
          </div>
          
          {/* Legend panel - compact on mobile, wrappable */}
          <div className="flex flex-wrap gap-1.5 lg:gap-3 text-[10px] lg:text-xs font-semibold">
            {graphState.steps.length > 0 && (
              <>
                <div className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/30 px-1.5 lg:px-2.5 py-0.5 lg:py-1 rounded-md lg:rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 ring-1 ring-indigo-300 dark:ring-indigo-800" />
                  <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                    {graphState.selectedAlgorithm === 'Bipartite' 
                      ? (lang === 'vi' ? 'A' : 'A') 
                      : (lang === 'vi' ? 'Active' : 'Active')}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 lg:px-2.5 py-0.5 lg:py-1 rounded-md lg:rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-emerald-300 dark:ring-emerald-800" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                    {graphState.selectedAlgorithm === 'Bipartite' 
                      ? (lang === 'vi' ? 'B' : 'B') 
                      : ['Prim', 'Kruskal'].includes(graphState.selectedAlgorithm) 
                        ? 'MST' 
                        : (lang === 'vi' ? 'Visited' : 'Visited')}
                  </span>
                </div>
                {['Prim', 'Kruskal'].includes(graphState.selectedAlgorithm) && (
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-1.5 lg:px-2.5 py-0.5 lg:py-1 rounded-md lg:rounded-lg border border-amber-100 dark:border-amber-900/30">
                    <span className="w-2 h-2 rounded-full bg-amber-500 ring-1 ring-amber-300 dark:ring-amber-800" />
                    <span className="text-amber-700 dark:text-amber-300 font-medium">
                      {lang === 'vi' ? 'Xét' : 'Eval'}
                    </span>
                  </div>
                )}
                {graphState.selectedAlgorithm === 'Kruskal' && (
                  <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/30 px-1.5 lg:px-2.5 py-0.5 lg:py-1 rounded-md lg:rounded-lg border border-rose-100 dark:border-rose-900/30">
                    <span className="w-2 h-2 border border-dashed border-rose-500 bg-rose-100 dark:bg-rose-950/30 rounded-full" />
                    <span className="text-rose-700 dark:text-rose-300 font-medium">Cycle</span>
                  </div>
                )}
                {graphState.selectedAlgorithm === 'FordFulkerson' && (
                  <>
                    <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 px-1.5 lg:px-2.5 py-0.5 lg:py-1 rounded-md lg:rounded-lg border border-blue-100 dark:border-blue-900/30">
                      <span className="w-2 h-2 rounded-full bg-blue-500 ring-1 ring-blue-300 dark:ring-blue-800" />
                      <span className="text-blue-700 dark:text-blue-300 font-medium">Flow</span>
                    </div>
                    <div className="flex items-center gap-1 bg-cyan-50 dark:bg-cyan-950/30 px-1.5 lg:px-2.5 py-0.5 lg:py-1 rounded-md lg:rounded-lg border border-cyan-100 dark:border-cyan-900/30">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 ring-1 ring-cyan-300 dark:ring-cyan-800" />
                      <span className="text-cyan-700 dark:text-cyan-300 font-medium">Path</span>
                    </div>
                  </>
                )}
                {graphState.selectedAlgorithm === 'Fleury' && (
                  <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/30 px-1.5 lg:px-2.5 py-0.5 lg:py-1 rounded-md lg:rounded-lg border border-red-100 dark:border-red-900/30">
                    <span className="w-2 h-2 border border-dashed border-red-500 bg-red-100 dark:bg-red-950/30 rounded-full" />
                    <span className="text-red-700 dark:text-red-300 font-medium">Bridge</span>
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

        {/* Mobile: Floating step description overlay at bottom */}
        {graphState.steps.length > 0 && graphState.currentStep >= 0 && graphState.steps[graphState.currentStep] && (
          <div className="lg:hidden mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-[10px] font-bold font-mono text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20">
                {lang === 'vi' ? 'Bước' : 'Step'} {graphState.currentStep + 1}/{graphState.steps.length}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{graphState.selectedAlgorithm}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 line-clamp-3">
              {graphState.steps[graphState.currentStep].description[lang]}
            </p>
          </div>
        )}
      </main>

      {/* Right Resizer (desktop only) */}
      <div 
        className={`hidden lg:block w-1.5 cursor-col-resize hover:bg-indigo-500/50 active:bg-indigo-500 transition-colors z-50 shrink-0 ${isResizingRight ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}
        onMouseDown={(e) => { e.preventDefault(); setIsResizingRight(true); }}
      />

      {/* 3. Right representation display & results Sidebar */}
      {/* Desktop: always visible | Mobile: slide-in overlay from right */}
      <div className={`
        lg:relative lg:block lg:z-auto
        fixed top-0 right-0 h-full min-h-0 z-[50] transition-transform duration-300 ease-in-out
        ${showRightPanel ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
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
      
    </div>
    </ErrorBoundary>
  );
}
