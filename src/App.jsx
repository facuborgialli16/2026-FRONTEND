// App.jsx
import React from 'react'
import { Route, Routes } from 'react-router'

import LoginScreen from './Screens/LoginScreen/LoginScreen'
import RegisterScreen from './Screens/RegisterScreen/RegisterScreen'
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen/ForgotPasswordScreen'
import HomeScreen from './Screens/HomeScreen.jsx/HomeScreen'
import CreateWorkspaceScreen from './Screens/CreateWorkspaceScreen/CreateWorkspaceScreen'
import WorkspaceScreen from './Screens/WorkspaceScreen/WorkspaceScreen'
import ResetPasswordScreen from './Screens/ResetPasswordScreen/ResetPasswordScreen'

import AuthContextProvider from './Context/AuthContext'
import WorkspaceContextProvider from './Context/WorkspaceContext'
import AuthMiddleware from './Middlewares/AuthMiddleware'

import AcceptInvitationScreen from './Screens/AcceptInvitationScreen/AcceptInvitationScreen'

function App() {
  return (
    <AuthContextProvider>
      <WorkspaceContextProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path='/' element={<LoginScreen />} />
          <Route path='/login' element={<LoginScreen />} />
          <Route path='/register' element={<RegisterScreen />} />
          <Route path='/forgot-password' element={<ForgotPasswordScreen />} />
          <Route path='/reset-password' element={<ResetPasswordScreen />} />
          <Route path='/invitation/:token' element={<AcceptInvitationScreen />} />

          {/* Rutas privadas (requieren login) */}
          <Route element={<AuthMiddleware />}>
            <Route path='/home' element={<HomeScreen />} />
            <Route path='/create-workspace' element={<CreateWorkspaceScreen />} />

            {/* Workspace dinámico */}
            <Route path='/workspace/:workspace_id' element={<WorkspaceScreen />} />
            <Route path='/workspace/:workspace_id/channel/:channel_id' element={<WorkspaceScreen />} />
          </Route>
        </Routes>
      </WorkspaceContextProvider>
    </AuthContextProvider>
  )
}

export default App