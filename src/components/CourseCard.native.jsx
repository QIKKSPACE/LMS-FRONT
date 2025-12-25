/**
 * CourseCard React Native Version
 * 
 * This is an example of how the CourseCard component would look in React Native.
 * Replace all web components with React Native equivalents:
 * 
 * Usage:
 * import { View, Text, Image, StyleSheet } from 'react-native';
 * import LinearGradient from 'react-native-linear-gradient'; // For gradient backgrounds
 * 
 * Note: This is a reference implementation showing the conversion pattern.
 * In a real React Native app, you would use this instead of CourseCard.jsx
 */

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ProgressBar from './ProgressBar.native'; // Assume native version exists

const CourseCardNative = ({
  title,
  membershipType,
  thumbnail,
  instructorImage,
  status,
  progress,
  chapters,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return '#10B981'; // green-500
      case 'IN_PROGRESS':
        return '#3B82F6'; // blue-500
      case 'EXPIRED':
        return '#EF4444'; // red-500
      case 'PAID':
        return '#A855F7'; // purple-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, // Android shadow
    },
    thumbnailContainer: {
      height: 192,
      backgroundColor: '#1F2937',
      position: 'relative',
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
      opacity: 0.5,
    },
    overlayContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 8,
    },
    avatarBorder: {
      position: 'absolute',
      top: -4,
      left: -4,
      right: -4,
      bottom: -4,
      borderRadius: 9999,
      borderWidth: 4,
      borderColor: '#DC2626', // primary color
      opacity: 0.8,
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 4,
      borderColor: '#FFFFFF',
    },
    titleOverlay: {
      marginTop: 8,
      alignItems: 'center',
    },
    titleMain: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    titleSub: {
      color: '#FFFFFF',
      fontSize: 14,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    detailsContainer: {
      padding: 16,
    },
    membershipRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    membershipText: {
      fontSize: 12,
      color: '#6B7280',
      marginRight: 4,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    courseTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#111827',
      flex: 1,
      marginRight: 8,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      alignSelf: 'flex-start',
    },
    statusText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    progressContainer: {
      marginBottom: 8,
    },
    progressInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressText: {
      fontSize: 14,
      color: '#DC2626',
      fontWeight: '500',
    },
    chaptersText: {
      fontSize: 14,
      color: '#6B7280',
    },
  });

  return (
    <View style={styles.card}>
      {/* Thumbnail Banner Section */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: thumbnail }}
          style={styles.thumbnailImage}
          resizeMode="cover"
        />
        
        {/* Overlay Content */}
        <View style={styles.overlayContent}>
          {/* Circular Avatar with Border */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBorder} />
            <Image
              source={{ uri: instructorImage }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          
          {/* Course Title Overlay */}
          <View style={styles.titleOverlay}>
            <Text style={styles.titleMain}>
              {title.split(' ').slice(0, -1).join(' ')}
            </Text>
            <Text style={styles.titleSub}>
              {title.split(' ').slice(-1)[0]}
            </Text>
          </View>
        </View>
      </View>

      {/* Course Details Section */}
      <View style={styles.detailsContainer}>
        {/* Membership Type */}
        <View style={styles.membershipRow}>
          <Text style={styles.membershipText}>{membershipType}</Text>
          <Text>🔥</Text>
        </View>

        {/* Title and Status Badge */}
        <View style={styles.titleRow}>
          <Text style={styles.courseTitle} numberOfLines={2}>
            {title}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(status) },
            ]}
          >
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} />
        </View>

        {/* Progress Text and Chapters */}
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {progress}% completed
          </Text>
          <Text style={styles.chaptersText}>
            {chapters} Chapters
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CourseCardNative;

