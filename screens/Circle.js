import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default class Circle extends Component {
  render() {
    const { xTranslate, yTranslate, color } = this.props
    return (
      <View style={[styles.container, {
        transform: [
          {translateX: xTranslate ? xTranslate : 10},
          {translateY: yTranslate ? yTranslate : 10},
        ],
        backgroundColor: color ? color : 'transparent'
      }]}>
        <View style={styles.innerCircle}>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 70,
  },
  innerCircle: {
    backgroundColor: 'rgb(255,255,255)',
    width: 60,
    height: 60,
    borderRadius: 35,
  },

})