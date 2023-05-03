import { Injectable, OnInit } from '@angular/core';
import { CollectionReference, DocumentData, addDoc, collection, deleteDoc, doc, updateDoc, } from '@firebase/firestore';
import { Firestore, collectionData, docData, enableIndexedDbPersistence, limit, orderBy, query, where } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { add, eachWeekOfInterval, endOfMonth, endOfWeek, format, getDaysInMonth, isSameWeek, startOfMonth, startOfWeek, sub, subMonths } from 'date-fns';
import { first, map, shareReplay, take, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface trainingDayData {
  id: any;
  dayTrained: string,
  musclesTrained: any[],
  Intensity: string,
  created: any
}

@Injectable({
  providedIn: 'root'
})

export class DataService {

  public dataCollection: CollectionReference<DocumentData>;
  uid;
  currentWeek = []
  data;

  constructor(public readonly firestore: Firestore, public auth: Auth, private afs: AngularFirestore) {

    enableIndexedDbPersistence(this.afs.firestore)
      .then((data) => {
        console.log('✅ Persistencia habilitada en el índice de la base de datos');
      })

    this.data = this.afs.collection(this.auth.currentUser.uid).valueChanges({ idField: 'id' })
      .pipe(
        tap(resp => {
          console.log(resp.length);
        }),
        shareReplay(1)
      );

    this.currentWeek = this.getCurrentWeek()
    this.uid = this.auth.currentUser.uid;
    this.dataCollection = collection(this.firestore, this.auth.currentUser.uid)
  }

  public getIndexedDatabase() {
    return this.afs
  }

  // SAFE (limit 1)
  getFirstTimeTrained() {
    let queryForMostRecent = query(this.dataCollection, orderBy("createdAt", "asc"), limit(1));
    return collectionData(queryForMostRecent, {
      idField: 'id',
    }).pipe(first()).toPromise() as Promise<trainingDayData[]>;
  }

  // SAFE (limit 1)
  getLastTimeTrained() {
    let queryForMostRecent = query(this.dataCollection, orderBy("createdAt", "desc"), limit(1));
    return collectionData(queryForMostRecent, {
      idField: 'id',
    }) as Observable<trainingDayData[]>;
  }

  // SAFE
  getTrainedThisWeek(): Promise<any[]> {
    const today = new Date();
    const startWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endWeek = endOfWeek(today, { weekStartsOn: 1 });

    return new Promise((resolve, reject) => {
      this.data.pipe(
        map((items: any) => items.filter(item => {
          const [day, month, year] = item.dayTrained.split('.');
          const itemDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          return itemDate >= startWeek && itemDate <= endWeek; // retorna los items que estén dentro de la semana
        }))
      ).subscribe(
        (result: any[]) => {
          this.subjectForTrainedThisWeek.next(result)
          resolve(result);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  // SAFE (limit 7)
  get7Recent() {
    let querySortedRecent = query(this.dataCollection, orderBy("createdAt", "desc"), limit(7));
    return collectionData(querySortedRecent, {
      idField: 'id',
    }) as Observable<trainingDayData[]>;
  }

  // getAll() {
  //   let querySortedByNewest = query(this.dataCollection, orderBy("createdAt", "desc"));
  //   return collectionData(querySortedByNewest, {
  //     idField: 'id',
  //   }) as Observable<trainingDayData[]>;
  // }
  

  // Safe
  getStatsYearTrained() {
    return new Promise((resolve, reject) => {
      this.data.subscribe(resp => {
        this.trainingByYear = {};
        let result = resp.map((a: any) => a.dayTrained);
        result.forEach(dayTrained => {
          let year = parseInt(dayTrained.substring(dayTrained.length - 4));
          if (!(year in this.trainingByYear)) {
            this.trainingByYear[year] = 0;
          }
          this.trainingByYear[year]++;
        });
        resolve(this.trainingByYear);
        this.subjectForYearTrained.next(this.trainingByYear)
      }, error => reject(error));
    });
  }

  private subjectForTrainedThisWeek = new Subject()

  getUpdatesFromgetTrainedThisWeek(): Observable<any> {
    return this.subjectForTrainedThisWeek.asObservable();
  }

  private subjectForYearTrained = new Subject()

  trainingByYear = {}

  getUpdatesFromgetStatsYearTrained(): Observable<any> {
    return this.subjectForYearTrained.asObservable();
  }

  // CRUD method
  createCollection(data: any) {
    const newCollection = collection(this.firestore, this.uid);
    addDoc(newCollection, data)
  }

  // CRUD method
  update(data: any) {
    let id = data.id
    const dataReference = doc(
      this.firestore,
      `${this.uid}/${id}`
    );
    return updateDoc(dataReference, { ...data });
  }

  // CRUD method
  delete(data: any) {
    const dataReference = doc(this.firestore, `${this.uid}/${data.id}`);
    return deleteDoc(dataReference);
  }

  // TIME METHOD
  getCurrentWeek() {
    let currentDate = new Date()
    let daysInMonth = getDaysInMonth(currentDate)

    let monday = startOfWeek(currentDate, { weekStartsOn: 1 }).getDate()
    let sunday = endOfWeek(currentDate, { weekStartsOn: 1 }).getDate()

    let daysInCurrentWeek = sunday - monday + 1

    if (monday > sunday) {
      let daysInFirstWeek = daysInMonth - monday + 1
      let daysInSecondWeek = daysInCurrentWeek - daysInFirstWeek

      let firstWeekDays = Array.from({ length: daysInFirstWeek }, (_, i) => i + monday)
      let secondWeekDays = Array.from({ length: daysInSecondWeek }, (_, i) => i + 1)

      return [firstWeekDays, secondWeekDays]
    } else {
      let currentWeekDays = Array.from({ length: daysInCurrentWeek }, (_, i) => i + monday)
      return currentWeekDays
    }
  }

  // TIME METHOD
  getPreviousWeek() {
    let month = new Date().getMonth()
    let r = sub(startOfWeek(new Date(), { weekStartsOn: 1 }), { weeks: 1 })
    let d = add(r, { days: 6 })
    let monday = parseInt(format(r, 'dd'))

    let sunday = parseInt(format(d, 'dd'))
    let previousWeek = []
    if (monday > sunday) {
      let newArr = []
      if (month == 4 || month == 6 || month == 9 || month == 11) {
        for (let i = monday; i < 31 + 1; i++) {
          newArr.push(i)
        }
        for (let i = 1; i < sunday + 1; i++) {
          newArr.push(i)
        }
        previousWeek.push(newArr)
      }
      if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        for (let i = monday; i < 31 + 1; i++) {
          newArr.push(i)
        }
        for (let i = 1; i < sunday + 1; i++) {
          newArr.push(i)
        }
        previousWeek = newArr
      }
      if (month == 2) {
        for (let i = monday; i < 29; i++) {
          newArr.push(i)
        }
        for (let i = 1; i < sunday + 1; i++) {
          newArr.push(i)
        }
        previousWeek = newArr
      }
    } else {
      for (let i = monday; i < sunday + 1; i++) {
        previousWeek.push(i)
      }
    }
    return previousWeek;
  }

  // TIME METHOD
  getFullMonth() {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });

    let aver = [];

    weeks.forEach((week) => {
      const startDate = startOfWeek(week, { weekStartsOn: 1 }); // Lunes
      const endDate = endOfWeek(week, { weekStartsOn: 1 }); // Domingo
      let firstDayWeek = parseInt(format(startDate, 'dd'))
      let LasDayWeek = parseInt(format(endDate, 'dd'))
      aver.push(firstDayWeek)
      aver.push(LasDayWeek)
    });

    const result = [];

    for (let i = 0; i < aver.length; i += 2) {
      const start = aver[i];
      const end = aver[i + 1];
      const subArr = [];

      if ((i % 2 === 0 && aver[i] >= 24) || aver[i + 1] >= 24) {
        const left = aver.slice(0, 5); // valores del lado izquierdo
        const right = aver.slice(5 + 1); // valores del lado derecho

        if (left.includes(aver[i])) {
          const lastMonth = subMonths(new Date(), 1); // Mes anterior a la fecha actual
          const endOfTheMonthForLastMonth = parseInt(format(endOfMonth(lastMonth), 'dd'));
          if (endOfTheMonthForLastMonth - aver[i] < 6) {
            for (let e = aver[i]; e <= endOfTheMonthForLastMonth; e++) {
              subArr.push(e);
            }
            for (let h = 1; h <= end; h++) {
              subArr.push(h);
            }
          }
        } else if (right.includes(aver[i])) {
          const endOfTheMonthForThisMonth = parseInt(format(endOfMonth(new Date()), 'dd')); // Obtiene el último día del mes actual
          if (endOfTheMonthForThisMonth - aver[i] < 6) {
            for (let e = aver[i]; e <= endOfTheMonthForThisMonth; e++) {
              subArr.push(e);
            }
            for (let h = 1; h <= end; h++) {
              subArr.push(h);
            }
          }
        }
      }

      for (let j = start; j <= end; j++) {
        subArr.push(j);
      }
      result.push(subArr);
    }
    console.log(result);
    return result

  }

}