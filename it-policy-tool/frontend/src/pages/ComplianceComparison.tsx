import { useState, useEffect } from 'react';
import { policyApi, regulatoryApi, comparisonApi } from '../api';
import { Policy, RegulatoryRequirement, Comparison } from '../types';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

export default function ComplianceComparison() {
  const [requirements, setRequirements] = useState<RegulatoryRequirement[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [selectedReq, setSelectedReq] = useState<RegulatoryRequirement | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingComparison, setEditingComparison] = useState<Comparison | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [reqs, pols, comps] = await Promise.all([
      regulatoryApi.getAll(),
      policyApi.getAll(),
      comparisonApi.getAll(),
    ]);
    setRequirements(reqs);
    setPolicies(pols);
    setComparisons(comps);
  };

  const handleCreateComparison = async (data: {
    regulatoryReqId: string;
    policyId?: string;
    standardId?: string;
    sopId?: string;
    status: string;
    notes?: string;
  }) => {
    if (!selectedReq) return;
    await comparisonApi.create({ ...data, regulatoryReqId: selectedReq.id });
    setShowModal(false);
    setSelectedReq(null);
    fetchData();
  };

  const handleUpdateComparison = async (id: string, data: Partial<Comparison>) => {
    await comparisonApi.update(id, data);
    setEditingComparison(null);
    fetchData();
  };

  const handleDeleteComparison = async (id: string) => {
    if (confirm('确定要删除这个对比记录吗？')) {
      await comparisonApi.delete(id);
      fetchData();
    }
  };

  const getComparisonForReq = (reqId: string) => {
    return comparisons.find((c) => c.regulatoryReqId === reqId);
  };

  const getRelatedItemTitle = (comparison: Comparison) => {
    if (comparison.sop) return comparison.sop.title;
    if (comparison.standard) return comparison.standard.title;
    if (comparison.policy) return comparison.policy.title;
    return '未关联';
  };

  const filteredRequirements = requirements.filter((req) => {
    if (filterStatus === 'all') return true;
    const comp = getComparisonForReq(req.id);
    return comp?.status === filterStatus;
  });

  const allStandards = policies.flatMap((p) => p.standards || []);
  const allSOPs = allStandards.flatMap((s) => s.sops || []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">合规对比</h2>
        <div className="flex items-center gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-40"
          >
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="completed">已完成</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">监管要求</h3>
          <div className="space-y-3">
            {filteredRequirements.map((req) => {
              const comp = getComparisonForReq(req.id);
              return (
                <div
                  key={req.id}
                  className={`card cursor-pointer transition-all ${
                    comp?.status === 'completed'
                      ? 'border-green-300 bg-green-50'
                      : 'hover:border-primary-300'
                  }`}
                  onClick={() => {
                    setSelectedReq(req);
                    setEditingComparison(comp || null);
                    setShowModal(true);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-800">{req.title}</h4>
                        <StatusBadge status={comp?.status || 'pending'} />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{req.source}</p>
                    </div>
                    <span className="text-xl">
                      {comp?.status === 'completed' ? '✓' : '→'}
                    </span>
                  </div>
                  
                  {comp && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        关联: <span className="font-medium text-primary-600">{getRelatedItemTitle(comp)}</span>
                      </p>
                      {comp.notes && (
                        <p className="text-xs text-gray-400 mt-1">备注: {comp.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">制度结构</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {policies.map((policy) => (
              <div key={policy.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-50">
                  <span className="font-medium text-gray-800">{policy.title}</span>
                </div>
                {policy.standards?.map((standard) => (
                  <div key={standard.id} className="border-t border-gray-200">
                    <div className="p-3 bg-gray-50/50 pl-6">
                      <span className="text-gray-700">{standard.title}</span>
                    </div>
                    {standard.sops?.map((sop) => (
                      <div key={sop.id} className="border-t border-gray-100 p-2 pl-10 text-sm text-gray-600">
                        • {sop.title}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingComparison ? '编辑对比' : '新建对比'}>
        {selectedReq && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">监管要求</p>
              <p className="font-medium text-gray-800">{selectedReq.title}</p>
              <p className="text-sm text-gray-500">{selectedReq.content}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">关联层级</label>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">制度</label>
                  <select id="compare-policy" className="input-field">
                    <option value="">选择制度...</option>
                    {policies.map((p) => (
                      <option key={p.id} value={`policy:${p.id}`}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">标准</label>
                  <select id="compare-standard" className="input-field">
                    <option value="">选择标准...</option>
                    {allStandards.map((s) => (
                      <option key={s.id} value={`standard:${s.id}`}>
                        {s.policy?.title} → {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">SOP</label>
                  <select id="compare-sop" className="input-field">
                    <option value="">选择SOP...</option>
                    {allSOPs.map((s) => (
                      <option key={s.id} value={`sop:${s.id}`}>
                        {s.standard?.policy?.title} → {s.standard?.title} → {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <select id="compare-status" className="input-field" defaultValue={editingComparison?.status || 'pending'}>
                <option value="pending">待处理</option>
                <option value="completed">已完成</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <textarea
                defaultValue={editingComparison?.notes || ''}
                id="compare-notes"
                className="textarea-field"
                rows={3}
                placeholder="输入对比备注..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              {editingComparison && (
                <button
                  onClick={() => {
                    handleDeleteComparison(editingComparison.id);
                    setShowModal(false);
                  }}
                  className="btn-danger"
                >
                  删除
                </button>
              )}
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">取消</button>
              <button
                onClick={() => {
                  const policySelect = document.getElementById('compare-policy') as HTMLSelectElement;
                  const standardSelect = document.getElementById('compare-standard') as HTMLSelectElement;
                  const sopSelect = document.getElementById('compare-sop') as HTMLSelectElement;
                  
                  let policyId: string | undefined;
                  let standardId: string | undefined;
                  let sopId: string | undefined;
                  
                  if (policySelect.value) {
                    const [type, id] = policySelect.value.split(':');
                    if (type === 'policy') policyId = id;
                  }
                  if (standardSelect.value) {
                    const [type, id] = standardSelect.value.split(':');
                    if (type === 'standard') standardId = id;
                  }
                  if (sopSelect.value) {
                    const [type, id] = sopSelect.value.split(':');
                    if (type === 'sop') sopId = id;
                  }
                  
                  const data = {
                    policyId,
                    standardId,
                    sopId,
                    status: (document.getElementById('compare-status') as HTMLSelectElement).value,
                    notes: (document.getElementById('compare-notes') as HTMLTextAreaElement).value,
                  };
                  
                  if (editingComparison) {
                    handleUpdateComparison(editingComparison.id, data);
                  } else {
                    handleCreateComparison({ ...data, regulatoryReqId: selectedReq!.id });
                  }
                }}
                className="btn-primary flex-1"
              >
                {editingComparison ? '保存' : '创建'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
