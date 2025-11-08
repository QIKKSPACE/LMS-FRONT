import React, { useState } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { courses } from '../data/courses';

const MyCourseDetailsPage = ({ courseId, onBack }) => {
  if (!courseId || !onBack) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const course = courses.find((c) => c.id === courseId);
  
  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="px-4 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
          >
            <ArrowBack style={{ fontSize: '20px', marginRight: '8px' }} />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Course Banner */}
          <div className="mb-6">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Progress */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Your Progress</h2>
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{course.progress}% Complete</p>
          </div>

          {/* Course Info */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Course Information</h2>
            <div className="space-y-2">
              <p><strong>Chapters:</strong> {course.chapters}</p>
              <p><strong>Status:</strong> {course.status}</p>
              <p><strong>Membership:</strong> {course.membershipType}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourseDetailsPage;
