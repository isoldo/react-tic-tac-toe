import { Board } from "../../types";
import BoardRowLayout from "./BoardRowLayout";

interface  BoardLayoutProps {
  canMakeMove: boolean;
  players: {
    firstPlayer: number;
    secondPlayer: number | undefined;
  }
  board: Board;
  marks?: {
    firstPlayer: string;
    secondPlayer: string;
  };
  onMoveClick: (rowIndex: number, columnIndex: number) => void;
}

export default function BoardLayout({ players, marks = {firstPlayer: "X", secondPlayer: "O"}, board, canMakeMove, onMoveClick }: BoardLayoutProps) {

  board.map((br) => console.debug({br}));

  const firstPlayer = players.firstPlayer;
  const secondPlayer = players.secondPlayer;
  const idMap = {
    [firstPlayer]: marks.firstPlayer,
    [secondPlayer ?? -1]: marks.secondPlayer
  }

  console.debug({idMap});

  return (
    <div>
      <p>The board:</p>
      {
        board.map((row, index) => {
          return (
              <div key={index}>
                <BoardRowLayout rowIndex={index} row={row} idMap={idMap} canMakeMove={canMakeMove} onMoveClick={onMoveClick}/>
              </div>
          );
        })
      }
    </div>
  )
}
