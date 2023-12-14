import '../App.css';

function App() {
  return (
    <div className="button-container">
      <button className="big-button" onClick={() => console.log("join")}>
        Join
      </button>
      <button className="big-button" onClick={() => console.log("new")}>
        New
      </button>
    </div>
  );
}

export default App;