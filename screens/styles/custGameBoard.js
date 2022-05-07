import { Dimensions, StyleSheet } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
      flex:1,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rightIcon: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
  },
  gameHeader:{
      height: hp("10%"),
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#12699f',
      borderBottomRightRadius: 15,
      borderBottomLeftRadius: 15,
      flexDirection: 'row',
  },
  pageFooter:{
      height: hp("3%"),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#12699f',
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
  },
  gameRow:{
    width: wp('20%'),
  },
  btnLeave:{
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerRoomName:{
      color: 'white',
      fontSize: 30,
      textAlign: 'center'
  },
  gameBoard_container: {
     flex:1,
     alignItems: 'center',
     //backgroundColor: 'rgb(142,223,255)',
  },
  board: {
      width: 312,
      height: 312,
      borderWidth: 4,
      borderColor: '#000',
      marginTop: 10,
      marginBottom: 10,
  },
  line: {
      position: 'absolute',
      width: 4,
      height: 306,
      backgroundColor: '#000',
      transform: [ {translateX: 100} ]
  },
  text: {
      fontSize: 19,
      fontWeight: 'bold',
      textAlign: 'center'
  },
  headerCon:{
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  headerRow:{
    height: 70,
    width: wp('20%'),
    textAlign:'center',
  },
  rowRound:{
    width: wp('30%'),
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  rowScore:{
    width: 100,
  },
  rowBgColor:{
    backgroundColor: 'rgb(25,116,210)',
    borderRadius: 10,
  },
  currentUser:{
        shadowColor: 'rgb(255, 166, 77)',
        shadowRadius:10,
        shadowOffset: { width: 0, height: 20, },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
  },
  rowText:{
    textAlign:'center',
    color: 'white',
    marginTop: 3,
    fontWeight: 'bold',
  },
  marks:{
    textAlign:'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
  },
  rowRoundText:{
    fontSize: 20,
  },
  btnQuitGame:{
    color: 'white',
    fontSize: 25,
    margin: 25,
  },



  roomInfo_container: {
      width: '100%',
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0
  },
  infoArea:{
      width: wp('90%'),
      height: hp('20%'),
      flexDirection: 'row',
      backgroundColor: 'rgb(25,116,210)',
      position: 'absolute',
      bottom: 0
  },
  infoArea2:{
    width: wp('65%'),
  },
  msgArea:{
    paddingLeft: 10,
    color: 'white',
  },
  roomInfo:{
    width: wp('35%'),
    padding: 10,
    color: 'white',
  },
  infoAreaText:{
    color: 'white',
  },
  inputBox: {
    height: 35,
    //width: 330,
    paddingHorizontal: 16,
    fontSize: 16,
    marginVertical: 1,
    color: 'white'
  },
  sysMsg:{
    color: "#00ff00"
  }
})
