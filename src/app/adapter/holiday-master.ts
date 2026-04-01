import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Holiday } from '../model/holiday';

interface recv {
  data: Holiday[],
  error: string
}

@Injectable({
  providedIn: 'root',
})
export class HolidayMaster {
  private http = inject(HttpClient);

  getHolidays(year: number = 2025): Observable<Holiday[]> {
    // HttpClient.getはObservableを返します。pipe(map(...)) でデータの変換のみ行います。
    return this.http.get<recv>(`http://localhost:4200/api/holiday?sdate=${year}/1/1&edate=${year}/12/31`).pipe(
      map(rd => rd.data.map(x => ({
        id: x.id,
        date: new Date(x.date),
        name: x.name
      })))
    );
  }
}
