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

interface ChainSelectorWidgetParams extends IRenderParams {}

const ChainSelectorWidget: React.FC<ChainSelectorWidgetParams> = () => {
  const classes = useStyles({});
  const { coreProxy } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();

  const [governanceChainId, setGovernanceChainId] = useState<ChainId>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chainInformationList, setChainInformationList] = useState<
    ChainInformation[]
  >([]);

  const chainOptions = useMemo(() => {
    console.log("chainInformationList", chainInformationList);
    return chainInformationList.map(({ chainId: value, name }) => ({
      name,
      value,
    }));
  }, [JSON.stringify(chainInformationList)]);

  useEffect(() => {
    setLoading(true);
    coreProxy
      .waitInitialized()
      .map(() => {
        retrieveGovernanceChainInformation();
        retrieveChainInformationList();
      })
      .mapErr(handleCoreError);
  }, []);

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
        chainInformationMap.forEach((chainInformation, _chainId) => {
          chainInformationList.push(chainInformation);
        });
        setChainInformationList(chainInformationList);
      })
      .mapErr(handleCoreError);
  };

  const toggleDialogOpen = () => {
    setIsDialogOpen((open) => !open);
  };

  const handleSwitchChain = (chainId: ChainId) => {
    coreProxy
      .switchProviderNetwork(chainId)
      .map(() => {
        // retrieveGovernanceChainInformation();
        console.log("Now re-init something");
      })
      .mapErr((e) => {
        console.log("!!! Switch your metamask network");
      });
  };

  if (!chainInformationList.length || !governanceChainId) {
    return <></>;
  }

  return (
    <>
      <Formik
        initialValues={{ chainId: governanceChainId }}
        onSubmit={(values) => {
          handleSwitchChain(values.chainId);
          console.log(`fe`, values.chainId);
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
    </>
  );
};

export default ChainSelectorWidget;
