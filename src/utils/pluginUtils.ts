import { GridPlugin, TableGenericAction } from "@seij/yagrid/dist/types";

export function overridePlugin<T>(
    plugin: GridPlugin<T>,
    transform: (plugin: GridPlugin<T>) => Partial<GridPlugin<T>>
): GridPlugin<T> {
    return { ...plugin, ...transform(plugin) };
}

export function overridePluginGenericAction<T>(
    plugin: GridPlugin<T>,
    actionName: string,
    transform: (action: TableGenericAction) => Partial<TableGenericAction>
): GridPlugin<T> {
    return overridePlugin(plugin, (p) => {
        const newActions = p.actionGenericList?.map((a) =>
            a.name === actionName ? { ...a, ...transform(a) } : a
        );
        return { actionGenericList: newActions };
    });
}
