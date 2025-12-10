declare module 'http-errors' {
  function createHttpError(
    status?: number | string,
    msg?: any,
    properties?: any
  ): any;
  namespace createHttpError {}
  export default createHttpError;
}
