import React, { Component } from 'react'
import { AsyncStorage, StatusBar, Dimensions, Button, HeaderBackButton, TextInput, YellowBox, TouchableWithoutFeedback, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ToastAndroid, AppState } from 'react-native';
import io from "socket.io-client";

import Circle from './Circle'
import Cross from './Cross'
import { CENTER_POINTS, AREAS, CONDITIONS, GAME_RESULT_NO, GAME_RESULT_CIRCLE, GAME_RESULT_CROSS, GAME_RESULT_TIE } from '../constants/game'
import styles from './styles/custGameBoard'
import PromptArea from './PromptArea'
import Icon from 'react-native-vector-icons/Ionicons';

console.ignoredYellowBox = ['Remote debugger'];
YellowBox.ignoreWarnings([ 'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?' ]);

export default class GameBoard extends Component {
    constructor(props) {
        super(props)
        const { navigation } = this.props;
        StatusBar.setHidden(true);
        this.socket = io("http://ringohome.asuscomm.com:9868");

        var roomID = navigation.getParam('roomID', '');
        var roomName = navigation.getParam('roomName', '');

        this.state= {
            open: false, connected: false, checkWinner: false,
            result: GAME_RESULT_NO, round: 1, seconds: 0,
            userID: navigation.getParam('userID', ''), displayName:'',
            roomID: roomID, roomName: roomName,
            circleInputs:[], crossInputs:[],
            infoMessages: [], infoMessage:'', chatMsg: [],
            userType: '', isYourTurn: false, gameMsg:'', isGameStart:false,
            tmpMsg:'', pptInGame:'',
            holderScore: 0, guestScore: 0
        }
        AsyncStorage.multiGet(['userID', 'displayName']).then((data) => {
            this.setState({ userID: data[0][1], displayName: data[1][1], })
        });
    }
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('roomName', ''),
            header: null
        }
    }
    emit() {
      if( this.state.connected ) {
        this.setState(prevState => ({ open: !prevState.open }))
      }
    }
    tick() { this.setState(prevState => ({ seconds: prevState.seconds + 1 })); }
    componentDidMount() {
        this.socket.emit("joinRoom", {roomID: this.state.roomID, roomName: this.state.roomName, userID: this.state.userID});
        this.socket.on("newUserJoinRoom", (data) => {
            this.setState({ gameMsg: data.gameMsg, pptInGame: data.playerInRoom, infoMessages: [...this.state.infoMessages, {msgType:data.msgType, msg:data.gameMsg} ] });
        });
        this.socket.on("newUserLogin", (data) => {
             if (data.userType+'' != ''){ this.setState({ userType: data.userType }); }
             this.setState({ gameMsg: data.gameMsg, infoMessages: [...this.state.infoMessages, {msgType:data.msgType, msg:data.gameMsg} ] });
             console.log(data.step)
             step = data.step;
             for (var s=0; s<step.length; s++) {
                console.log(step[s].type);
                if (step[s].type === 'cross') {
                    this.setState({ crossInputs: [...this.state.crossInputs, step[s].areaID] });
                }else if (step[s].type === 'circle') {
                    this.setState({ circleInputs: [...this.state.circleInputs, step[s].areaID] });
                }
             }
        });
        this.socket.on("processChatMsg", (data) => {
            this.setState({ infoMessages: [...this.state.infoMessages, {msgType: 'user', msg:data.displayName + ': ' + data.msg}] });
        });

        this.socket.on("gameStart", (data) => {
             this.setState({ infoMessages: [...this.state.infoMessages, {msgType:data.msgType, msg:data.gameMsg}] });

             if (this.state.userType+'' == 'holder'){
                 this.setState({ isGameStart: true, isYourTurn:true });
                 this.setGameMsg();

             }else if (this.state.userType+'' == 'guest'){
                 this.setState({ isGameStart: true, isYourTurn:false });
                 this.setGameMsg();

             }else if (this.state.userType+'' == 'viewer'){
                 this.setState({ isGameStart: true, isYourTurn:false, gameMsg: 'Viewer Mode' });
             }
        });
        this.socket.on("setMessageInfo", (data) => {
             this.setState({ infoMessages: [...this.state.infoMessages, {msgType:data.msgType, msg:data.gameMsg}], pptInGame: data.playerInRoom });
        });
        this.socket.on("reStartGame", (gameIsStart) => {
              const { round } = this.state
              this.setState({
                  circleInputs: [],
                  crossInputs: [],
                  result: GAME_RESULT_NO,
                  round: round + 1,
                  isYourTurn:true
              })
             if (this.state.userType+'' == 'holder'){
                 this.setState({ isGameStart: true, isYourTurn:true });
                 this.setGameMsg();

             }else if (this.state.userType+'' == 'guest'){
                 this.setState({ isGameStart: true, isYourTurn:false });
                 this.setGameMsg();

             }else if (this.state.userType+'' == 'viewer'){
                 this.setState({ isGameStart: true, isYourTurn:false, gameMsg: 'Viewer Mode' });

             }
        });
        this.socket.on("updateGameBoardCross", cross => {
            this.setState({ crossInputs: [...this.state.crossInputs, cross] });
            if (this.state.userType+'' != 'viewer'){
                 this.setState({ isYourTurn:true, gameMsg: 'Your Turn!' });
            }
            setTimeout(() => { this.judgeWinner() }, 5)
       });
        this.socket.on("updateGameBoardCircle", circle => {
            this.setState({ circleInputs: [...this.state.circleInputs, circle] });
            if (this.state.userType+'' != 'viewer'){
                 this.setState({ isYourTurn:true, gameMsg: 'Your Turn!' });
            }
            setTimeout(() => { this.judgeWinner() }, 5)
       });
        this.socket.on('disConnection', () => {
            this.socket.close();
        });
     }
    componentWillUnmount() {
         AppState.removeEventListener('change', this._handleAppStateChange);
         clearInterval(this.interval);
     }
    componentDidUpdate() {}
    restart() {
        const { round } = this.state
        this.setState({
            circleInputs: [],
            crossInputs: [],
            result: GAME_RESULT_NO,
            round: round + 1,
            isYourTurn:true
        })
        this.socket.emit("reStartGame", {roomID:this.state.roomID});
     }
    isWinner(inputs: number[]) {
        return CONDITIONS.some(d => d.every(item => inputs.indexOf(item) !== -1))
    }
    judgeWinner() {
      const { circleInputs, crossInputs, result } = this.state
      const inputs = circleInputs.concat(crossInputs);
      if (inputs.length >= 5 ) {
        let res = this.isWinner(circleInputs)
        if (res && result !== GAME_RESULT_CIRCLE) {
          return this.setState({ result: GAME_RESULT_CIRCLE, gameMsg:'', holderScore: this.state.holderScore+1, userType:this.state.userType })
        }
        res = this.isWinner(crossInputs)
        if (res && result !== GAME_RESULT_CROSS) {
          return this.setState({ result: GAME_RESULT_CROSS, gameMsg:'', guestScore: this.state.guestScore+1, userType:this.state.userType })
        }
      }
      if (inputs.length === 9 && result === GAME_RESULT_NO && result !== GAME_RESULT_TIE) {
        this.setState({ result: GAME_RESULT_TIE, gameMsg:'' })
      }
    }
    setGameMsg(){
        if (this.state.isYourTurn){
            this.setState({ gameMsg: 'Your Turn!' })
        }else{
            this.setState({ gameMsg: 'Opponent Turn!' })
        }
    }
    boardClickHandler(e: Object) {
        const { locationX, locationY } = e.nativeEvent
        const { circleInputs, crossInputs, result, isYourTurn, isGameStart, roomID } = this.state
        const { navigation } = this.props;

        if (result !== -1 || !isYourTurn || !isGameStart) { return }

        const inputs = circleInputs.concat(crossInputs)
        const area = AREAS.find(d => (locationX >= d.startX && locationX <= d.endX) && (locationY >= d.startY && locationY <= d.endY))

        if (area && inputs.every(d => d !== area.id)) {
             if (inputs.length % 2 === 0){
              // Circle
              this.setState({ circleInputs: this.state.circleInputs.concat(area.id), isYourTurn:false, gameMsg: 'Opponent Turn!' });
              this.socket.emit("updateGameBoardCircle", {areaID:area.id, roomID:roomID});
            }else{
              // Cross
              this.setState({ crossInputs: this.state.crossInputs.concat(area.id), isYourTurn:false, gameMsg: 'Opponent Turn!' });
              this.socket.emit("updateGameBoardCross", {areaID:area.id, roomID:roomID});
            }
        }
        setTimeout(() => { this.judgeWinner() }, 5)
    }
    leaveRoom(roomID){
        this.socket.emit("leftRoom", {userID: this.state.userID, userName: this.state.userName, roomID:this.state.roomID});
        this.props.navigation.navigate('Lobby',{userID: this.state.userID});
    }
    sendChatMsg(){
        if (this.state.chatMsg+'' != ''){
            this.socket.emit("sendChatMsg", {roomID: this.state.roomID, userID: this.state.userID, displayName: this.state.displayName, msg:this.state.chatMsg});
            this.setState({ chatMsg: "" });
        }
    }
    render() {
         const infoMessages = this.state.infoMessages.map(data => data.msgType === 'user' && data.msg !='' ? (
                                                                <Text style={styles.infoAreaText} key={data.msg}>{data.msg}</Text>
                                                             ):
                                                             (
                                                                <Text style={styles.infoAreaText, styles.sysMsg} key={data.msg}>[Info] {data.msg}</Text>
                                                             )
                                                        ).reverse();

        return (
          <View style={styles.container}>
             <View style={styles.gameHeader}>
                <View style={styles.leftContainer} />
                <View style={styles.text}>
                    <Text style={styles.headerRoomName}>{this.state.roomName}</Text>
                </View>
                <View style={styles.rightContainer}>
                    <TouchableOpacity onPress={() => this.leaveRoom()}>
                       <Icon name="ios-home" style={styles.btnQuitGame}/>
                    </TouchableOpacity>
                </View>
             </View>


             <View style={styles.headerCon}>
                 <View style={[styles.headerRow, styles.rowBgColor, styles.rowScore,
                               this.state.isGameStart && ((this.state.userType+''=='holder' && this.state.isYourTurn) || (this.state.userType+''=='guest' && !this.state.isYourTurn)) ? styles.currentUser:""]}>
                     <Text style={styles.rowText}>{this.state.userType+''=='holder' ? 'You':'Opponent'}</Text>
                     <Text style={styles.marks}>{this.state.holderScore}</Text>
                 </View>
                 <View style={[styles.headerRow, styles.rowRound]}>
                    <Text style={styles.rowRoundText}>Round {this.state.round}</Text>
                 </View>
                 <View style={[styles.headerRow, styles.rowBgColor, styles.rowScore,
                               this.state.isGameStart && ((this.state.userType+''=='guest' && this.state.isYourTurn) || (this.state.userType+''=='holder' && !this.state.isYourTurn)) ? styles.currentUser:""]}>
                    <Text style={styles.rowText}>{this.state.userType+''=='guest' ? 'You':'Opponent'}</Text>
                    <Text style={styles.marks}>{this.state.guestScore}</Text>
                 </View>
             </View>


             <View style={styles.gameBoard_container}>
                <TouchableWithoutFeedback onPress={e => this.boardClickHandler(e)} >
                    <View style={styles.board}>
                      <View style={styles.line} />
                      <View style={[styles.line, { width: 4, height: 306, transform: [{translateX: 200}]}]} />
                      <View style={[styles.line, { width: 306, height: 4, transform: [{translateY: 100}]}]} />
                      <View style={[styles.line, { width: 306, height: 4, transform: [{translateY: 200}]}]} />
                      {
                          this.state.circleInputs.map((d, i) => (
                              <Circle key={i} xTranslate={CENTER_POINTS[d].x} yTranslate={CENTER_POINTS[d].y} color='deepskyblue' />
                          ))
                      }
                      {
                          this.state.crossInputs.map((d, i) => (
                              <Cross key={i} xTranslate={CENTER_POINTS[d].x} yTranslate={CENTER_POINTS[d].y} color='red' />
                          ))
                      }
                    </View>
                </TouchableWithoutFeedback>
                <PromptArea result={this.state.result} userType={this.state.userType} onRestart={() => this.restart()} />
                <View style={styles.roomInfo_container}>
                   <View style={styles.infoArea}>
                       <View style={styles.infoArea2}>
                           <ScrollView style={styles.msgArea}>
                               {infoMessages}
                           </ScrollView>
                           <TextInput style={styles.inputBox}
                                       onChangeText={(chatMsg) => this.setState({chatMsg})}
                                       underlineColorAndroid='rgb(255,255,255)'
                                       placeholder="Message"
                                       placeholderTextColor = "#d3d3d3"
                                       selectionColor="#fff"
                                       onSubmitEditing={()=> this.sendChatMsg()}
                                       value={this.state.chatMsg}
                           />
                       </View>
                       <View style={styles.roomInfo}>
                           <Text style={styles.infoAreaText}>Room ID:</Text>
                           <Text style={styles.infoAreaText}>{this.state.roomID}{"\n"}</Text>
                           <Text style={styles.infoAreaText}>Player(s): {this.state.pptInGame}</Text>
                           <ScrollView>
                               <Text style={styles.infoAreaText}>{this.state.userID}</Text>
                           </ScrollView>

                       </View>
                   </View>
                </View>
             </View>
            <View style={styles.pageFooter} />
         </View>
        )
    }
}