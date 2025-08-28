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

  useEffect(() => {
    const generateTree = async () => {
      setLoading(true);
      // Panggil fungsi SQL yang baru tanpa parameter
      const { data: apiData, error } = await supabase.rpc('get_pohon_kinerja_data');
  
      // Tambahkan debugging yang lebih detail
      console.log("Raw API Data:", apiData);
      console.log("API Error:", error);
      console.log("Data type:", typeof apiData);
      console.log("Is Array:", Array.isArray(apiData));
      
      // Jika apiData adalah array, log setiap item
      if (Array.isArray(apiData)) {
        console.log("Total items:", apiData.length);
        apiData.forEach((item, index) => {
          console.log(`Item ${index}:`, {
            id: item.id,
            type: item.type,
            label: item.label,
            hasChildren: item.children ? item.children.length : 0,
            children: item.children
          });
        });
      }
  
      if (error || !apiData || apiData.length === 0) {
        console.error("Gagal mengambil data pohon kinerja atau data kosong:", error);
        setNodes([]); 
        setEdges([]);
        setLoading(false);
        return;
      }
      
      const initialNodes = [];
      const initialEdges = [];
      
      // Fungsi rekursif untuk memproses hierarki dengan children
      function processHierarchy(items, parentId = null, level = 0) {
        console.log(`Processing level ${level}, parentId: ${parentId}, items:`, items);
        
        if (!items || !Array.isArray(items)) {
          console.log("Items is not array or null/undefined");
          return;
        }
        
        items.forEach((item, index) => {
          console.log(`Processing item ${index} at level ${level}:`, item);
          
          // Buat unique ID dengan menambahkan type prefix
          const nodeId = `${item.type.replace(/\s+/g, '_')}_${item.id}`;
          
          const node = {
            id: nodeId,
            type: 'custom',
            position: { x: 0, y: 0 },
            data: {
              title: item.type.toUpperCase(),
              description: item.label,
              detail_1_title: item.detail_1_title || '',
              detail_1: item.detail_1 || '',
              detail_2_title: item.detail_2_title || '',
              detail_2: item.detail_2 || '',
              level: level
            },
          };
          initialNodes.push(node);
          console.log(`Created node: ${nodeId}`);
  
          // Buat edge jika ada parent
          if (parentId) {
            const edgeId = `e-${parentId}-${nodeId}`;
            initialEdges.push({
              id: edgeId,
              source: parentId,
              target: nodeId,
              type: 'smoothstep'
            });
            console.log(`Created edge: ${edgeId}`);
          }
  
          // Proses children jika ada
          if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            console.log(`Processing ${item.children.length} children for ${nodeId}`);
            processHierarchy(item.children, nodeId, level + 1);
          } else {
            console.log(`No children for ${nodeId}`);
          }
        });
      }
  
      // Mulai proses dari root level
      console.log("Starting processHierarchy with apiData:", apiData);
      processHierarchy(apiData);
      
      // Debug nodes dan edges yang dibuat
      console.log("Generated Nodes:", initialNodes);
      console.log("Generated Edges:", initialEdges);
      console.log("Total Nodes Created:", initialNodes.length);
      console.log("Total Edges Created:", initialEdges.length);
      
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setLoading(false);
    };
  
    generateTree();
  }, [setNodes, setEdges]);
  
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