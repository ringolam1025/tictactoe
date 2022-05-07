import React, { Component } from 'react';
import { StatusBar, StyleSheet, Text, View, TextInput, Button, TouchableOpacity, AsyncStorage, Keyboard, Alert, ToastAndroid, Image } from 'react-native';
import {Actions} from 'react-native-router-flux';
import { withNavigation } from 'react-navigation';

import Form from './Form';

export default class Login extends Component{
    static navigationOptions = {
        title: 'Login',
        header: null
    };
    constructor(props) {
        super(props)
        StatusBar.setHidden(true);
        this.state = {
            userid: '',
            userpw: '',
            displayName:''
        }
    }
    funSignin = () =>{
        const { userid, userpw }  = this.state;
        fetch('http://ringohome.asuscomm.com:6158/tictactoe_db/reg.php', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
            body: JSON.stringify({ part: 'login', userid: userid, userpw: userpw })
        })
        .then((response) => response.json() )
        .then((responseData) => {
            if (responseData.flag+''=='success') {
                AsyncStorage.multiSet([
                    ["userID", responseData.res.userid],
                    ["displayName", responseData.res.displayName]
                ])
                this.props.navigation.navigate('Lobby', {userID: userid, displayName:responseData.res.displayName});

             }else if (responseData.flag+''=='fail'){
                ToastAndroid.show(responseData.msg, ToastAndroid.LONG);
             }
        })
        .catch((error) => {
            console.warn(error);
        })
        .done();
        global.MyVar = 'https://aboutreact.com';
    }
    signup() { Actions.signup(); }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.containerUp}>
                    <Image source={require("../assets/images/small_icon.png")}
                            resizeMode="contain"
                            style={styles.image}
                    />
                </View>

                <View style={styles.containerForm}>
                    <TextInput style={styles.inputBox}
                                onChangeText={(userid) => this.setState({userid})}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder="User ID"
                                placeholderTextColor = "#12699f"
                                selectionColor="#fff"
                                //keyboardType="email-address"
                                onSubmitEditing={()=> this.userpw.focus()}
                    />
                    <TextInput style={styles.inputBox}
                                onChangeText={(userpw) => this.setState({userpw})}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                placeholder="Password"
                                secureTextEntry={true}
                                placeholderTextColor = "#12699f"
                                ref={(input) => this.userpw = input}
                                onSubmitEditing={()=> this.funSignin()}
                    />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText} onPress={this.funSignin}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
                        <Text style={styles.signupButton}>Create an account</Text>
                    </TouchableOpacity>


                    {/*<TouchableOpacity onPress={() => this.props.navigation.navigate('Lobby')}>
                        <Text style={styles.signupButton}>[Debug] Lobby</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('GameBoard')}>
                        <Text style={styles.signupButton}>[Debug] GameBoard </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                        <Text style={styles.signupButton}>[Debug] MyProfile </Text>
                    </TouchableOpacity>*/}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    containerUp:{
        height: "50%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#12699f',
        borderBottomRightRadius: 150,
    },
    containerForm:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
//        backgroundColor: '#FF699f',
    },
    signupButton: {
        color: '#12699f',
        fontSize:16,
    },
    inputBox: {
        width: 330,
        paddingHorizontal: 16,
        fontSize: 16,
        marginVertical: 10,
        height: 45,
        borderWidth: 1,
        borderColor: '#12699f',
    },
    button: {
        width: 330,
        marginVertical: 10,
        paddingVertical: 12,
        backgroundColor: '#12699f',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
    },
    image: {
        width: 242,
        height: 242,
        marginTop: 60,
    }
});