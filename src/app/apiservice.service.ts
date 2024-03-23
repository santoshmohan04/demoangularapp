import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiserviceService {
  hosturl = 'https://frontendtest.glitch.me/';

  constructor(private httpclient: HttpClient) {}

  getRecords() {
    const apiurl = this.hosturl + 'employees';
    return this.httpclient.get(apiurl).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        throw new Error(error);
      })
    );
  }
}
