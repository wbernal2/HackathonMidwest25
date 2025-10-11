# HangHub - Social Hangout Planning App 🧭

## Project Overview
HangHub is a React Native mobile app built with Expo that helps friends plan hangouts together using a Tinder-style activity matching system. Users can create hangout sessions, invite friends, and swipe through activity suggestions to find the perfect match for everyone.

## 🎨 **NEW: Lyrical Lemonade-Inspired Design**
The app now features a minimal, clean aesthetic inspired by Lyrical Lemonade's brand:
- **Color Palette**: Bold yellow (#FFD700), pure black (#000000), clean white (#FFFFFF)  
- **Typography**: Heavy, sans-serif fonts with high contrast
- **Design Elements**: Sharp corners, bold borders, minimal shadows
- **Layout**: Clean spacing, uppercase labels, geometric shapes

## Current Implementation Status ✅

### ✅ Completed Screens

#### 1. **Home/Start Screen** (`app/(tabs)/index.tsx`)
- Welcome screen with HangHub branding
- "Create a Hangout" button (navigates to session setup)
- "Join with Link" button (for joining existing sessions)
- "How it Works" explanation section
- **Status**: Fully functional with navigation

#### 2. **Session Setup Screen** (`app/(tabs)/create-session.tsx`)
- Form for hangout details:
  - Hangout name input
  - Location input
  - Date input (text field)
  - Time input (text field)
  - Group size selector (2, 3, 4, 5, 6+)
- "Continue to Invites" button
- **Status**: UI complete, ready for navigation connection

#### 3. **Invite Friends Screen** (`app/(tabs)/invite-friends.tsx`)
- Shareable invite code display (e.g., "HANG2025")
- Share link functionality with native sharing
- Quick invite friends list with tap-to-invite
- Visual indicators for invited friends
- Friend counter and status display
- "Start Hangout Planning" button
- "Skip for now" option
- **Status**: Fully functional UI

#### 4. **Activity Swipe Screen** (`app/(tabs)/activity-swipe.tsx`) 🎯 **CORE FEATURE**
- Tinder-style card interface for activity suggestions
- Pre-loaded activities: Bowling, Coffee, Mini Golf, Movies, Escape Room, Hiking
- Swipe animations (right=like, left=pass)
- Like/Pass buttons as alternative to swiping
- Progress bar showing completion status
- Activity details: emoji, category, duration, cost
- Real-time stats tracking (liked/passed counts)
- Card stacking effect (next card preview)
- **Status**: Fully functional swiping experience

### 🚧 Remaining Screens to Build

#### 5. **Match Results Screen** (Next Priority)
- Display activities that were liked by user
- Voting interface if multiple people in group
- Conflict resolution for different preferences
- "Confirm Plan" button

#### 6. **Plan Confirmation Screen**
- Final hangout details summary
- Location, time, attendees list
- Activity chosen with details
- "Start Hangout" button

#### 7. **Live Moment Screen**
- Photo capture during hangout
- Share and save options
- Memory creation features

#### 8. **End Summary Screen**
- Hangout recap with photos
- Feedback rating system
- "Plan Next Hangout" suggestion

## Technical Architecture 🛠️

### **Frontend Stack**
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and runtime
- **Expo Router**: File-based navigation system
- **TypeScript**: Type safety and better development experience

### **Backend Stack**
- **Express.js**: RESTful API server
- **MongoDB Atlas**: Cloud database for hangout sessions
- **Node.js**: Runtime environment

### **Key Features Implemented**
1. **Responsive Design**: Works on iOS and Android
2. **Native Sharing**: Uses device's native share functionality
3. **Smooth Animations**: Card transitions and UI feedback
4. **TypeScript Integration**: Type-safe development
5. **Expo Router Navigation**: Modern navigation patterns

## Development Setup 🚀

### **Prerequisites**
- Node.js (v16+)
- Expo CLI
- MongoDB Atlas account
- Mobile device with Expo Go app OR iOS Simulator/Android Emulator

### **Installation Steps**
1. Clone the repository
2. Install dependencies:
   ```bash
   cd MyProject
   npm install
   ```
3. Set up environment variables in `/server/.env`:
   ```
   MONGODB_URI=mongodb+srv://willberndev_db_user:msaPuGaCB754xkpT@hangcluster.j3wrszx.mongodb.net/
   PORT=3000
   NODE_ENV=development
   ```

### **Running the Application**

#### **Start Backend Server:**
```bash
cd server
npm start
```
Server will run on: `http://172.16.0.251:3000`

#### **Start Frontend (Mobile App):**
```bash
cd MyProject
npx expo start --tunnel
```

#### **Access on Mobile:**
1. Install Expo Go app on your phone
2. Scan the QR code displayed in terminal
3. App will load in Expo Go

## User Experience Flow 📱

```
1. Home Screen → "Create a Hangout"
2. Session Setup → Enter details (name, location, date/time, group size)
3. Invite Friends → Share code, select friends, start planning
4. Activity Swipe → Swipe through activity suggestions
5. Match Results → See what everyone liked (TO BUILD)
6. Plan Confirmation → Finalize the hangout (TO BUILD)
7. Live Moment → Capture memories during hangout (TO BUILD)
8. End Summary → Rate experience, plan next (TO BUILD)
```

## For Team Members 👥

### **What You Can Test Right Now:**
1. **Home Screen**: Navigation to create session
2. **Session Setup**: Form inputs and validation
3. **Invite Friends**: Sharing functionality and friend selection
4. **Activity Swipe**: Full swipe experience with 6 different activities

### **Quick Start for New Developers:**
1. Clone repo and run `npm install` in both `/server` and `/MyProject`
2. Start backend: `cd server && npm start`
3. Start frontend: `cd MyProject && npx expo start --tunnel`
4. Scan QR code with Expo Go app

### **File Structure:**
```
/MyProject/app/(tabs)/
├── index.tsx           # Home screen
├── create-session.tsx  # Session setup form
├── invite-friends.tsx  # Friend invitation
├── activity-swipe.tsx  # Core swiping feature
└── _layout.tsx         # Tab navigation

/server/
├── src/index.js        # Express API server
├── .env               # Environment variables
└── package.json       # Dependencies
```

## Next Development Priorities 🎯

1. **Complete Navigation Flow**: Connect all screens with proper routing
2. **Build Match Results Screen**: Show liked activities and voting
3. **Implement Real-time Features**: Multiple users swiping simultaneously
4. **Add User Authentication**: Login/signup system
5. **Database Integration**: Save sessions and user preferences
6. **Push Notifications**: Friend invites and session updates
7. **Polish UI/UX**: Animations, loading states, error handling

## Demo Features Working Now 🎉

- ✅ Beautiful, responsive mobile interface
- ✅ Smooth card swiping with animations
- ✅ Native sharing for invite codes
- ✅ Form inputs with validation
- ✅ Progress tracking during swiping
- ✅ Activity data with details (time, cost, category)
- ✅ Visual feedback for all interactions

**Ready for Hackathon Demo**: The core swiping feature is fully functional and provides a great user experience that demonstrates the app's main value proposition!