import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: '📊' },
    { id: 'policies', label: '制度管理', icon: '📋' },
    { id: 'regulatory', label: '监管要求', icon: '📜' },
    { id: 'comparison', label: '合规对比', icon: '🔍' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-50 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      <div className="p-4 border-b border-gray-700">
        {isExpanded && (
          <h1 className="text-xl font-bold text-primary-400">IT制度管理</h1>
        )}
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-primary-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isExpanded && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-20 bg-gray-800 border border-gray-600 rounded-full p-1 hover:bg-gray-700 transition-colors"
      >
        <span className="text-gray-400 text-sm">
          {isExpanded ? '<' : '>'}
        </span>
      </button>
    </aside>
  );
}
