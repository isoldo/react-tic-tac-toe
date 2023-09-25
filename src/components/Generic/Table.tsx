import React from "react";

interface TableProps<T> {
  items: Array<T>;
  rowComponent: React.ComponentType<T>;
}

export default function Table<T extends {}>({items, rowComponent}: TableProps<T>): JSX.Element {
  return (
    <>
    {
      items.map((item, index) => {
        return (
          <div key={index}>
            {React.createElement(rowComponent, item, null)}
          </div>
        )
      })
    }
    </>
  )
}
