// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Game from './pages/game';
import JoinGame from './pages/join_game';
import NewGame from './pages/new_game';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/game" element={<Game/>} />
        <Route path="/joingame" element={<JoinGame/>} />
        <Route path="/newgame" element={<NewGame/>} />
      </Routes>
    </Router>
  );
};

export default App;