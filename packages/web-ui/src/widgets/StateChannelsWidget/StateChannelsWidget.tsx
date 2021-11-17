import {
  ActiveStateChannel,
  ChainId,
  EthereumContractAddress,
  PublicIdentifier,
} from "@hypernetlabs/objects";
import { Box, Typography } from "@material-ui/core";
import { useStoreContext } from "@web-ui/contexts";
import { IRenderParams } from "@web-ui/interfaces";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";

import { GovernanceDialogSelectField } from "@web-ui/components";
import { useStyles } from "@web-ui/widgets/StateChannelsWidget/StateChannelsWidget.style";

interface IStateChannelsWidget extends IRenderParams {}

const StateChannelsWidget: React.FC<IStateChannelsWidget> =
  ({}: IStateChannelsWidget) => {
    const classes = useStyles();
    const { coreProxy, UIData } = useStoreContext();
    const [stateChannels, setStateChannels] = useState<ActiveStateChannel[]>(
      [],
    );
    const [selectedStateChannelAddress, setSelectedStateChannelAddress] =
      useState<EthereumContractAddress>(EthereumContractAddress(""));

    useEffect(() => {
      coreProxy.getActiveStateChannels().map((_stateChannels) => {
        setStateChannels(_stateChannels);
        if (_stateChannels[0] != null) {
          setSelectedStateChannelAddress(_stateChannels[0].channelAddress);
          UIData.onSelectedStateChannelChanged.next(_stateChannels[0]);
        }
      });

      coreProxy.onStateChannelCreated.subscribe((activeStateChannel) => {
        setStateChannels([...stateChannels, activeStateChannel]);
        if (stateChannels.length === 0) {
          setSelectedStateChannelAddress(activeStateChannel.channelAddress);
          UIData.onSelectedStateChannelChanged.next(activeStateChannel);
        }
      });
    }, []);

    const handleChange = (address: EthereumContractAddress) => {
      // Publish an event to other widgets
      setSelectedStateChannelAddress(address);
      UIData.onSelectedStateChannelChanged.next(
        stateChannels.find(
          (stateChannel) => stateChannel.channelAddress === address,
        ),
      );
    };

    return (
      <Box className={classes.wrapper}>
        <Typography variant="h5" className={classes.label}>
          Current Account Address
        </Typography>
        <Formik
          enableReinitialize
          initialValues={{
            stateChannel: selectedStateChannelAddress,
          }}
          onSubmit={() => {}}
        >
          {({ handleSubmit }) => {
            return (
              <Form onSubmit={handleSubmit} className={classes.form}>
                <GovernanceDialogSelectField
                  required
                  dialogTitle="Hypernet Account"
                  name="stateChannel"
                  type="select"
                  options={stateChannels.map(({ channelAddress }) => ({
                    primaryText: channelAddress,
                    value: channelAddress,
                  }))}
                  fullWidth
                  handleChange={handleChange}
                />
              </Form>
            );
          }}
        </Formik>
      </Box>
    );
  };

export default StateChannelsWidget;
