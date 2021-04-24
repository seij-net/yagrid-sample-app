import React from "react";
import { ItemDelete, ItemAdd, ItemEdit, Grid, GridProps } from "@seij/yagrid";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

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
  const gridProps: GridProps<SampleData> = {
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
      {
        name: "amount",
        editor: (item, onValueChange) => {
          return (
            <input
              type="number"
              onChange={(evt) =>
                onValueChange({ ...item, amount: parseInt(evt.target.value) })
              }
            />
          );
        },
      },
    ],
    data: data,
    plugins: [
      ItemEdit.create({
        onEdit: async () => {},
        editable: (data) => data.amount < 100,
      }),
      ItemDelete.create({ onDelete: async (item) => {} }),
      ItemAdd.create({
        onAddConfirm: async () => {},
        onAddTemplate: async () => ({ id: "-1", label: "default", amount: 0 }),
      }),
    ],
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sample table</h1>
      </header>
      <main>
        <Button variant="contained" color="primary">
          Hello world
        </Button>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell>Calories</TableCell>
                <TableCell>Fat&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>2</TableCell>
                <TableCell>3</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>2</TableCell>
                <TableCell>3</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>2</TableCell>
                <TableCell>3</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>2</TableCell>
                <TableCell>3</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
        </TableContainer>
        <hr />
        <TableContainer  component={Paper}>
          <Grid {...gridProps} />
        </TableContainer>
      </main>
    </div>
  );
}

export default App;

