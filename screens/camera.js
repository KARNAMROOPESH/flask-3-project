import * as React from 'react';
import { Button, View, Stylesheet, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default class PickImage extends React.Component {
    constructor() {
        super();
        this.state = {
            image: null
        }
    }
    componentDidMount() {
        this.getpermission();
    }
    getpermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (status !== "granted") {
            Alert.alert("Sorry, we need camera permissions to make this work")
        }
    }
    pickimage = async () => {
        try{
            var img = await ImagePicker.launchImageLibraryAsync({
                mediaTypes : ImagePicker.MediaTypeOptions.All,
                allowsEditing : true,
                quality : 1,
                aspect: [4,3]
            })
            if (!img.cancelled){
                this.setState({image: img.data})
                this.uploadimage(img.uri)
            }

        }catch(error){
            Alert.alert(error)
        }
    }
    uploadimage = async(uri) =>{
        const data = new FormData();
        var filename = uri.split("/") [uri.split("/").length - 1]
        const filetoupload = {
            uri : uri,
            name: filename
        }

        data.append("Digit", filetoupload)

        await fetch(' http://90c40408c3ac.ngrok.io/get-prediction', {
            method :"POST" ,
            body: data
        })
        .then((response) => response.json())
        .then((result)=>{
            console.log("Successful",result)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    render() {
        return (<View>
            <Button title="Click here to select image"
                onPress={this.pickimage} />
        </View>
        )
    }
}