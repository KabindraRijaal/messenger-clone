import { Routes, Route } from 'react-router-dom';
import Chat from '../pages/Chat/Chat';
import Home from '../pages/Home/Home';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
};

export default AppRoutes; 