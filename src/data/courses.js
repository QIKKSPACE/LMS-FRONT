// Static course data
export const courses = [
  {
    id: 1,
    title: "Python for Data Science and Machine Learning",
    membershipType: "DCA- Silver Membership",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    status: "COMPLETED",
    progress: 100,
    chapters: 15,
    category: "all",
    isPurchased: true,
    price: 299,
    expiryDate: "2025-12-31", // Expiry date set by admin (YYYY-MM-DD format)
    description: "Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Scikit-Learn, Machine Learning, Tensorflow, and more!",
    sections: [
      {
        id: 1,
        title: "Introduction",
        lectures: 23,
        completed: 23,
        duration: "5hr 6min",
        lecturesList: [
          { id: 1, title: "Welcome to the Course", duration: "5:30", isCompleted: true, videoUrl: "" },
          { id: 2, title: "Course Overview", duration: "8:15", isCompleted: true, videoUrl: "" },
          { id: 3, title: "Setting Up Your Environment", duration: "12:45", isCompleted: true, videoUrl: "" },
        ]
      },
      {
        id: 2,
        title: "Data Science Libraries",
        lectures: 12,
        completed: 12,
        duration: "3hr 13min",
        lecturesList: [
          { id: 1, title: "Introduction to NumPy", duration: "15:20", isCompleted: true, videoUrl: "" },
          { id: 2, title: "Working with Pandas", duration: "22:10", isCompleted: true, videoUrl: "" },
          { id: 3, title: "Data Visualization with Matplotlib", duration: "18:45", isCompleted: true, videoUrl: "" },
        ]
      },
      {
        id: 3,
        title: "Machine Learning",
        lectures: 8,
        completed: 8,
        duration: "2hr 1min",
        lecturesList: [
          { id: 1, title: "Introduction to Machine Learning", duration: "20:30", isCompleted: true, videoUrl: "" },
          { id: 2, title: "Supervised Learning", duration: "25:15", isCompleted: true, videoUrl: "" },
          { id: 3, title: "Unsupervised Learning", duration: "18:20", isCompleted: true, videoUrl: "" },
        ]
      },
      {
        id: 4,
        title: "Deep Neural Network (DNN)",
        lectures: 6,
        completed: 6,
        duration: "1hr 43min",
        lecturesList: [
          { id: 1, title: "Neural Networks Basics", duration: "22:00", isCompleted: true, videoUrl: "" },
          { id: 2, title: "Building Your First DNN", duration: "28:30", isCompleted: true, videoUrl: "" },
        ]
      },
      {
        id: 5,
        title: "Convolutional Neural Network (CNN)",
        lectures: 6,
        completed: 6,
        duration: "1hr 21min",
        lecturesList: [
          { id: 1, title: "CNN Fundamentals", duration: "19:45", isCompleted: true, videoUrl: "" },
          { id: 2, title: "Image Classification", duration: "24:20", isCompleted: true, videoUrl: "" },
        ]
      },
      {
        id: 6,
        title: "Computer Vision Application",
        lectures: 5,
        completed: 5,
        duration: "1hr 15min",
        lecturesList: [
          { id: 1, title: "Image Processing", duration: "16:30", isCompleted: true, videoUrl: "" },
          { id: 2, title: "Object Detection", duration: "20:15", isCompleted: true, videoUrl: "" },
        ]
      },
      {
        id: 7,
        title: "Natural Language Processing",
        lectures: 7,
        completed: 7,
        duration: "1hr 52min",
        lecturesList: [
          { id: 1, title: "NLP Basics", duration: "18:00", isCompleted: true, videoUrl: "" },
          { id: 2, title: "Text Preprocessing", duration: "22:30", isCompleted: true, videoUrl: "" },
        ]
      },
      {
        id: 8,
        title: "Model Deployment",
        lectures: 4,
        completed: 4,
        duration: "1hr 8min",
        lecturesList: [
          { id: 1, title: "Deployment Strategies", duration: "15:45", isCompleted: true, videoUrl: "" },
          { id: 2, title: "Cloud Deployment", duration: "19:20", isCompleted: true, videoUrl: "" },
        ]
      },
    ]
  },
  {
    id: 2,
    title: "Advanced Spiritual Practices",
    membershipType: "Premium Membership",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
    status: "PAID",
    progress: 0,
    chapters: 20,
    category: "all",
    isPurchased: false,
    price: 399,
    expiryDate: "2025-06-30", // Expiry date set by admin (YYYY-MM-DD format)
  },
  {
    id: 3,
    title: "Meditation Mastery Course",
    membershipType: "Basic Membership",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
    status: "PAID",
    progress: 0,
    chapters: 12,
    category: "all",
    isPurchased: false,
    price: 199,
    expiryDate: "2025-08-15", // Expiry date set by admin (YYYY-MM-DD format)
  },
  {
    id: 4,
    title: "Yoga Fundamentals",
    membershipType: "Free Trial",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
    status: "PAID",
    progress: 0,
    chapters: 10,
    category: "all",
    isPurchased: false,
    price: 149,
    expiryDate: "2025-07-20", // Expiry date set by admin (YYYY-MM-DD format)
  },
  {
    id: 5,
    title: "Mindfulness and Wellness",
    membershipType: "Standard Membership",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop",
    status: "PAID",
    progress: 0,
    chapters: 18,
    category: "all",
    isPurchased: false,
    price: 249,
    expiryDate: "2025-09-10", // Expiry date set by admin (YYYY-MM-DD format)
  },
  {
    id: 6,
    title: "Spiritual Growth Journey",
    membershipType: "Elite Membership",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
    status: "PAID",
    progress: 0,
    chapters: 25,
    category: "all",
    isPurchased: false,
    price: 499,
    expiryDate: "2025-11-30", // Expiry date set by admin (YYYY-MM-DD format)
  },
];

