import React,{useState} from 'react';
import {
  AsyncStorage,
  StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    Dimensions,
    Button,
    Alert
} from 'react-native';
import {AuthContext} from "../context";
import {apiUrl} from "../urlconfig";
// 获取屏幕的宽和高
let {width,height} = Dimensions.get('window');
const LOGIN_URL=apiUrl+"/checkUser";
var isSuccess ;
function fetchData({name,password,navigation}) {
    let formdata = new FormData();
    formdata.append('username',name);
    formdata.append('password',password);
    fetch(LOGIN_URL,{
        method:'POST',
        body:formdata,
    })
        .then((response) => {
            // let cookie=response._bodyBlob._data.blobId;
            // console.log("cookie in login screen:"+JSON.stringify(response));
            let _storeData = async () => {
                try {
                    await AsyncStorage.setItem("@Bookstore:token",'exist');
                } catch (error) {
                    // Error saving data
                }
            };
            _storeData();
            return response.json();
        })
        .then((responseData) => {
            // 注意，这里使用了this关键字，为了保证this在调用时仍然指向当前组件，我们需要对其进行“绑定”操作
            console.log(responseData);
            isSuccess=(responseData.status!=0?true:false);
            if(isSuccess){
                AsyncStorage.setItem("user",name);
                console.log(name);
                navigation.navigate("home");
            }else{
                Alert.alert("用户名或密码错误！");
            }
        })
        .catch((error)=>{
            console.error(error);
        });
}


export function LoginScreen({navigation}){
    const [name, setName] = useState('');
    const [password,setPassword]=useState('');
    // const { signIn } = React.useContext(AuthContext);

    return (
            <View style={{ flex: 1}}>
                <View style={styles.container}>
                    <Text style={styles.titleStyle}>Login</Text>
                    {/*账号和密码*/}
                    <TextInput
                        style={styles.textInputStyle}
                        onChangeText={text => setName(text)}
                        value={name}
                        placeholder={'请输入用户名'} />

                    <TextInput
                        style={styles.textInputStyle}
                        placeholder='请输入密码'
                        onChangeText={text => setPassword(text)}
                        value={password}
                        password={true}
                        secureTextEntry={true}/>

                    {/*登录*/}
                    <Button style={styles.loginBtnStyle} title="登录" onPress={() => {
                        fetchData({name,password,navigation});
                    }}>
                        <Text style={{color:'white'}}>登录</Text>
                    </Button>

                    {/*设置*/}
                    <View style={styles.settingStyle}>
                        <Text>忘记密码</Text>
                        <Text>注册</Text>
                    </View>

                </View>
            </View>
        );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // 侧轴的对齐方式
        justifyContent: "center",
        alignItems:'center',
        backgroundColor: 'orange'
    },
    textInputStyle: {
        width:width*0.9,
        height:40,
        backgroundColor:'white',
        textAlign:'center',
        marginBottom:5
    },
    loginBtnStyle: {
        width: width*0.9,
        height: 40,
        backgroundColor:'blue',
        marginTop:30,
        marginBottom: 20,
        borderRadius:10
    },
    settingStyle: {
        width: width*0.85,
        height: 40,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    titleStyle: {
        fontSize:40,
        alignItems:'center',
        paddingBottom:10
    },
});