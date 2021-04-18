import React from "react";
import { EditDelete, EditInlineAdd, Table, TableProps } from "@seij/yagrid";
import "tailwindcss/dist/tailwind.min.css";
import "@tailwindcss/forms/dist/forms.css";
import { EditInline } from "@seij/yagrid";

interface SampleData {
  id: string;
  label: string;
  amount: number;
}

function App() {
  const data: SampleData[] = [];
  for (let i = 1; i < 100; i++) {
    data.push({ id: "" + i, label: "item " + i, amount: i * 10 });
  }
  const gridProps: TableProps<SampleData> = {
    columns: [
      { name: "id" },
      {
        name: "label",
        editor: (item, onValueChange) => {
          return (
            <input
              type="text"
              onChange={(evt) =>
                onValueChange({ ...item, label: evt.target.value })
              }
            />
          );
        },
      },
      { name: "amount",
    editor:(item, onValueChange)=>{
      return <input type="number" onChange={evt => onValueChange({...item, amount: parseInt(evt.target.value)})} />
    } },
    ],
    data: data,
    plugins: [
      EditInline.editInline({
        onEdit: async () => {},
        editable: (data) => data.amount < 100,
      }),
      EditDelete.deletePlugin({ onDelete: async (item) => {} }),
      EditInlineAdd.editorAdd({
        onAddConfirm: async () => {},
        onAddTemplate: async () => ({ id: "-1", label: "default", amount: 0 }),
      }),
    ],
    editable: true,
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sample table</h1>
      </header>
      <main>
        <Table {...gridProps} />
      </main>
    </div>
  );
}

export default App;
