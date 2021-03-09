import React , { useState, useCallback, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Image } from "react-native";
import { GiftedChat, InputToolbar, Actions, Composer, Send } from "react-native-gifted-chat";
import { Icon } from 'react-native-elements';
import SocketIOClient from 'socket.io-client';


export default function App({props}) {
  const socket =  SocketIOClient('http://localhost:3000');
  useEffect(() => {
    socket.on('message', onReceivedMessage);
  });

  const [messages, setMessages] = useState([
    {
      _id: 1,
      text: 'BurnCam',
      createdAt: new Date(Date.UTC(2021, 3, 8, 17, 20, 0)),
      user: {
          _id: 2,
          name: 'Rebecca Russel',
          avatar: 'https://placeimg.com/140/140/animals',
      }
    },
  ]);

  const renderSend = (props) => {
    return(
      <Send
        {...props}
        disabled={!props.text}
        containerStyle={{
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 4,
        }}
      >
        <Icon
          name='send'
        />
      </Send>
    );
  };

  const renderActions = (props) => (
    <Actions
      {...props}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 0,
      }}
      icon={() => (
        <Icon
          name='folder'
        />
      )}
      options={{
        'Choose From Library': () => {
          console.log('Choose From Library');
        },
        Cancel: () => {
          console.log('Cancel');
        },
      }}
      optionTintColor="#222B45"
    />
  );

  const onSend = (messages) => {
    socket.emit('message', messages[0]);
    _storeMessages(messages);
  };

  const onReceivedMessage = (messages) => {
    _storeMessages(messages);
  }

  const  _storeMessages = (newMessages) => {
    setMessages(() =>
      GiftedChat.append(messages, newMessages),
    );
  }

    return (
      <View style={styles.container}>
        <View style={styles.chatHeader}>
            <Icon
                size={40}
                name='arrow-back'
                style={{alignSelf: 'flex-start'}}
                // onPress={} //put navigation to ChatLibrary here
              />
          <View style={{alignSelf: 'center'}}><Text style={{fontSize: 25}}>Rebecca Russel</Text></View> 
          {/* TODO: handle wrapping/truncating longer names */}
          <Icon
                size={40}
                name='videocam'
                style={{alignSelf: 'flex-end'}}
                // onPress={} //put navigation to VideoChat here
          />
        </View>
        
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            renderSend={renderSend}
            renderActions={renderActions}
            user={{
              _id: 1,
              name: 'Me',
              avatar: 'https://placeimg.com/140/140/animals'
            }}
        />
      </View>
    );
};
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  chatHeader: {
    alignSelf: 'stretch', 
    justifyContent: 'space-around', 
    flexDirection: 'row', top: '8%', 
    borderBottomColor: 'black', 
    borderBottomWidth: 1,
    height: 45
  }
});