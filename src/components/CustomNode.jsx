// src/components/CustomNode.jsx
import { Handle, Position } from 'reactflow';

const DetailRow = ({ title, content, isHeader = false }) => {
  if (!content) return null; // Jangan tampilkan jika tidak ada konten

  const titleClass = isHeader 
    ? "px-2 py-1 bg-gray-600 text-white font-bold text-xs uppercase text-center"
    : "px-2 py-1 bg-gray-200 text-gray-700 font-bold text-xs uppercase text-center";
  
  const contentClass = isHeader
    ? "px-2 py-2 text-center text-sm font-semibold"
    : "px-2 py-2 text-center text-sm";

  return (
    <>
      <div className={titleClass}>{title}</div>
      <div className={contentClass}>{content}</div>
    </>
  );
};

function CustomNode({ data }) {
  return (
    <div className="bg-white border-2 border-gray-400 rounded-md w-72">
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      
      <DetailRow title={data.title} content={data.description} isHeader={true} />
      
      {/* Tampilkan Detail 1 (Indikator atau PD) */}
      <DetailRow title={data.detail_1_title} content={data.detail_1} />

      {/* Tampilkan Detail 2 (Penanggung Jawab) */}
      <DetailRow title={data.detail_2_title} content={data.detail_2} />

      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
}

export default CustomNode;