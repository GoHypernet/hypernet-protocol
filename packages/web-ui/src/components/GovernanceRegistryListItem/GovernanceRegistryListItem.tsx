import React from "react";
import { GovernanceListItem, GovernanceButton } from "@web-ui/components";
import { GovernanceListItemValueWithTitle } from "@web-integration/index";

interface GovernanceRegistryListItemProps {
  number: string;
  title: string;
  registryAddress: string;
  tokenURI: string;
  numberOfEntries: string;
  onViewDetailsClick: () => void;
}

export const GovernanceRegistryListItem: React.FC<GovernanceRegistryListItemProps> =
  (props: GovernanceRegistryListItemProps) => {
    const {
      number,
      title,
      registryAddress,
      tokenURI,
      numberOfEntries,
      onViewDetailsClick,
    } = props;

    return (
      <GovernanceListItem
        number={number}
        title={title}
        rightContent={
          <GovernanceButton
            onClick={onViewDetailsClick}
            variant="contained"
            size="medium"
          >
            View Details
          </GovernanceButton>
        }
      >
        <GovernanceListItemValueWithTitle
          title="Registry Address"
          value={registryAddress}
        />
        <GovernanceListItemValueWithTitle title="Token URI" value={tokenURI} />
        <GovernanceListItemValueWithTitle
          title="Number of Entries"
          value={numberOfEntries}
        />
      </GovernanceListItem>
    );
  };
