import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { AppConfig } from '../models/config.model';

@Injectable()
export class ConfigLoaderService {

public appApi = 'Not Set Yet';
public appImg = 'Not Set Yet';
public appIframe = 'Not Set Yet';
public appConsoleLog = false;


  constructor(private httpClient: HttpClient) { }

  initialize() {
    return this.httpClient.get<AppConfig>('./assets/config.json')
    .pipe(tap((response: AppConfig) => {
      this.appApi = response.apiUrl;
      this.appImg = response.imgUrl;
      this.appIframe = response.iframeUrl;
      this.appConsoleLog = response.isConsoleLog;
    })).toPromise<AppConfig>();
  }

}