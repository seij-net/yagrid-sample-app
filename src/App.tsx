import React from "react";
import { ItemDelete, ItemAdd, ItemEdit, Grid, GridProps } from "@seij/yagrid";
import {
  useGrid,
  useGridItem,
  useGridItemProperty,
  GridProvider,
  LoadingState,
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
import {
  GridColumnDefinitionInternal,
  GridPlugin,
  TableAction,
  TableGenericAction,
} from "@seij/yagrid/dist/types";
import { overridePluginGenericAction } from "./utils/pluginUtils";
import { useItemAdd } from "@seij/yagrid/dist/plugins/item-add";

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
      {
        name: "label",
        label: "Item name",
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
        labelAddButton: "Ajouter",
        labelAddButtonCancel: "Annuler",
        labelAddButtonConfirm: "OK",
        onAddConfirm: async () => {},
        onAddTemplate: async () => ({
          id: "-1",
          label: "default",
          amount: 0,
        }),
      }),
    ],
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sample table</h1>
      </header>
      <main>
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
  const materialProps = toMaterialProps(props);
  return (
    <GridProvider
      columns={materialProps.columns}
      types={materialProps.types}
      data={materialProps.data}
      plugins={materialProps.plugins}
      identifierProperty={materialProps.identifierProperty}
    >
      <YAGridMaterial2 {...materialProps} />
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

  return (
    <div>
      <div>
        {extensions.actionGenericList.map(action => {
          // const ActionRender = action.render
          // return <ActionRender key={action.name} />
          return <AddButtonMaterial key={action.name} />
        })}
      </div>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow >
              {columnDefinitions.map((column) => {
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

function toMaterialProps<T>(props: GridProps<T>): GridProps<T> {
  const plugins = props.plugins.map((plugin) => {
    switch (plugin.name) {
      case "edit_add":
        return toMaterialPropsPluginAdd(plugin);
      default:
        return plugin;
    }
  });
  return { ...props, plugins: plugins };
}

function toMaterialPropsPluginAdd<T>(plugin: GridPlugin<T>): GridPlugin<T> {
  return overridePluginGenericAction(plugin, "add", (action) => ({
    render: () => {
      console.log("on arrive là")
      return <AddButtonMaterial />
    },
  }));
}

const AddButtonMaterial: React.FC<{}> = (props) => {
  const { buttonProps, config } = useItemAdd()
  
  return <Button {...buttonProps}>{config.labelAddButton}</Button>;
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
        <YAGridTableBodyRow key={item.id} item={item} />
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
    <TableRow>
      {columnDefinitions.map((column) => (
        <YAGridTableCell key={column.name} item={item} column={column} />
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
