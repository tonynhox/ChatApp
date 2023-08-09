import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

interface MessageType {
  sender: string;
  content: string;
}

const Messenger = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isSending, setIsSending] = useState(false);
  const route = useRoute();
  // const [other, setOthers] = useState<string>('');

  const params = route.params as { userId: string };
  const other = params.userId;
  const userId = useSelector<any>(state => state.users.user)
  console.log('render')
  // if(other===''){
  //   return
  // }
  // const handleOther = (name:string)=>{
  //   setOthers(name)
  // }
  const scrollViewRef = React.useRef<any>(null);


  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = { sender: 'Me', content: message };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
    setIsSending(true);
  };

  useEffect(() => {
    const messageRef = firestore().collection('messages').doc(userId+other);

    const unsubscribe = messageRef.onSnapshot((doc) => {
      const data = doc.data();
      if (data) {
        setMessages(data.messages);
      }
    });
    scrollViewRef.current.scrollToEnd({ animated: true });

    return () => unsubscribe();
  }, []);

  useEffect(() => {

    if (!isSending) return;
    const messageRef = firestore().collection('messages').doc(userId+other);

    messageRef.set({
      messages,
    });

    const messageRefOther = firestore().collection('messages').doc(other + userId);

    messageRefOther.get().then(doc => {
      const existingMessages = doc.data()?.messages || [];
      const newMessages = messages.slice(existingMessages.length).map(msg => ({ ...msg, sender: userId }));

      messageRefOther.set({
        messages: existingMessages.concat(newMessages),
      });
    });
    scrollViewRef.current.scrollToEnd({ animated: true });

  }, [messages]);

  const renderItem = ({ item }: { item: MessageType }) => {
    const isMe = item.sender === 'Me';
    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessageContainer : styles.otherMessageContainer]}>
        <Text style={styles.senderText}>{item.sender}</Text>
        <Text style={styles.contentText}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.messageListContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity 
        
          style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
        {/* {userId==='tonynhox'?
                <TouchableOpacity style={styles.sendButton} onPress={()=> handleOther('123')}>
                <Text style={styles.sendButtonText}>123</Text>
              </TouchableOpacity>
              :

              <TouchableOpacity style={styles.sendButton} onPress={()=> handleOther('tonynhox')}>
                <Text style={styles.sendButtonText}>tonynhox</Text>
              </TouchableOpacity>
        
        } */}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  messageListContainer: {
    flexGrow: 1,
    paddingTop: 16,
  },
  messageContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '70%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAEAEA',
  },
  senderText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contentText: {},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  sendButton: {
    padding: 8,
    backgroundColor: 'blue',
    borderRadius: 8,
  },
  sendButtonText: {
    color: 'white',
  },
});

export default Messenger;
