import { StatusBar } from 'expo-status-bar';
import React,{useEffect,useState} from 'react';
import { StyleSheet, Button, View } from 'react-native';
import * as Notifications from 'expo-notifications';
//permessi per IOS
import * as Permissions from 'expo-permissions';



/**
 * definisco all'esterno questo setNotificationHandler
 * dentro a questo oggetto definiamo come gestire le notifiche in arrivo se l'app è in esecuzione
 * handleNotification avremo una funzione che ritorna un oggetto che dice al sistema operativo cosa dovrebbe accadere quando si riceve una notifica
 * quando l'app è in esecuzione, nella return diciamo al sistema operativo cosa deve fare prima che la notifica venga fatta vedere all'utente
 * mettiamo handleNotification async così ritorna una promessa
 */
Notifications.setNotificationHandler({
    handleNotification:async()=>{
        /**ritorniamo un oggetto che descrive il comportamento del sistema operativo 
         * mettiamo che deve mostrare un alert lo mostra anche se l'app è chiusa ma voglio mostrarlo quando l'app è in esecuzione
         * vediamo la notifica anche se siamo dentro all'app, mettiamo anche un suono 
         * 
        */
        return {
            shouldShowAlert:true,
            shouldPlaySound:true
        };
    }
});

export default function App() {

    //definisco uno useState per gestire il token
    const [pushToken,setPushToken]=useState();

    useEffect(()=>{
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
        Permissions.getAsync(Permissions.NOTIFICATIONS)
        .then((statusObj) => {
          if (statusObj.status !== 'granted') {
            return Permissions.askAsync(Permissions.NOTIFICATIONS);
          }
          return statusObj;//così che il prossimo blocco then è solo per i casi in cui avevamo il permesso
        })
        .then((statusObj) => {
          if (statusObj.status !== 'granted') {
            throw new Error('Permission not granted!');
            /*metto questo senò andrebbe avanti ad eseguire il blocco then sotto
            il codice verrà eseguito solo se disponiamo di autorizzazione*/
          }
        })
        .then(()=>{
            /** getExpoPushTokenAsync ci serve per ottenere un token push */
            console.log('Getting token');
            return Notifications.getExpoPushTokenAsync();
        })
        .then(response=>{
            /**avremo come argomento data, qua recuperiamo il token e lo salviamo dentro alla constante token
             * andiamo a prenderlo da response e prendiamo il valore data visto dal console log dove c'è dentro il token
             * quando testiamo la notifica userà gli stessi metoni per background e per foreground 
             */
            console.log(response);//questo console.log lo dobbiamo mettere sempre per vedere il token per fare i test
            const token=response.data;
            setPushToken(token);//salvo il token dentro alla setPushToken
        
        })
        .catch((err)=>{
            console.log(err);
            return null;
        })
    }, []);

    useEffect(()=>{
        /**salviamo nella constante backgroundSubscription
         * creiamo un altro metodo per reagire alle notifiche quando l'applicazione è stata chiusa
         * definisce una funzione che deve essere eseguita quando un utente interagisce con una notifica mentre app non era in esecuzione
         * otteniamo un oggetto response
        */
        const backgroundSubscription=Notifications.addNotificationResponseReceivedListener(response=>{
            console.log(response);//otteniamo un oggetto risposta
        });


        /**
         * salviamo tutto dentro alla constante foregroundSubscription
         * metodo che ci consente di definire una funzione alla fine, viene eseguito quando si
         * riceve una notifica in arrivo e l'app è in esecuzione
         * 1 argomento notification 
        */
        const foregroundSubscription=Notifications.addNotificationReceivedListener(notification=>{
            console.log(notification);//qui otteniamo una notifica
        })
        /**
         * ritorniamo una funzione, sarà una funzione di pulizia che viene eseguita in modo automatico ogni volta che anciamo questo effetto
         * 
         */
        return ()=>{//mettiamo una remove della constante backgroundSubscription e foregroundSubscription
            backgroundSubscription.remove();
            foregroundSubscription.remove();
        }
    },[]);



    const triggerNotificationHandler=()=>{
        /**metodo che ci aiuta a programmare una notifica con questo crei una notifica locale */
      /* 
      NON SARA' PIU' COSI' PER LE NOTIFICHE PUSH
       Notifications.scheduleNotificationAsync({
            content:{//è un oggetto con varie opzioni
                title:'My first local notification',
                body:'This is the first local notification we are sending!',
                data:{mySpecialData:'Some text'}
            },
            trigger:{//trigger è un oggetto in cui si definisce quando inviare la notifica
                seconds:5 //secondi prima che la notifica venga visualizzata
            }
        });*/
        /**mandiamo una richiesta http. Faccio una fetch su questo url 
         * e dobbiamo configurare questa richiesta con il secondo argomento il metodo post e l'header
         * e il body perchè come nel sito expo per testare le notifiche c'erano tante cose da configurare
         * inviamo una richiesta http al server che poi farà tutto lui
        */
        fetch('https://exp.host/--/api/v2/push/send',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Accept-Encoding':'gzip, deflate',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                to:pushToken, //necessita del token questa proprietà
                data:{extraData:'Some data'},//impostiamo un data
                title:'Sent via the app',
                body:'This push notification was sent via the app'
            })
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
