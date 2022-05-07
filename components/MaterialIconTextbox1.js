import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class MaterialIconTextbox1 extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Icon
          name={this.props.iconStyleName || "lock-open"}
          style={styles.iconStyle}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="rgba(255,255,255,1)"
          style={styles.inputStyle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center"
  },
  iconStyle: {
    color: "rgba(255,255,255,1)",
    fontFamily: "roboto-regular",
    fontSize: 24,
    paddingLeft: 8
  },
  inputStyle: {
    flex: 1,
    color: "#000",
    alignSelf: "stretch",
    marginLeft: 16,
    paddingTop: 14,
    paddingRight: 5,
    paddingBottom: 8,
    borderColor: "#D9D5DC",
    borderBottomWidth: 1,
    fontSize: 16,
    lineHeight: 16
  }
});
