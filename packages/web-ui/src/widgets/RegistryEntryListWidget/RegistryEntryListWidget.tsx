import React, { useEffect, useState, useMemo } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceRegistryListItem,
  GovernanceWidgetHeader,
  GovernancePagination,
  GovernanceEmptyState,
} from "@web-ui/components";
import { IRegistryEntryListWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import {
  EthereumAddress,
  Registry,
  RegistryEntry,
} from "@hypernetlabs/objects";
import CreateIdentityWidget from "../CreateIdentityWidget";

const REGISTRY_ENTRIES_PER_PAGE = 3;

const RegistryEntryListWidget: React.FC<IRegistryEntryListWidgetParams> = ({
  onRegistryEntryDetailsNavigate,
  onRegistryListNavigate,
  registryName,
}: IRegistryEntryListWidgetParams) => {
  const alert = useAlert();
  const { coreProxy, viewUtils } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [registryEntries, setRegistryEntries] = useState<RegistryEntry[]>([]);
  const [registry, setRegistry] = useState<Registry>();
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );

  const [createIdentityModalOpen, setCreateIdentityModalOpen] =
    useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [hasEmptyState, setHasEmptyState] = useState<boolean>(false);

  useEffect(() => {
    getRegistry();
  }, []);

  useEffect(() => {
    if (registry?.numberOfEntries) {
      getRegistryEntries();
    }
  }, [registry?.numberOfEntries, page, REGISTRY_ENTRIES_PER_PAGE]);

  useEffect(() => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);
    });
  }, []);

  const getRegistry = () => {
    coreProxy
      .getRegistryByName([registryName])
      .map((registryMap) => {
        setRegistry(registryMap.get(registryName));
        setLoading(false);
      })
      .mapErr(handleError);
  };

  const getRegistryEntries = () => {
    coreProxy
      .getRegistryEntries(registryName, page, REGISTRY_ENTRIES_PER_PAGE)
      .map((registryEntries) => {
        setRegistryEntries(registryEntries);
      })
      .mapErr(handleError);
  };

  const handleError = (err?: Error) => {
    console.log("handleError err: ", err);
    setLoading(false);
    setHasEmptyState(true);
    alert.error(err?.message || "Something went wrong!");
  };

  const isRegistrar = useMemo(() => {
    return registry?.registrarAddresses.some(
      (address) => address === accountAddress,
    );
  }, [accountAddress, JSON.stringify(registry?.registrarAddresses)]);

  const isRegistrationTokenEnabled = useMemo(() => {
    return (
      registry?.registrationToken != null &&
      !viewUtils.isZeroAddress(registry?.registrationToken)
    );
  }, [JSON.stringify(registry?.registrationToken)]);

  const canCreateNewRegistryEntry = isRegistrar || isRegistrationTokenEnabled;

  return (
    <Box>
      <GovernanceWidgetHeader
        label="Registry Entries"
        navigationLink={{
          label: "Registry Entry List",
          onClick: () => {
            onRegistryListNavigate?.();
          },
        }}
        {...(canCreateNewRegistryEntry && {
          headerActions: [
            {
              label: "Create New Identity",
              onClick: () => setCreateIdentityModalOpen(true),
              variant: "contained",
              color: "primary",
            },
          ],
        })}
      />

      {hasEmptyState && (
        <GovernanceEmptyState
          title="No registiry entries found."
          description="Registiry entries submitted by community members will appear here."
        />
      )}

      {registryEntries.map((registryEntry) => (
        <GovernanceRegistryListItem
          key={registryEntry.label}
          number={registryEntry.tokenId.toString()}
          title=""
          fieldWithValueList={[
            {
              fieldTitle: "Label",
              fieldValue: registryEntry.label,
            },
            {
              fieldTitle: "Token ID",
              fieldValue: registryEntry.tokenId.toString(),
            },
            {
              fieldTitle: "Owner",
              fieldValue: registryEntry.owner || undefined,
            },
            {
              fieldTitle: "Token URI",
              fieldValue: registryEntry.tokenURI || undefined,
            },
          ]}
          {...((isRegistrar || registryEntry.owner === accountAddress) && {
            actionButtonList: [
              {
                label: "View Registry Entry Details",
                onClick: () =>
                  onRegistryEntryDetailsNavigate &&
                  onRegistryEntryDetailsNavigate(
                    registryName,
                    registryEntry.label,
                  ),
              },
            ],
          })}
        />
      ))}
      {registry?.numberOfEntries && registry?.numberOfEntries > 0 && (
        <GovernancePagination
          customPageOptions={{
            itemsPerPage: REGISTRY_ENTRIES_PER_PAGE,
            totalItems: registry?.numberOfEntries,
          }}
          onChange={(_, page) => {
            setPage(page);
          }}
        />
      )}
      {createIdentityModalOpen && (
        <CreateIdentityWidget
          onCloseCallback={() => {
            getRegistry();
            setCreateIdentityModalOpen(false);
          }}
          registryName={registryName}
          currentAccountAddress={accountAddress}
        />
      )}
    </Box>
  );
};

export default RegistryEntryListWidget;
