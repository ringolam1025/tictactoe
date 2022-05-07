import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import { GAME_RESULT_NO, GAME_RESULT_CIRCLE, GAME_RESULT_CROSS, GAME_RESULT_TIE, userType } from '../constants/game'

export default class Header extends Component {
    generateResultText(result: number, userType) {
        switch (result) {
            case GAME_RESULT_CROSS:
                if (userType === 'guest') {
                    return 'You Win!'
                } else if (userType === 'holder') {
                    return 'You lose!'
                } else {
                    return 'Cross Win!'
                }
            case GAME_RESULT_CIRCLE:
                if (userType === 'guest') {
                    return 'You lose!'
                } else if (userType === 'holder') {
                    return 'You Win!'
                } else {
                    return 'Circle Win!'
                }
            case GAME_RESULT_TIE:
                return 'Tie!'
            default:
                return ''
    }
  }
  render() {
    const { result, onRestart, userType } = this.props
    return (
      <View>
        <Text style={styles.text}>{ this.generateResultText(result, userType) }</Text>
        {
          userType == 'holder' && result !== GAME_RESULT_NO && (
            <TouchableOpacity onPress={() => onRestart()}>
              <Text style={styles.instructions}> Touch here to play again </Text>
            </TouchableOpacity>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  instructions: {
    color: 'grey',
    textAlign: 'center',
  },
})
