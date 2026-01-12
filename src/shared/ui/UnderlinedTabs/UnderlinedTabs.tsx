import React from 'react';

interface TabOption {
  id: string;
  label: string;
  badge?: number;
}

interface UnderlinedTabsProps<T extends string = string> {
  tabs: readonly TabOption[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
}

export function UnderlinedTabs<T extends string = string>({ 
  tabs, 
  activeTab, 
  onTabChange 
}: UnderlinedTabsProps<T>) {
  return (
    <div className="w-full border-b border-gray-200">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as T)}
              className={`
                relative flex-1 py-3 text-sm font-semibold tracking-wide uppercase
                transition-colors
                ${isActive ? 'text-[var(--color-accent)]' : 'text-gray-400'}
              `}
            >
              <span className="inline-flex items-center gap-1.5">
                {tab.label}
                {tab.badge !== undefined && (
                  <span>
                    {tab.badge}
                  </span>
                )}
              </span>
              
              {/* Подчеркивающая линия для активного таба */}
              {isActive && (
                <span 
                  className="absolute bottom-0 left-1/3 right-1/3 h-0.5 bg-[var(--color-accent)] transition-all"
                  style={{ borderRadius: '2px 2px 0 0' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}