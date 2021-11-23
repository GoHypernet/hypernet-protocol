import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Button, Text } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface BalanceCardProps {
  renderIcon?: () => any;
  primaryTitle: string;
  primaryValue: string;
  secondaryTitle: string;
  secondaryValue: string;
}

const BalanceCard: React.FC<BalanceCardProps> = (props: BalanceCardProps) => {
  const {
    primaryTitle,
    primaryValue,
    secondaryTitle,
    secondaryValue,
    renderIcon = () => {},
  } = props;
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{renderIcon()}</Text>
      <View style={styles.detailContainer}>
        <View style={styles.row}>
          <Text style={styles.primaryValue}>{primaryTitle}</Text>
          <Text style={styles.primaryValue}>{primaryValue}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.secondaryValue}>{secondaryTitle}</Text>
          <Text style={styles.secondaryValue}>${`${secondaryValue}`}</Text>
        </View>
      </View>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A202E",
    borderTopWidth: 2,
    borderTopColor: "#2852ff",
    height: hp(11),
    paddingTop: wp(6),
    paddingBottom: wp(6),
    paddingLeft: wp(5),
    paddingRight: wp(5),
    marginBottom: hp(1),
  },
  icon: {
    marginRight: wp(4),
    marginLeft: wp(4),
    color: "white",
  },
  detailContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  primaryValue: {
    // 14
    fontSize: hp(1.8),
    color: "#FFFFFF",
    fontWeight: "800",
  },
  secondaryValue: {
    // 11
    fontSize: hp(1.4),
    color: "#6D778B",
    fontWeight: "800",
  },
});

export default BalanceCard;
