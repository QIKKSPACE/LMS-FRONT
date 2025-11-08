/**
 * CoursesPage Component
 * 
 * React Native Conversion Notes:
 * - Replace <div> with <View> from react-native
 * - Use ScrollView or FlatList for course list
 * - flex-col → flexDirection: 'column'
 * - grid → Use FlatList with numColumns prop for grid layout
 * - px-4, py-4 → paddingHorizontal, paddingVertical
 * - mb-20 → marginBottom for bottom nav spacing
 * - Use SafeAreaView for mobile safe areas
 */
import React, { useState, useMemo } from 'react';
import CourseCard from '../components/CourseCard';
import FilterTabs from '../components/FilterTabs';
import { courses } from '../data/courses';

const CoursesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'expired', label: 'Expired' },
    { id: 'paid', label: 'Paid' },
  ];

  const filteredCourses = useMemo(() => {
    if (activeFilter === 'all') {
      return courses;
    }
    return courses.filter((course) => {
      const categoryMap = {
        in_progress: 'IN_PROGRESS',
        completed: 'COMPLETED',
        expired: 'EXPIRED',
        paid: 'PAID',
      };
      return course.status === categoryMap[activeFilter];
    });
  }, [activeFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm sticky top-0 z-30">
        <div className="flex flex-row items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <div className="flex flex-row items-center gap-4">
            <button className="text-gray-600">
              <span className="text-xl">🔍</span>
            </button>
            <button className="text-gray-600 relative">
              <span className="text-xl">🔔</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="text-gray-600">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <FilterTabs
          tabs={filterTabs}
          activeTab={activeFilter}
          onTabChange={setActiveFilter}
        />
      </div>

      {/* Desktop Filter Tabs */}
      <div className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-6 py-3">
          <FilterTabs
            tabs={filterTabs}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
          />
        </div>
      </div>

      {/* Course Cards List/Grid */}
      <div className="flex-1 px-4 py-4 pb-24 lg:pb-4">
        <div className="lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              membershipType={course.membershipType}
              thumbnail={course.thumbnail}
              instructorImage={course.instructorImage}
              status={course.status}
              progress={course.progress}
              chapters={course.chapters}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;

