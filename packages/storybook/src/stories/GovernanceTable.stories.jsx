import React from "react";
import AddIcon from "@material-ui/icons/Add";

import {
  GovernanceTable,
  GovernanceStatusTag,
  GovernanceCard,
} from "@hypernetlabs/web-ui";
import { EProposalState } from "@hypernetlabs/objects";

export default {
  title: "Layout/GovernanceTable",
  component: GovernanceTable,
};

const Template = (args) => (
  <>
    <GovernanceCard>
      <GovernanceTable {...args} isExpandable />
    </GovernanceCard>

    <br />
    <br />
    <br />

    <GovernanceTable {...args} />
  </>
);

export const Primary = Template.bind({});
Primary.args = {
  title: "Transactions",
  description:
    "There may be a detail sentence about the transactions. Lorem ipsum dolor sit amet, lorem ipsum dolor sit amet.",
  rows: [
    [
      {
        cellValue: "Baris",
        tableCellProps: {
          align: "left",
          width: 200,
        },
      },
      {
        cellValue: "Hantas",
        tableCellProps: {
          align: "left",
        },
      },
      {
        cellValue: "12",
        onlyVisibleInExpandedState: true,
        tableCellProps: { align: "left" },
      },
      {
        cellValue: <GovernanceStatusTag status={EProposalState.SUCCEEDED} />,
        tableCellProps: {
          align: "right",
        },
      },
      {
        cellValue: <GovernanceStatusTag status={EProposalState.SUCCEEDED} />,
        tableCellProps: {
          align: "right",
        },
      },
    ],
    [
      {
        cellValue: "Muhammed",
        tableCellProps: {
          align: "left",
          width: 200,
        },
      },
      {
        cellValue: "Altinci",
        tableCellProps: {
          align: "left",
        },
      },
      {
        cellValue: "12",
        onlyVisibleInExpandedState: true,
        tableCellProps: { align: "left" },
      },
      {
        cellValue: <GovernanceStatusTag status={EProposalState.ACTIVE} />,
        tableCellProps: {
          align: "right",
        },
      },
      {
        cellValue: <GovernanceStatusTag status={EProposalState.ACTIVE} />,
        tableCellProps: {
          align: "right",
        },
      },
    ],
    [
      {
        cellValue: "Seda",
        tableCellProps: {
          align: "left",
          width: 200,
        },
      },
      {
        cellValue: "Kaya",
        tableCellProps: {
          align: "left",
        },
      },
      {
        cellValue: "12",
        onlyVisibleInExpandedState: true,
        tableCellProps: { align: "left" },
      },
      {
        cellValue: <GovernanceStatusTag status={EProposalState.CANCELED} />,
        tableCellProps: {
          align: "right",
        },
      },
      {
        cellValue: <GovernanceStatusTag status={EProposalState.CANCELED} />,
        tableCellProps: {
          align: "right",
        },
      },
    ],
    [
      {
        cellValue: "Albert",
        tableCellProps: {
          align: "left",
          width: 200,
        },
      },
      {
        cellValue: "Einstein",
        tableCellProps: {
          align: "left",
        },
      },
      {
        cellValue: "12",
        onlyVisibleInExpandedState: true,
        tableCellProps: { align: "left" },
      },
      {
        cellValue: <GovernanceStatusTag status={EProposalState.DEFEATED} />,
        tableCellProps: {
          align: "right",
        },
      },
      {
        cellValue: <GovernanceStatusTag status={EProposalState.DEFEATED} />,
        tableCellProps: {
          align: "right",
        },
      },
    ],
  ],
  columns: [
    {
      cellValue: "Name",
      tableCellProps: {
        align: "left",
      },
    },
    {
      cellValue: "Surname",
      tableCellProps: {
        align: "left",
      },
    },
    {
      cellValue: "Authorized Amount",
      tableCellProps: {
        align: "left",
      },
      onlyVisibleInExpandedState: true,
    },
    {
      cellValue: "Status",
      tableCellProps: {
        align: "left",
      },
    },
    {
      cellValue: "Action",
      tableCellProps: {
        align: "left",
      },
    },
  ],
  headerAction: {
    label: "Add Entity",
    onClick: () => {
      console.log("clicked!");
    },
    status: "primary",
    startIcon: <AddIcon />,
    variant: "contained",
  },
};
