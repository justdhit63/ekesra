// src/pages/PohonKinerjaPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import CustomNode from '../components/CustomNode';

// --- Fungsi untuk Layout Otomatis dengan Dagre (tidak ada perubahan) ---
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 288; // Sedikit lebih lebar untuk CustomNode
const nodeHeight = 50; // Tinggi dasar, akan disesuaikan jika konten banyak

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });
  nodes.forEach((node) => {
    // Beri ruang lebih untuk node custom yang lebih tinggi
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight + (node.data.detail_1 ? 80 : 0) + (node.data.detail_2 ? 50 : 0) });
  });
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
  dagre.layout(dagreGraph);
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = 'top';
    node.sourcePosition = 'bottom';
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    return node;
  });
  return { nodes, edges };
};
// --- Akhir Fungsi Layout ---

const nodeTypes = {
    custom: CustomNode,
};

function PohonKinerjaPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);

  // <-- DIUBAH: Hanya satu useEffect untuk mengambil seluruh pohon -->
  useEffect(() => {
    const generateTree = async () => {
      setLoading(true);
      // Panggil fungsi SQL yang baru tanpa parameter
      const { data: apiData, error } = await supabase.rpc('get_pohon_kinerja_data');

      if (error || !apiData || apiData.length === 0) {
        console.error("Gagal mengambil data pohon kinerja atau data kosong:", error);
        setNodes([]); 
        setEdges([]);
        setLoading(false);
        return;
      }
      
      const initialNodes = [];
      const initialEdges = [];
      
      function processHierarchy(items, parentId = null) {
        if (!items) return;
        items.forEach(item => {
          const node = {
            id: item.id.toString(),
            type: 'custom',
            position: { x: 0, y: 0 },
            data: {
              title: item.type.replace(/_/g, ' ').toUpperCase(),
              description: item.label,
              detail_1_title: item.detail_1_title,
              detail_1: item.detail_1,
              detail_2_title: item.detail_2_title, // Data baru dari SQL
              detail_2: item.detail_2,           // Data baru dari SQL
            },
          };
          initialNodes.push(node);

          if (parentId) {
            initialEdges.push({
              id: `e-${parentId}-${item.id}`,
              source: parentId.toString(),
              target: item.id.toString(),
              type: 'smoothstep'
            });
          }
          if (item.children) {
            processHierarchy(item.children, item.id);
          }
        });
      }

      processHierarchy(apiData);
      
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setLoading(false);
    };

    generateTree();
  }, [setNodes, setEdges]); // <-- DIUBAH: Hapus dependensi dropdown
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Pohon Kinerja</h1>
      
      {/* <-- DIHAPUS: Dropdown Perangkat Daerah tidak lagi relevan --> */}

      <div style={{ height: '80vh' }} className="bg-white rounded-lg shadow-md border">
        {loading ? <p className="p-4 text-center">Membangun Pohon Kinerja...</p> : (
            nodes.length > 0 ? (
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            ) : <p className="p-4 text-center text-gray-500">Tidak ada data untuk ditampilkan. Silakan isi data RPD terlebih dahulu.</p>
        )}
      </div>
    </div>
  );
}

export default PohonKinerjaPage;