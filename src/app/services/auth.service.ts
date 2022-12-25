import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, browserSessionPersistence, getAuth, setPersistence  } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }


  async register({email, password}){
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password)
     return user
    } 
    catch (e) {
      return null
    }
  }

  async login({email, password}){
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password)
      console.log('aas')

      return user
    } 
    catch (e) {

      return null
    }
  }

  logout(){
    this.auth.signOut()
    return signOut(this.auth)
  }

}
