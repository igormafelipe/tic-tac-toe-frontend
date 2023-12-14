import { useState } from 'react';
import '../App.css';

function JoinGame() {
  const [gameCode, setGameCode] = useState('');

  const handleInputChange = (event) => {
    setGameCode(event.target.value);
  };

  const handleJoinClick = () => {
    console.log("Joining game with code:", gameCode);
    // Add logic to handle joining the game with the entered code
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