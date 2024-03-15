import type { PiniaPluginContext } from 'pinia';
import Dexie from 'dexie';

export const piniaPersistToIndexDBPlugin = async ({ store, options }: PiniaPluginContext) => {
  if (options.indexDB?.name) {
    const db = new Dexie(options.indexDB.name);
    // 如果 indexDB 数据库中存在相关数据，则更新到 store 中
    if (options.indexDB.tables?.length) {
      // 初始化数据表
      const stores = options.indexDB.tables
        .map(i => i.name)
        .reduce((pre, next) => ({
          ...pre,
          [next]: '++key,value'
        }), {});
      db.version(options.indexDB!.version || 1).stores(stores);
      // 更新数据
      for (const tableInfo of options.indexDB!.tables) {
        const table = db.table(tableInfo.name);
        if (table) {
          const data = await table.toArray();
          const res: Record<string, any> = {};
          data.forEach(i => {
            res[i.key] = JSON.parse(i.value);
          });
          store.$patch(res);
        }
      }
    }
    // 订阅 store 中的 state 变化，将修改的变量更新到 indexDB 数据库中
    store.$subscribe((mutation, state) => {
      options.indexDB?.tables && options.indexDB.tables.forEach(table => {
        table.paths.forEach(path => {
          db.table(table.name).put({
            key: path,
            // 必须是字符串类型
            value: JSON.stringify(state[path])
          }, path);
        });
      });
    });
  }
};

export { Dexie };
