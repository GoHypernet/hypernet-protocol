import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { IRenderParams } from "@web-ui/interfaces";

import { BoxWrapper } from "@web-ui/components";
import { useStoreContext } from "@web-ui/contexts";
import {
  ActiveStateChannel,
  ChainId,
  EthereumAddress,
  PublicIdentifier,
} from "@hypernetlabs/objects";

interface IStateChannelsWidget extends IRenderParams {}

const StateChannelsWidget: React.FC<IStateChannelsWidget> = ({
  includeBoxWrapper,
  bodyStyle,
}: IStateChannelsWidget) => {
  const { coreProxy, UIData } = useStoreContext();
  const [stateChannels, setStateChannels] = useState<ActiveStateChannel[]>([]);
  const [selectedStateChannelAddress, setSelectedStateChannelAddress] =
    useState<EthereumAddress>(EthereumAddress(""));

  useEffect(() => {
    coreProxy.getActiveStateChannels().map((_stateChannels) => {
      /* const activeStateChannels = [
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
      ]; */

      setStateChannels(_stateChannels);
      if (_stateChannels[0] != null) {
        setSelectedStateChannelAddress(_stateChannels[0].channelAddress);
        UIData.onSelectedStateChannelChanged.next(_stateChannels[0]);
      }
    });
  }, []);

  const CustomBox = includeBoxWrapper ? BoxWrapper : Box;

  const handleChange = (event) => {
    const val = event.target.value;
    // Publish an event to other widgets
    setSelectedStateChannelAddress(val);
    UIData.onSelectedStateChannelChanged.next(
      stateChannels.find((stateChannel) => stateChannel.channelAddress === val),
    );
  };

  return (
    <CustomBox label="Current state channel" bodyStyle={bodyStyle}>
      <FormControl style={{ display: "flex", padding: "20px 200px" }}>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedStateChannelAddress}
          onChange={handleChange}
        >
          {stateChannels.map((stateChannel) => (
            <MenuItem
              key={stateChannel.channelAddress}
              value={stateChannel.channelAddress}
            >
              {stateChannel.channelAddress}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </CustomBox>
  );
};

export default StateChannelsWidget;
