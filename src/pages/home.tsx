import '../css/App.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { X } from '../constants/constants';

function App() {
  const navigate = useNavigate()

  const CreateGame = async () => {
    const response = await axios.post('http://127.0.0.1:5000/create_game');
    const modifiedResponse = {
      ...response.data,
      from: "create_game",
      player: X,
    }
    console.log(modifiedResponse)
    if (modifiedResponse.status === "success") {
      navigate("/game", { state: modifiedResponse })
    } else {
      // To do: display error message to user more 
      alert("Unable to create game!")
      console.log(modifiedResponse)
    }
  }

  return (
    <div className="button-container">
      <button className="big-button" 
              onClick={() => navigate("/joingame")
      }>
        Join
      </button>
      <button className="big-button" onClick={CreateGame}>
        New
      </button>
    </div>
  );
}

export default App;