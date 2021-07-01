export interface IRedirectInfo {
  // This is a query string parameter that the iframe will look for
  redirectParam: string;

  // This is the value to expect
  redirectValue: string;

  // This callback will be called by the frame when it is ready for the redirect.
  readyFunction: () => void;
}
