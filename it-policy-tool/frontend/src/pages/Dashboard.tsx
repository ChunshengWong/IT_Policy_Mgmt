import { useEffect, useState } from 'react';
import { comparisonApi, policyApi, regulatoryApi, standardApi, sopApi } from '../api';
import { ComplianceOverview, Policy, RegulatoryRequirement } from '../types';

export default function Dashboard() {
  const [overview, setOverview] = useState<ComplianceOverview | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [requirements, setRequirements] = useState<RegulatoryRequirement[]>([]);
  const [stats, setStats] = useState({ policies: 0, standards: 0, sops: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const [compliance, policyList, reqList] = await Promise.all([
        comparisonApi.getComplianceOverview(),
        policyApi.getAll(),
        regulatoryApi.getAll(),
      ]);
      setOverview(compliance);
      setPolicies(policyList);
      setRequirements(reqList);

      const standardsCount = policyList.reduce((sum, p) => sum + (p.standards?.length || 0), 0);
      const sopsCount = policyList.reduce(
        (sum, p) => sum + (p.standards?.reduce((s, st) => s + (st.sops?.length || 0), 0) || 0),
        0
      );
      setStats({ policies: policyList.length, standards: standardsCount, sops: sopsCount });
    };
    fetchData();
  }, []);

  if (!overview) {
    return <div className="flex items-center justify-center h-64">加载中...</div>;
  }

  const complianceColor = parseFloat(overview.complianceRate) >= 80 ? 'text-green-500' : 
                          parseFloat(overview.complianceRate) >= 50 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">制度总数</p>
              <p className="text-3xl font-bold text-gray-800">{stats.policies}</p>
            </div>
            <div className="text-5xl opacity-50">📋</div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">标准数量</p>
              <p className="text-3xl font-bold text-gray-800">{stats.standards}</p>
            </div>
            <div className="text-5xl opacity-50">📐</div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-pink-50 to-pink-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">SOP数量</p>
              <p className="text-3xl font-bold text-gray-800">{stats.sops}</p>
            </div>
            <div className="text-5xl opacity-50">📝</div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">监管要求</p>
              <p className="text-3xl font-bold text-gray-800">{overview.totalRequirements}</p>
            </div>
            <div className="text-5xl opacity-50">📜</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">合规率概览</h3>
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#22c55e"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${parseFloat(overview.complianceRate) * 3.52} 352`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${complianceColor}`}>
                  {overview.complianceRate}%
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-gray-600">已完成对比</span>
                <span className="font-semibold text-gray-800">{overview.completedComparisons}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="text-gray-600">待处理</span>
                <span className="font-semibold text-gray-800">{overview.pendingComparisons}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">最近监管要求</h3>
          <div className="space-y-3">
            {requirements.slice(0, 5).map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 truncate">{req.title}</p>
                  <p className="text-sm text-gray-500">{req.source}</p>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(req.effectiveDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">制度结构</h3>
          <div className="space-y-4">
            {policies.slice(0, 3).map((policy) => (
              <div key={policy.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{policy.title}</span>
                    <span className="text-sm text-gray-500">
                      {policy.standards?.length || 0} 个标准
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {policy.standards?.slice(0, 2).map((standard) => (
                    <div key={standard.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{standard.title}</span>
                      <span className="text-gray-400">
                        {standard.sops?.length || 0} SOPs
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
