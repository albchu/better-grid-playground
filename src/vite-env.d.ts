/// <reference types="vite/client" />

declare module '*?worker&inline' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}
