import ScreenHeader from "@mobileApp/components/ScreenHeader";
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import ServiceCard from "./components/ServiceCard";

interface ServiceProps {}

const Service: React.FC<ServiceProps> = (props: ServiceProps) => {
  return (
    <View style={styles.container}>
      <ScreenHeader
        screenLabel="Service"
        onActionClick={() => {
          console.log("action clicked");
        }}
        onFilterClick={() => {
          console.log("filter clicked");
        }}
      />
      <View style={styles.cardListContainer}>
        <ServiceCard renderIcon={() => <Image source={require("@mobileApp/assets/images/copernicus.png")} />} />
        <ServiceCard renderIcon={() => <Image source={require("@mobileApp/assets/images/galileo.png")} />} />
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

export default Service;
