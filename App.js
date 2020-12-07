import { StatusBar } from 'expo-status-bar';
import React,{useEffect} from 'react';
import { StyleSheet, Button, View } from 'react-native';
import * as Notifications from 'expo-notifications';
//permessi per IOS
import * as Permissions from 'expo-permissions';

export default function App() {

    const triggerNotificationHandler=()=>{

        useEffect(async()=>{
            /**
             * la proprietà statusObj ha un valore che è status
             * CHIEDE la possibilità di inviare le notifiche sia per android che ios
             * con then() vediamo la stato, se abbiamo granted come stato non abbiamo bisogno di continuare
             * se non abbiamo granted allora possiamo continuare e richiediamo il permesso alle notifiche
             */
            /**
             * con un then sotto chiediamo ancora lo status, se lo stato non è ancora granted mettiamo un alert e una return
             * se lo status sarà granted allora saremo a posto 
             */
            Permissions.getAsync(Permissions.NOTIFICATIONS).then(statusObj=>{
                if(statusObj.status==='!granted'){
                    return Permissions.askAsync(Permissions.NOTIFICATIONS);
                }
                return statusObj;//così che il prossimo blocco then è solo per i casi in cui avevamo il permesso
            }).then(statusObj=>{
                if(statusObj.status !=='granted'){
                    return;
                }
            }); 
        },[])
        /**metodo che ci aiuta a programmare una notifica con questo crei una notifica locale */
        Notifications.scheduleNotificationAsync({
            content:{//è un oggetto con varie opzioni
                title:'My first local notification',
                body:'This is the first local notification we are sending!',
            },
            trigger:{//trigger è un oggetto in cui si definisce quando inviare la notifica
                seconds:2 //secondi prima che la notifica venga visualizzata
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
