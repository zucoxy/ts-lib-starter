import 'pinia';

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    indexDB?: {
      /**
       * DB name
       */
      name?: string;
      /**
       * DB version
       */
      version?: number;
      tables?: {
        /**
         * table name
         */
        name: string;
        /**
         * 要缓存到 indexDB 中的字段数组
         */
        paths: string[];
      }[];
    }
  }
}
