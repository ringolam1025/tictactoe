import React, { Component } from 'react'
import { StatusBar, Dialog, FlatList, TextInput, YellowBox, TouchableWithoutFeedback, Button,
         Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity,
         View, Alert, ToastAndroid, AppState, AsyncStorage, Keyboard, BottomNavigation,TouchableHighlight, ListEmptyComponent
       } from 'react-native';
import { ListItem } from 'react-native-elements'
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import DialogInput from 'react-native-dialog-input';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import io from "socket.io-client";

console.ignoredYellowBox = ['Remote debugger'];
YellowBox.ignoreWarnings([ 'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?' ]);

export default class LobbyScreen extends Component {
    static navigationOptions = {
        title: 'Game Lobby',
        headerLeft: null,
        header: null
    };
    constructor(props) {
        super(props)
        const { navigation } = this.props;
        StatusBar.setHidden(true);
        this.socket = io("http://ringohome.asuscomm.com:9868");
        this.state= {
            userID: '',
            displayName: '',
            roomList: [],
            isNewRoomDialogVisible: false, isJoinRoomDialogVisible: false,
        }
        AsyncStorage.multiGet(['userID', 'displayName']).then((data) => {
            this.setState({ userID: data[0][1], displayName: data[1][1], })
        });
        this.socket.emit("getRoomList");
    }
    componentDidMount() {
        this.socket.on("updateRoomList", (roomsList) => {
            this.setState({ roomList: roomsList });
        });
    }
    enterRoom(obj){
       // console.log(obj);
        this.props.navigation.navigate('GameBoard', {roomID: obj.key, roomName: obj.name, userID: this.state.userID});
    }
    submitToCreateRoom(roomName){
        this.socket.emit("createNewRoom", {roomName: roomName, userID: this.state.userID});
        this.showDialog('newRoom',false);
        this.socket.on("joinRoomAfterCreate", (data) => {
            this.props.navigation.navigate('GameBoard',{roomID: data.roomID, userID: data.userID, roomName: data.roomName});
        });
    }
    submitToJoinRoomByID(inputRoomID){
        this.showDialog('joinRoom',false);
        this.props.navigation.navigate('GameBoard', {roomID: inputRoomID, roomName: 'Room', userID: this.state.userID});
    }
    showDialog(tar,flag){
        if (tar+'' == 'newRoom'){
            if (flag){
                this.setState({ isNewRoomDialogVisible: true });
            }else{
                this.setState({ isNewRoomDialogVisible: false });
            }
        }else if (tar+'' == 'joinRoom'){
            if (flag){
                this.setState({ isJoinRoomDialogVisible: true });
            }else{
                this.setState({ isJoinRoomDialogVisible: false });
            }
        }


    }
    render() {
        keyExtractor = (item, key) => key.toString()

        return(
            <View style={styles.container}>
                <View style={styles.pageHeader}>
                    <Text style={styles.headerUserName}>{this.state.displayName}</Text>
                    <Text>Game Lobby</Text>
                </View>
                <View style={styles.flatList}>
                    <FlatList
                           style={styles.roomListDisplay_container}
                           ListEmptyComponent={this._listEmptyComponent}
                           keyExtractor={(item)=>item.key}
                           data={this.state.roomList}
                           ListHeaderComponent={() => (!this.state.roomList.length?
                                                           <View style={styles.loadingContainer}>
                                                                <Icon style={styles.loadingIcon} name="md-sad" size={250} color="#d3d3d3"/>
                                                                <Text style={styles.loadingText}>Click + to create room!</Text>
                                                           </View>
                                                           : null)
                                                         }
                           renderItem={({ item }) => (
                                                <TouchableOpacity  style={styles.row} onPress={() => this.enterRoom(item)}>
                                                      <View style={styles.row_cell_timeplace}>
                                                        <Text style={styles.row_place}>{item.name}</Text>
                                                        <Text style={styles.row_time}>{item.subtitle}</Text>
                                                      </View>
                                                      <Text style={styles.row_cell_temp}>{item.numOfPeople}</Text>
                                                </TouchableOpacity>
                                                )}
                     />
                 </View>
                <ActionButton buttonColor="#3498db">
                    <ActionButton.Item buttonColor="#9b59b6" title="Join room" onPress={() => this.showDialog('joinRoom',true)} >
                        <Icon name="ios-add" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor="rgba(231,76,60,1)" title="New room" onPress={() => this.showDialog('newRoom',true)} >
                        <Icon name="logo-game-controller-b" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>


                <View>
                    <DialogInput isDialogVisible={this.state.isNewRoomDialogVisible}
                                title={"New Room"}
                                message={"Enter Room Name"}
                                hintInput ={""}
                                submitInput={ (roomName) => {this.submitToCreateRoom(roomName)} }
                                closeDialog={ () => {this.showDialog('newRoom',false)}}
                                onSubmitEditing={ (roomName) => {this.submitToCreateRoom(roomName)} }>
                    </DialogInput>
                </View>
                <View>
                    <DialogInput isDialogVisible={this.state.isJoinRoomDialogVisible}
                                title={"Join Room"}
                                message={"Enter Room ID"}
                                hintInput ={""}
                                submitInput={ (inputRoomID) => {this.submitToJoinRoomByID(inputRoomID)} }
                                closeDialog={ () => {this.showDialog('joinRoom',false)}}>
                    </DialogInput>
                </View>
                <View style={styles.pageFooter} />
             </View>
        )
}    }

export const colors = {
  "secondary": '#0686E4',
  "tertiary": '#ffffff',
  "background_dark": '#F0F0F0',
  "text_light": '#ffffff',
  "text_medium": '#464646',
  "text_dark": '#263238',
  "weather_text_color": '#464646',
  "transparent_white": '#FFFFFF00',
  "separator_background": '#E2E2E2',
  "layoutColor":'#12699f',
};
export const values = {
  "font_body_size": 14,
  "font_title_size": 20,
  "font_time_size": 12,
  "font_place_size": 20,
  "font_temp_size": 27,
  'border_radius': 2,
  "tiny_icon_size": 22,
  "small_icon_size": 40,
  "large_icon_size": 110,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background_dark,
    },
    flatList: {
        flex: 1,
        padding: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    pageHeader:{
        height: hp("15%"),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.layoutColor,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    pageFooter:{
        height: hp("3%"),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.layoutColor,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    roomListDisplay_container:{
        marginTop: 14,
        alignSelf: "stretch",
    },
    row: {
          elevation: 1,
          borderRadius: 2,
          backgroundColor: colors.tertiary,
          flex: 1,
          flexDirection: 'row',  // main axis
          justifyContent: 'flex-start', // main axis
          alignItems: 'center', // cross axis
          paddingTop: 15,
          paddingBottom: 15,
          paddingLeft: 18,
          paddingRight: 16,
          marginLeft: 14,
          marginRight: 14,
          marginTop: 0,
          marginBottom: 6,
    },
    row_cell_timeplace: {
      flex: 1,
      flexDirection: 'column',
    },
    row_cell_temp: {
      color: colors.weather_text_color,
      paddingLeft: 16,
      flex: 0,
      fontSize: values.font_temp_size,
      fontFamily: values.font_body,
    },
    row_time: {
      color: colors.weather_text_color,
      textAlignVertical: 'bottom',
      includeFontPadding: false,
      flex: 0,
      fontSize: values.font_time_size,
      fontFamily: values.font_body,
    },
    row_place: {
      color: colors.weather_text_color,
      textAlignVertical: 'top',
      includeFontPadding: false,
      flex: 0,
      fontSize: values.font_place_size,
      fontFamily: values.font_body,
    },
    headerUserName:{
        color: 'white',
        fontSize: 30,
    },
    loadingContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText:{
        fontSize: 30,
        justifyContent: 'center',
        alignItems: 'center',
        color: "#d3d3d3"
    },
    loadingIcon:{
        justifyContent: 'center',
        alignItems: 'center',
    },
});