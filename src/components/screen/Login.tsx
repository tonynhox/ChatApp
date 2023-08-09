import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation,NavigationProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import userSlice from '../../redux/slice/userSlice';


const Login: React.FC = () => {
  const [username, setUsername] = useState<any>('');
  const [password, setPassword] = useState<any>('');
  const navigation = useNavigation<any>();
  
  const dispatch= useDispatch();

  const loginUser = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('users')
        .get();

      if (querySnapshot.docs.length > 0) {
        console.log('Total users: ', querySnapshot.docs[0].data().username);

        querySnapshot.forEach(documentSnapshot => {
          if(documentSnapshot.data().username===username){
            dispatch(userSlice.actions.username(username))
            navigation.navigate('listUser');
          }
        });
      } else {
        console.log('No users found.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={() => loginUser()} />
      <Button title="Register" onPress={() => navigation.navigate('register')} />
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

export default Login;
