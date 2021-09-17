import { Button } from "@hypernetlabs/web-ui";
import { EButtonStatus } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/Button",
  component: Button,
};

const Template = (args) => (
  <>
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <Button {...args} status={EButtonStatus.primary} />
      <Button {...args} status={EButtonStatus.secondary} />
      <Button {...args} cstatus={EButtonStatus.text} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <Button {...args} status={EButtonStatus.primary} hasMaterialUIStyle />
      <Button {...args} status={EButtonStatus.secondary} hasMaterialUIStyle />
      <Button {...args} status={EButtonStatus.link} hasMaterialUIStyle />
    </div>
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <Button {...args} status={EButtonStatus.primary} hasBackIcon />
      <Button {...args} status={EButtonStatus.secondary} hasBackIcon />
      <Button {...args} status={EButtonStatus.link} hasBackIcon />
    </div>
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <Button {...args} status={EButtonStatus.primary} disabled />
      <Button {...args} status={EButtonStatus.secondary} disabled />
      <Button {...args} status={EButtonStatus.link} disabled />
    </div>
    <Button {...args} status={EButtonStatus.primary} fullWidth />
    <Button {...args} status={EButtonStatus.secondary} fullWidth />
    <Button {...args} status={EButtonStatus.link} fullWidth />
  </>
);

export const Contained = Template.bind({});
Contained.args = {
  onClick: () => {
    console.log("clicked!");
  },
  label: "Click me!",
};
