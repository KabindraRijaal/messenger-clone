import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import './styles/global.scss';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
