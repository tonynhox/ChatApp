import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ToastAndroid } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

// const firebaseConfig = {
//   apiKey: 'AIzaSyAfOqqbEC3BoZaU5Txy1TgKOi-6I4fvoPw',
//   authDomain: 'chatrealtime-14b6f.firebaseapp.com',
//   projectId: 'chatrealtime-14b6f',
//   storageBucket: 'chatrealtime-14b6f.appspot.com',
//   messagingSenderId: '1079328159025',
//   appId: '1:1079328159025:android:f815da632bce23a62d6c10',
// };



const Register = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = async () => {
    const userId:any = uuid.v4();
  
    try {
      // Kiểm tra xem username đã tồn tại chưa
      const usernameQuerySnapshot = await firestore()
        .collection('users')
        .where('username', '==', username)
        .get();
  
      if (!usernameQuerySnapshot.empty) {
        console.log('Username already exists');
        ToastAndroid.show('user đã tồn tại rồi em!', ToastAndroid.SHORT);
        return; // Ngăn không cho tạo nếu username đã tồn tại
      }
  
      // Tạo người dùng mới nếu username chưa tồn tại
      await firestore()
        .collection('users')
        .doc(userId)
        .set({
          name: fullName,
          username: username,
          password: password,
          userId: userId,
        });
  
      console.log('User created successfully');
      navigation.goBack();
    } catch (error) {
      console.log('Error creating user:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Register" onPress={()=> registerUser()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default Register;
