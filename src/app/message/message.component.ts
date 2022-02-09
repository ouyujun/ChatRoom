import { Component, OnInit, HostListener, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { Observable } from 'rxjs';
// import { ActivatedRoute, Router } from '@angular/router';
/*---*/
import { ChatbotService } from '../service/chatbot.service';
import { ConfigLoaderService } from '../service/config-loder.service'; //Main.Url(API URL、IMG URL)
import { SharevarService } from '../service/sharevar.service';
import { HistoryService } from '../service/history.service';
import { CustomerService } from '../service/customer.service';
/*---*/
import { sendQuestionToBot, getClickPost, getFaqBtnList } from './message-models';
import { BotMainData, VisitorInfo } from '../models/sendquestiontobot';
import { addMessages, Wellcomeresponse, WellcomechatContents, Wellcomeres, chatFragment } from '../models/wellcomemodels';
import { feedback, fAQAnswer, EmailAnswer, ButtonModuleAnswer, QuestionModuleAnswer, PictureModuleAnswer, recordChatFufill } from '../models/messagemodels';
// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation } from "swiper";
SwiperCore.use([Pagination, Navigation]);
//時間工具庫 方便時間格式化
import * as moment from 'moment';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent implements OnInit {
  /*尚未整理到的參數 */
  rootSet = document.querySelector<HTMLElement>(':root'); //css Style Root
  nowTime = moment(Date.now()).format('HH:mm A');//顯示對話時間
  timeInMs = Date.now();
  /*SharevarService取得值*/
  messageList$: Observable<addMessages[]> = this.SharevarService.messageMain$; // messageList$: Observable< messageAllTest[]> = this.TestService.messageMain$;
  historyList$: Observable<chatFragment[]> = this.HistoryService.historyMain$; // messageList$: Observable< messageAllTest[]> = this.TestService.messageMain$;
  /*SessionStorage*/
  // membertoken = JSON.parse(sessionStorage.getItem("VisitorInfo-key"));//get sessionstorage
  /*錯誤內容*/
  errorMessage = 'errorMessage'; //If Function feedback is Error then show errorMessage
  //import models
  keywordtext: string = '';
  imageUrl: string = this.mainUrl.appImg; //Image server front URL
  @ViewChild('scrollMe') comment: ElementRef;
  @ViewChild('myText') input: ElementRef;
  scrolltop: number = 0;
  isSpinning: boolean;
  isVipCs: boolean;
  //Add New message
  keyword: string = ""; //Enter the textbox
  faqid: number = 0; //Enter the textbox
  showTimes: string;
  //
  loadhistory: string = "";
  isTotalWait: number = null;
  actionCode: number = null;
  isAuth: boolean = false;
  taskType: string = "";
  //Send back message // feedback: feedback;
  faqBtnList: getFaqBtnList[];
  content: addMessages[] = [];
  timeout = null; // default set
  constructor(
    private LayoutComponent: LayoutComponent,
    private mainService: ChatbotService,
    private SharevarService: SharevarService,
    private HistoryService: HistoryService,
    private CustomerService: CustomerService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private mainUrl: ConfigLoaderService,
  ) { }
  ngOnInit(): void {
    this.getSharevar();
    this.addScorllBar();
    this.getTPData();
    this.getChatboticon();
    this.MessageMainDom(); //監聽
    this.SharevarService.getTestWellcome();
    this.SharevarService.setUserInfo();
    this.HistoryService.setHistoryDate(); //重置歷史紀錄日期
    this.onMenuSwitch(); //開關
  }
ngAfterContentInit(): void {
 setTimeout(() => {
   this.input.nativeElement.focus()
 }, 100);
  
}
  //觀察參數SharevarService
  getSharevar() {
    this.SharevarService.isSpinning.subscribe(res => {
      this.isSpinning = res;
    }, error => { this.SharevarService.isTestConsoleLog("error getSharevar isSpinning")})
    this.SharevarService.isVip.subscribe(res => {
      this.isVipCs = res;
    }, error => { this.SharevarService.isTestConsoleLog("error getSharevar isVipCs")})
    this.SharevarService.isNotify.subscribe(res => {
      this.isNotify = res;
    }, error => { this.SharevarService.isTestConsoleLog("error getSharevar isNotify")})
    //loadhistory歷史紀錄
    this.HistoryService.onload$.subscribe(res => {
      this.loadhistory = res;
    }, error => { this.SharevarService.isTestConsoleLog("error getSharevar loadhistory")})
    this.CustomerService.isTotalWait$.subscribe(res => {
      this.isTotalWait = res;
    }, error => { this.SharevarService.isTestConsoleLog("error CustomerService") })
    //是否登入控制
    this.SharevarService.memberInfo$.subscribe(res => {
      if (res) this.isAuth = res.isAuth;
    }, error => { this.SharevarService.isTestConsoleLog("error getSharevar") });
    //取得TaskType
    this.SharevarService.taskType$.subscribe(res => {
      this.taskType = res;
    }, error => { this.SharevarService.isTestConsoleLog("error getSharevar") })
  }

  //對話紀錄有變化，scroll調整。
  addScorllBar() {
    this.messageList$.subscribe(res => {
      setTimeout(() => {
        this.scrolltop = this.comment.nativeElement.scrollHeight;
      }, 100)
    }, error => { this.SharevarService.isTestConsoleLog("error getSharevar") })
  }
  //
  onMenuSwitch() {
    let mask = document.getElementById('mask');
    let input = document.getElementById('input');
    mask.addEventListener('click', (event) => {
      if (this.isMenuOn) this.doMenuSwitch();
    }, false);
    input.addEventListener('click', (event) => {
      if (this.isMenuOn) this.doMenuSwitch();
    }, false);
  }
  isActionTime: boolean = false;
  @HostListener('scroll', ['$event']) onElementScroll($event: any) {
    let modal = this.elementRef.nativeElement.querySelector('.chatMessageBody');
    let readPrivacy = modal.scrollHeight - modal.scrollTop === modal.clientHeight;
    if (!readPrivacy) {
      this.SharevarService.time.next(1);
    }
  }
  //
  clearTimerandSetup(isSetup) {
    this.SharevarService.isTestConsoleLog(isSetup)
    this.SharevarService.time.next(1);
    this.SharevarService.isSetup.next(isSetup);
  }
  clearTimer() {
    this.SharevarService.time.next(1);
  }
  /*===================================基礎對話設定===================================*/
  //
  doSend() {
    this.keyword = this.keyword.replace(/\s/g, "")
    if (this.keyword !== "") {
      if (this.keyword.length > 0) {
        let getBack: any[] = [];
        let chatContents = new WellcomechatContents();
        chatContents.text = this.keyword;
        let content = new Wellcomeresponse();
        content.kind = "Text";
        content.demand = this.keyword;
        content.chatContents.push(chatContents)
        getBack.push(content);
        this.storeData('', getBack, false);
        clearTimeout(this.timeout);
        this.fetchMessage();
        this.clearTimerandSetup(true);
      }
    }
  }

  fetchMessage() {
    this.keywordtext += this.keyword;
    this.keyword = '';
    //Save user input to sendbot.message
    //-------------------------------------------
    this.setVisitorInfo();
    this.timeout = setTimeout(() => {
      let sendbot: sendQuestionToBot = {
        message: this.keywordtext,
        user: 'System',
        memberKey: this.memberKey, //save sessionstorage tosenbot.memberkey
        sessionNo: this.sessionNo,//save sessionstorage tosenbot.sessionNo
        faqId: this.faqid
      };
      this.keywordtext = '';
      this.faqid = 0;
      //以下models帶入變數會進到fetchMessage()接API
      this.mainService.sendQuestionToBot(sendbot).subscribe((Message: feedback) => {
        //RETURN FEEDBACK
        let content: Wellcomeresponse[] = [];
        Message.responseMessage.forEach((feedbackMQ: Wellcomeresponse) => {
          content.push(feedbackMQ);
        });
        this.storeData(Message.taskType, content, true);
        if (Message.guideButtons) {
          this.rootSet.style.setProperty('--isFAQBtn', 'block');
          this.faqBtnList = Message.guideButtons;
          // this.SharevarService.isTestConsoleLog( Message.guideButtons)
        }
      }, error => this.errorMessage = error);
    }, 1000);
  }
  storeData(taskType: string, data: any, type: boolean) {
    this.SharevarService.addHistoryList(taskType, data, type)
    if (type) {
      //這邊如果是True就是bot回答
      this.clearTimerandSetup(false);
      return
    } else if (!type) {
      this.clearTimerandSetup(true);
      return
    }
    this.faqBtnList = [];
  }
  /*==============================類別為：按鈕模組、主動提問==============================*/
  runKindBtn(item: WellcomechatContents, data: Wellcomeresponse) {
    if (/S3/.test(item.actionCode)) {//由主動提問轉真人客服
      this.SharevarService.stopSetUpTime();
      this.CustomerService.isLoginAsnwer("轉真人客服", "S3")
      return
    }
    switch (item.actionCode) {
      case "1_S1&S2":
        //結束對話提醒-點選"呼叫小帮手" API:reconnection、getBotWellcomeInfoV2
        this.postNewSessionNoAndChatFufill(item.replyName, item.moduleId, 2, data);
        break;
      case "1_S1":
        //結束對話提醒-點選Yes後,呼叫API 完成對話/api/Chatbot/setChatFulfill
        this.postCloseWindows(item.replyName, item.moduleId, 2, data)//2. 閒置提醒選擇結束
        break;
      case "2_S1":
        //結束對話提醒-點選Yes後,呼叫API 完成對話/api/Chatbot/setChatFulfill
        this.postCloseWindows(item.replyName, item.moduleId, 3, data) //3. 結束提醒選擇結束
        break;
      case "S4":
        //真人客服流程-點選"我要留言" 顯示留言紀錄
        this.SharevarService.stopSetUpTime();
        this.CustomerService.isMessage.next(true);
        this.rootSet.style.setProperty('--isMask', 'block');
        break;
      default:
        if (data.kind === "Question") {
          this.setVisitorInfo(); //取得新的session
          // this.getTaskType(); //取得上一個對話TaskType
          let recordQuestion: QuestionModuleAnswer = {
            memberKey: this.memberKey,//save sessionstorage tosenbot.memberkey
            sessionNo: this.sessionNo,//save sessionstorage tosenbot.sessionNo
            demand: data.demand,
            replyName: item.replyName,
            setUrl: item.setUrl,
            setReply: item.setReply,
            setDemand: item.setDemand,
            setAPI: item.setAPI,
            setLinkModuleId: item.setLinkModuleId,
            taskType: this.taskType,
          }
          this.mainService.getQuestionModuleAnswer(recordQuestion).subscribe((res: feedback) => {
            this.runActive(item.replyName); //客戶假回覆
            if (res.responseMessage[0].kind === "WebUrl") {
              //this.SharevarService.isTestConsoleLog(res.responseMessage[0])
              if (!item.setUrl) {
                // this.router.navigate(['error404'])
                window.open('https://www.boxtradex.com/');
                this.SharevarService.setupTime(1);
                this.SharevarService.isSetup.next(false);
                this.SharevarService.isSpinning.next(false);
              } else {
                window.open(item.setUrl);
                this.SharevarService.isSpinning.next(false);
                this.clearTimerandSetup(false)
              }
            } else {
              setTimeout(() => { this.storeData(res.taskType, res.responseMessage, true); }, 1000)
              this.clearTimerandSetup(false)
            }
          });
          return
        } else if (data.kind === "Button") {
          this.setVisitorInfo();
          // this.getTaskType();
          let recordButton: ButtonModuleAnswer = {
            kindId: item.kindId,
            sessionNo: this.sessionNo,//save sessionstorage tosenbot.sessionNo
            memberKey: this.memberKey,//save sessionstorage tosenbot.memberkey
            setReply: item.setReply,
            setDemand: item.setDemand,
            linkButtonId: item.linkButtonId,
            setLinkModuleId: item.setLinkModuleId,
            pictureUrl: item.pictureUrl,
            setUrl: item.setUrl,
            setAPI: item.setAPI,
            taskType: this.taskType,
            text: item.text,
          }
          this.mainService.getButtonModuleAnswer(recordButton).subscribe((res: feedback) => {
            this.runActive(item.text); //客戶假回覆
            setTimeout(() => {
              if (res.responseMessage.length > 0) {
                this.storeData(res.taskType, res.responseMessage, true);
                return
              } else {
                this.SharevarService.isSpinning.next(false);
              }
            }, 1000)
          });
          return
        }
        break;
    }
  }
  runActive(reply) { //文字
    if (reply.length > 0) {
      let getGo: any[] = [];
      let chatContents = new WellcomechatContents();
      chatContents.text = reply;
      let content = new Wellcomeresponse();
      content.kind = "Text";
      content.demand = reply;
      content.chatContents.push(chatContents)
      getGo.push(content);
      // this.getTaskType();
      this.storeData(this.taskType, getGo, false)
    }
  }
  /*==============================回傳文字與獲得回答(setReply)==============================*/
  feedbackAndSend(item: any) {
    //回傳text
    let getBotBack: any[] = [];
    let getUserBack: any[] = [];
    let BotContents = new WellcomechatContents();
    BotContents.text = item.setReply;
    let UserContents = new WellcomechatContents();
    UserContents.text = item.replyName;
    let Bot = new Wellcomeresponse();
    Bot.kind = "Text";
    Bot.demand = item.setReply;
    Bot.chatContents.push(BotContents)
    let User = new Wellcomeresponse();
    User.kind = "Text";
    User.demand = item.replyName;
    User.chatContents.push(UserContents)
    getBotBack.push(Bot);
    getUserBack.push(User);
    // this.getTaskType();
    this.storeData(this.taskType, getUserBack, false)
    setTimeout(() => { this.storeData(this.taskType, getBotBack, true) }, 1000)
  }
  //===================================Kind=QUESTION或BUTTON-[閒置提醒&結束提醒]=============================
  postNewSessionNoAndChatFufill(replyName: string, moduleId: number, fullfillType: number, data: Wellcomeresponse) {
    //呼叫小幫手，結束對話-建立新對話。
    this.SharevarService.stopSetUpTime();
    this.setVisitorInfo();
    this.SharevarService.taskType$.next(data.taskType);
    let ChatFufillWithRecord: recordChatFufill = {
      sessionNo: this.sessionNo,
      memberKey: this.memberKey,
      demand: data.demand,
      replyName: replyName,
      moduleId: moduleId,
      fullfillType: fullfillType, //卡片79 callfullfill這邊應 @FulfillType應該=2 (2022/01/03前是3)
      taskType: data.taskType
    }
    this.mainService.reconnection(ChatFufillWithRecord).subscribe((res: number) => { //api/Chatbot/reconnection 完成對話(包含記錄對話)
      let Storage: VisitorInfo = {
        sessionNo: res,
        memberKey: this.memberKey,
        askerId: this.askerId
      }
      this.setSessionStorage(Storage);
    }, error => this.errorMessage = error);

  }
  //SetUrl-結束對話
  postCloseWindows(replyName: string, moduleId: number, fullfillType: number, data: Wellcomeresponse) { //api/Chatbot/setChatFulfillWithRecords完成對話(包含記錄對話)
    this.setVisitorInfo();
    // this.getTaskType();
    let godata = {
      sessionNo: this.sessionNo,
      memberKey: this.memberKey,
      demand: data.demand,
      replyName: replyName,
      moduleId: moduleId,
      fullfillType: fullfillType, //卡片79 callfullfill這邊應 @FulfillType應該=2 (2022/01/03前是3) 
      taskType: this.taskType
    }
    //2021/11/3討論第一階段要做紀錄
    this.mainService.setChatFulfillWithRecord(godata).subscribe(error => this.errorMessage = error);
    this.SharevarService.isNotify.next(false);
    this.SharevarService.cancelList();
    this.LayoutComponent.forHandleCancel();
    this.SharevarService.stopSetUpTime();
  }
  //SetUrl-給予新的Session
  setSessionStorage(data: VisitorInfo) {
    sessionStorage.setItem("VisitorInfo-key", JSON.stringify(data));
    this.SharevarService.getTestWellcome();
    this.SharevarService.stopSetUpTime();
    this.SharevarService.setupTime(1);
    this.SharevarService.isSetup.next(false);
  }

  /*=======================監聽FAQ事件=============================*/
  public removeEventListener: () => void;

  //如果超連結按下後id=faq
  public handleAnchorClick(event: Event) {
    // Prevent opening anchors the default way
    event.preventDefault();
    const anchor = event.target as HTMLAnchorElement;
    this.keyword = anchor.textContent;
    this.faqid = parseInt(anchor.getAttribute('value'));
    this.doSend();
  }
  //如果按鈕按下後id=click
  public handleButtonClick(event: Event) {
    event.preventDefault();
    const btn = event.target as HTMLButtonElement;
    this.setVisitorInfo();
    // this.getTaskType();
    let Clickdata: getClickPost = {
      chatClickTypeId: 2,//FAQ-Click
      clickId: parseInt(btn.getAttribute('value')),
      clickSourdId: 0,//linkbtn
      sessionNo: this.sessionNo,
      memberKey: this.memberKey,
      demand: btn.textContent,
      taskType: this.taskType,
    }
    // this.SharevarService.isTestConsoleLog(Clickdata)
    this.mainService.getClickAnswer(Clickdata).subscribe((res: Wellcomeres) => {
      // this.SharevarService.isTestConsoleLog(res)
      res.responseMessage.forEach((message: Wellcomeresponse) => {
        message.chatContents.forEach((chatContents: WellcomechatContents) => {
          if (chatContents.setUrl) {
            window.open(chatContents.setUrl, '_blank')
            return
          } else {
            window.open('https://www.boxtradex.com/');
          }
        });
      });

    })
  }
  //監聽
  MessageMainDom() {
    this.removeEventListener = this.renderer.listen(this.elementRef.nativeElement, 'click', (event) => {
      //超連結
      if (!this.isNotify) {
        if (event.target instanceof HTMLAnchorElement) {
          // Your custom anchor click event handler
          switch (event.target.id) {
            case "faq_" + event.target.attributes.value.nodeValue:
              this.handleAnchorClick(event);
              this.faqBtnList = [];
              break;
            case "csUser_" + event.target.attributes.value.nodeValue:
              this.SharevarService.stopSetUpTime();
              this.CustomerService.isLoginAsnwer(event.target.innerText, null)
              break;
            case "email_" + event.target.attributes.value.nodeValue:
              this.setVisitorInfo();
              let EmailAnswer: EmailAnswer = {
                memberKey: this.memberKey, //save sessionstorage tosenbot.memberkey
                sessionNo: this.sessionNo,//save sessionstorage tosenbot.sessionNo
                demand: event.target.innerText,
                email: event.target.innerText,
                taskType: this.taskType,
              };
              this.mainService.getEmailAnswer(EmailAnswer).subscribe(res => {
              }, error => { this.SharevarService.isTestConsoleLog("建立失敗") })
              break;
            case "faq_" + event.target.attributes.value.nodeValue:
              break;
          }
        }
        //按鈕
        if (event.target instanceof HTMLButtonElement) {
          // Your custom anchor click event handler
          if (event.target.id == "click_" + event.target.attributes.value?.nodeValue) this.handleButtonClick(event);
        }
        return
      } else {
        if (event.target instanceof HTMLAnchorElement || event.target instanceof HTMLButtonElement) alert('請重新連線對話。');
      }
    });
  }
  onWaitNumber() {
    this.CustomerService.doResTypeFour();
  }
  /*====================基礎設定================================*/
  //第三方設定
  ThirdParty: any = [];
  //取得最新的sessionStorage
  sessionNo: number;
  memberKey: number;
  askerId: number;
  //取得機器人資訊 Robot info
  botInfoColor: any;
  faqBtnstyle: any;
  botInfo: BotMainData;

  getTPData(): void {
    this.mainService.getTPList().subscribe(res => {
      this.ThirdParty = res;
      this.imageUrl = `${this.imageUrl}`
    });
  }

  setVisitorInfo() {
    let storage = JSON.parse(sessionStorage.getItem("VisitorInfo-key"))
    this.sessionNo = storage.sessionNo;
    this.memberKey = storage.memberKey;
    this.askerId = storage.askerId;
  }

  getChatboticon() {
    this.mainService.getChatBotIcon().subscribe((res: BotMainData) => {
      this.botInfo = res;
      this.imageUrl = `${this.imageUrl}`
      this.faqBtnstyle = {
        border: 0.75 + 'px' + 'solid',
        borderColor: this.botInfo.colorUrl,
      }
    });
  }
  //ENTER KEYWORD
  @HostListener('window:keyup', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if ($event.key === 'Enter') {
      this.doSend();
    }
  }

  //需轉換新增至History
  /*===================================區塊設定===================================*/
  //讀取要不要顯示提醒
  isNotify: boolean = false;/*第二階段結束提醒區塊開關*/
  isPlace: number = 0;
  onImportHistory() { //歷史紀錄區塊
    const scroll = this.comment.nativeElement.scrollHeight;
    this.HistoryService.getHistoryDate("載入");
    // this.SharevarService.isTestConsoleLog(scroll)
    setTimeout(() => {
      const nowScroll = this.comment.nativeElement.scrollHeight
      this.scrolltop = nowScroll - scroll;
      // this.SharevarService.isTestConsoleLog(this.scrolltop)
    }, 300)
  }

  onFaqBtn(btns: getFaqBtnList) {
    this.setVisitorInfo();
    this.SharevarService.isTestConsoleLog(this.taskType)
    let data: fAQAnswer = {
      id: btns.id,
      buttonId: btns.buttonId,
      buttonName: btns.buttonName,
      sessionNo: this.sessionNo,
      memberKey: this.memberKey,
      taskType: this.taskType,
    }
    this.runActive(btns.buttonName);
    this.mainService.getGuideButtonAnswer(data).subscribe((res: feedback) => {
      this.storeData(res.taskType, res.responseMessage, true)
      if (res.guideButtons) {
        this.rootSet.style.setProperty('--isFAQBtn', 'block');
        this.faqBtnList = res.guideButtons;
      }
    })
  }
  onPicture(info: any) { //按下圖片
    // this.SharevarService.isTestConsoleLog(info)
    this.setVisitorInfo();
    // this.getTaskType();
    this.SharevarService.time.next(1)
    if (!info.setUrl) {
      window.open('https://www.boxtradex.com/');
      // this.router.navigate(['/error404']);
      this.input.nativeElement.focus();
      return
    } else {
      window.open(info.setUrl);
    }
    let data: PictureModuleAnswer = {
      sessionNo: this.sessionNo,
      kindId: info.kindId,
      setLinkModuleId: info.setLinkModuleId,
      linkButtonId: info.linkButtonId,
    }
    // this.SharevarService.isTestConsoleLog(info)
    this.mainService.getPictureModuleAnswer(data).subscribe(res => {
    })
  }
  isMenuOn: boolean = false;/*Menu區塊開關*/
  isInput: boolean = false;
  //區塊動畫
  doMenuSwitch() {
    this.isMenuOn = !this.isMenuOn;
    let sixpalaces = '176px';
    if (this.isMenuOn) {
      this.rootSet.style.setProperty('--loginmenuH', sixpalaces);
      this.SharevarService.stopSetUpTime();
      setTimeout(() => {
        this.rootSet.style.setProperty('--isMask', 'block');
      }, 500);
      return
    } else {
      this.rootSet.style.setProperty('--loginmenuH', '0px');
      setTimeout(() => {
        this.SharevarService.setupTime(1);
        this.rootSet.style.setProperty('--isMask', 'none');
      }, 500);
    }
  }
  dologinSwitch() {
    this.isMenuOn = !this.isMenuOn;
    let itemheight = '176px';
    if (this.isMenuOn) {
      this.rootSet.style.setProperty('--itemH', itemheight);
      return
    } else {
      this.rootSet.style.setProperty('--itemH', '0px');
    }
  }
  /*==VIP真人客服==*/
  onClickCsVIP() {
    this.SharevarService.stopSetUpTime();
    // this.SharevarService.isTestConsoleLog("轉真人客服")
    this.CustomerService.isLoginAsnwer("轉真人客服", null)
  }


  /*===================================區塊設定CSS===================================*/
  sixpalaces: any = {
    position: 'absolute',
    top: 60 + '%',
    zIndex: 99,
    width: 100 + '%',
    transform: 'scaleY(0)',
  }
  test(data: any) {
  }
  switchBtn = {
    display: 'block',
  }

}

