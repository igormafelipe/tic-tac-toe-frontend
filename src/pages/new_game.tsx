import '../App.css';

function NewGame() {
  // Dummy game code for illustration
  const gameCode = "ABC123";

  return (
    <div className="game-container">
      <div className="game-info">
        <h2>Game Code:</h2>
        <p className="game-code">{gameCode}</p>
        <p>Waiting for someone to join your game</p>
      </div>
    </div>
  );
}

export default NewGame;