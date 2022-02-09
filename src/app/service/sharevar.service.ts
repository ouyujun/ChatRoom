import { Injectable, Type } from '@angular/core';
import { ChatbotService } from '../service/chatbot.service';
import { btnReplies } from '../models/sendquestiontobot';
import { BehaviorSubject } from 'rxjs'
import { Wellcomeres, Wellcomeresponse, addMessages, WellcomechatContents } from '../models/wellcomemodels'
import { notifyTimes, VisitorInfo } from '../models/sendquestiontobot';
import { MemberInfo } from '../models/memberInfo';
import { UserInfo } from '../models/memberInfo';
import { ConfigLoaderService } from './config-loder.service'; //Main.Url(API URL)

@Injectable()

export class SharevarService {
  public consoleLog = new BehaviorSubject<boolean>(true);

  public messageMainSubject$ = new BehaviorSubject<addMessages[]>([]);
  public messageMain$ = this.messageMainSubject$.asObservable();
  public taskType$ = new BehaviorSubject<string>("");
  public demand = new BehaviorSubject<string>("");

  public isNotify = new BehaviorSubject<boolean>(false);
  public isSpinning = new BehaviorSubject<boolean>(false);
  public isRunGetIdleNotify = new BehaviorSubject<boolean>(false);
  public memberInfo = new BehaviorSubject<MemberInfo>(null);
  public memberInfo$ = this.memberInfo.asObservable();

  public time = new BehaviorSubject<number>(null);
  public isSetup = new BehaviorSubject<boolean>(false);

  public showLoginModal = new BehaviorSubject<boolean>(false);
  public showLoginModal$ = this.showLoginModal.asObservable();
  public isVip = new BehaviorSubject<boolean>(false);

  rootSet = document.querySelector<HTMLElement>(':root'); //css Style Root 
  questionBtn: btnReplies[] = null;
  newWellcomeList: any[] = null;
  btnWellcomeList: any[] = null;
  btnList = {
    kind: 'Button',
    arr: [],
  };
  //設定sessionStorage
  sessionNo: number = null;
  memberKey: number = null;
  askerId: number = null;
  NotifyTimes: notifyTimes = null;
  constructor(
    private mainService: ChatbotService,
    private mainUrl: ConfigLoaderService
  ) { }

  addHistoryList(taskType: any, list: Wellcomeresponse[], type: boolean) { //新增對話
    this.taskType$.next(taskType);
    this.rootSet.style.setProperty('--isFAQBtn', 'none');
    const messages: addMessages = {
      type: type,
      content: list
    }
    this.messageMainSubject$.getValue().map(response => {
      response.content.map((Message: Wellcomeresponse) => {
        if (Message.kind === "Question") {
          Message.chatContents.forEach((chatContents: WellcomechatContents) => {
            let lastText = chatContents.text;
            if (document.getElementById(lastText)) {
              let myList = document.getElementById(lastText);
              myList.remove();
            }
          });
        }
      });
    });
    if (type) {
      this.isSpinning.next(false);
      this.messageMainSubject$.next([
        ...this.messageMainSubject$.getValue(), messages
      ])
    } else if (!type) {
      this.isRunGetIdleNotify.next(true);
      this.isSpinning.next(true);
      this.messageMainSubject$.next([
        ...this.messageMainSubject$.getValue(), messages
      ])
    }
  }
  //清空對話
  cancelList() {
    this.messageMainSubject$.next([])
  }

  storeVisitorInfo(): void {
    this.mainService.getVisitorInfo().subscribe((res: VisitorInfo) => {
      sessionStorage.setItem("VisitorInfo-key", JSON.stringify(res));
    });
  }
  getTestWellcome() {
    this.newWellcomeList = [];
    this.btnList.arr = [];
    this.mainService.getBotWellcomeInfoV2().subscribe((res: Wellcomeres) => {
      let response: Wellcomeresponse[];
      response = res.responseMessage;
      this.addHistoryList(res.taskType, response, true);
    });
  }
  //獲取閒置提醒各時間

  getNotifyTimes() {
    this.mainService.getNotifyTimes().subscribe((res: notifyTimes) => {
      this.NotifyTimes = res;
    });
  }
  //設定sessionStorage
  getSessionStorage() {
    if (sessionStorage.getItem("VisitorInfo-key")) {
      let storage = JSON.parse(sessionStorage.getItem("VisitorInfo-key"))
      this.sessionNo = storage.sessionNo;
      this.memberKey = storage.memberKey;
      this.askerId = storage.askerId;
    }
  }
  userInfo: UserInfo;
  setUserInfo() {  //VIP
    let storage: UserInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    if (storage) {
      this.isVip.next(storage.isVIP);
    } else {
      this.isVip.next(false);
    }
  }
  //時間計時-計算閒置時間並動作
  // time: number = 1;
  interval: any = {};
  isChatSessionRecord: boolean;

  setupTime(time: number) {
    clearInterval(this.interval);
    //isSetup是閒置提醒的開關.
    if (this.NotifyTimes) {
      this.time.next(time);
      this.interval = setInterval(() => {
        this.isTestConsoleLog("Bot計時" + this.time.getValue())
        switch (this.time.getValue()) {
          case this.NotifyTimes.endBotUserQWait:
            //this.time === this.NotifyTimes.endBotUserQWait  30s
            //多輪回覆對話
            this.getChatRecover();
            break;
          case this.NotifyTimes.lazyBotUserA:
            //this.time === this.NotifyTimes.lazyBotUserA   45s
            //回覆提醒。
            if (this.isSetup.getValue()) {
              this.getIdleNotify();
              this.isSetup.next(false);
            }
            break;
          case this.NotifyTimes.endBotUserQ + 10:
            //this.time === this.NotifyTimes.endBotUserQ + 10   45s+10s=55s
            //第一階段結束提醒
            this.getEndChatNotify();
            break;
          case this.NotifyTimes.endBotUserQ + this.NotifyTimes.endBotUserQWait:
            //this.time === this.NotifyTimes.endBotUserQ + this.NotifyTimes.endBotUserQWait  45s+30s=75s
            //第二階段結束提醒
            this.showNotify();
            break;
          default:
            if (this.time.getValue() > this.NotifyTimes.endBotUserQ + this.NotifyTimes.endBotUserQWait) clearInterval(this.interval);
            //this.NotifyTimes.endBotUserQ + this.NotifyTimes.endBotUserQWait
            break;
        }
        this.time.next(this.time.getValue() + 1);
      }, 1000)
    }
  }
  //停止閒置時間的計時
  stopSetUpTime() {
    clearInterval(this.interval);
  }
  getLastChatSessionRecord() {
    this.getSessionStorage();
    this.mainService.getLastChatSessionRecord(this.sessionNo).subscribe(res => {
      this.isChatSessionRecord = res;
    })
  }
  //對話恢復提醒
  getChatRecover() {
    this.getSessionStorage();
    // console.log(this.sessionNo, '對話恢復提醒')
    this.mainService.getRecoverChat(this.sessionNo).subscribe((res: Wellcomeres) => {
      // console.log(res)
      if (!res.responseMessage) return
      this.addHistoryList(res?.taskType, res.responseMessage, true);
      this.taskType$.next(res.taskType);
      this.time.next(0);
    }, error => { this.isTestConsoleLog("無對話恢復提醒") });
  }
  //新增對話-閒置提醒[180s]
  arr: any[] = [];
  getIdleNotify() {
    // console.log(this.sessionNo, '閒置提醒[180s]')
    this.getSessionStorage();
    if (!this.isRunGetIdleNotify) return
    this.mainService.getIdleNotifyV2(this.sessionNo).subscribe((res: Wellcomeres) => {
      if (!res.responseMessage) return
      let arr: Wellcomeresponse[] = res.responseMessage;
      this.taskType$.next(res.taskType);
      //  this.demand.next(res.demand);
      this.isTestConsoleLog(res)
      this.addHistoryList(res?.taskType, res.responseMessage, true);
      this.time.next(0);
      this.isRunGetIdleNotify.next(false);
    });
  }
  //新增對話-結束提醒(第一階段提醒)[300s]
  getEndChatNotify() {
    this.getSessionStorage();
    this.isTestConsoleLog(this.sessionNo + '結束提醒(第一階段提醒)[300s]')
    this.mainService.getEndChatNotifyV2(this.sessionNo).subscribe((res: Wellcomeres) => {
      // this.demand.next(res.demand);
      this.taskType$.next(res.taskType);
      this.addHistoryList(res?.taskType, res.responseMessage, true);
    });
  }
  //新增對話-結束提醒(第二階段提醒)[300s後過60s]
  showNotify() {
    this.isTestConsoleLog(this.sessionNo + '結束提醒(第二階段提醒)[300s後過60s]')
    let btnElement = <HTMLButtonElement>document.getElementById('theButton');
    btnElement.disabled = true;
    this.getSessionStorage();
    let data = {
      sessionNo: this.sessionNo,
      fullfillType: 4
    }
    this.mainService.setChatFulfill(data).subscribe(error => { this.isTestConsoleLog(Response) });
    this.isNotify.next(true);
    this.showLoginModal.next(false);
    // this.CustomerService.isMessage.next(false);
    this.rootSet.style.setProperty('--closeNotify', 'block');//第二階段結束提醒顯示
    this.rootSet.style.setProperty('--isMask', 'block');
    this.rootSet.style.setProperty('--isTDitem', 'none');//第二階段結束提醒不給他按第三方登入
    this.rootSet.style.setProperty('--isOpenChat', 'hidden');
    sessionStorage.clear();
  }
  getChatFulfill(num: number) {
    this.getSessionStorage();
    let data = {
      sessionNo: this.sessionNo,
      fullfillType: num
    }
    this.mainService.setChatFulfill(data).subscribe(res => {
    }, error => { this.isTestConsoleLog(Response) });
  }
  clearMemberInfo() { //isAuth登出使歷史紀錄不顯示
    const memberInfo: MemberInfo = {
      isAuth: null,
      token: null,
      userInfo: null
    }
    this.memberInfo.next(memberInfo);
  }
  isTestConsoleLog(test: any) {
    if (this.mainUrl.appConsoleLog) return console.log(test);
  }
}





