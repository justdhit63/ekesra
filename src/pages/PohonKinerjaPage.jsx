// src/pages/PohonKinerjaPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import CustomNode from '../components/CustomNode';

// --- Fungsi untuk Layout Otomatis dengan Dagre ---
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 250;
const nodeHeight = 50;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });
  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight }));
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
  const [perangkatDaerahList, setPerangkatDaerahList] = useState([]);
  const [selectedDaerahId, setSelectedDaerahId] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);

  // <-- BAGIAN YANG DILENGKAPI: Mengambil daftar Perangkat Daerah -->
  useEffect(() => {
    const fetchPerangkatDaerah = async () => {
      const { data } = await supabase.from('perangkat_daerah').select('id, nama_daerah');
      if (data) {
        setPerangkatDaerahList(data);
        if (data.length > 0) {
          setSelectedDaerahId(data[0].id);
        }
      }
    };
    fetchPerangkatDaerah();
  }, []);

  useEffect(() => {
    if (!selectedDaerahId) return;

    const generateTree = async () => {
      setLoading(true);
      const { data: apiData, error } = await supabase.rpc('get_pohon_kinerja_data', { pd_id: selectedDaerahId });

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
          // 3. Ubah cara kita membuat node
          const node = {
            id: item.id.toString(),
            type: 'custom', // Gunakan tipe 'custom' yang sudah kita daftarkan
            position: { x: 0, y: 0 },
            // Isi 'data' dengan struktur yang dibutuhkan oleh CustomNode
            data: {
              title: item.type.replace('_', ' ').toUpperCase(), // misal: "SASARAN", "PROGRAM"
              description: item.label,
              // Anda perlu memodifikasi fungsi SQL untuk mendapatkan data ini
              detail_1_title: item.detail_1_title, // Data baru dari SQL
              detail_1: item.detail_1,
              detail_2_title: item.detail_2_title, // Data baru dari SQL
              detail_2: item.detail_2,
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
  }, [selectedDaerahId, setNodes, setEdges]);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Pohon Kinerja</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <label className="block text-sm font-medium text-gray-700">Perangkat Daerah</label>
        {/* <-- BAGIAN YANG DILENGKAPI: Opsi dropdown --> */}
        <select 
            value={selectedDaerahId} 
            onChange={(e) => setSelectedDaerahId(e.target.value)} 
            className="mt-1 block w-full md:w-1/3 border p-2 rounded-md"
        >
            <option value="">Pilih Perangkat Daerah</option>
            {perangkatDaerahList.map(daerah => (
                <option key={daerah.id} value={daerah.id}>{daerah.nama_daerah}</option>
            ))}
        </select>
      </div>

      <div style={{ height: '70vh' }} className="bg-white rounded-lg shadow-md border">
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
            ) : <p className="p-4 text-center text-gray-500">Tidak ada data untuk ditampilkan. Silakan isi data Renstra terlebih dahulu.</p>
        )}
      </div>
    </div>
  );
}

export default PohonKinerjaPage;