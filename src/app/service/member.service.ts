import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs'


import { ConfigLoaderService } from './config-loder.service'; //Main.Url(API URL)
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberServices {
  public isloginok = new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient,
    private mainUrl: ConfigLoaderService
    ) { }
    getAntiCsrfToken(){
        return this.http.get(`${this.mainUrl.appApi}api/Account/getAntiCsrfToken`);
      }
    onLogin(data:any){
        return this.http.post(`${this.mainUrl.appApi}api/Account/login`,data);
      }
}