import { ChainId, ChainInformation } from "@hypernetlabs/objects";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import {
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@material-ui/icons";
import { Form, Formik, Field as FormikField, FieldProps } from "formik";

import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { IRenderParams } from "@web-ui/interfaces";
import { useStyles } from "@web-ui/widgets/ChainSelectorWidget/ChainSelectorWidget.style";
import { useAlert } from "react-alert";

interface ChainSelectorWidgetParams extends IRenderParams {}

const ChainSelectorWidget: React.FC<ChainSelectorWidgetParams> = () => {
  const classes = useStyles({});
  const { coreProxy, UIData } = useStoreContext();
  const { handleCoreError } = useLayoutContext();
  const alert = useAlert();

  const [governanceChainId, setGovernanceChainId] = useState<ChainId>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chainInformationList, setChainInformationList] = useState<
    ChainInformation[]
  >([]);
  const [mainProviderChainId, setMainProviderChainId] = useState<ChainId>();

  const chainOptions = useMemo(() => {
    return chainInformationList
      .filter(({ isDev }) => isDev === false)
      .map(({ chainId, name }) => ({
        name: `${name} - ${chainId}`,
        value: chainId,
      }));
  }, [JSON.stringify(chainInformationList)]);

  useEffect(() => {
    coreProxy.payments
      .waitPaymentsInitialized()
      .map(initializeData)
      .mapErr(handleCoreError);

    coreProxy.registries
      .waitRegistriesInitialized()
      .map(initializeData)
      .mapErr(handleCoreError);

    coreProxy.governance
      .waitGovernanceInitialized()
      .map(initializeData)
      .mapErr(handleCoreError);
  }, []);

  useEffect(() => {
    // Governance provider chain id change evet
    coreProxy.onGovernanceChainChanged.subscribe((chainId) => {
      setGovernanceChainId(chainId);
    });

    // Main provider chain id change evet
    coreProxy.onChainChanged.subscribe((chainId) => {
      setMainProviderChainId(chainId);
    });

    // Check for governance signer unavailable events
    coreProxy.onGovernanceSignerUnavailable.subscribe((error) => {
      alert.info(
        error?.message ||
          "Your signer is not available for the selected chain, please switch your network in metamask!",
      );
    });
  }, []);

  const initializeData = () => {
    retrieveGovernanceChainInformation();
    retrieveChainInformationList();
    getMainProviderChainId();
  };

  const retrieveGovernanceChainInformation = () => {
    coreProxy
      .retrieveGovernanceChainInformation()
      .map((governanceChainInformation) => {
        setGovernanceChainId(governanceChainInformation.chainId);
      })
      .mapErr(handleCoreError);
  };

  const retrieveChainInformationList = () => {
    coreProxy
      .retrieveChainInformationList()
      .map((chainInformationMap) => {
        const chainInformationList: ChainInformation[] = [];
        chainInformationMap.forEach((chainInformation) => {
          chainInformationList.push(chainInformation);
        });
        setChainInformationList(chainInformationList);
      })
      .mapErr(handleCoreError);
  };

  const getMainProviderChainId = () => {
    coreProxy
      .getMainProviderChainId()
      .map((chainId) => {
        setMainProviderChainId(chainId);
      })
      .mapErr(handleCoreError);
  };

  const toggleDialogOpen = () => {
    setIsDialogOpen((open) => !open);
  };

  const handleSwitchChain = (chainId: ChainId) => {
    coreProxy
      .initializeForChainId(chainId)
      .map(() => {
        window.location.reload();
      })
      .mapErr(handleCoreError);
  };

  const handleSwitchMetamaskNetwork = () => {
    if (governanceChainId == null) {
      return;
    }

    coreProxy.switchProviderNetwork(governanceChainId).mapErr(handleCoreError);
  };

  const showSwitchNetworkButton = useMemo(() => {
    if (governanceChainId == null || mainProviderChainId == null) {
      return false;
    }

    return governanceChainId !== mainProviderChainId;
  }, [governanceChainId, mainProviderChainId]);

  if (!chainInformationList.length || !governanceChainId) {
    return <></>;
  }

  return (
    <Box display="flex">
      <Formik
        initialValues={{ chainId: governanceChainId }}
        onSubmit={(values) => {
          handleSwitchChain(values.chainId);
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} id="ChwainSelectorForm">
            <Box className={classes.wrapper} onClick={toggleDialogOpen}>
              <FormikField
                className={classes.field}
                name="chainId"
                type="select"
                placeholder={"select action"}
                required={true}
                options={chainOptions}
              >
                {({ field, form }: FieldProps) => {
                  return (
                    <>
                      <Box className={classes.fieldTextWrapper}>
                        <Typography variant="body2">
                          {`Chain: 
                            ${
                              chainOptions?.find(
                                (option) => option.value === field.value,
                              )?.name
                            }`}
                        </Typography>
                        <KeyboardArrowDownIcon />
                      </Box>

                      <Dialog
                        open={isDialogOpen}
                        onClose={() => {
                          setIsDialogOpen(false);
                        }}
                        fullWidth
                        maxWidth="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <DialogTitle>
                          <Box className={classes.dialogTitle}>
                            Select Chain
                            <IconButton
                              aria-label="close"
                              onClick={() => {
                                setIsDialogOpen(false);
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Box>
                        </DialogTitle>
                        <Divider />
                        <List className={classes.list}>
                          {chainOptions?.map((option, index) => (
                            <ListItem
                              key={index}
                              className={classes.listItem}
                              button
                              onClick={() => {
                                form.setFieldValue("chainId", option.value);
                                setIsDialogOpen(false);
                                handleSubmit();
                              }}
                            >
                              <ListItemText
                                {...(option.name && { primary: option.name })}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Dialog>
                    </>
                  );
                }}
              </FormikField>
            </Box>
          </Form>
        )}
      </Formik>

      {showSwitchNetworkButton && (
        <Box
          className={classes.switchChainButton}
          onClick={handleSwitchMetamaskNetwork}
        >
          <Typography>Switch Network</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChainSelectorWidget;
