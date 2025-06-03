import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { User } from '../models/user.model'
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {getFirestore, setDoc, doc, getDoc, addDoc, collection} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL} from 'firebase/storage';

 
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsScv = inject(UtilsService);

  // ===== Autentication =====
  getAuth(){
    return getAuth();
  }

  // ===== Acceder =====
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //===== Crear usuario =====
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //===== Actualizar usuario =====
  updateUser(displayName: string){
    return updateProfile(getAuth().currentUser, {displayName}) 
  }

  //===== Reestablecer contraseña =====
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email);
  }

  //===== Cerrar Sesión =====
  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsScv.routerLink('/auth'); 
  }

  //================= Base de datos ================

  //===== Setear Documentos =====
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(),path),data);
  }

  //===== Obtener Documento =====
  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(),path))).data();
  }

    //===== Agregar Documento =====
  addDocument(path: string, data: any) {
 return addDoc(collection(getFirestore(),path,), data);
  }

// ====== Subir imagen =====
  async uploadImage(path: string, dataUrl: string) { 
    return uploadString(ref(getStorage(), path), dataUrl, 'data_url').then(() => {
    return getDownloadURL(ref(getStorage(), path));
    }); 
  }

   //===== Guardar post mascota perdida =====
  async addLostPetPost(postData: any) {
    const id = this.firestore.createId(); 
    const path = `lostPets/${id}`;
    const data = {
      ...postData,
      id,
      createdAt: new Date()
    };
    return this.setDocument(path, data);
  }

  //===== Guardar post mascota encontrada =====
  async addFoundPetPost(postData: any) {
    const id = this.firestore.createId();
    const path = `foundPets/${id}`;
    const data = {
      ...postData,
      id,
      createdAt: new Date()
    };
    return this.setDocument(path, data);
  }


}
