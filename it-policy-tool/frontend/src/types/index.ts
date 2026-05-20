export interface Policy {
  id: string;
  title: string;
  description?: string;
  content: string;
  version: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  standards?: Standard[];
}

export interface Standard {
  id: string;
  title: string;
  description?: string;
  content: string;
  policyId: string;
  version: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  policy?: Policy;
  sops?: SOP[];
}

export interface SOP {
  id: string;
  title: string;
  description?: string;
  content: string;
  standardId: string;
  version: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  standard?: Standard;
}

export interface RegulatoryRequirement {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comparison {
  id: string;
  regulatoryReqId: string;
  policyId?: string;
  standardId?: string;
  sopId?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  regulatoryReq?: RegulatoryRequirement;
  policy?: Policy;
  standard?: Standard;
  sop?: SOP;
}

export interface ComplianceOverview {
  totalRequirements: number;
  completedComparisons: number;
  pendingComparisons: number;
  complianceRate: string;
}

export type PolicyCreateInput = Omit<Policy, 'id' | 'version' | 'status' | 'createdAt' | 'updatedAt'>;
export type StandardCreateInput = Omit<Standard, 'id' | 'version' | 'status' | 'createdAt' | 'updatedAt'>;
export type SOPCreateInput = Omit<SOP, 'id' | 'version' | 'status' | 'createdAt' | 'updatedAt'>;
export type RegulatoryRequirementCreateInput = Omit<RegulatoryRequirement, 'id' | 'createdAt' | 'updatedAt'>;
export type ComparisonCreateInput = Omit<Comparison, 'id' | 'createdAt' | 'updatedAt'>;
