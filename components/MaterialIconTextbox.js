import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class MaterialIconTextbox extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Icon
          name={this.props.iconStyleName || "key"}
          style={styles.iconStyle}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="rgba(230, 230, 230,1)"
          autoFocus={true}
          autoCorrect={false}
          blurOnSubmit={true}
          editable={true}
          keyboardType="email-address"
          style={styles.inputStyle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(121,39,39,0)",
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
    color: "rgba(255,255,255,1)",
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
