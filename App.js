import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Button, View } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function App() {

    const triggerNotificationHandler=()=>{
        /**metodo che ci aiuta a programmare una notifica con questo crei una notifica locale */
        Notifications.scheduleNotificationAsync({
            content:{//è un oggetto con varie opzioni
                title:'My first local notification',
                body:'This is the first local notification we are sending!',
            },
            trigger:{//trigger è un oggetto in cui si definisce quando inviare la notifica
                seconds:10 //secondi prima che la notifica venga visualizzata
            }
        });
    }


  return (
    <View style={styles.container}>
      <Button title="Trigger Notification" onPress={triggerNotificationHandler}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
