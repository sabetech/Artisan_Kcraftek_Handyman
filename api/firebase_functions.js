import * as firebase from "firebase";
import "firebase/firestore";
import {Alert} from "react-native";

export async function registration(email, password, name, occupations) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const currentUser = firebase.auth().currentUser;

    const db = firebase.firestore();
    db.collection("artisan_users")
      .doc(currentUser.uid)
      .set({
        email: currentUser.email,
        name: name,
        occupations: occupations,
        is_active: false,
        location: {lat: 0, lng: 0},
        id: currentUser.uid,
        jobs_completed: 0,
        total_earned: 0.0,
        rating: 0,
        request:{
          'status':'idle'
        }
      });
  } catch (err) {
    Alert.alert("There is something wrong!!!!", err.message);
  }
}

export async function signIn(email, password) {
  try {
   await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
}

export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    Alert.alert('There is something wrong!', err.message);
  }
}

export async function toggleOffline(artisan) {
  console.log(artisan.is_active);
  try{
    const db = firebase.firestore();
    db.collection("artisan_users").doc(artisan.id).update({
      "is_active":!artisan.is_active
    });
      
  }catch (err){

  }
}

//status = [idle, requesting, accepted, job_started, job_completed, job_cancelled]
export async function acceptTask(artisan){
  //set request status to accepted for this artisan
  //notify client that made req of accepted artisan
  
  //check to see if the person is not already busy
  //check
  console.log(artisan);
  try{
    const db = firebase.firestore();
   await db.collection('artisan_users')
      .where('request.client.id', '==', artisan.request.client.id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({'request':{
            'status': 'idle'
          }})
        })
      });
      
  const data = await db.collection("artisan_users").doc(artisan.id);
   await data.update({
      'request':{
        'status':'accepted',
        'client':artisan.request.client,
        'info': artisan.request.info
      }
    });

  }catch(err){
    console.log(err);
  }
}

export async function declineTask(artisan){
  try{
    const db = firebase.firestore();

    db.collection("artisan_users").doc(artisan.id).update({
      "request":{
        'status':'idle'
      }
    });
  }catch(erro){

  }
}

export async function observeArtisanDBChanges(artisan) {
  
}