import { useEffect, useState } from "react";
import "../css/game_board.css";
import { EMPTY, FREE_MOVE } from "../constants/constants";
import GameWinner from "../components/game_winner";

function makeBoard() {
    return [[EMPTY, EMPTY, EMPTY], 
            [EMPTY, EMPTY, EMPTY], 
            [EMPTY, EMPTY, EMPTY]];
}

function GameBoard(props) {
    const [board, setBoard] = useState([[makeBoard(), makeBoard(), makeBoard()],
                                        [makeBoard(), makeBoard(), makeBoard()],
                                        [makeBoard(), makeBoard(), makeBoard()]]);
    const [turn, setTurn] = useState("X");
    const [boardToPlay, setBoardToPlay] = useState(FREE_MOVE);
    const [boardWinner, setBoardWinner] = useState([[EMPTY, EMPTY, EMPTY], 
                                                    [EMPTY, EMPTY, EMPTY], 
                                                    [EMPTY, EMPTY, EMPTY]]);
    const [gameWinner, setGameWinner] = useState(EMPTY);
    const [updateFailed, setUpdateFailed] = useState(false);
    
    useEffect(() => {
        // To Do: Make this more elegant by having some modal or something
        props.socket.on("board_update_failed", (data) => {
            setUpdateFailed(true);
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

        props.socket.on("local_board_winner", (data) => {
            const boardWon = data.board;
            console.log("board won: " + boardWon);
            const winner = data.winner;

            const boardWonY = Math.floor(boardWon / 3);
            const boardWonX = boardWon % 3;

            const new_board_winner = [...boardWinner];
            new_board_winner[boardWonY][boardWonX] = winner;
            setBoardWinner(new_board_winner);
            console.log(boardWinner);
        });

        // To do, make it elegant and not just an alert
        props.socket.on("game_winner", (data) => {
            const winner = data.winner;
            setGameWinner(winner);
        });

        // To do, make it elegant and not just an alert
        props.socket.on("game_draw", () => {
            setGameWinner("DRAW");
        });

        props.socket.on("player_left", (data) => {
            alert("A player has left the room, waiting for another player to join");
        });

        return () => {
            props.socket.off("board_update_failed");
            props.socket.off("board_updated");
            props.socket.off("change_turn");
            props.socket.off("local_board_winner");
            props.socket.off("game_winner");
            props.socket.off("game_draw");
        }
    }, [props.socket, props.room_id]);

    const handleMove = (rowIndex, colIndex) => {
        if (turn !== props.player) {
            console.log("Not your turn");
            return;
        }

        if (gameWinner !== EMPTY) {
            return;
        }
        
        // row is a number between 0 and 8
        // col is a number between 0 and 8
        // board to play is a number between 0 and 8

        const board_x_index = Math.floor(rowIndex / 3);
        const board_y_index = Math.floor(colIndex / 3);
        const board_index = board_y_index * 3 + board_x_index;

        if (boardToPlay !== FREE_MOVE && boardToPlay !== board_index) {
            alert("Invalid move");
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
                                                className={
                                                    (boardWinner[colIndex][rowIndex] == props.player && "your_winner_cell") ||
                                                    (boardWinner[colIndex][rowIndex] != EMPTY && "opponent_winner_cell") ||
                                                    (boardToPlay === -1 && "active_cell") ||
                                                    (boardToPlay === colIndex * 3 + rowIndex && "active_cell") ||
                                                    "inactive_cell"
                                                }

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
            {gameWinner !== EMPTY && 
                <GameWinner boardWinner={boardWinner} board={board} player={props.player} winner={gameWinner}/>
            }
            {gameWinner === EMPTY && 
                <div className="game-container">
                    <div className="game-information">
                        <h2 className="title">Ultimate Tic Tac Toe</h2>
                        <h2>Room {props.room_id}</h2>
                        <h2>Playing as {props.player}</h2>
                    </div>
                    <div className="turn">
                        {turn == props.player ? <h2 className="your_turn">Your turn</h2> : 
                                                <h2 className="opponent_turn">Opponent's turn</h2>}
                    </div>
                    <div className="game-board">
                        {renderBoard()}
                    </div>
                </div>
            }
        </div>

    );
}

export default GameBoard;