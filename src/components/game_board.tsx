import { useEffect } from "react";

function GameBoard(props) {
    useEffect(() => {
        console.log(props.socket);
    }, [props]);

    return (
        <div>
            <h1>Game Board...</h1>
            <h1>Room {props.room_id}</h1>
        </div>
    );
}

export default GameBoard;