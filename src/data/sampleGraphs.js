// Sample Graph configurations for testing and demo purposes
// Includes abstract samples and practical real-world scenarios.

export const directedSample = {
  isDirected: true,
  isWeighted: true,
  nodes: [
    { id: 'A', label: 'A', x: 150, y: 150 },
    { id: 'B', label: 'B', x: 300, y: 80 },
    { id: 'C', label: 'C', x: 300, y: 220 },
    { id: 'D', label: 'D', x: 450, y: 80 },
    { id: 'E', label: 'E', x: 450, y: 220 },
    { id: 'F', label: 'F', x: 600, y: 150 }
  ],
  edges: [
    { id: 'e1', source: 'A', target: 'B', weight: 4 },
    { id: 'e2', source: 'A', target: 'C', weight: 2 },
    { id: 'e3', source: 'B', target: 'C', weight: 1 },
    { id: 'e4', source: 'B', target: 'D', weight: 5 },
    { id: 'e5', source: 'C', target: 'E', weight: 3 },
    { id: 'e6', source: 'C', target: 'D', weight: 8 },
    { id: 'e7', source: 'D', target: 'E', weight: 2 },
    { id: 'e8', source: 'D', target: 'F', weight: 6 },
    { id: 'e9', source: 'E', target: 'F', weight: 2 }
  ]
};

export const undirectedSample = {
  isDirected: false,
  isWeighted: true,
  nodes: [
    { id: 'A', label: 'A', x: 150, y: 150 },
    { id: 'B', label: 'B', x: 300, y: 80 },
    { id: 'C', label: 'C', x: 300, y: 220 },
    { id: 'D', label: 'D', x: 450, y: 80 },
    { id: 'E', label: 'E', x: 450, y: 220 },
    { id: 'F', label: 'F', x: 600, y: 150 }
  ],
  edges: [
    { id: 'e1', source: 'A', target: 'B', weight: 4 },
    { id: 'e2', source: 'A', target: 'C', weight: 4 },
    { id: 'e3', source: 'B', target: 'C', weight: 2 },
    { id: 'e4', source: 'B', target: 'D', weight: 3 },
    { id: 'e5', source: 'C', target: 'D', weight: 1 },
    { id: 'e6', source: 'C', target: 'E', weight: 6 },
    { id: 'e7', source: 'D', target: 'E', weight: 2 },
    { id: 'e8', source: 'D', target: 'F', weight: 4 },
    { id: 'e9', source: 'E', target: 'F', weight: 3 }
  ]
};

export const bipartiteSample = {
  isDirected: false,
  isWeighted: false,
  nodes: [
    { id: '1', label: '1', x: 200, y: 80 },
    { id: '2', label: '2', x: 200, y: 150 },
    { id: '3', label: '3', x: 200, y: 220 },
    { id: '4', label: '4', x: 450, y: 80 },
    { id: '5', label: '5', x: 450, y: 150 },
    { id: '6', label: '6', x: 450, y: 220 }
  ],
  edges: [
    { id: 'e1', source: '1', target: '4', weight: 1 },
    { id: 'e2', source: '1', target: '5', weight: 1 },
    { id: 'e3', source: '2', target: '4', weight: 1 },
    { id: 'e4', source: '2', target: '6', weight: 1 },
    { id: 'e5', source: '3', target: '5', weight: 1 },
    { id: 'e6', source: '3', target: '6', weight: 1 }
  ]
};

// =========================================================================
// Real-world practical scenarios
// =========================================================================

// 1. GPS Driving router (Dijkstra shortest route)
export const gpsScenario = {
  isDirected: true,
  isWeighted: true,
  nodes: [
    { id: 'HN', label: 'Hà Nội', x: 300, y: 40 },
    { id: 'V', label: 'Vinh', x: 240, y: 110 },
    { id: 'H', label: 'Huế', x: 280, y: 190 },
    { id: 'DN', label: 'Đà Nẵng', x: 380, y: 210 },
    { id: 'DL', label: 'Đà Lạt', x: 340, y: 300 },
    { id: 'NT', label: 'Nha Trang', x: 450, y: 290 },
    { id: 'SG', label: 'Sài Gòn', x: 380, y: 380 }
  ],
  edges: [
    { id: 'g1', source: 'HN', target: 'V', weight: 300 },
    { id: 'g2', source: 'HN', target: 'DN', weight: 760 },
    { id: 'g3', source: 'V', target: 'H', weight: 370 },
    { id: 'g4', source: 'H', target: 'DN', weight: 100 },
    { id: 'g5', source: 'DN', target: 'DL', weight: 660 },
    { id: 'g6', source: 'DN', target: 'NT', weight: 520 },
    { id: 'g7', source: 'NT', target: 'SG', weight: 430 },
    { id: 'g8', source: 'DL', target: 'SG', weight: 310 }
  ]
};

// 2. Fiber optic campus installation (Prim / Kruskal MST)
export const networkScenario = {
  isDirected: false,
  isWeighted: true,
  nodes: [
    { id: 'ADMIN', label: 'Tòa Nhà Điều Hành', x: 350, y: 50 },
    { id: 'CS', label: 'Khoa CNTT', x: 200, y: 150 },
    { id: 'LIB', label: 'Thư Viện Trung Tâm', x: 500, y: 150 },
    { id: 'DORM', label: 'Ký Túc Xá', x: 200, y: 300 },
    { id: 'LAB', label: 'Phòng Thí Nghiệm', x: 500, y: 300 },
    { id: 'GYM', label: 'Nhà Thể Chất', x: 350, y: 385 }
  ],
  edges: [
    { id: 'n1', source: 'ADMIN', target: 'CS', weight: 4 },
    { id: 'n2', source: 'ADMIN', target: 'LIB', weight: 3 },
    { id: 'n3', source: 'CS', target: 'LIB', weight: 6 },
    { id: 'n4', source: 'CS', target: 'DORM', weight: 2 },
    { id: 'n5', source: 'CS', target: 'LAB', weight: 5 },
    { id: 'n6', source: 'LIB', target: 'LAB', weight: 4 },
    { id: 'n7', source: 'DORM', target: 'LAB', weight: 7 },
    { id: 'n8', source: 'DORM', target: 'GYM', weight: 3 },
    { id: 'n9', source: 'LAB', target: 'GYM', weight: 5 }
  ]
};

// 3. Social degree of connections (BFS)
export const socialScenario = {
  isDirected: false,
  isWeighted: false,
  nodes: [
    { id: 'AN', label: 'An', x: 150, y: 150 },
    { id: 'BINH', label: 'Bình', x: 300, y: 80 },
    { id: 'CUONG', label: 'Cường', x: 300, y: 220 },
    { id: 'DUNG', label: 'Dũng', x: 450, y: 80 },
    { id: 'GIANG', label: 'Giang', x: 450, y: 220 },
    { id: 'HUONG', label: 'Hương', x: 600, y: 150 }
  ],
  edges: [
    { id: 's1', source: 'AN', target: 'BINH', weight: 1 },
    { id: 's2', source: 'AN', target: 'CUONG', weight: 1 },
    { id: 's3', source: 'BINH', target: 'CUONG', weight: 1 },
    { id: 's4', source: 'BINH', target: 'DUNG', weight: 1 },
    { id: 's5', source: 'CUONG', target: 'GIANG', weight: 1 },
    { id: 's6', source: 'DUNG', target: 'GIANG', weight: 1 },
    { id: 's7', source: 'DUNG', target: 'HUONG', weight: 1 },
    { id: 's8', source: 'GIANG', target: 'HUONG', weight: 1 }
  ]
};

// 4. Job matching bipartite graph (Bipartite 2-coloring)
export const matchingScenario = {
  isDirected: false,
  isWeighted: false,
  nodes: [
    { id: 'DEV', label: 'Lập trình viên (Ứng viên)', x: 200, y: 70 },
    { id: 'DES', label: 'Thiết kế (Ứng viên)', x: 200, y: 160 },
    { id: 'MKT', label: 'Marketing (Ứng viên)', x: 200, y: 250 },
    { id: 'GG', label: 'Google (Công ty)', x: 480, y: 70 },
    { id: 'FB', label: 'Meta (Công ty)', x: 480, y: 160 },
    { id: 'NF', label: 'Netflix (Công ty)', x: 480, y: 250 }
  ],
  edges: [
    { id: 'm1', source: 'DEV', target: 'GG', weight: 1 },
    { id: 'm2', source: 'DEV', target: 'FB', weight: 1 },
    { id: 'm3', source: 'DES', target: 'FB', weight: 1 },
    { id: 'm4', source: 'DES', target: 'NF', weight: 1 },
    { id: 'm5', source: 'MKT', target: 'GG', weight: 1 },
    { id: 'm6', source: 'MKT', target: 'NF', weight: 1 }
  ]
};

// 5. Flight route network (Dijkstra - finding cheapest flight)
export const flightScenario = {
  isDirected: true,
  isWeighted: true,
  nodes: [
    { id: 'SGN', label: 'TP.HCM (SGN)', x: 300, y: 350 },
    { id: 'HAN', label: 'Hà Nội (HAN)', x: 300, y: 50 },
    { id: 'DAD', label: 'Đà Nẵng (DAD)', x: 450, y: 200 },
    { id: 'PQC', label: 'Phú Quốc (PQC)', x: 150, y: 400 },
    { id: 'CXR', label: 'Nha Trang (CXR)', x: 500, y: 280 },
    { id: 'VCA', label: 'Cần Thơ (VCA)', x: 200, y: 350 }
  ],
  edges: [
    { id: 'f1', source: 'SGN', target: 'HAN', weight: 1500 },
    { id: 'f2', source: 'SGN', target: 'DAD', weight: 600 },
    { id: 'f3', source: 'SGN', target: 'PQC', weight: 300 },
    { id: 'f4', source: 'DAD', target: 'HAN', weight: 700 },
    { id: 'f5', source: 'DAD', target: 'CXR', weight: 200 },
    { id: 'f6', source: 'CXR', target: 'SGN', weight: 400 },
    { id: 'f7', source: 'PQC', target: 'VCA', weight: 100 },
    { id: 'f8', source: 'VCA', target: 'SGN', weight: 150 },
    { id: 'f9', source: 'SGN', target: 'CXR', weight: 450 }
  ]
};

// 6. Maze / Game Pathfinding (BFS/DFS)
export const mazeScenario = {
  isDirected: false,
  isWeighted: false,
  nodes: [
    { id: 'START', label: 'Bắt đầu 🟢', x: 100, y: 100 },
    { id: 'A', label: 'Phòng A', x: 250, y: 100 },
    { id: 'B', label: 'Phòng B', x: 400, y: 100 },
    { id: 'C', label: 'Phòng C', x: 100, y: 250 },
    { id: 'D', label: 'Ngã tư D', x: 250, y: 250 },
    { id: 'E', label: 'Phòng E', x: 400, y: 250 },
    { id: 'F', label: 'Hành lang F', x: 250, y: 400 },
    { id: 'EXIT', label: 'Lối thoát 🚪', x: 400, y: 400 }
  ],
  edges: [
    { id: 'z1', source: 'START', target: 'A', weight: 1 },
    { id: 'z2', source: 'START', target: 'C', weight: 1 },
    { id: 'z3', source: 'A', target: 'B', weight: 1 },
    { id: 'z4', source: 'C', target: 'D', weight: 1 },
    { id: 'z5', source: 'A', target: 'D', weight: 1 },
    { id: 'z6', source: 'D', target: 'E', weight: 1 },
    { id: 'z7', source: 'D', target: 'F', weight: 1 },
    { id: 'z8', source: 'F', target: 'EXIT', weight: 1 },
    { id: 'z9', source: 'E', target: 'B', weight: 1 }
  ]
};

// 7. One-Stroke Game (Trò chơi vẽ 1 nét - Eulerian Path)
// Envelope shape with X. D & E have odd degree (3), A=2, B=4, C=4.
export const oneStrokeScenario = {
  isDirected: false,
  isWeighted: false,
  nodes: [
    { id: 'A', label: 'Mái nhà', x: 300, y: 100 },
    { id: 'B', label: 'Góc Trái (Bậc 4)', x: 150, y: 250 },
    { id: 'C', label: 'Góc Phải (Bậc 4)', x: 450, y: 250 },
    { id: 'D', label: 'Đáy Trái (Bậc 3)', x: 150, y: 450 },
    { id: 'E', label: 'Đáy Phải (Bậc 3)', x: 450, y: 450 }
  ],
  edges: [
    { id: 'os1', source: 'A', target: 'B' },
    { id: 'os2', source: 'A', target: 'C' },
    { id: 'os3', source: 'B', target: 'C' },
    { id: 'os4', source: 'B', target: 'E' },
    { id: 'os5', source: 'B', target: 'D' },
    { id: 'os6', source: 'C', target: 'D' },
    { id: 'os7', source: 'C', target: 'E' },
    { id: 'os8', source: 'D', target: 'E' }
  ]
};

// 8. Garbage Truck (Lộ trình xe rác - Eulerian Circuit)
// Octahedron graph. All nodes have degree 4. Perfect circuit!
export const garbageTruckScenario = {
  isDirected: false,
  isWeighted: true,
  nodes: [
    { id: 'N1', label: 'Ngã tư 1', x: 300, y: 100 },
    { id: 'N2', label: 'Phố A', x: 150, y: 250 },
    { id: 'N3', label: 'Phố B', x: 450, y: 250 },
    { id: 'N4', label: 'Phố C', x: 150, y: 450 },
    { id: 'N5', label: 'Phố D', x: 450, y: 450 },
    { id: 'N6', label: 'Trạm rác', x: 300, y: 600 }
  ],
  edges: [
    { id: 'g1', source: 'N1', target: 'N2', weight: 5 },
    { id: 'g2', source: 'N1', target: 'N3', weight: 5 },
    { id: 'g3', source: 'N1', target: 'N4', weight: 8 },
    { id: 'g4', source: 'N1', target: 'N5', weight: 8 },
    { id: 'g5', source: 'N6', target: 'N2', weight: 8 },
    { id: 'g6', source: 'N6', target: 'N3', weight: 8 },
    { id: 'g7', source: 'N6', target: 'N4', weight: 5 },
    { id: 'g8', source: 'N6', target: 'N5', weight: 5 },
    { id: 'g9', source: 'N2', target: 'N3', weight: 6 },
    { id: 'g10', source: 'N3', target: 'N4', weight: 9 },
    { id: 'g11', source: 'N4', target: 'N5', weight: 6 },
    { id: 'g12', source: 'N5', target: 'N2', weight: 9 }
  ]
};

// 9. CNC/PCB Routing (Eulerian Path on Directed Graph)
export const cncRoutingScenario = {
  isDirected: true,
  isWeighted: false,
  nodes: [
    { id: 'P1', label: 'Khởi động', x: 100, y: 100 },
    { id: 'P2', label: 'Mối hàn A', x: 300, y: 100 },
    { id: 'P3', label: 'Mối hàn B', x: 500, y: 100 },
    { id: 'P4', label: 'Tụ điện C', x: 300, y: 300 },
    { id: 'P5', label: 'Kết thúc', x: 300, y: 500 }
  ],
  edges: [
    { id: 'c1', source: 'P1', target: 'P2' },
    { id: 'c2', source: 'P2', target: 'P3' },
    { id: 'c3', source: 'P3', target: 'P4' },
    { id: 'c4', source: 'P4', target: 'P2' },
    { id: 'c5', source: 'P2', target: 'P5' }
  ]
};

export const sampleGraphs = {
  directed: directedSample,
  undirected: undirectedSample,
  bipartite: bipartiteSample,
  gps: gpsScenario,
  network: networkScenario,
  social: socialScenario,
  matching: matchingScenario,
  flight: flightScenario,
  maze: mazeScenario,
  onestroke: oneStrokeScenario,
  garbage: garbageTruckScenario,
  cnc: cncRoutingScenario
};
