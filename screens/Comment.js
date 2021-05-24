import React, { useEffect, useState } from "react";
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, Image, ScrollView, Text, TextInput, View } from "react-native";
import { connect } from "react-redux";
import itinerariesActions from "../redux/actions/itinerariesActions";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Activity = ({commentInfo, userLogged, setCommentState, itineraryId, editOrRemoveComment, props}) =>{ 

    const[editingComment, setEditComment]= useState({comment: commentInfo.comment , editing : false})
    const [userLS, setUserLS] = useState({ userLS:{}})


    var commentId = commentInfo._id    
    
    const getData = async () => {
              const jsonValue = await AsyncStorage.getItem('userLogged')
              const userData = JSON.parse(jsonValue) 
              let userLS= {
              token: await AsyncStorage.getItem('token'),
              ...userData
              }
              setUserLS({userLS:userLS}) 
    }


    const enterToSend = ((e) =>{
      e.key === 'Enter' && send()    
    })

    useEffect(()=> {
      getData()
      setEditComment({...editingComment,
        editing:false})
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[commentInfo])

    const editOrRemove = async (editedComment= null , commentId, itineraryId) =>{
      var sendData = {editedComment, commentId} 
      const respuesta = await editOrRemoveComment(sendData, itineraryId, props, userLS.userLS)
      setCommentState({comments: respuesta})
    }
    
    const options = (e)=> Alert.alert(
      "Want to modify your comment?",
      `What option do you prefer?`,
      [
          {text: 'Edit', onPress: () => editComment()},
          {text: 'Delete', onPress: () => Alert.alert("Your comment will be deleted...", "Are you sure?", [
                {text: 'Yes', onPress: () => {
                  editOrRemove(null, commentId, itineraryId)
                  return Alert.alert('Poof! Your comment has been deleted!')
                }},
              {text: 'No'},
          ]) 
          },
          {text: 'Cancel'},
      ]
  )


    const editComment = (() => {
      setEditComment({...editingComment, editing:true})
    })

    const readComment = ((text,name) => {
      setEditComment({
        ...editingComment,
        comment : text
      })
    })

    const send = (() => {
        if (editingComment.comment !== "") {
          var comment = editingComment.comment
          editOrRemove(comment, commentInfo, itineraryId)
        } else {
           Alert.alert("You cannot send an empty comment", "Write something!")
        }        
    })
    

    return(
        <View >
            <View style={{flexDirection:'row',width:'100%', alignItems:'center', justifyContent:'flex-start', marginVertical:3,backgroundColor:'#e2ceb5', borderRadius:50}}>            
                <Image style={{width:50, height:50, borderRadius:100, marginLeft:5}} source={{uri: commentInfo.img}}/>
                    <View style={{width:'78%', marginHorizontal:10, marginVertical:3}}>
                        <Text style={{fontSize:15, fontWeight:'bold'}}>{commentInfo.firstName} {commentInfo.lastName}:</Text>
                        {!editingComment.editing 
                        ? <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                              <Text style={{marginLeft:15}}>{commentInfo.comment}</Text> 
                              {!editingComment.editing && userLogged && userLogged.id === commentInfo.userId ?
                                <MaterialIcons name="more-vert" size={24} color="black"  style={{top:-10}}  className={commentInfo.comment} onPress={(e) => options(e.target)}/>
                                : null } 
                          </View>
                        :<View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', minWidth:'98%', maxWidth:'98%'}}> 
                              <TextInput style={{width:'75%'}} onKeyPress={(e)=> enterToSend(e)} name ="comment" onChangeText={(text, name='comment')=> readComment(text, name)} type="text" value={editingComment.comment} ></TextInput>
                              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', width:80, marginRight:10}}>
                                  <FontAwesome5 name="edit" size={24} color="black" onPress={() => send()} /> 
                                  <MaterialCommunityIcons name="cancel" size={24} color="black" onPress={() => setEditComment({...editingComment, editing:false})} /> 
                              </View> 
                        </View> } 
                    </View>                                

            </View> 
        </View> 
    )
}

const mapStateToProps = state => {
    return {
        userLogged: state.loginReducer.userLogged,
    }
  }
const mapDispatchToProps = {
  editOrRemoveComment: itinerariesActions.editOrRemoveComment,
}


export default connect(mapStateToProps, mapDispatchToProps)(Activity)
