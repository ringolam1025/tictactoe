import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Keyboard, Button, Alert, ToastAndroid, Image } from 'react-native';

import {Actions} from 'react-native-router-flux';
import { withNavigation } from 'react-navigation';

export default class Signup extends Component {
    static navigationOptions = {
        header: null,
        title: 'Back',
        headerStyle:{
            backgroundColor: '#12699f',
            shadowOpacity: 0,
            shadowOffset: { height: 0 },
            shadowRadius: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
    };
    constructor(props){
        super(props)
        this.state = {
            userid: '',
            userpw: '',
            displayName: ''
        }
    }
    funSignup = () =>{
        const { userid, userpw, displayName }  = this.state;
        if (userid != '' && userpw != '' && displayName != ''){
            fetch('http://ringohome.asuscomm.com:6158/tictactoe_db/reg.php', {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
                body: JSON.stringify({ part: 'signup', userid: userid, userpw: userpw, displayName:displayName })
            })
            .then( (response) => response.json() )
            .then((responseData) => {
                if (responseData.flag+''=='success') {
                    this.props.navigation.navigate('Login',{userid:this.state.userid, userpw: this.state.userpw});
                    ToastAndroid.show(responseData.msg, ToastAndroid.LONG);
                }else if (responseData.flag+''=='fail'){ ToastAndroid.show(responseData.msg, ToastAndroid.LONG); }
            })
            .catch((error) => { console.warn(error); })
            .done();
        }else{
            alert('Please enter missing fields!')
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.containerUp}>
                    <Text style={styles.gameName}>Sign Up</Text>
                </View>
                <View style={styles.containerForm}>
                    <TextInput style={styles.inputBox}
                        onChangeText={(displayName) => this.setState({displayName})}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="Display Name"
                        placeholderTextColor = "#12699f"
                        onSubmitEditing={()=> this.userid.focus()}
                    />
                    <TextInput style={styles.inputBox}
                        onChangeText={(userid) => this.setState({userid})}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="User ID"
                        placeholderTextColor = "#12699f"
                        selectionColor="#fff"
                        onSubmitEditing={()=> this.userpw.focus()}
                    />
                    <TextInput style={styles.inputBox}
                        onChangeText={(userpw) => this.setState({userpw})}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="Password"
                        secureTextEntry={true}
                        placeholderTextColor = "#12699f"
                        onSubmitEditing={()=> this.funSignup}
                    />

                    <TouchableOpacity style={styles.button} onPress={this.funSignup}>
                        <Text style={styles.buttonText} >Signup</Text>
                    </TouchableOpacity>
                    <Text> OR </Text>
                    <TouchableOpacity style={styles.buttonOutline} onPress={() => this.props.navigation.navigate('Login')}>
                        <Text style={styles.buttonTextOutline} >Sign in</Text>
                    </TouchableOpacity>
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
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        //height: 300,
    //  backgroundColor: '#FF699f',
    },
    inputBox: {
        width: 330,
        paddingHorizontal: 16,
        fontSize: 16,
        marginVertical: 10,
        height: 40,
        borderWidth: 1,
        borderColor: '#12699f',
    },
    button: {
        width: 330,
        marginVertical: 10,
        paddingVertical: 12,
        backgroundColor: '#12699f',
    },
    buttonOutline: {
        width: 330,
        marginVertical: 10,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#12699f',
    },
    buttonTextOutline: {
        fontSize: 16,
        fontWeight: '500',
        color: '#12699f',
        textAlign: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
    },
    gameName: {
        fontSize: 30,
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: '500',
    },
    signupInfo: {
        color: '#ffffff',
        textAlign: 'center',
    }

});