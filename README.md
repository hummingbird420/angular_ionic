HRM Mobile App

Features
Employee Management: View and manage employee profiles and details.
Attendance Tracking: Mark attendance and view attendance history.
Leave Requests: Submit and approve leave requests.
Push Notifications: Real-time updates on HR-related activities.
Cross-Platform: Fully functional on Android and iOS.


echnologies Used
Frontend Framework: Angular with Ionic for hybrid app development.
Mobile UI Framework: Ionic Components.
State Management: Ionic state and ngxs state.
Backend Integration: RESTful APIs.
Build Tools: Capacitor and Angular CLI.

Prerequisites
Node.js (>= v14)
Angular CLI (>= v15)
Ionic CLI (>= v6)
Git
A mobile emulator or a connected device for testing.

Running the App
Serve the app in the browser:  ionic serve
The app will be accessible at http://localhost:8100.

Test on an emulator or a connected device:  ionic capacitor run android
# or
ionic capacitor run ios


Building for Production
To build the app for production: ionic build --prod

Generate platform-specific builds: ionic capacitor build android
                                   ionic capacitor build ios


                                   
Folder Structure
src/
├── app/                 # Application modules and components
├── assets/              # Static assets (images, icons, etc.)
├── environments/        # Environment-specific configurations
├── theme/               # Global styles and themes
├── index.html           # Main HTML file
├── main.ts              # Application entry point


Environment Configuration
environment.ts: Development settings.
environment.prod.ts: Production settings.
Update API endpoints, keys, and other configuration values as needed.
