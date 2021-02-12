import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Button, Text } from "react-native-elements";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";
import ServiceCard from "./components/ServiceCard";

interface ServiceProps {}

const Service: React.FC<ServiceProps> = (props: ServiceProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Icon name="filter" color="white" size={hp(2.5)} />
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Service</Text>
        <Button
          title="Action"
          type="outline"
          titleStyle={styles.text}
          buttonStyle={styles.actionButton}
          onPress={() => console.log("pressed")}
        />
      </View>
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
  filterContainer: {
    flexDirection: "row-reverse",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(5),
    marginBottom: hp(2),
  },
  title: {
    color: "white",
    marginBottom: 24,
    fontSize: 28,
    fontWeight: "800",
  },
  img: {
    marginBottom: 10,
  },
  cardListContainer: {
    flex: 1,
    flexDirection: "column",
  },
  actionButton: {
    backgroundColor: "#2E3546",
    width: 100,
    height: 30,
    borderRadius: 15,
    borderColor: "#2E3546",
  },
  text: { color: "#FFFFFF", fontWeight: "800", fontSize: 11 },
});

export default Service;
