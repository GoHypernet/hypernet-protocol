import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Button, Text } from "react-native-elements";

interface BalanceProps {}

const Balance: React.FC<BalanceProps> = (props: BalanceProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Balance</Text>
        <Button
          title="Action"
          type="outline"
          titleStyle={styles.text}
          buttonStyle={styles.actionButton}
          onPress={() => console.log("pressed")}
        />
      </View>
      <View style={styles.cardListContainer}>
        <Image style={styles.img} source={require("@mobileApp/assets/images/balance_card_1.png")} />
        <Image style={styles.img} source={require("@mobileApp/assets/images/balance_card_1.png")} />
        <Image style={styles.img} source={require("@mobileApp/assets/images/balance_card_1.png")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 100,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 30,
    marginRight: 30,
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
    alignItems: "center",
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

export default Balance;
