/**
 * SidebarNav Component
 * 
 * React Native Conversion Notes:
 * - Replace <div> with <View> from react-native
 * - Replace <button> with <TouchableOpacity> from react-native
 * - flex-col → flexDirection: 'column'
 * - fixed left → position: 'absolute', left: 0
 * - h-screen → height: '100%' or Dimensions.get('window').height
 * - border-r → borderRightWidth, borderRightColor
 * - Use react-native-vector-icons for icons
 */
import React from 'react';
import { Home, MenuBook, Person, Logout } from '@mui/icons-material';
import Header from './Header';

const SidebarNav = ({ activeTab, onTabChange, onLogout }) => {
  const iconColor = 'rgb(220, 38, 38)'; // rgb(220 38 38 / var(--tw-bg-opacity, 1))
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'mycourse', label: 'My Course', icon: MenuBook },
    { id: 'profile', label: 'Profile', icon: Person },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log('Logout clicked');
      // Add your logout logic here
    }
  };

  return (
    <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex-col z-40 shadow-2xl">
      {/* Header at the top */}
      <div className="border-b border-gray-200/50 bg-gradient-to-r from-white/90 to-white/70">
        <Header />
      </div>
      
      {/* Navigation Items */}
      <div className="flex flex-col px-4 py-6 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-row items-center py-3 px-4 rounded-xl mb-2 transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30 transform scale-105'
                  : 'text-gray-700 hover:bg-gray-100/80 hover:transform hover:scale-[1.02]'
              }`}
            >
              {React.createElement(item.icon, { 
                style: { 
                  color: isActive ? 'white' : iconColor, 
                  fontSize: '20px' 
                },
                className: 'mr-3 transition-all duration-300'
              })}
              <span className={`font-semibold ${isActive ? 'text-white' : 'text-gray-700'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Logout Button */}
      <div className="px-4 mt-auto pb-4">
        <button
          onClick={handleLogout}
          className="flex flex-row items-center py-3 px-4 rounded-xl w-full transition-all duration-300 text-gray-700 hover:bg-red-50 hover:border hover:border-red-200 hover:text-red-600"
        >
          {React.createElement(Logout, { 
            style: { color: iconColor, fontSize: '20px' },
            className: 'mr-3 transition-all duration-300'
          })}
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;

