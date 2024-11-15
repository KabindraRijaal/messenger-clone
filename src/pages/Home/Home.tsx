import { Link } from 'react-router-dom';
import './Home.scss';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Facebook Messenger Clone</h1>
      <Link to="/chat" className="chat-link">
        Start Chatting
      </Link>
    </div>
  );
};

export default Home; 