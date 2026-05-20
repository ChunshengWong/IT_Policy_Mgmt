import axios from 'axios';
import {
  Policy,
  Standard,
  SOP,
  RegulatoryRequirement,
  Comparison,
  ComplianceOverview,
  PolicyCreateInput,
  StandardCreateInput,
  SOPCreateInput,
  RegulatoryRequirementCreateInput,
  ComparisonCreateInput
} from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const policyApi = {
  getAll: async (): Promise<Policy[]> => {
    const response = await axios.get(`${API_BASE_URL}/policies`);
    return response.data;
  },
  
  getById: async (id: string): Promise<Policy> => {
    const response = await axios.get(`${API_BASE_URL}/policies/${id}`);
    return response.data;
  },
  
  create: async (data: PolicyCreateInput): Promise<Policy> => {
    const response = await axios.post(`${API_BASE_URL}/policies`, data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Policy>): Promise<Policy> => {
    const response = await axios.put(`${API_BASE_URL}/policies/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/policies/${id}`);
  }
};

export const standardApi = {
  getAll: async (policyId?: string): Promise<Standard[]> => {
    const params = policyId ? { policyId } : {};
    const response = await axios.get(`${API_BASE_URL}/standards`, { params });
    return response.data;
  },
  
  getById: async (id: string): Promise<Standard> => {
    const response = await axios.get(`${API_BASE_URL}/standards/${id}`);
    return response.data;
  },
  
  create: async (data: StandardCreateInput): Promise<Standard> => {
    const response = await axios.post(`${API_BASE_URL}/standards`, data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Standard>): Promise<Standard> => {
    const response = await axios.put(`${API_BASE_URL}/standards/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/standards/${id}`);
  }
};

export const sopApi = {
  getAll: async (standardId?: string): Promise<SOP[]> => {
    const params = standardId ? { standardId } : {};
    const response = await axios.get(`${API_BASE_URL}/sops`, { params });
    return response.data;
  },
  
  getById: async (id: string): Promise<SOP> => {
    const response = await axios.get(`${API_BASE_URL}/sops/${id}`);
    return response.data;
  },
  
  create: async (data: SOPCreateInput): Promise<SOP> => {
    const response = await axios.post(`${API_BASE_URL}/sops`, data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<SOP>): Promise<SOP> => {
    const response = await axios.put(`${API_BASE_URL}/sops/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/sops/${id}`);
  }
};

export const regulatoryApi = {
  getAll: async (): Promise<RegulatoryRequirement[]> => {
    const response = await axios.get(`${API_BASE_URL}/regulatory`);
    return response.data;
  },
  
  getById: async (id: string): Promise<RegulatoryRequirement> => {
    const response = await axios.get(`${API_BASE_URL}/regulatory/${id}`);
    return response.data;
  },
  
  create: async (data: RegulatoryRequirementCreateInput): Promise<RegulatoryRequirement> => {
    const response = await axios.post(`${API_BASE_URL}/regulatory`, data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<RegulatoryRequirement>): Promise<RegulatoryRequirement> => {
    const response = await axios.put(`${API_BASE_URL}/regulatory/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/regulatory/${id}`);
  }
};

export const comparisonApi = {
  getAll: async (): Promise<Comparison[]> => {
    const response = await axios.get(`${API_BASE_URL}/comparisons`);
    return response.data;
  },
  
  getById: async (id: string): Promise<Comparison> => {
    const response = await axios.get(`${API_BASE_URL}/comparisons/${id}`);
    return response.data;
  },
  
  create: async (data: ComparisonCreateInput): Promise<Comparison> => {
    const response = await axios.post(`${API_BASE_URL}/comparisons`, data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Comparison>): Promise<Comparison> => {
    const response = await axios.put(`${API_BASE_URL}/comparisons/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/comparisons/${id}`);
  },
  
  getComplianceOverview: async (): Promise<ComplianceOverview> => {
    const response = await axios.get(`${API_BASE_URL}/comparisons/compliance/overview`);
    return response.data;
  }
};
