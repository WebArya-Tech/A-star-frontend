# Student Dashboard -    iThinkLearn

## Overview
A comprehensive student panel/dashboard for the    iThinkLearn platform. This dashboard provides students with a centralized location to manage their courses, assignments, schedules, progress, and more.

## 🎨 Design System

### Color Palette (from Homepage)
- **Primary Blue**: `#196d83` - Main brand color
- **Primary Gold**: `#ddaa2c` - Accent color
- **Accent Gold**: `#ffd700` - Highlights
- **Light Background**: `#fef9f0` - Soft backgrounds
- **Success Green**: `#28a745` - Positive actions
- **Warning Yellow**: `#ffc107` - Alerts
- **Danger Red**: `#dc3545` - Important alerts

### Typography
- Font Stack: System fonts for optimal performance
- Headings: Bold, clear hierarchy
- Body: Readable with proper line-height

## 📁 File Structure

```
src/components/student-dashboard/
├── StudentDashboard.jsx      # Main dashboard container
├── StudentSidebar.jsx         # Navigation sidebar
├── DashboardHome.jsx          # Dashboard home/overview
├── MyCourses.jsx              # Course management
├── MyAssignments.jsx          # Assignment tracking
├── MyProgress.jsx             # Performance analytics
├── MySchedule.jsx             # Class schedule
├── MyProfile.jsx              # Student profile
├── Notifications.jsx          # Notification center
└── SupportHelp.jsx            # Help & support
```

## 🚀 Features

### 1. Dashboard Home (`DashboardHome.jsx`)
- **Welcome Banner**: Personalized greeting with gradient background
- **Quick Stats**:
  - Enrolled Courses count
  - Pending Assignments
  - Completed work percentage
  - Upcoming Classes
- **Upcoming Classes**: Next 3 classes with tutor info and join buttons
- **Recent Assignments**: Latest assignments with status badges
- **Notifications**: Recent updates and alerts
- **Quick Actions**: Fast navigation to key features

### 2. My Courses (`MyCourses.jsx`)
- **Course Cards**: Visual display with:
  - Course icon and title
  - Tutor information
  - Progress bar
  - Class completion stats
  - Next class timing
  - Status badges (Active/Completed)
- **Filters**: All, Active, Completed
- **Actions**: View details, Access materials
- **Enrollment**: Button to enroll in new courses

### 3. My Assignments (`MyAssignments.jsx`)
- **Assignment List** with:
  - Title, course, and description
  - Due date with countdown
  - Priority badges (High/Medium)
  - Status indicators (Pending/Submitted/Graded)
  - Points and grades
  - Attachments count
- **Stats Dashboard**:
  - Pending count
  - Submitted count
  - Graded count
  - Total assignments
- **Filters**: All, Pending, Submitted, Graded
- **Actions**: Submit, View details, Download feedback

### 4. My Progress (`MyProgress.jsx`)
- **Overall Statistics**:
  - Course completion progress
  - Average grade
  - Attendance rate
  - Assignment completion
- **Course-wise Performance**:
  - Individual course progress bars
  - Grades and attendance per course
  - Assignment tracking
- **Recent Grades**: List of latest graded work
- **Performance Insights**:
  - Strengths identification
  - Areas for improvement

### 5. My Schedule (`MySchedule.jsx`)
- **Weekly Calendar**: 7-day view with:
  - Time slots for each class
  - Tutor information
  - Class type icons (Live/Lab/Workshop)
  - Join class buttons
- **Upcoming Events**: Important dates and exams
- **Study Hours Summary**:
  - Hours this week
  - Classes attended
  - Today's schedule
- **View Options**: Week/Month toggle

### 6. My Profile (`MyProfile.jsx`)
- **Profile Header**:
  - Profile picture (initials if no photo)
  - Student ID
  - Contact information
  - Education level badges
- **Editable Sections**:
  - Personal Information
  - Academic Information
  - Guardian Information
- **Account Settings**:
  - Change password
  - Notification preferences
  - Account deactivation

### 7. Notifications (`Notifications.jsx`)
- **Notification Types**:
  - Assignments
  - Grades
  - Class reminders
  - Study materials
  - Announcements
  - Events
- **Features**:
  - Unread count
  - Mark as read (individual/all)
  - Category filters
  - Time stamps
- **Settings**:
  - Email notifications toggle
  - Push notifications toggle
  - Reminder preferences

### 8. Support & Help (`SupportHelp.jsx`)
- **Contact Options**:
  - Phone support
  - Email support
  - Live chat
- **Support Tickets**:
  - Create new ticket
  - View existing tickets
  - Track status (Open/In Progress/Resolved)
- **FAQ Section**:
  - Category filters
  - Searchable questions
  - Detailed answers
- **Additional Resources**:
  - Help Center link
  - Video Tutorials

## 🎯 Key Components

### StudentSidebar
- Fixed left sidebar navigation
- Active state highlighting
- Icon + label for each menu item
- Logout button at bottom
- Collapsible on mobile

### Header
- Sticky top navigation
- Hamburger menu for sidebar toggle
- Notification bell with badge
- User profile with dropdown

## 📱 Responsive Design
- **Desktop**: Full sidebar + main content
- **Tablet**: Collapsible sidebar
- **Mobile**: Hamburger menu, mobile-optimized layouts

## 🔧 Usage

### Access the Dashboard
Navigate to `/student-dashboard` route in the application.

### Navigation
```javascript
// In App.jsx, the route is configured:
case 'student-dashboard':
  return <StudentDashboard />
```

### Mock Data
Currently uses mock/dummy data for demonstration. In production, replace with API calls:
- Student information
- Course enrollments
- Assignment data
- Progress metrics
- Schedule information

## 🎨 Styling Approach
- Inline styles for color consistency
- Tailwind CSS for layout and utilities
- Consistent spacing and shadows
- Smooth transitions and hover effects

## 📊 Data Structure Examples

### Student Data
```javascript
{
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  studentId: 'ICFY2024001',
  enrollmentDate: '2024-01-15',
  courses: 5,
  assignments: 12,
  completedAssignments: 8
}
```

### Course Data
```javascript
{
  id: 1,
  title: 'Undergraduate Mathematics - Calculus',
  tutor: 'Ms. Ramya Rajamani',
  progress: 75,
  totalClasses: 40,
  completedClasses: 30,
  upcomingClass: 'Today, 4:00 PM',
  status: 'active'
}
```

## 🔮 Future Enhancements
1. **Real-time Updates**: WebSocket integration for live notifications
2. **Video Integration**: Direct class joining with video conferencing
3. **File Upload**: Assignment submission with file attachments
4. **Calendar Sync**: Export schedule to Google Calendar/iCal
5. **Progress Analytics**: Advanced charts and reports
6. **Peer Interaction**: Discussion forums and study groups
7. **Mobile App**: Native iOS/Android applications
8. **Offline Mode**: Access content without internet
9. **Gamification**: Badges, achievements, leaderboards
10. **AI Assistant**: Chatbot for instant help

## 🐛 Troubleshooting

### Common Issues
1. **Sidebar not showing**: Check `sidebarOpen` state
2. **Colors not matching**: Verify color variables match homepage
3. **Navigation not working**: Ensure `setCurrentView` is passed correctly

## 📝 Notes
- Dashboard hides the main app navbar and footer
- Color scheme matches the homepage design
- All components are fully responsive
- Mock data should be replaced with real API calls
- Component structure allows easy customization

## 🤝 Contributing
When adding new features:
1. Follow the existing color scheme
2. Maintain consistent spacing
3. Ensure mobile responsivity
4. Add proper status indicators
5. Include loading states

## 📧 Support
For questions or issues with the student dashboard:
- Email: icfyglobal@ixpoe.com
- Phone: +91 779 501 0900

---

**Last Updated**: February 19, 2026
**Version**: 1.0.0
**Author**:    iThinkLearn Development Team
