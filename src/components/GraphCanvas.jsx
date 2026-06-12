import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

/**
 * GraphCanvas component - Interactive graph visualization using Cytoscape.js
 * Handles node/edge rendering, user interactions, and algorithm visualization
 * 
 * @param {Object} props - Component props
 * @param {Array} props.nodes - Array of node objects {id, x, y}
 * @param {Array} props.edges - Array of edge objects
 * @param {boolean} props.isDirected - Whether graph is directed
 * @param {boolean} props.isWeighted - Whether graph is weighted
 * @param {Function} props.updateNodePosition - Callback when node position changes
 * @param {Function} props.addNode - Callback to add new node
 * @param {Function} props.removeNode - Callback to remove node
 * @param {Function} props.removeEdge - Callback to remove edge
 * @param {Array} props.steps - Algorithm visualization steps
 * @param {number} props.currentStep - Current visualization step
 * @param {boolean} props.darkMode - Whether dark mode is enabled
 * @param {string} props.language - UI language (vi/en)
 */
export default function GraphCanvas({
  nodes,
  edges,
  isDirected,
  isWeighted,
  updateNodePosition,
  addNode,
  removeNode,
  removeEdge,
  steps,
  currentStep,
  darkMode,
  language
}) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  // 1. Initialize Cytoscape on mount
  useEffect(() => {
    if (!containerRef.current) return;

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [],
      style: getStylesheet(darkMode, isDirected),
      layout: { name: 'preset' },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      autoungrabify: false,
    });

    // Handle node drag positioning update
    cyRef.current.on('dragfree', 'node', (evt) => {
      const node = evt.target;
      const pos = node.position();
      updateNodePosition(node.id(), Math.round(pos.x), Math.round(pos.y));
    });

    // Double tap canvas background to add a node
    cyRef.current.on('dbltap', (evt) => {
      if (evt.target === cyRef.current) {
        const pos = evt.position;
        // Find next unused letter A-Z
        const usedIds = new Set(cyRef.current.nodes().map(n => n.id()));
        let nextId = '';
        for (let i = 65; i <= 90; i++) {
          const char = String.fromCharCode(i);
          if (!usedIds.has(char)) {
            nextId = char;
            break;
          }
        }
        if (!nextId) {
          nextId = String(usedIds.size + 1);
        }
        addNode(nextId, Math.round(pos.x), Math.round(pos.y));
      }
    });

    // Context menu or taphold to remove elements
    cyRef.current.on('cxttap', 'node', (evt) => {
      const node = evt.target;
      if (window.confirm(`Xóa đỉnh "${node.id()}"? / Delete Node "${node.id()}"?`)) {
        removeNode(node.id());
      }
    });

    cyRef.current.on('cxttap', 'edge', (evt) => {
      const edge = evt.target;
      if (window.confirm(`Xóa cạnh "${edge.data('source')}" - "${edge.data('target')}"? / Delete Edge?`)) {
        removeEdge(edge.id());
      }
    });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [updateNodePosition, addNode, removeNode, removeEdge]);

  // 2. Update styles when darkMode or isDirected changes
  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.style(getStylesheet(darkMode, isDirected));
    }
  }, [darkMode, isDirected]);

  // 3. Synchronize Nodes and Edges state to Cytoscape elements
  useEffect(() => {
    if (!cyRef.current) return;

    const cy = cyRef.current;

    // Collect current Cytoscape IDs
    const cyNodeIds = new Set(cy.nodes().map(n => n.id()));
    const cyEdgeIds = new Set(cy.edges().map(e => e.id()));

    const stateNodeIds = new Set(nodes.map(n => n.id));
    const stateEdgeIds = new Set(edges.map(e => e.id));

    // Remove nodes no longer in state
    cy.nodes().forEach(node => {
      if (!stateNodeIds.has(node.id())) {
        cy.remove(node);
      }
    });

    // Remove edges no longer in state
    cy.edges().forEach(edge => {
      if (!stateEdgeIds.has(edge.id())) {
        cy.remove(edge);
      }
    });

    // Add / Update nodes
    nodes.forEach(n => {
      if (cyNodeIds.has(n.id)) {
        const node = cy.getElementById(n.id);
        // Update label
        node.data('label', n.label || n.id);
        // Update position if not dragged (to prevent jump during drag)
        if (!node.grabbed()) {
          node.position({ x: n.x, y: n.y });
        }
      } else {
        cy.add({
          group: 'nodes',
          data: { id: n.id, label: n.label || n.id },
          position: { x: n.x, y: n.y }
        });
      }
    });

    // Add / Update edges
    edges.forEach(e => {
      const edgeData = {
        id: e.id,
        source: e.source,
        target: e.target,
        weight: e.weight,
        label: isWeighted ? String(e.weight) : ''
      };

      if (cyEdgeIds.has(e.id)) {
        const cyEdge = cy.getElementById(e.id);
        cyEdge.data(edgeData);
      } else {
        cy.add({
          group: 'edges',
          data: edgeData
        });
      }
    });

    // Auto fit/center graph elements if we just loaded/changed a sample
    if (currentStep === -1 && (nodes.length > 0)) {
      cy.fit(null, 50);
    }
  }, [nodes, edges, isWeighted, currentStep]);

  // 4. Synchronize visualization highlighting class states
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    // Reset classes
    cy.elements().removeClass('visited active active-edge mst skipped colorA colorB conflict euler-edge');

    if (currentStep >= 0 && steps[currentStep]) {
      const step = steps[currentStep];

      // Highlight visited nodes
      if (step.visited) {
        step.visited.forEach(nodeId => {
          cy.getElementById(nodeId).addClass('visited');
        });
      }

      // Highlight active exploring nodes
      if (step.activeNodes) {
        step.activeNodes.forEach(nodeId => {
          cy.getElementById(nodeId).addClass('active');
        });
      }

      // Highlight active exploring/traversing edges
      if (step.activeEdges) {
        step.activeEdges.forEach(edgeId => {
          cy.getElementById(edgeId).addClass('active-edge');
        });
      }

      // Highlight minimum spanning tree edges (Prim / Kruskal)
      if (step.mstEdges) {
        step.mstEdges.forEach(edgeId => {
          cy.getElementById(edgeId).addClass('mst');
        });
      }

      // Highlight accumulated Eulerian path edges
      if (step.eulerEdges) {
        step.eulerEdges.forEach(edgeId => {
          cy.getElementById(edgeId).addClass('euler-edge');
        });
      }

      // Highlight skipped/cycle-causing edges (Kruskal)
      if (step.skippedEdges) {
        step.skippedEdges.forEach(edgeId => {
          cy.getElementById(edgeId).addClass('skipped');
        });
      }

      // Highlight bipartite coloring colors
      if (step.bipartiteColors) {
        Object.entries(step.bipartiteColors).forEach(([nodeId, color]) => {
          cy.getElementById(nodeId).addClass(color === 0 ? 'colorA' : 'colorB');
        });
      }

      // If bipartite conflict happened
      if (step.isBipartiteConflict && step.activeEdges) {
        step.activeEdges.forEach(edgeId => {
          cy.getElementById(edgeId).addClass('conflict');
        });
      }
    }
  }, [steps, currentStep]);

  const lang = language || 'vi';

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Visual Canvas */}
      <div 
        id="cy-canvas"
        ref={containerRef} 
        className="w-full flex-1 cytoscape-container rounded-2xl shadow-inner border border-slate-200/50 dark:border-slate-800/40"
      />
      {/* Help tooltip */}
      <div className="absolute bottom-3 left-3 text-xs bg-slate-900/85 dark:bg-slate-950/90 text-white/90 backdrop-blur-xl px-4 py-2.5 rounded-xl border border-slate-700/40 flex flex-col gap-1 pointer-events-none select-none z-10 font-sans shadow-xl">
        <div>💡 <b>{lang === 'vi' ? 'Nhấp đôi' : 'Double Click'}</b> {lang === 'vi' ? 'vùng trống để thêm đỉnh' : 'empty space to add a node'}</div>
        <div>💡 <b>{lang === 'vi' ? 'Nhấp chuột phải' : 'Right Click'}</b> {lang === 'vi' ? 'đỉnh/cạnh để xóa' : 'node/edge to delete it'}</div>
        <div>💡 <b>{lang === 'vi' ? 'Kéo thả' : 'Drag'}</b> {lang === 'vi' ? 'các đỉnh để sắp xếp' : 'nodes to rearrange layouts'}</div>
      </div>
      
      {/* Node/Edge count badge */}
      <div className="absolute top-3 right-3 flex gap-2 pointer-events-none select-none z-10">
        <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 backdrop-blur-md rounded-lg border border-indigo-500/20">
          {lang === 'vi' ? `${nodes.length} Đỉnh` : `${nodes.length} Nodes`}
        </span>
        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 backdrop-blur-md rounded-lg border border-emerald-500/20">
          {lang === 'vi' ? `${edges.length} Cạnh` : `${edges.length} Edges`}
        </span>
      </div>
    </div>
  );
}

// Cytoscape CSS Stylesheet configuration based on Theme Mode and graph type
function getStylesheet(darkMode, isDirected) {
  const nodeBg = darkMode ? '#1e293b' : '#ffffff';
  const nodeBorder = darkMode ? '#475569' : '#cbd5e1';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const edgeColor = darkMode ? '#475569' : '#94a3b8';
  const edgeTextBg = darkMode ? '#1e293b' : '#f8fafc';

  return [
    {
      selector: 'node',
      style: {
        'width': '42px',
        'height': '42px',
        'content': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-color': nodeBg,
        'border-color': nodeBorder,
        'border-width': '2.5px',
        'color': textColor,
        'font-size': '13px',
        'font-family': 'Inter, system-ui, sans-serif',
        'font-weight': '600',
        'text-wrap': 'ellipsis',
        'text-max-width': '60px',
        'transition-property': 'background-color, border-color, border-width, width, height',
        'transition-duration': '0.25s',
        'z-index': 10,
        'shadow-blur': darkMode ? '8' : '4',
        'shadow-color': darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)',
        'shadow-offset-x': '0',
        'shadow-offset-y': '2',
        'shadow-opacity': 1
      }
    },
    {
      selector: 'edge',
      style: {
        'width': '2px',
        'line-color': edgeColor,
        'target-arrow-color': edgeColor,
        'target-arrow-shape': isDirected ? 'triangle' : 'none',
        'arrow-scale': isDirected ? 0.9 : 0,
        'curve-style': 'bezier',
        'label': 'data(label)',
        'font-size': '11px',
        'font-family': 'JetBrains Mono, monospace',
        'font-weight': '600',
        'color': textColor,
        'text-background-opacity': 1,
        'text-background-color': edgeTextBg,
        'text-background-padding': '4px',
        'text-background-shape': 'roundrectangle',
        'transition-property': 'line-color, target-arrow-color, width',
        'transition-duration': '0.25s'
      }
    },
    // Visited Nodes highlight (emerald with glow)
    {
      selector: 'node.visited',
      style: {
        'background-color': '#10b981',
        'border-color': '#059669',
        'border-width': '3px',
        'color': '#ffffff',
        'shadow-blur': '12',
        'shadow-color': 'rgba(16,185,129,0.35)',
        'shadow-opacity': 1
      }
    },
    // Active Node being processed (indigo with strong glow)
    {
      selector: 'node.active',
      style: {
        'width': '48px',
        'height': '48px',
        'background-color': '#6366f1',
        'border-color': '#a5b4fc',
        'border-width': '4px',
        'color': '#ffffff',
        'z-index': 20,
        'shadow-blur': '18',
        'shadow-color': 'rgba(99,102,241,0.5)',
        'shadow-opacity': 1
      }
    },
    // Traversal active edge (amber/orange)
    {
      selector: 'edge.active-edge',
      style: {
        'width': '4px',
        'line-color': '#f59e0b',
        'target-arrow-color': '#f59e0b',
        'z-index': 15
      }
    },
    // Minimum Spanning Tree edge (emerald green, thicker)
    {
      selector: 'edge.mst',
      style: {
        'width': '5px',
        'line-color': '#10b981',
        'target-arrow-color': '#10b981',
        'z-index': 14
      }
    },
    // Eulerian Path drawn edge (violet/purple with glow)
    {
      selector: 'edge.euler-edge',
      style: {
        'width': '5px',
        'line-color': '#8b5cf6',
        'target-arrow-color': '#8b5cf6',
        'z-index': 16,
        'shadow-blur': '8',
        'shadow-color': 'rgba(139,92,246,0.6)',
        'shadow-opacity': 1
      }
    },
    // Kruskal skipped cycle edge (red dashed)
    {
      selector: 'edge.skipped',
      style: {
        'width': '1.5px',
        'line-color': '#f43f5e',
        'line-style': 'dashed',
        'target-arrow-color': '#f43f5e',
        'z-index': 5,
        'opacity': 0.6
      }
    },
    // Bipartite coloring classes
    {
      selector: 'node.colorA',
      style: {
        'background-color': '#4f46e5',
        'border-color': '#c7d2fe',
        'border-width': '3px',
        'color': '#ffffff',
        'shadow-blur': '10',
        'shadow-color': 'rgba(79,70,229,0.35)',
        'shadow-opacity': 1
      }
    },
    {
      selector: 'node.colorB',
      style: {
        'background-color': '#ec4899',
        'border-color': '#fbcfe8',
        'border-width': '3px',
        'color': '#ffffff',
        'shadow-blur': '10',
        'shadow-color': 'rgba(236,72,153,0.35)',
        'shadow-opacity': 1
      }
    },
    // Bipartite color conflict edge (thick red)
    {
      selector: 'edge.conflict',
      style: {
        'width': '5px',
        'line-color': '#e11d48',
        'target-arrow-color': '#e11d48',
        'z-index': 18
      }
    }
  ];
}
