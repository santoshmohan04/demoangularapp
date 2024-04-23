import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  hosturl = environment.hosturl;

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

  deleteSingleRecords(id: string) {
    const apiurl = this.hosturl + 'employees/' + id;
    return this.httpclient.delete(apiurl).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        throw new Error(error);
      })
    );
  }

  deleteAllRecords(id: string, body: any) {
    const apiurl = this.hosturl + 'employees/' + id;
    return this.httpclient.delete(apiurl, { body: body }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        throw new Error(error);
      })
    );
  }

  updateRecord(id: string, body: any) {
    const apiurl = this.hosturl + 'employees/' + id;
    return this.httpclient.put(apiurl, body).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        throw new Error(err);
      })
    );
  }
  uploadImage(body: any) {
    const apiurl = this.hosturl + 'upload';
    return this.httpclient.post(apiurl, body).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        throw new Error(err);
      })
    );
  }

  addRecord(body: any) {
    const apiurl = this.hosturl + 'employees';
    return this.httpclient.post(apiurl, body).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        throw new Error(err);
      })
    );
  }
}
