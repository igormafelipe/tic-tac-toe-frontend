import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import WaitingForPlayer from '../components/waiting_for_player';
import Loading from '../components/loading';
import GameBoard from '../components/game_board';


function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  if (!data) {
    window.location.href = "/";
  }

  const [socket, setSocket] = useState(io());
  const [gameState, setGameState] = useState("none");

  useEffect(() => {
    if (gameState === "connected_to_socket") {
      console.log("Socket already exists")
      return;
    }

    console.log("Creating new socket");
  
    const newSocket = io('http://127.0.0.1:5000');

    newSocket.on('connect', () => {
      console.log("Connected to socket");
      setGameState("connected_to_socket");
      setSocket(newSocket);
    });
  
    // Cleanup socket when component unmounts
    return () => {
      newSocket.disconnect();
      setGameState("none");
    };
  }, []);

  useEffect(() => {
    if (!socket || gameState !== "connected_to_socket") {
      console.log("here")
      return;
    }

    setGameState("loading");

    socket.emit('join_game', { "id": data.room_id });

    const handlePlayer1Joined = () => {
      setGameState("waiting_for_player_2");
    };

    const handlePlayer2Joined = () => {
      setGameState("game_in_progress");
    };

    const handleGameNotFound = () => {
      alert("Game not found!");
    };

    const handleUnableToJoinGame = () => {
      alert("Unable to join game!");
      navigate("/");
    };

    socket.on('player_1_joined', handlePlayer1Joined);
    socket.on('player_2_joined', handlePlayer2Joined);
    socket.on('game_not_found', handleGameNotFound);
    socket.on('unable_to_join_game', handleUnableToJoinGame);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.room_id, gameState, socket]);

  return (
    <div>
      {gameState === "loading" && 
        <Loading/>}
      {gameState === "waiting_for_player_2" && 
        <WaitingForPlayer room_id={data.room_id} player={data.player} />}
      {gameState === "game_in_progress" && 
        <GameBoard socket={socket} room_id={data.room_id} player={data.player}/>}
    </div>
  );
}

export default Game;