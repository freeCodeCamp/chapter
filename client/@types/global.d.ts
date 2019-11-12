/**
 * For special typings in NextJS/ReactJS using TS...
 * there are some pretty good patterns followed here - https://github.com/deptno/next.js-typescript-starter-kit
 */

interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
}

// export some usefull utils for type modifications...
type Subtract<T, K> = T extends K ? T : never;
