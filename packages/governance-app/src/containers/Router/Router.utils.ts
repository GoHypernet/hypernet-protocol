export const replaceRouteParams = (url: string, paramsObject: any) =>
  url
    .split("/")
    .map(
      (item) => (paramsObject && paramsObject[item.replace(":", "")]) || item,
    )
    .join("/");

export const getRoute = (path: string, paramsObject: any) =>
  replaceRouteParams(path, paramsObject);
