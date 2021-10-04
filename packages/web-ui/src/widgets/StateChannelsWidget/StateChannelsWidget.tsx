import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { IRenderParams } from "@web-ui/interfaces";

import { GovernanceField } from "@web-ui/components";
import { useStoreContext } from "@web-ui/contexts";
import {
  ActiveStateChannel,
  ChainId,
  EthereumAddress,
  PublicIdentifier,
} from "@hypernetlabs/objects";
import { Form, Formik } from "formik";
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
      useState<EthereumAddress>(EthereumAddress(""));

    useEffect(() => {
      console.log("state channel widget use effect");

      const activeStateChannels = [
        new ActiveStateChannel(
          ChainId(343434),
          PublicIdentifier("sdAsdsad"),
          EthereumAddress("asdsadsad"),
        ),
        new ActiveStateChannel(
          ChainId(34343422),
          PublicIdentifier("sdAsdsad22"),
          EthereumAddress("asdsadsad22"),
        ),
        new ActiveStateChannel(
          ChainId(34343433),
          PublicIdentifier("sdAsdsad33"),
          EthereumAddress("asdsadsad33"),
        ),
      ];

      setStateChannels(activeStateChannels);
      if (activeStateChannels[0] != null) {
        setSelectedStateChannelAddress(activeStateChannels[0].channelAddress);
        UIData.onSelectedStateChannelChanged.next(activeStateChannels[0]);
      }

      coreProxy.onStateChannelCreated.subscribe((activeStateChannel) => {
        setStateChannels([...stateChannels, activeStateChannel]);
        if (stateChannels.length === 0) {
          setSelectedStateChannelAddress(activeStateChannel.channelAddress);
          UIData.onSelectedStateChannelChanged.next(activeStateChannel);
        }
      });
    }, []);

    const handleChange = (address: EthereumAddress) => {
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
                <GovernanceField
                  required
                  name="stateChannel"
                  type="select"
                  options={stateChannels.map(({ channelAddress }) => ({
                    label: channelAddress,
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
