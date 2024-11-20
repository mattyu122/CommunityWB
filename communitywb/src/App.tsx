import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { axiosClient, axiosClientMultipart } from './api/axios/axiosClient';
import { setupInterceptors } from './api/axios/axiosInterceptor';
import './App.css'; // Import the external CSS file
import { useNavigation } from './hooks/useNavigation';
import ConfirmContact from './page/ConfirmContact';
import LoginSignUpPage from './page/LoginSignUp/LoginSignUp';
import MainPage from './page/Main/Main';
import { useUserStore } from './stores/userStateStore';
function App() {
  const { navigateToLogin } = useNavigation();
  const { accessToken } = useUserStore();
  useEffect(() => {
      // Pass navigateToLogin to interceptors
      setupInterceptors(axiosClient);
      setupInterceptors(axiosClientMultipart);
  }, [navigateToLogin]);
  useEffect(() => {
      if (!accessToken) {
        navigateToLogin();
      }
  }, [accessToken, navigateToLogin]);
  return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/loginSignUp" element={<LoginSignUpPage/>} />
        <Route path="/confirmEmail" element={<ConfirmContact/>} />
      </Routes>
  );
}

export default App;