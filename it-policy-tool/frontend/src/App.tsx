import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import PolicyManagement from './pages/PolicyManagement';
import RegulatoryRequirements from './pages/RegulatoryRequirements';
import ComplianceComparison from './pages/ComplianceComparison';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'policies':
        return <PolicyManagement />;
      case 'regulatory':
        return <RegulatoryRequirements />;
      case 'comparison':
        return <ComplianceComparison />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="ml-64 p-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
