import { addDecorator } from "@storybook/react";
import { withThemes } from "@react-theming/storybook-addon";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import { lightTheme, darkTheme } from "@hypernetlabs/web-ui";
import withFormik from "storybook-formik";

// export const parameters = {
//   actions: { argTypesRegex: "^on[A-Z].*" },
//   controls: {
//     matchers: {
//       color: /(background|color)$/i,
//       date: /Date$/,
//     },
//   },
// };

const providerFn = ({ theme, children }) => {
  const serialTheme = JSON.parse(JSON.stringify(theme));
  const muiTheme = createTheme(serialTheme);
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
};

addDecorator(withFormik);
addDecorator(withThemes(null, [lightTheme, darkTheme], { providerFn }));
