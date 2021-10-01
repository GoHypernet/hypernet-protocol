import { Typography } from "@material-ui/core";

export default {
  title: "Layout/Typography",
  component: Typography,
};

const Template = (args) => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
    }}
  >
    <Typography variant="h1"> Something lorem ipsum lolo !</Typography>
    <Typography variant="h2"> Something lorem ipsum lolo !</Typography>
    <Typography variant="h3"> Something lorem ipsum lolo !</Typography>
    <Typography variant="h4"> Something lorem ipsum lolo !</Typography>
    <Typography variant="h5"> Something lorem ipsum lolo !</Typography>
    <Typography variant="h6"> Something lorem ipsum lolo !</Typography>
    <Typography variant="subtitle1"> Somethin g lorem ipsum lolo !</Typography>
    <Typography variant="body1"> Something lorem ipsum lolo !</Typography>
    <Typography variant="body2"> Something lorem ipsum lolo !</Typography>
  </div>
);

export const Primary = Template.bind({});
Primary.args = {};
