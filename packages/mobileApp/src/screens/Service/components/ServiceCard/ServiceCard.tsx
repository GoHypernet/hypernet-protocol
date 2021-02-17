import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";

interface ServiceCardProps {
  renderIcon: () => {};
}

const ServiceCard: React.FC<ServiceCardProps> = (props: ServiceCardProps) => {
  const { renderIcon = () => {} } = props;
  return (
    <View style={styles.container}>
      {renderIcon()}

      <Button
        titleStyle={styles.buttonText}
        buttonStyle={styles.button}
        icon={<Icon name="unlink" color="white" />}
        title="Unauthorize"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  button: {
    backgroundColor: "#0078FF",
    width: wp(30),
    height: 30,
    borderRadius: 15,
    borderColor: "#0078FF",
    justifyContent: "space-around",
    alignItems: "center",
  },
  buttonText: {
    fontSize: hp(1.4),
  },
});

export default ServiceCard;
