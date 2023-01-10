import { Injectable, OnInit } from '@angular/core';
import {  CollectionReference,  DocumentData, addDoc,  collection,  deleteDoc,  doc,  updateDoc,} from '@firebase/firestore';
import { Firestore, collectionData, docData, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { endOfWeek, format, startOfWeek } from 'date-fns';

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

  public dataCollection: CollectionReference<DocumentData>;
  querySortedByNewest;
  uid;

  currenteWeekeer;
  
  constructor(public readonly firestore: Firestore, public auth: Auth) {
    // this.dataCollection = collection(this.firestore, 'Bh89hEJFo4Ve4UobbTyuMBDbAQx1')
    this.dataCollection = collection(this.firestore, this.auth.currentUser.uid)

    this.querySortedByNewest = query(this.dataCollection, orderBy("createdAt", "desc"));

     this.uid = this.auth.currentUser.uid;

     this.currenteWeekeer = this.getCurrentWeek();
    console.log(this.currenteWeekeer)
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


  getCurrentWeek() {

    // We get data from today's day, month, and year, converted to int
    let todaysDate = format(new Date(), 'dd.MM.yyyy')
    let varForToday = parseInt(todaysDate.substring(0, todaysDate.indexOf(".")))
    let month = parseInt(todaysDate.substring(todaysDate.indexOf(".") + 1).slice(0, -5))
    let varForThisYear = parseInt(todaysDate.substring(todaysDate.length - 4))

    // We get the start of the week
    let startOfCurrentWeek = startOfWeek(new Date(varForThisYear, month - 1, varForToday), { weekStartsOn: 1 }).toString()
    let firstDayOfWeekToInt = parseInt(startOfCurrentWeek.substring(0, startOfCurrentWeek.length - 52).slice(-2))

    // We get the end of the week
    let LastDayOfCurrentWeek = endOfWeek(new Date(varForThisYear, month - 1, varForToday), { weekStartsOn: 1 }).toString()
    let lastDayOfCurrentWeekToInt = parseInt(LastDayOfCurrentWeek.substring(0, LastDayOfCurrentWeek.length - 52).slice(-2))

    // we fill this array wich comntais numbers of day of the week to match days trained
    let currentWeek = []
    for (let i = firstDayOfWeekToInt; i < lastDayOfCurrentWeekToInt + 1; i++) {
      currentWeek.push(i)
    }

    if (firstDayOfWeekToInt > lastDayOfCurrentWeekToInt) {
      let newArr = []
      if (month == 4 || month == 6 || month == 9 || month == 11) {
        let endOfMonthVariable = 30
        for (let i = firstDayOfWeekToInt; i < endOfMonthVariable + 1; i++) {
          newArr.push(i)
        }
        for (let i = 1; i < lastDayOfCurrentWeekToInt + 1; i++) {
          newArr.push(i)
        }
        currentWeek.push(newArr)
      }
      if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        let endOfMonthVariable = 31
        for (let i = firstDayOfWeekToInt; i < endOfMonthVariable + 1; i++) {
          newArr.push(i)
        }
        for (let i = 1; i < lastDayOfCurrentWeekToInt + 1; i++) {
          newArr.push(i)
        }
        currentWeek.push(newArr)
      }
      if (month == 2) {
        let endOfMonthVariable = 28
        for (let i = firstDayOfWeekToInt; i < endOfMonthVariable; i++) {
          newArr.push(i)
        }
        for (let i = 1; i < lastDayOfCurrentWeekToInt + 1; i++) {
          newArr.push(i)
        }
        currentWeek = newArr
      }
    }

    return currentWeek
    

  }
  

  
}
