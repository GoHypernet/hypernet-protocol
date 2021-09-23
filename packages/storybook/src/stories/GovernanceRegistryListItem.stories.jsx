import { GovernanceRegistryListItem } from "@hypernetlabs/web-ui";

export default {
  title: "Layout/GovernanceRegistryListItem",
  component: GovernanceRegistryListItem,
};

const Template = (args) => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      padding: "40px 80px",
    }}
  >
    <GovernanceRegistryListItem
      {...args}
      onViewDetailsClick={() => console.log("Go to Details")}
    />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  number: "1",
  title: "Registry Name",
  registryAddress: "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b",
  tokenURI:
    "https://ipfs.infura.io/ipfs/QmWc6YHE815F8kExchG9kd2uSsv7ZF1iQNn23bt5iKC6K3/image",
  numberOfEntries: "391",
};
