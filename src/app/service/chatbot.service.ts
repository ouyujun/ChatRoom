import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders   } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigLoaderService } from './config-loder.service'; //Main.Url(API URL)
import { Observable } from 'rxjs';
import { sendQuestionToBot } from '../models/sendquestiontobot';
import { UserAuthResponse } from '../models/userAuthRes';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  constructor(
    private http: HttpClient,
    private mainUrl: ConfigLoaderService
  ) { }
  isTestConsoleLog(test:any){
    if(this.mainUrl.appConsoleLog){
      console.log(test)
    }
  }
  /*------------------------------------------1.Layout------------------------------------------*/
  getMainData() {
    this.isTestConsoleLog(this.mainUrl.appApi)
    return this.http.get(`${this.mainUrl.appApi}api/Chatbot/getBotUserInfo`);
  }
  getVisitorInfo() {
    return this.http.get(`${this.mainUrl.appApi}api/Chatbot/getVisitorInfo`);
  }
  /*------------------------------------------2.Login------------------------------------------*/
  getTPList() {
    return this.http.get(`${this.mainUrl.appApi}api/Chatbot/getLoginSettingInfo`);
  }
  /*------------------------------------------3.Message------------------------------------------*/
  getChatBotIcon() {
    //GET取得Bot資訊
    return this.http.get(`${this.mainUrl.appApi}api/Chatbot/getBotUserInfo`);
  }
  sendQuestionToBot(data: sendQuestionToBot): Observable<any> {
    //取得AI回答
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/sendQuestionToBot`, data);
  }
  getNewSessionNoAndChatFufill(data): Observable<any> {
    //結束對話並取得新的對話編號(包含紀錄對話)-Call Fulfill & Call Session
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/getNewSessionNoAndChatFufill`, data);
  }
  setChatFulfillWithRecord(data): Observable<any> {
    //完成對話(包含紀錄對話)-Call Fulfill
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/setChatFulfillWithRecords`, data);
  }
  setChatFulfill(data): Observable<any> {
    //完成對話
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/setChatFulfill`, data);
  }
  getNotifyTimes(): Observable<any> {
    //取得所有提醒時間
    return this.http.get<any>(`${this.mainUrl.appApi}api/Chatbot/getNotifyTimes`);
  }
  getIdleNotifyV2(sessionNo: any): Observable<any> {
    //閒置提醒
    return this.http.get<any>(`${this.mainUrl.appApi}api/Chatbot/getIdleNotifyV2?sessionNo=${sessionNo}`);
  }
  getEndChatNotifyV2(sessionNo: any): Observable<any> {
    //結束提醒
    return this.http.get<any>(`${this.mainUrl.appApi}api/Chatbot/getEndChatNotifyV2?sessionNo=${sessionNo}`);
  }
  getRecoverChat(sessionNo: any): Observable<any> {
    //對話恢復提醒
    return this.http.get<any>(`${this.mainUrl.appApi}api/Chatbot/getRecoverChat?sessionNo=${sessionNo}`);
  }
  getLastChatSessionRecord(sessionNo: any): Observable<any> {
    //是否有對話紀錄
    return this.http.get<any>(`${this.mainUrl.appApi}api/Chatbot/getLastChatSessionRecord?sessionNo=${sessionNo}`);
  }
  ///Chatbot 回答模組相關 API
  getButtonModuleAnswer(data: any) {
    //按鈕模組回答
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/getButtonModuleAnswer`, data);
  }
  getQuestionModuleAnswer(data: any) {
    //主動提問模組回答
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/getQuestionModuleAnswer`, data);
  }
  getPictureModuleAnswer(data: any) {
    //圖片模組的回答
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/getPictureModuleAnswer`, data);
  }
  getFAQAnswer(data: any) {
    //取得標準問題回答
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/getFAQAnswer`, data);
  }
  getEmailAnswer(data: any) {
    //取得Email標籤回答
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/getEmailAnswer`, data);
  }
  getClickAnswer(data: any) {
    //取得轉導網址
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/getClickAnswer`, data);
  }
  getGuideButtonAnswer(data: any) {
    //取得引導按鈕回答
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/getGuideButtonAnswer`, data);
  }
  /*------------------------------------------------4.Wellcome------------------------------------------------*/
  //Wellcome WellcomV2
  getBotWellcomeInfoV2() {
    return this.http.get(`${this.mainUrl.appApi}api/Chatbot/getBotWellcomeInfoV2`);
  }
  reconnection(data) {
    //重新連線
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/reconnection`, data);
  }
  /*------------------------------------------------5.changeToRealTimeCustomer------------------------------------------------*/
  changeToRealTimeCustomerService(data: any) {
    //轉真人客服
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/changeToRealTimeCustomerService`, data);
  }
  //0.無人

  //1.留言訊息
  getFaqCategoryOptions() {
    //取得留言板中的Faq類別選項(下拉式選單)
    return this.http.get(`${this.mainUrl.appApi}api/Chatbot/getFaqCategoryOptions`);
  }
  createMemberMessage(data: any) {
    //建立留言紀錄
    let header = new HttpHeaders().set(
      "X-XSRF-TOKEN",
       localStorage.getItem("memberToken")
    );
    this.isTestConsoleLog( localStorage.getItem("memberToken"))
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/createMemberMessage`,data, {headers:header});
  }
  //2.詢問等待
  getRealTimeWaitModuleMessage(data:any){
    //繼續等候
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/getRealTimeWaitModuleMessage`,data);
  }
  cancelRealTimeQueue(data: any){
     //取消排隊
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/cancelRealTimeQueue`, data);
  }
    //等候提醒2
    getCsUserQueueInfo(csUserId:number,chatTimetableId:number){
      return this.http.get<any>(`${this.mainUrl.appApi}api/Chatbot/getCsUserQueueInfo?csUserId=${csUserId}&chatTimetableId=${chatTimetableId}`);
    }
  
  //3.開始連線



  /*----------------------------------------------------login-------------------------------------------------*/
  authRes: BehaviorSubject<UserAuthResponse> = new BehaviorSubject<UserAuthResponse>(null);
  authRes$ = this.authRes.asObservable();
  loading: boolean = false;
  isAuth() {
    this.http.get(`${this.mainUrl.appApi}api/Account/getAuthInfo`).subscribe((result: UserAuthResponse) => {
      this.isTestConsoleLog('isAuth:' + result);
      this.authRes.next(result);
    })
  }
  getCsrfToken() {
    return this.http.get<{ token: string }>(`${this.mainUrl.appApi}api/Account/getAntiCsrfToken`)
      .pipe(
        map(res => {
          this.isTestConsoleLog('get csrf:' + res.token);
          sessionStorage.setItem('csrf_token', res.token);
        })
      );
  }

  getUserInfo() {
    this.http.get(`${this.mainUrl.appApi}api/Chatbot/getVisitorInfo`);
  }

  login(loginForm: any) {
    return this.http.post(`${this.mainUrl.appApi}api/Account/login`, {
      username: loginForm.username,
      password: loginForm.password
    });
  }

  memberLogin(loginForm: any) {
    return this.http.post(`${this.mainUrl.appApi}api/Account/memberLogin`, {
      sessionNo: loginForm.sessionNo,
      askerId: loginForm.askerId,
      username: loginForm.username,
      password: loginForm.password
    });
  }
  /*------------------------------------------------------------------------------ */
  getChatRecordHistory(data) {
    //取得轉導網址
    return this.http.post<any>(`${this.mainUrl.appApi}api/Chatbot/getChatRecordHistory`, data);

  }
}


