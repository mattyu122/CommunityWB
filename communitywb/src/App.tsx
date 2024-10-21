import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css'; // Import the external CSS file
import ConfirmContact from './page/ConfirmContact';
import LoginSignUpPage from './page/LoginSignUp';
import MainPage from './page/Main';
import { useUserStore } from './stores/userStateStore';
function App() {
  const { setTokens, setUser } = useUserStore();

  useEffect(() => {
      // Check if tokens exist in localStorage
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const idToken = localStorage.getItem('idToken');

      if (accessToken && refreshToken && idToken) {
          // Restore tokens to the Zustand store
          setTokens(accessToken, refreshToken, idToken);

      }
  }, [setTokens, setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/loginSignUp" element={<LoginSignUpPage/>} />
        <Route path="/confirmEmail" element={<ConfirmContact/>} />
      </Routes>
    </Router>
  );
}

export default App;