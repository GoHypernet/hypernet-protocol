import ScreenHeader from "@mobileApp/components/ScreenHeader";
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

interface SummaryProps {}

const Summary: React.FC<SummaryProps> = (props: SummaryProps) => {
  return (
    <View style={styles.container}>
      <ScreenHeader
        screenLabel="Summary"
        onActionClick={() => {
          console.log("action clicked");
        }}
        onFilterClick={() => {
          console.log("filter clicked");
        }}
      />
      <View style={styles.cardListContainer}>
        <Image style={styles.img} source={require("@mobileApp/assets/images/summary.png")} />
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
    paddingBottom: 50,
  },
  cardListContainer: {
    flex: 1,
    marginTop: -hp(10),
    flexDirection: "column",
  },
});

export default Summary;
