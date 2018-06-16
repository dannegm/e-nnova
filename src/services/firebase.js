import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'

const credentials = {
  apiKey: "AIzaSyCOpyCAAyletQNHj7NaeyVAiuHnN2d7otA",
  authDomain: "e-nnova.firebaseapp.com",
  databaseURL: "https://e-nnova.firebaseio.com",
  projectId: "e-nnova",
  storageBucket: "e-nnova.appspot.com",
  messagingSenderId: "149489944506"
};
firebase.initializeApp (credentials);
const database = firebase.database ();

export {
  database
}