/**
 * FilterTabs Component
 * 
 * React Native Conversion Notes:
 * - Replace <div> with <View> from react-native
 * - Replace className with style prop
 * - Use ScrollView from react-native for horizontal scrolling
 * - flex-row → flexDirection: 'row'
 * - overflow-x-auto → ScrollView with horizontal={true}
 * - px-4, py-2 → paddingHorizontal, paddingVertical
 * - rounded-full → borderRadius: 9999
 * - active state colors → conditional style based on isActive prop
 */
import React from 'react';

const FilterTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-row overflow-x-auto px-4 py-3 gap-2 hide-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-lg shadow-red-500/30 transform scale-105'
                : 'bg-white/80 backdrop-blur-sm text-gray-600 font-medium hover:bg-gray-100/80 border border-gray-200/50'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;

