import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAk-SNQRSo3Lg2EXZiVU09kWJ99UlrR7NI',
  authDomain: 'athena-dsv.firebaseapp.com',
  projectId: 'athena-dsv',
  storageBucket: 'athena-dsv.appspot.com',
  messagingSenderId: '782759998381',
  appId: '1:782759998381:web:638c19afff65a2b1932724',
  measurementId: 'G-DTFT6FRJLH',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
