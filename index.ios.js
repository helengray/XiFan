/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    Navigator,
    View,
    TouchableOpacity,
    Text,
} from 'react-native';

import MainScene from './js/MainScene';
import AppNavigator from './js/component/AppNavigator';
import DramaComponent from './js/component/DramaComponent';
import DramaDetailComponent from './js/DramaDetailScene';

class XiFan extends Component {

    render(){
        return(
            <AppNavigator id='MainScene' data='' name='首页' component={MainScene} showLeftButton={false}/>

        );
    }
}

// class MyView extends Component{
//
//     jump(){
//         this.props.navigator.push({
//             title:'下一页',
//             component:MyView
//         });
//     }
//
//     render(){
//         return(
//             <View style={{flex:1,backgroundColor:'black'}}>
//                 <View style={{height:200,backgroundColor:'red'}}>
//                     <TouchableOpacity onPress={this.jump.bind(this)}>
//                         <Text>点击跳转</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         );
//     }
//}


AppRegistry.registerComponent('XiFan', () => XiFan);

// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';
//
// class XiFan extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>
//           Welcome to React Native!
//         </Text>
//         <Text style={styles.instructions}>
//           To get started, edit index.ios.js
//         </Text>
//         <Text style={styles.instructions}>
//           Press Cmd+R to reload,{'\n'}
//           Cmd+D or shake for dev menu
//         </Text>
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
//
// AppRegistry.registerComponent('XiFan', () => XiFan);
