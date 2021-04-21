import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import BalanceCard from "./components/BalanceCard";

import ScreenHeader from "@mobileApp/components/ScreenHeader";
import { useStateContext } from "@mobileApp/state/store";

interface BalanceProps {}

const Balance: React.FC<BalanceProps> = (props: BalanceProps) => {
  const { state } = useStateContext();
  const { coreReducer } = state;
  console.log("coreReducer: ", coreReducer);

  return (
    <View style={styles.container}>
      <ScreenHeader
        screenLabel="Balance"
        onActionClick={() => {
          console.log("action clicked");
        }}
        onFilterClick={() => {
          console.log("filter clicked");
        }}
      />
      <View style={styles.cardListContainer}>
        <BalanceCard
          primaryTitle="Wrapped Bitcoin"
          primaryValue="1.00043"
          secondaryTitle="WBTC"
          secondaryValue="5750,70"
          renderIcon={() => <Image source={require("@mobileApp/assets/images/wbtc.png")} />}
        />

        <BalanceCard
          primaryTitle="Hypercoin"
          primaryValue="831,54"
          secondaryTitle="HC"
          secondaryValue="831,54"
          renderIcon={() => <Image source={require("@mobileApp/assets/images/hc.png")} />}
        />
        <BalanceCard
          primaryTitle="United States Dist."
          primaryValue="24.923"
          secondaryTitle="USDC"
          secondaryValue="1390,10"
          renderIcon={() => <Image source={require("@mobileApp/assets/images/usdc.png")} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: hp(9),
    paddingLeft: wp(6),
    paddingRight: wp(6),
  },
  img: {
    marginBottom: 10,
  },
  cardListContainer: {
    flex: 1,
    flexDirection: "column",
  },
});

export default Balance;
