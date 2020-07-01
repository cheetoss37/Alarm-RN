import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity, 
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from 'react-native-push-notification';
import BackgroundTimer from 'react-native-background-timer';//library that allow app to run in background (not killed/closed)
import Footer from './Footer';

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios', //use Platform.OS === 'ios' if you not use remote notification and do not have Firebase
  });
  
export default class Alarm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        notes: [],
        note: '',
        time: '',
    }
}

async componentDidMount() {
  // Get all item from async storage
    const notes = await AsyncStorage.getItem('notes');
    if (notes && notes.length > 0) {
        this.setState({
            notes: JSON.parse(notes)
        })
    }

  //Function get current time
    this.getTime = setInterval(() => { 
        this.getCurrentTime()
    }, 1000)

  //Set compare function inside background timer that allow app to run in background    
    BackgroundTimer.runBackgroundTimer(() => { 
        this.compareTime(); 
        }, 
        10*1000);
}

updateAsyncStorage(notes) { 
    return new Promise( async(resolve, reject) => { 
        try {
            await AsyncStorage.removeItem('notes');
            await AsyncStorage.setItem('notes', JSON.stringify(notes));
            return resolve(true);

        } catch(e) {
            return reject(e);
        }
    });
}

cloneNotes() {
    return [...this.state.notes];
}

async addNote() {
    if (this.state.note.length <= 0)
        return;

    try {
        const notes = this.cloneNotes();
        notes.push(this.state.note);

        await this.updateAsyncStorage(notes);//update list from local storage after adding item

        this.setState({
            notes: notes,
            note: ''
        });
    }

    catch(e) {
        // notes could not be updated
        alert(e);
    }
}

// Function delete  item from time list
async removeNote(i) {
    try {
        const notes = this.cloneNotes();
        notes.splice(i, 1);
        await this.updateAsyncStorage(notes);//update list from local storage after delete item
        this.setState({ notes: notes });
    }
    catch(e) {
        alert(e);
        console.log(e);
    }
}

//Function get current time
  getCurrentTime = () => {
    var d = new Date();
    var hour = d.getHours();
    var min = d.getMinutes();
    this.setState({
      time: hour + '-' + min 
    })
  }

//Function compare time, put timelist inside for loop and compare current time to each item
  compareTime = () => {
    var timecp = this.state.time 
    var timearr = this.state.notes 
    for(var i=0; i<timearr.length; i++){
      if(timearr[i].indexOf(timecp) !== -1){
        this.testPush();
      }
    }
  }

// Push notification function
  testPush = () => { 
    PushNotification.localNotificationSchedule({
        title: "Alarm",
        message: "Alarm", 
        priority: "high",
        playSound: true,
        soundName: "my_sound.mp3", // FILE PATH: android/app/src/main/res/raw
        date: new Date(Date.now() + 30 * 1000)
    });
  }

renderNotes() {
    return this.state.notes.map((note, i) => {
        return (
            <TouchableOpacity 
                key={i} style={styles.note} 
                onPress={ () => this.removeNote(i) }
            >
                <Text style={styles.noteText}>{note}</Text>
                <Text>{this.state.time}</Text>
            </TouchableOpacity>
        );
    });
}

render() {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {this.renderNotes()}
            </ScrollView>
            <Footer
                onChangeText={ (note) => this.setState({note})  }
                inputValue={this.state.note}
                onNoteAdd={ () => this.addNote() }
            />
        </View>
    );

}

}

const styles = StyleSheet.create({
container: {
    flex: 1,
    position: 'relative'
},
scrollView: {
    maxHeight: '100%',
    marginBottom: 100,
    backgroundColor: '#fff'
},
note: {
    margin: 18,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC7C3',
    borderRadius: 10,
},
noteText: {
    fontSize: 14,
    padding: 0,
}
});
