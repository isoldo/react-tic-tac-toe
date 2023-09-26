interface BoardRowLayoutProps {
  rowIndex: number;
  row: number[];
  idMap: Record<number, string>;
  canMakeMove: boolean;
  onMoveClick: (rowIndex: number, columnIndex: number) => void;
}

export default function BoardRowLayout({ row, idMap, canMakeMove, rowIndex, onMoveClick }: BoardRowLayoutProps) {
  return (
    <div className="row">
      {row.map( (field, index) => {
        console.log({field, rowIndex, index});
          return (
            <div className="column" key={index} onClick={() => onMoveClick(rowIndex, index)}>
              <input placeholder={idMap[field] ?? `. (${index})`} disabled={!canMakeMove || !!field}></input>
            </div>
          )
        })
      }
    </div>
  )
}
