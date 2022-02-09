import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { retry } from 'rxjs/operators';
import { ConfigLoaderService } from '../service/config-loder.service'; //Main.Url(API URL)

import { LineTokenRes } from '../models/lineTokenRes';
import { VisitorInfo } from '../models/sendquestiontobot';
import { UserAuthResponse } from '../models/userAuthRes';
import { ChatbotService } from '../service/chatbot.service';

@Component({
  selector: 'app-callback',
  template: '<div>Loading....</div>',
})
export class CallbackComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private authService:ChatbotService,
    private route: ActivatedRoute,
    private router: Router,
    private mainUrl: ConfigLoaderService
    ) { }
    

  ngOnInit(): void {
    // this.route.queryParams.subscribe((params: Params) => {
    //   // this.SharevarService.isTestConsoleLog(params)
    //   let code = params['code'];
    //   let provider = params['provider'];
    //   let key:VisitorInfo = JSON.parse(sessionStorage.getItem('VisitorInfo-key'));
    //   let askerId = key.askerId;
    //   let memberKey = key.memberKey;
    //   if (code) {
    //     this.authService.getCsrfToken().subscribe(() => {
    //       this.http.post(`${this.mainUrl.appApi}api/Account/getChatbotInfoAsync`, {
    //         code: code,
    //         Provider: provider,
    //         AskerId: askerId,
    //         MemberKey: memberKey,
    //         LoginKind: 1
    //       }).subscribe((result: UserAuthResponse) => {
    //         this.authService.authRes.next(result);
    //         localStorage.setItem('memberkey', result.userInfo.memberKey.toString());
    //         localStorage.setItem('memberLoginId', result.userInfo.memberLoginId.toString());
    //         // this.router.navigate(['/']);
    //       }, error => {
    //         // this.SharevarService.isTestConsoleLog(error.error);
    //         alert(error.error);
    //         // this.router.navigate(['/']);
    //       });
    //     });
    //   }

    // });
  }
}
