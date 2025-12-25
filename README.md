# LMS Web App

A Learning Management System (LMS) web application built with React and TailwindCSS, designed with React Native compatibility in mind.

## Features

- **Mobile-First Design**: Responsive UI that matches mobile app design patterns
- **Desktop Responsive**: Converts bottom navigation to sidebar on larger screens
- **Filter Tabs**: Filter courses by All, In Progress, Completed, Expired, Paid
- **Course Cards**: Beautiful course cards with progress tracking
- **Reusable Components**: All components structured for easy React Native migration

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Component Structure

All components include comments explaining how to convert them to React Native:

- `CourseCard.jsx` - Reusable course card component
- `ProgressBar.jsx` - Progress indicator component
- `FilterTabs.jsx` - Horizontal tab selector
- `BottomNav.jsx` - Mobile bottom navigation
- `SidebarNav.jsx` - Desktop sidebar navigation
- `CoursesPage.jsx` - Main courses page with filtering

## React Native Conversion

Each component includes detailed comments at the top explaining:
- How to replace HTML elements (`div` → `View`, `img` → `Image`)
- How to convert Tailwind classes to React Native StyleSheet
- How to handle layout differences (flexbox, positioning)
- Icon replacement strategies

## Responsive Breakpoints

- **Mobile**: Default layout with bottom navigation
- **Desktop (lg)**: Sidebar navigation, grid layout for course cards

## Tech Stack

- React 18
- Vite
- TailwindCSS 3
- Modern ES6+ JavaScript

