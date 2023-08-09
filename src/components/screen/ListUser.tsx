import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation,NavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

// interface Item {
//   id: number;
//   name: string;
// }

// const data: Item[] = [
//   { id: 1, name: 'Item 1' },
//   { id: 2, name: 'Item 2' },
//   { id: 3, name: 'Item 3' },
//   // ... Add more items as needed
// ];

interface RootStackParamList  {
  messenger: { userId: string };
};

const ListUser: React.FC = () => {

  const [data, setData] = React.useState<string[]>([]);
  const navigation = useNavigation<any>();
  const userId = useSelector<any>(state => state.users.user)

  const fetchData = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('users')
        .get();

      if (querySnapshot.docs.length > 0) {
        console.log('Total users: ', querySnapshot.docs[0].data().username);
        const usernames: string[] = [];
        querySnapshot.forEach(documentSnapshot => {
          if(documentSnapshot.data().username!==userId)
          usernames.push(documentSnapshot.data().username);
        });
        setData(usernames);
        // console.log('ok',data+' | '+user);
      } else {
        console.log('No users found.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(()=>{
    fetchData();
  },[])






  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
    onPress={() => navigation.navigate('messenger',{userId:item})}

      // onPress={()=>navigation.navigate('messenger',{userId:item}as RootStackParamList['messenger'])}
      style={styles.item}>
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
});

export default ListUser;
