/**
 * BottomNav Component
 * 
 * React Native Conversion Notes:
 * - Replace <div> with <View> from react-native
 * - Replace <button> with <TouchableOpacity> or <Pressable> from react-native
 * - Use react-native-vector-icons or @expo/vector-icons for icons
 * - flex-row → flexDirection: 'row'
 * - justify-around → justifyContent: 'space-around'
 * - fixed bottom → position: 'absolute', bottom: 0
 * - border-t → borderTopWidth, borderTopColor
 * - Icons: Use icon libraries (Ionicons, MaterialIcons, etc.)
 */
import React from 'react';
import { Home, MenuBook, Person, VideoCall } from '@mui/icons-material';

const BottomNav = ({ activeTab, onTabChange }) => {
  const iconColor = 'rgb(220, 38, 38)'; // rgb(220 38 38 / var(--tw-bg-opacity, 1))
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'mycourse', label: 'My Course', icon: MenuBook },
    { id: 'livesession', label: 'Live', icon: VideoCall },
    { id: 'profile', label: 'Profile', icon: Person },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 z-50 lg:hidden shadow-2xl">
      <div className="flex flex-row justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-[60px] transition-all duration-300 ${
                isActive ? 'transform scale-110' : ''
              }`}
            >
              {React.createElement(item.icon, { 
                style: { 
                  color: isActive ? iconColor : 'rgb(107, 114, 128)', 
                  fontSize: '24px' 
                },
                className: `mb-1 transition-all duration-300 ${isActive ? 'drop-shadow-lg' : ''}`
              })}
              <span
                className={`text-xs font-semibold transition-all duration-300 ${
                  isActive ? 'text-primary' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;

