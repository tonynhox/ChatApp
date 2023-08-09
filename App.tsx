import { View, Text } from 'react-native'
import React from 'react'
import Register from './src/components/screen/Register'
import Login from './src/components/screen/Login'
import Messenger from './src/components/screen/Messenger'
import MainNavigation from './src/components/navigation/MainNavigation'
import { Provider } from 'react-redux'
import store from './src/redux/store'
const App:React.FC = () => {
  return (
    <Provider store={store}> 
    <MainNavigation/>

    </Provider>
  )
}

export default App