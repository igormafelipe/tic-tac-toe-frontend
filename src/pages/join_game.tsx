import { useState } from 'react';
import axios from 'axios';
import '../css/App.css';
import { useNavigate } from "react-router-dom";
import { O } from '../constants/constants';

function JoinGame() {
  const navigate = useNavigate()

  const [gameCode, setGameCode] = useState('');

  const handleInputChange = (event) => {
    setGameCode(event.target.value);
  };

  const handleJoinClick = async () => {
    console.log("Joining game with code:", gameCode);
    
    const response = await axios.post('http://127.0.0.1:5000/join_game', {room_id: gameCode});
    const [status, message] = [response.data.status, response.data.message];

    if (status === "success") {
      navigate("/game", { state: {room_id : gameCode, player: O}});
    } else {
      alert(message);
    }
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <h2>Enter Game Code</h2>
        <input
          type="text"
          value={gameCode}
          onChange={handleInputChange}
          placeholder="Type the game code"
        />
        <br/><br/>
        <button onClick={handleJoinClick}>
          Join
        </button>
      </div>
    </div>
  );
}

export default JoinGame;