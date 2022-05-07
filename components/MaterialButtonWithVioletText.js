import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

export default class MaterialButtonWithVioletText extends Component {
  render() {
    return (
      <TouchableOpacity style={[styles.container, this.props.style]}>
        <Text style={styles.caption}>Create Account</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 16,
    paddingLeft: 16,
    minWidth: 88
  },
  caption: {
    color: "rgba(254,254,254,1)",
    fontSize: 14
  }
});
