import {
  ERegistrySortOrder,
  EthereumAccountAddress,
  Registry,
  RegistryEntry,
  RegistryName,
} from "@hypernetlabs/objects";
import { Box, Typography } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { IRegistryEntryListWidgetParams } from "@web-ui/interfaces";
import { Form, Formik } from "formik";
import React, { useEffect, useState, useMemo, useRef } from "react";

import {
  GovernanceRegistryListItem,
  GovernanceWidgetHeader,
  GovernancePagination,
  GovernanceEmptyState,
  GovernanceSwitch,
  IHeaderAction,
  GovernanceSearchFilter,
  GovernanceDialogSelectField,
} from "@web-ui/components";
import CreateBatchIdentityWidget from "@web-ui/widgets/CreateBatchIdentityWidget";
import CreateIdentityWidget from "@web-ui/widgets/CreateIdentityWidget";
import { useStyles } from "@web-ui/widgets/RegistryEntryListWidget/RegistryEntryListWidget.style";

const REGISTRY_ENTRIES_PER_PAGE = 3;

enum ERegistryEntrySearchBy {
  OWNER_ADDRESS,
  USERNAME,
}

const RegistryEntryListWidget: React.FC<IRegistryEntryListWidgetParams> = ({
  onRegistryEntryDetailsNavigate,
  onRegistryListNavigate,
  registryName,
}: IRegistryEntryListWidgetParams) => {
  const classes = useStyles();
  const { coreProxy, viewUtils } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [registryEntries, setRegistryEntries] = useState<RegistryEntry[]>([]);
  const [registry, setRegistry] = useState<Registry>();
  const [accountAddress, setAccountAddress] = useState<EthereumAccountAddress>(
    EthereumAccountAddress(""),
  );
  const [reversedSortingEnabled, setReversedSortingEnabled] =
    useState<boolean>(false);
  const [createIdentityModalOpen, setCreateIdentityModalOpen] =
    useState<boolean>(false);
  const [createBatchIdentityModalOpen, setCreateBatchIdentityModalOpen] =
    useState<boolean>(false);
  const [lazyMintModeEnabled, setLazyMintModeEnabled] =
    useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasEmptyState, setHasEmptyState] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [registryFetched, setRegistryFetched] = useState<boolean>(false);
  const mounted = useRef(false);

  useEffect(() => {
    getRegistry();
  }, []);

  useEffect(() => {
    if (registry?.numberOfEntries && registryFetched) {
      getRegistryEntries();
    }
  }, [registry?.numberOfEntries, page, REGISTRY_ENTRIES_PER_PAGE]);

  useEffect(() => {
    if (mounted.current) {
      handleRegistryEntriesRefresh();
    } else {
      mounted.current = true;
    }
  }, [reversedSortingEnabled]);

  useEffect(() => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);
    });
  }, []);

  const handleRegistryEntriesRefresh = () => {
    if (page === 1) {
      getRegistryEntries();
    } else {
      setPage(1);
    }
  };

  const getRegistry = () => {
    setLoading(true);
    coreProxy.registries
      .getRegistryByName([RegistryName(registryName)])
      .map((registryMap) => {
        const registry = registryMap.get(RegistryName(registryName));
        setRegistryFetched(true);
        setRegistry(registry);
        setHasEmptyState(!registry?.numberOfEntries);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const getRegistryEntries = () => {
    setLoading(true);
    coreProxy.registries
      .getRegistryEntries(
        RegistryName(registryName),
        page,
        REGISTRY_ENTRIES_PER_PAGE,
        reversedSortingEnabled
          ? ERegistrySortOrder.REVERSED_ORDER
          : ERegistrySortOrder.DEFAULT,
      )
      .map((registryEntries) => {
        setRegistryEntries(registryEntries);
        setLoading(false);
      })
      .mapErr(handleCoreError);
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

  const getHeaderActions: () => IHeaderAction[] = () => {
    const canCreateNewRegistryEntry = isRegistrar || isRegistrationTokenEnabled;

    const canCreateNewBatchRegistryEntry =
      isRegistrar && registry?.modulesCapability.batchMintEnabled;

    const cansubmitLazyMintSignature =
      isRegistrar && registry?.modulesCapability.lazyMintEnabled;

    const headerActions: IHeaderAction[] = [];

    if (cansubmitLazyMintSignature) {
      headerActions.push({
        label: "Lazy Mint Identity",
        onClick: () => {
          setCreateIdentityModalOpen(true);
          setLazyMintModeEnabled(true);
        },
        variant: "contained",
        color: "primary",
      });
    }

    if (canCreateNewBatchRegistryEntry) {
      headerActions.push({
        label: "Create Batch Identity",
        onClick: () => setCreateBatchIdentityModalOpen(true),
        variant: "contained",
        color: "primary",
      });
    }

    if (canCreateNewRegistryEntry) {
      headerActions.push({
        label: "Create New Identity",
        onClick: () => {
          setCreateIdentityModalOpen(true);
          setLazyMintModeEnabled(false);
        },
        variant: "contained",
        color: "primary",
      });
    }

    return headerActions;
  };

  const onSearchByOwnerAddressClick = (value) => {
    setLoading(true);
    setSearchTerm(value);
    coreProxy.registries
      .getRegistryEntryListByOwnerAddress(
        RegistryName(registryName),
        EthereumAccountAddress(value),
      )
      .map((registryEntries) => {
        setRegistryEntries(registryEntries);
        setPage(1);
        setLoading(false);
      })
      .mapErr(handleSearchError);
  };

  const onSearchByUsernameClick = (value) => {
    setLoading(true);
    setSearchTerm(value);
    coreProxy.registries
      .getRegistryEntryListByUsername(RegistryName(registryName), value)
      .map((registryEntries) => {
        setRegistryEntries(registryEntries);
        setPage(1);
        setLoading(false);
      })
      .mapErr(handleSearchError);
  };

  const handleSearchError = (err: any) => {
    console.error(err);
    setRegistryEntries([]);
    setLoading(false);
  };

  const hasEmptyFilterResult = useMemo(
    () => searchTerm && !registryEntries.length,
    [searchTerm, JSON.stringify(registryEntries)],
  );

  const onRestartClick = () => {
    setSearchTerm("");
    handleRegistryEntriesRefresh();
  };

  const handleIdentityCallback = () => {
    getRegistry();
    setLazyMintModeEnabled(false);
    setCreateIdentityModalOpen(false);
  };

  return (
    <Box>
      <GovernanceWidgetHeader
        label={registryName}
        navigationLink={{
          label: "Registry Entry List",
          onClick: () => {
            onRegistryListNavigate?.();
          },
        }}
        headerActions={getHeaderActions()}
        bottomContent={
          <Box className={classes.headerBottomContentWrapper}>
            <Formik
              initialValues={{
                searchBy: ERegistryEntrySearchBy.OWNER_ADDRESS,
              }}
              onSubmit={() => {}}
            >
              {({ handleSubmit, values }) => {
                return (
                  <Form onSubmit={handleSubmit} className={classes.searchForm}>
                    <GovernanceDialogSelectField
                      title="Search By"
                      size="small"
                      name="searchBy"
                      wrapperClassName={classes.searchBySelectWrapper}
                      options={[
                        {
                          primaryText: "Owner Address",
                          value: ERegistryEntrySearchBy.OWNER_ADDRESS,
                        },
                        {
                          primaryText: "Username",
                          value: ERegistryEntrySearchBy.USERNAME,
                        },
                      ]}
                    />
                    <Box className={classes.searchFilterWrapper}>
                      {values.searchBy === ERegistryEntrySearchBy.USERNAME ? (
                        <GovernanceSearchFilter
                          title="Search by username"
                          placeholder="Search by username"
                          onSearchClick={onSearchByUsernameClick}
                          onRestartClick={onRestartClick}
                        />
                      ) : (
                        <GovernanceSearchFilter
                          title="Search by owner address"
                          placeholder="Search by owner address"
                          onSearchClick={onSearchByOwnerAddressClick}
                          onRestartClick={onRestartClick}
                        />
                      )}
                    </Box>
                  </Form>
                );
              }}
            </Formik>
            <Box className={classes.sortWrapper}>
              <Typography className={classes.reverseSortLabel}>
                Reverse sorting
              </Typography>
              <GovernanceSwitch
                initialValue={reversedSortingEnabled}
                onChange={(reversedSorting) =>
                  setReversedSortingEnabled(reversedSorting)
                }
              />
            </Box>
          </Box>
        }
      />
      {hasEmptyState && (
        <GovernanceEmptyState
          title="No registiry entries found."
          description="Registiry entries submitted by community members will appear here."
        />
      )}
      {hasEmptyFilterResult && (
        <GovernanceEmptyState
          title="No registiry entries found."
          description="This filter/search returned no registry entries submitted by community members."
        />
      )}
      {registryEntries.map((registryEntry) => (
        <GovernanceRegistryListItem
          key={registryEntry.label}
          number={
            registryEntry.index != null
              ? (registryEntry.index + 1).toString()
              : "-"
          }
          title=""
          fieldWithValueList={[
            {
              fieldTitle: "Label",
              fieldValue: registryEntry.label || "-",
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
                    RegistryName(registryName),
                    registryEntry.tokenId,
                  ),
              },
            ],
          })}
        />
      ))}
      {!!registry?.numberOfEntries && !searchTerm && (
        <GovernancePagination
          customPageOptions={{
            itemsPerPage: REGISTRY_ENTRIES_PER_PAGE,
            totalItems: registry?.numberOfEntries,
            currentPage: page,
          }}
          onChange={(_, page) => {
            setPage(page);
          }}
        />
      )}
      {createIdentityModalOpen && (
        <CreateIdentityWidget
          onCloseCallback={handleIdentityCallback}
          lazyMintModeEnabled={lazyMintModeEnabled}
          registryName={registryName}
          currentAccountAddress={accountAddress}
        />
      )}
      {createBatchIdentityModalOpen && (
        <CreateBatchIdentityWidget
          onCloseCallback={() => {
            getRegistry();
            setCreateBatchIdentityModalOpen(false);
          }}
          registryName={registryName}
          currentAccountAddress={accountAddress}
        />
      )}
    </Box>
  );
};

export default RegistryEntryListWidget;
