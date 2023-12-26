import "../css/game_board.css";
import "../css/confetti.scss";
import { EMPTY } from "../constants/constants";

function GameWinner(props) {
    const renderBoard = () => {
        return (
            <div className="ultimate-board">
                {props.board.map((row, rowIndex) => (
                    <div key={rowIndex} className="ultimate-row">
                        {row.map((subBoard, colIndex) => (
                            <div key={colIndex} className="sub-board">
                                <br></br>
                                {subBoard.map((board_, boardIndex) => (
                                    <div key={boardIndex} className="row">
                                        {board_.map((cell, cellIndex) => (
                                            <div
                                                key={cellIndex}
                                                className={
                                                    (props.boardWinner[colIndex][rowIndex] == props.player && "your_winner_cell") ||
                                                    (props.boardWinner[colIndex][rowIndex] != EMPTY && "opponent_winner_cell") ||
                                                    "inactive_cell"
                                                }
                                            >
                                                {cell}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };
    

    return (
        <div className="game-container">
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="turn">
                {props.winner == props.player ? <h2 className="your_turn">YOU WON!</h2> : 
                                        <h2 className="opponent_turn">YOU LOST!</h2>}
            </div>
            <div className="game-board">
                {renderBoard()}
            </div>
        </div>
    );
}

export default GameWinner;