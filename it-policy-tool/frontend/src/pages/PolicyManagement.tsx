import { useState, useEffect } from 'react';
import { policyApi, standardApi, sopApi } from '../api';
import { Policy, Standard, SOP } from '../types';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showStandardModal, setShowStandardModal] = useState(false);
  const [showSOPModal, setShowSOPModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);
  const [editingSOP, setEditingSOP] = useState<SOP | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    const data = await policyApi.getAll();
    setPolicies(data);
  };

  const handleCreatePolicy = async (data: { title: string; description: string; content: string }) => {
    await policyApi.create(data);
    setShowPolicyModal(false);
    fetchPolicies();
  };

  const handleUpdatePolicy = async (id: string, data: Partial<Policy>) => {
    await policyApi.update(id, data);
    setEditingPolicy(null);
    fetchPolicies();
  };

  const handleDeletePolicy = async (id: string) => {
    if (confirm('确定要删除这个制度吗？')) {
      await policyApi.delete(id);
      fetchPolicies();
    }
  };

  const handleCreateStandard = async (data: { title: string; description: string; content: string }) => {
    if (!selectedPolicy) return;
    await standardApi.create({ ...data, policyId: selectedPolicy.id });
    setShowStandardModal(false);
    fetchPolicies();
  };

  const handleUpdateStandard = async (id: string, data: Partial<Standard>) => {
    await standardApi.update(id, data);
    setEditingStandard(null);
    fetchPolicies();
  };

  const handleDeleteStandard = async (id: string) => {
    if (confirm('确定要删除这个标准吗？')) {
      await standardApi.delete(id);
      fetchPolicies();
    }
  };

  const handleCreateSOP = async (data: { title: string; description: string; content: string }) => {
    if (!selectedStandard) return;
    await sopApi.create({ ...data, standardId: selectedStandard.id });
    setShowSOPModal(false);
    fetchPolicies();
  };

  const handleUpdateSOP = async (id: string, data: Partial<SOP>) => {
    await sopApi.update(id, data);
    setEditingSOP(null);
    fetchPolicies();
  };

  const handleDeleteSOP = async (id: string) => {
    if (confirm('确定要删除这个SOP吗？')) {
      await sopApi.delete(id);
      fetchPolicies();
    }
  };

  const filteredPolicies = policies.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">制度管理</h2>
        <button
          onClick={() => {
            setEditingPolicy(null);
            setShowPolicyModal(true);
          }}
          className="btn-primary"
        >
          + 新建制度
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="搜索制度..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      <div className="space-y-4">
        {filteredPolicies.map((policy) => (
          <div key={policy.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">{policy.title}</h3>
                  <StatusBadge status={policy.status} />
                </div>
                <p className="text-gray-500 text-sm mt-1">{policy.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingPolicy(policy);
                    setShowPolicyModal(true);
                  }}
                  className="btn-secondary text-sm"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDeletePolicy(policy.id)}
                  className="btn-danger text-sm"
                >
                  删除
                </button>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-gray-200 pl-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">标准 ({policy.standards?.length || 0})</span>
                <button
                  onClick={() => {
                    setSelectedPolicy(policy);
                    setEditingStandard(null);
                    setShowStandardModal(true);
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + 添加标准
                </button>
              </div>

              {policy.standards?.map((standard) => (
                <div key={standard.id} className="mb-3 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{standard.title}</span>
                        <StatusBadge status={standard.status} />
                      </div>
                      <p className="text-gray-500 text-sm">{standard.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingStandard(standard);
                          setShowStandardModal(true);
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteStandard(standard.id)}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  <div className="ml-4 mt-3 border-l-2 border-gray-300 pl-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">SOP ({standard.sops?.length || 0})</span>
                      <button
                        onClick={() => {
                          setSelectedStandard(standard);
                          setEditingSOP(null);
                          setShowSOPModal(true);
                        }}
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        + 添加SOP
                      </button>
                    </div>

                    {standard.sops?.map((sop) => (
                      <div key={sop.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                        <div>
                          <span className="text-sm font-medium text-gray-700">{sop.title}</span>
                          <p className="text-xs text-gray-400">{sop.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingSOP(sop);
                              setShowSOPModal(true);
                            }}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteSOP(sop.id)}
                            className="text-xs text-red-500 hover:text-red-600"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showPolicyModal} onClose={() => setShowPolicyModal(false)} title={editingPolicy ? '编辑制度' : '新建制度'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input
              type="text"
              defaultValue={editingPolicy?.title || ''}
              id="policy-title"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              defaultValue={editingPolicy?.description || ''}
              id="policy-description"
              className="textarea-field"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
            <textarea
              defaultValue={editingPolicy?.content || ''}
              id="policy-content"
              className="textarea-field"
              rows={5}
            />
          </div>
          {editingPolicy && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <select id="policy-status" className="input-field" defaultValue={editingPolicy.status}>
                <option value="draft">草稿</option>
                <option value="active">生效</option>
                <option value="pending">待审核</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button onClick={() => setShowPolicyModal(false)} className="btn-secondary flex-1">取消</button>
            <button
              onClick={() => {
                const data = {
                  title: (document.getElementById('policy-title') as HTMLInputElement).value,
                  description: (document.getElementById('policy-description') as HTMLTextAreaElement).value,
                  content: (document.getElementById('policy-content') as HTMLTextAreaElement).value,
                  status: editingPolicy ? (document.getElementById('policy-status') as HTMLSelectElement).value : undefined,
                };
                if (editingPolicy) {
                  handleUpdatePolicy(editingPolicy.id, data);
                } else {
                  handleCreatePolicy(data);
                }
              }}
              className="btn-primary flex-1"
            >
              {editingPolicy ? '保存' : '创建'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showStandardModal} onClose={() => setShowStandardModal(false)} title={editingStandard ? '编辑标准' : '新建标准'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input
              type="text"
              defaultValue={editingStandard?.title || ''}
              id="standard-title"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              defaultValue={editingStandard?.description || ''}
              id="standard-description"
              className="textarea-field"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
            <textarea
              defaultValue={editingStandard?.content || ''}
              id="standard-content"
              className="textarea-field"
              rows={5}
            />
          </div>
          {editingStandard && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <select id="standard-status" className="input-field" defaultValue={editingStandard.status}>
                <option value="draft">草稿</option>
                <option value="active">生效</option>
                <option value="pending">待审核</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button onClick={() => setShowStandardModal(false)} className="btn-secondary flex-1">取消</button>
            <button
              onClick={() => {
                const data = {
                  title: (document.getElementById('standard-title') as HTMLInputElement).value,
                  description: (document.getElementById('standard-description') as HTMLTextAreaElement).value,
                  content: (document.getElementById('standard-content') as HTMLTextAreaElement).value,
                  status: editingStandard ? (document.getElementById('standard-status') as HTMLSelectElement).value : undefined,
                };
                if (editingStandard) {
                  handleUpdateStandard(editingStandard.id, data);
                } else {
                  handleCreateStandard(data);
                }
              }}
              className="btn-primary flex-1"
            >
              {editingStandard ? '保存' : '创建'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showSOPModal} onClose={() => setShowSOPModal(false)} title={editingSOP ? '编辑SOP' : '新建SOP'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input
              type="text"
              defaultValue={editingSOP?.title || ''}
              id="sop-title"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              defaultValue={editingSOP?.description || ''}
              id="sop-description"
              className="textarea-field"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
            <textarea
              defaultValue={editingSOP?.content || ''}
              id="sop-content"
              className="textarea-field"
              rows={5}
            />
          </div>
          {editingSOP && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <select id="sop-status" className="input-field" defaultValue={editingSOP.status}>
                <option value="draft">草稿</option>
                <option value="active">生效</option>
                <option value="pending">待审核</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button onClick={() => setShowSOPModal(false)} className="btn-secondary flex-1">取消</button>
            <button
              onClick={() => {
                const data = {
                  title: (document.getElementById('sop-title') as HTMLInputElement).value,
                  description: (document.getElementById('sop-description') as HTMLTextAreaElement).value,
                  content: (document.getElementById('sop-content') as HTMLTextAreaElement).value,
                  status: editingSOP ? (document.getElementById('sop-status') as HTMLSelectElement).value : undefined,
                };
                if (editingSOP) {
                  handleUpdateSOP(editingSOP.id, data);
                } else {
                  handleCreateSOP(data);
                }
              }}
              className="btn-primary flex-1"
            >
              {editingSOP ? '保存' : '创建'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
