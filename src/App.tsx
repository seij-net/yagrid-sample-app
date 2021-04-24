import React from "react";
import { ItemDelete, ItemAdd, ItemEdit, Grid, GridProps } from "@seij/yagrid";
import {
  useGrid,
  useGridItem,
  useGridItemProperty,
  GridContext,
  GridProvider,
} from "@seij/yagrid/dist/GridContext";
import {
  Button,
  ButtonBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Grid as MaterialGrid,
  TableProps,
  Typography,
} from "@material-ui/core";
import { GridColumnDefinitionInternal } from "@seij/yagrid/dist/types";

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
      { name: "id", label: "#" },
      { name: "label", label:"Item name",
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
        label: "Amount €",
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
        <MaterialGrid container spacing={2}>
          <MaterialGrid item xs={6}>
            <Typography variant="h5">Material</Typography>
            <YAGridMaterial {...gridProps} size={"small"} />
          </MaterialGrid>
          <MaterialGrid item xs={6}>
            <Typography variant="h5">Not material</Typography>
            <Grid {...gridProps} />
          </MaterialGrid>
        </MaterialGrid>
      </main>
    </div>
  );
}
const YAGridMaterial: React.FC<GridProps<any> & TableProps> = (props) => {
  return (
    <GridProvider
      columns={props.columns}
      types={props.types}
      data={props.data}
      plugins={props.plugins}
      identifierProperty={props.identifierProperty}
    >
      <YAGridMaterial2 {...props} />
    </GridProvider>
  );
};
const YAGridMaterial2: React.FC<GridProps<any>> = (props) => {
  const gridContext = useGrid();
  const {
    extensions,
    columnDefinitions,
    resolvedData,
    dataListTransform,
    identifierProperty,
    state,
    handleEditItemChange,
  } = gridContext;
  const hasActionsStart = extensions.actionItemList.some(
    (action) => action.position === "start"
  );
  console.log(gridContext);
  return (
    <div>
      <Toolbar>
        {extensions.actionGenericList.map((action) => (
          <Button>{action.render}</Button>
        ))}
      </Toolbar>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columnDefinitions.map((column) => {
                console.log("colonnes?", column);
                return (
                  <TableCell key={column.name} variant="head">
                    {column.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <YAGridTableBodyRows />
        </Table>
      </TableContainer>
    </div>
  );
};

const YAGridTableBodyRows: React.FC<{}> = (props) => {
  const gridContext = useGrid();
  const {
    extensions,
    columnDefinitions,
    dataListTransform,
    identifierProperty,
    state,
    handleEditItemChange,
  } = gridContext;
  return (
    <TableBody>
      {dataListTransform.map((item) => (
        <YAGridTableBodyRow item={item} />
      ))}
    </TableBody>
  );
};

const YAGridTableBodyRow: React.FC<{ item: any }> = ({ item }) => {
  const gridContext = useGrid();
  const {
    identifierProperty,
    columnDefinitions,
    state,
    handleEditItemChange,
  } = gridContext;
  const {
    selectDisplayedItemActions,
    selectExtraItems: extraItemList,
  } = useGridItem(item, gridContext);
  return (
    <TableRow key={item[identifierProperty]}>
      {columnDefinitions.map((column) => (
        <YAGridTableCell item={item} column={column} />
      ))}
    </TableRow>
  );
};

const YAGridTableCell: React.FC<{
  column: GridColumnDefinitionInternal<any>;
  item: any;
}> = ({ item, column }) => {
  const gridContext = useGrid();
  const {
    identifierProperty,
    columnDefinitions,
    state,
    handleEditItemChange,
  } = gridContext;
  const {
    selectDisplayedItemActions,
    selectExtraItems: extraItemList,
  } = useGridItem(item, gridContext);
  const { editing } = useGridItemProperty(column.name, item, gridContext);
  return (
    <TableCell key={column.name}>
      {editing && column.editor
        ? column.editor(state.editedItemValue, handleEditItemChange)
        : column.render(item)}
    </TableCell>
  );
};

export default App;
