import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../game_board.css";

function makeBoard() {
    return [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
}

function GameBoard(props) {
    const X = "X";
    const O = "O";
    const EMPTY = " ";
    const FREE_MOVE = -1;
    const ERROR = -2;
    
    const navigate = useNavigate();

    // if (props.player) {
    //     navigate("/");
    // }

    const [board, setBoard] = useState([[makeBoard(), makeBoard(), makeBoard()],
                                        [makeBoard(), makeBoard(), makeBoard()],
                                        [makeBoard(), makeBoard(), makeBoard()]]);
    const [turn, setTurn] = useState("X");
    const [boardToPlay, setBoardToPlay] = useState(FREE_MOVE);
    const [winner, setWinner] = useState(EMPTY);
    const [boardWinner, setBoardWinner] = useState([[EMPTY, EMPTY, EMPTY], 
                                                    [EMPTY, EMPTY, EMPTY], 
                                                    [EMPTY, EMPTY, EMPTY]]);

    // To Do: Make this more elegant
    props.socket.on("board_update_failed", (data) => {
        alert("Invalid move");
        console.log(data);
    });

    props.socket.on("board_updated", (data) => {
        // update the local board
        const x = data.x;
        const y = data.y;
        const boardToPlay = data.board; // number between 0 and 8
        const boardToPlayX = Math.floor(boardToPlay / 3);
        const boardToPlayY = boardToPlay % 3;
        const player = data.player;

        if (x === null || y === null || boardToPlay === null || player === null) {
            return;
        }

        // Update is working but wrong board is being updated
        const new_board = [...board];
        console.log(new_board);
        new_board[boardToPlayY][boardToPlayX][y][x] = player;
        console.log(new_board);
        setBoard(new_board);
    });	

    props.socket.on("change_turn", (data) => {
        // update the next board and the turn of the players
        // update the local board
        console.log(data);
        const boardToPlay = data.board;
        const next_player = data.next_player;
 
        setBoardToPlay(boardToPlay);
        setTurn(next_player);
    });

    const handleMove = (rowIndex, colIndex) => {
        if (turn !== props.player) {
            console.log("Not your turn");
            return;
        }
        
        // row is a number between 0 and 8
        // col is a number between 0 and 8
        // board to play is a number between 0 and 8

        const board_x_index = Math.floor(rowIndex / 3);
        const board_y_index = Math.floor(colIndex / 3);
        const board_index = board_y_index * 3 + board_x_index;

        if (boardToPlay !== FREE_MOVE && boardToPlay !== board_index) {
            alert("Invalid move")
            return;
        }

        const move_x_index = colIndex % 3;
        const move_y_index = rowIndex % 3;

        props.socket.emit("make_move", {x: move_x_index, y: move_y_index, board: board_index, player: props.player, game_id: props.room_id});
    };

    const renderBoard = () => {
        return (
            <div className="ultimate-board">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="ultimate-row">
                        {row.map((subBoard, colIndex) => (
                            <div key={colIndex} className="sub-board">
                                <br></br>
                                {subBoard.map((board_, boardIndex) => (
                                    <div key={boardIndex} className="row">
                                        {board_.map((cell, cellIndex) => (
                                            <div
                                                key={cellIndex}
                                                className="cell"
                                                onClick={() =>
                                                    handleMove(
                                                        rowIndex * 3 + boardIndex,
                                                        colIndex * 3 + cellIndex
                                                    )
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
        <div>
            <h1>Room {props.room_id}</h1>
            <h1>Playing as {props.player}</h1>
            <h1>{turn}'s turn, play on board {boardToPlay}</h1>
            <div className="game-board">
                {renderBoard()}
            </div>
        </div>
    );
}

export default GameBoard;