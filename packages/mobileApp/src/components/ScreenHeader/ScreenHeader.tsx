import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Button, Text } from "react-native-elements";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";

import { colors } from "@mobileApp/constants";

interface IScreenHeaderProps {
  onActionClick: () => void;
  onFilterClick: () => void;
  screenLabel: string;
}

const ScreenHeader: React.FC<IScreenHeaderProps> = (
  props: IScreenHeaderProps,
) => {
  const { onActionClick, onFilterClick, screenLabel } = props;
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={onFilterClick}>
          <Icon name="filter" color={colors.white} size={hp(2.5)} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{screenLabel}</Text>
        <Button
          title="Action"
          type="outline"
          titleStyle={styles.text}
          buttonStyle={styles.actionButton}
          onPress={onActionClick}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  filterContainer: {
    flexDirection: "row-reverse",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(5),
  },
  title: {
    color: colors.white,
    marginBottom: 24,
    fontSize: 28,
    fontWeight: "800",
  },
  actionButton: {
    backgroundColor: colors.actionButtonBgColor,
    width: 100,
    height: 30,
    borderRadius: 15,
    borderColor: colors.actionButtonBgColor,
  },
  text: { color: colors.white, fontWeight: "800", fontSize: 11 },
});

export default ScreenHeader;
