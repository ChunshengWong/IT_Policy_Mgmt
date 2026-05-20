import { useState, useEffect } from 'react';
import { regulatoryApi } from '../api';
import { RegulatoryRequirement } from '../types';
import Modal from '../components/Modal';

export default function RegulatoryRequirements() {
  const [requirements, setRequirements] = useState<RegulatoryRequirement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<RegulatoryRequirement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    const data = await regulatoryApi.getAll();
    setRequirements(data);
  };

  const handleCreate = async (data: { title: string; content: string; source: string; category: string; effectiveDate: string }) => {
    await regulatoryApi.create(data);
    setShowModal(false);
    fetchRequirements();
  };

  const handleUpdate = async (id: string, data: Partial<RegulatoryRequirement>) => {
    await regulatoryApi.update(id, data);
    setEditingRequirement(null);
    fetchRequirements();
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个监管要求吗？')) {
      await regulatoryApi.delete(id);
      fetchRequirements();
    }
  };

  const categories = ['all', ...new Set(requirements.map((r) => r.category))];
  
  const filteredRequirements = requirements.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">监管要求</h2>
        <button
          onClick={() => {
            setEditingRequirement(null);
            setShowModal(true);
          }}
          className="btn-primary"
        >
          + 添加监管要求
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="搜索监管要求..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field w-48"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? '全部分类' : cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequirements.map((req) => (
          <div key={req.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{req.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">
                    {req.category}
                  </span>
                  <span className="text-xs text-gray-500">{req.source}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingRequirement(req);
                    setShowModal(true);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(req.id)}
                  className="p-1 hover:bg-red-100 rounded"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{req.content}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>生效日期</span>
              <span>{new Date(req.effectiveDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredRequirements.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无监管要求</p>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingRequirement ? '编辑监管要求' : '添加监管要求'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input
              type="text"
              defaultValue={editingRequirement?.title || ''}
              id="req-title"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
            <textarea
              defaultValue={editingRequirement?.content || ''}
              id="req-content"
              className="textarea-field"
              rows={5}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">来源</label>
              <input
                type="text"
                defaultValue={editingRequirement?.source || ''}
                id="req-source"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
              <input
                type="text"
                defaultValue={editingRequirement?.category || ''}
                id="req-category"
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">生效日期</label>
            <input
              type="date"
              defaultValue={editingRequirement?.effectiveDate ? new Date(editingRequirement.effectiveDate).toISOString().split('T')[0] : ''}
              id="req-date"
              className="input-field"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">取消</button>
            <button
              onClick={() => {
                const data = {
                  title: (document.getElementById('req-title') as HTMLInputElement).value,
                  content: (document.getElementById('req-content') as HTMLTextAreaElement).value,
                  source: (document.getElementById('req-source') as HTMLInputElement).value,
                  category: (document.getElementById('req-category') as HTMLInputElement).value,
                  effectiveDate: (document.getElementById('req-date') as HTMLInputElement).value,
                };
                if (editingRequirement) {
                  handleUpdate(editingRequirement.id, data);
                } else {
                  handleCreate(data);
                }
              }}
              className="btn-primary flex-1"
            >
              {editingRequirement ? '保存' : '创建'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
