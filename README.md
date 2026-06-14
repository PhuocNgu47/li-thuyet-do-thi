# 🔬 Trình Trực Quan Hóa Thuật Toán Đồ Thị

> Ứng dụng trực quan hóa các thuật toán đồ thị, hỗ trợ BFS, DFS, Dijkstra, Prim, Kruskal, đường đi Euler và kiểm tra đồ thị hai phía.

**🌐 Xem trực tiếp (Live Demo):** [https://appdocbao-6810c.web.app](https://appdocbao-6810c.web.app)

Đây là một dự án học tập dùng để minh họa các khái niệm lý thuyết đồ thị thông qua giao diện trực quan. Ứng dụng được xây dựng bằng React và Vite.

## ✨ Tính năng

- **7 thuật toán đồ thị**: BFS, DFS, Dijkstra, Prim, Kruskal, Euler, Bipartite
- **Canvas tương tác**: Tạo, chỉnh sửa và trực quan hóa đồ thị theo thời gian thực
- **Hoạt ảnh từng bước**: Điều khiển quá trình chạy thuật toán bằng nút phát/tạm dừng và từng bước
- **Thuộc tính đồ thị**: Hỗ trợ đồ thị có hướng/vô hướng và có trọng số/không trọng số
- **Giao diện song ngữ**: Hỗ trợ tiếng Việt và tiếng Anh
- **Thanh bên có thể thay đổi kích thước**: Tùy biến bố cục theo nhu cầu
- **Nhập/xuất đồ thị**: Lưu và tải lại cấu hình đồ thị
- **Sinh đồ thị ngẫu nhiên**: Tạo nhanh đồ thị để kiểm thử

## 🚀 Bắt đầu nhanh

### Yêu cầu
- Node.js 16+ và npm

### Cài đặt

```bash
# Sao chép và chuyển vào thư mục dự án
cd li-thuyet-do-thio

# Cài đặt dependencies
npm install

# Chạy môi trường phát triển
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## 📦 Build bản production

```bash
npm run build
```

Các file tối ưu sẽ được tạo trong thư mục `dist/`.

## 🛠️ Các lệnh có sẵn

- `npm run dev` - Chạy môi trường phát triển với hot reload
- `npm run build` - Build cho production
- `npm run lint` - Kiểm tra chất lượng mã bằng ESLint
- `npm run preview` - Xem trước bản build production

## 🏗️ Cấu trúc dự án

```
src/
├── components/          # Các component React
│   ├── GraphCanvas.jsx  # Khu vực trực quan hóa đồ thị
│   ├── LeftSidebar.jsx  # Bảng điều khiển bên trái
│   ├── RightSidebar.jsx # Khu vực hiển thị thông tin
│   └── ErrorBoundary.jsx # Xử lý lỗi
├── hooks/               # Custom hooks
│   ├── useGraph.js      # Quản lý trạng thái đồ thị
│   └── useResizable.js  # Logic thay đổi kích thước thanh bên
├── algorithms/          # Cài đặt thuật toán
│   ├── bfs.js
│   ├── dfs.js
│   ├── dijkstra.js
│   ├── prim.js
│   ├── kruskal.js
│   ├── eulerian.js
│   └── bipartite.js
├── utils/               # Các hàm tiện ích
├── data/                # Dữ liệu đồ thị mẫu
└── App.jsx              # Component chính
```

## 🔧 Công nghệ sử dụng

- **React** - Thư viện giao diện
- **Vite** - Công cụ build và dev server
- **Cytoscape.js** - Thư viện trực quan hóa đồ thị
- **Lucide React** - Thư viện icon
- **ESLint** - Kiểm tra chất lượng mã nguồn

## 📚 Cách sử dụng

1. **Tạo đồ thị**
   - Nhấp đúp vào canvas để thêm đỉnh
   - Nhấn vào đỉnh rồi nhấn đỉnh đích để tạo cạnh
   - Nhấp chuột phải để xóa phần tử

2. **Chạy thuật toán**
   - Chọn thuật toán ở thanh bên trái
   - Chọn đỉnh bắt đầu nếu cần
   - Nhấn "Run" hoặc "Play" để thực thi

3. **Điều khiển trực quan hóa**
   - Dùng Play/Pause để chạy hoạt ảnh
   - Dùng các nút Step để đi từng bước
   - Điều chỉnh thanh tốc độ nếu cần

4. **Tùy chỉnh bố cục**
   - Kéo các thanh phân cách để đổi kích thước
   - Chuyển ngôn ngữ giữa tiếng Việt và tiếng Anh

## 📋 Các thuật toán được hỗ trợ

| Thuật toán | Loại | Đặc điểm |
|-----------|------|----------|
| BFS | Duyệt | Dùng được với mọi đồ thị |
| DFS | Duyệt | Dùng được với mọi đồ thị |
| Dijkstra | Đường đi ngắn nhất | Yêu cầu trọng số không âm |
| Prim | Cây khung nhỏ nhất | Yêu cầu đồ thị có trọng số, vô hướng |
| Kruskal | Cây khung nhỏ nhất | Yêu cầu đồ thị có trọng số, vô hướng |
| Eulerian | Tìm đường đi | Có yêu cầu riêng về liên thông |
| Bipartite | Phân loại | Kiểm tra đồ thị có 2 tô màu được không |

## 🐛 Khắc phục sự cố

**Ứng dụng không chạy được**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

**Thuật toán không chạy**
- Đảm bảo đồ thị không rỗng
- Kiểm tra đã chọn đỉnh bắt đầu hay chưa (đối với BFS/DFS)
- Xác minh thuộc tính đồ thị phù hợp với thuật toán

## 📝 Giấy phép

Đây là một dự án phục vụ mục đích học tập.

## 👨‍💻 Tác giả

Được tạo bởi Phuoc cho môn Lý thuyết đồ thị.

---

**Tạo bằng React và Vite**
