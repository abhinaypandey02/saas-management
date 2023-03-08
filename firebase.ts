import { initializeApp } from 'firebase/app'
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore'

import Saas from './interfaces/Saas'
const firebaseConfig = {
  apiKey: 'AIzaSyAU8m__3_JRbwHkvbmazDm5pdfizyxSzFE',
  authDomain: 'nexmo-50c56.firebaseapp.com',
  projectId: 'nexmo-50c56',
  storageBucket: 'nexmo-50c56.appspot.com',
  messagingSenderId: '881082434456',
  appId: '1:881082434456:web:a2d7246a199a1c6274e1ed',
  measurementId: 'G-DXCVM20MEK',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

export async function addSaaS(saas: Saas) {
  await setDoc(doc(db, 'Saas', saas.id), saas)
}
export async function getAllSaaS() {
  const docs = await getDocs(collection(db, 'Saas'))
  if (docs) {
    return docs.docs.map((doc) => doc.data())
  }
  return []
}
export async function deleteSaas(id: string) {
  const docs = await deleteDoc(doc(db, 'Saas', id))
}
