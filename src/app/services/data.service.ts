import { Injectable, OnInit } from '@angular/core';
import {  CollectionReference,  DocumentData, addDoc,  collection,  deleteDoc,  doc,  updateDoc,} from '@firebase/firestore';
import { Firestore, collectionData, docData, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';

export interface trainingDayData {
  dayTrained: string,
  musclesTrained: any[],
  Intensity: string,
  created: any
}


@Injectable({
  providedIn: 'root'
})


export class DataService   {

  private dataCollection: CollectionReference<DocumentData>;
  querySortedByNewest;
  uid;
  
  constructor(private readonly firestore: Firestore, private auth: Auth) {
    // this.dataCollection = collection(this.firestore, 'Bh89hEJFo4Ve4UobbTyuMBDbAQx1')
    this.dataCollection = collection(this.firestore, this.auth.currentUser.uid)

    this.querySortedByNewest = query(this.dataCollection, orderBy("createdAt", "desc"));

     this.uid = this.auth.currentUser.uid;

  }

  // uid = 'Bh89hEJFo4Ve4UobbTyuMBDbAQx1';


  

  getAll() {
    
    return collectionData(this.querySortedByNewest, {
      idField: 'id',
    }) as Observable<trainingDayData[]>;
  }

  get(id: string) {
    const dataDocumentReference = doc(this.firestore, `${this.uid}/${id}`);
    return docData(dataDocumentReference, { idField: 'id' });
  }

  create(data: any) {
    return addDoc(this.dataCollection, data); 
  }

  createCollection(data: any) {
    
    const newCollection = collection(this.firestore, this.uid);
    return addDoc(newCollection, data);
  }

  update(data: any) {
    let id = data.id
    const pokemonDocumentReference = doc(
      this.firestore,
      `${this.uid}/${id}`
    );
    return updateDoc(pokemonDocumentReference, { ...data });
  }

  delete(id: string) {
    const pokemonDocumentReference = doc(this.firestore, `${this.uid}/${id}`);
    return deleteDoc(pokemonDocumentReference);
  }

  

  
}
