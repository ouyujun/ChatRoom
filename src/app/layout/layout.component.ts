import { AfterContentInit, Component, HostListener, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigLoaderService } from '../service/config-loder.service'; //Main.Url(API URL、IMG URL)
import { ChatbotService } from '../service/chatbot.service';
import { SharevarService } from '../service/sharevar.service';
import { HistoryService } from '../service/history.service';
import { CustomerService } from '../service/customer.service';
import { VisitorInfo, BotMainData } from '../models/sendquestiontobot';
import { CategoryOptions, creatMessage } from '../models/customer.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberInfo } from '../models/memberInfo';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterContentInit {
  rootSet = document.querySelector<HTMLElement>(':root'); //css Style Root
  imageUrl = this.mainUrl.appImg; //Image server front URL
  title = 'Project-Chatbot';//The name of this project
  isVisible = false; //Bounce window settings
  btnVisible: boolean = true;
  showLogin: boolean = false;
  loginForm: FormGroup; //登入
  sendMsgForm: FormGroup; //留言紀錄
  loginFormError: string;
  sendMsgFormError: string;
  // memberInfo: MemberInfo;
  isAuth: boolean = false;
  isAskAwait: boolean = false;
  //顯示留言
  isMessage: boolean;
  //API
  data: BotMainData;
  //session Info
  sessionNo: number = null;
  memberKey: number = null;
  askerId: number = null;
  //圖片資訊
  ThirdParty: any = [];
  //login的選單
  isLoginMenu: boolean = true;
  //等候人數
  isTotalWait: number = null;
  //判斷真人狀態
  isResType: number = null;
  //視窗顯示文字
  isWindowsMain:string=null;
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private mainService: ChatbotService, //API
    private mainUrl: ConfigLoaderService, //Config
    private HistoryService: HistoryService, //歷史紀錄
    private SharevarService: SharevarService, //對話 & 其他參數
    private CustomerService: CustomerService, //客服
  ) { }

  ngOnInit(): void {
    sessionStorage.clear();
    localStorage.clear();
    this.getTPData();
    this.SharevarService.isNotify.next(false);
    this.rootSet.style.setProperty('--closeNotify', 'none');
    this.iframe['contentDocument'].body.style.background = 'none';
    this.getOption();
    this.getMemberInfo();
    this.getShowObeject();
    this.SharevarService.getNotifyTimes();//獲取提醒時間
    // this.aaa();
  }
  @HostListener('window:keyup.enter', ['$event'])
  ngAfterContentInit(): void {
    this.getAllData();
  }
  /* ------------------------載入資訊------------------------ */
  //隱藏、顯示物件，RXJS
  getShowObeject() {
    //留言視窗
    this.CustomerService.isMessage.subscribe(res => {
      this.isMessage = res;
      this.messageFrom();
    }, error => { this.SharevarService.isTestConsoleLog("失敗") })
    //詢問等待
    this.CustomerService.isAskAwait$.subscribe(res => {
      this.isAskAwait = res;
    }, error => { this.SharevarService.isTestConsoleLog("失敗") })
    //登入
    this.SharevarService.showLoginModal$.subscribe(res => {
      this.showLogin = res;
      if (this.showLogin) this.validateLoginForm();
    }, error => { this.SharevarService.isTestConsoleLog("失敗") })
    //詢問等待-排隊人數
    this.CustomerService.isTotalWait$.subscribe(res => {
      this.isTotalWait = res;
    }, error => { this.SharevarService.isTestConsoleLog("失敗") })
    this.CustomerService.resType$.subscribe(res => {
      this.isResType = res;
    }, error => { this.SharevarService.isTestConsoleLog("失敗") })
    this.CustomerService.isWindowsMain$.subscribe(res=>{
      this.isWindowsMain=res;
    }, error => { this.SharevarService.isTestConsoleLog("失敗") })
  }

  //留言視窗-內容
  messageFrom() {
    this.sendMsgForm = this.formBuilder.group({
      select: [null, [Validators.required]],
      comment: [null, [Validators.required]],
    });
  }
  //登入第三方圖片資訊
  getTPData(): void {
    this.mainService.getTPList().subscribe(res => {
      this.ThirdParty = res;
      this.imageUrl = `${this.imageUrl}`;
    }, error => { this.SharevarService.isTestConsoleLog("失敗") });
  }
  //登入判斷隱藏、顯示物件
  getMemberInfo() {
    this.SharevarService.memberInfo$.subscribe(res => {
      if (res) this.isAuth = res.isAuth; //登入
    }, error => { this.SharevarService.isTestConsoleLog("失敗") });
  }
  //From表單判斷(ngzorro)
  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }
  //From表單判斷(ngzorro)
  validateLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.min(6)]]
    });
  }
  //取的全部資訊
  getAllData(): void {
    this.mainService.getMainData().subscribe((res: BotMainData) => {
      this.data = res;
      var xcolor = res.colorUrl + 'A0';
      var allcolor = res.colorUrl + '0f';
      this.rootSet.style.setProperty('--blue', res.colorUrl);
      this.rootSet.style.setProperty('--Gradient', xcolor);
      this.rootSet.style.setProperty('--background', allcolor);
      this.imageUrl = `${this.imageUrl}`
    });
  }
  /* ------------------------Function------------------------ */
  iframe = window.frameElement;
  //打開聊天室
  showModal(): void {
    this.isVisible = true;
    this.btnVisible = false;
    this.rootSet.style.setProperty('--isOpenChat', 'hidden');
    this.iframe['style'].width = window.outerWidth + 'px';
    this.iframe['style'].height = '90%';
    // this.iframe['style'].bottom = '20%';
    if (window.outerWidth > 420) this.iframe['style'].width = '420px';
    if (window.outerHeight < 600) this.iframe['style'].top = '2%';
    if (window.outerWidth < 300) this.iframe['style'].width = '275px';
  }
  //結束對話-YES
  forHandleCancel(): void {
    this.isVisible = false;
    this.SharevarService.cancelList();
    this.SharevarService.stopSetUpTime();
    this.SharevarService.isNotify.next(false);
    setTimeout(() => {
      this.iframe['style'].width = '90px';
      this.iframe['style'].height = '90px';
      // this.iframe['style'].top = 'auto';
      this.rootSet.style.setProperty('--isOpenChat', 'visible');
    }, 250)
  }
  //放大視窗
  onFullscreen() {
    window.open('http://192.168.230.203/#/webcontent')
  }

  //關閉全部聊天室
  handleCancelAll(): void {
    this.setVisitorInfo();
    if (sessionStorage.getItem("VisitorInfo-key")) {
      this.SharevarService.getChatFulfill(1);
      sessionStorage.clear();
      this.SharevarService.isNotify.next(false);
    }
    this.closeNotify = false;
    this.handleCancel();
  }
  //基本關閉
  handleCancel(): void {
    sessionStorage.clear();
    localStorage.clear();
    this.isAuth = false;
    this.SharevarService.memberInfo.next(null);
    this.btnVisible !== this.btnVisible;
    this.HistoryService.startDate
    this.rootSet.style.setProperty('--closeNotify', 'none');
    this.rootSet.style.setProperty('--isMask', 'none');
    this.HistoryService.clearHistory();
    this.forHandleCancel();//這段與關閉聊天室重複
  }

  /* ------------------------視窗按鈕function------------------------ */
  //結束提醒提示-取消
  closeAll() {
    this.SharevarService.cancelList();
    this.handleCancel();
    this.SharevarService.isNotify.next(false);
  }
  //結束提醒提示-重新連線
  anewMessages() {
    sessionStorage.clear();
    localStorage.clear();
    this.isAuth = false;
    this.SharevarService.clearMemberInfo();
    this.getMemberInfo();
    this.SharevarService.memberInfo.next(null);
    this.HistoryService.clearHistory(); //重置歷史紀錄
    this.SharevarService.isNotify.next(false);
    this.SharevarService.cancelList();
    this.SharevarService.stopSetUpTime();
    this.SharevarService.getTestWellcome();
    this.rootSet.style.setProperty('--isTDitem', 'block');
    this.rootSet.style.setProperty('--closeNotify', 'none');
    this.rootSet.style.setProperty('--isMask', 'none');
    this.mainService.getVisitorInfo().subscribe((res: VisitorInfo) => {
      this.SharevarService.storeVisitorInfo()
      this.SharevarService.setupTime(1)
      this.SharevarService.isSetup.next(false)
    });
    this.SharevarService.isVip.next(false)
  }
  //等候提醒-繼續等候、(無真人可用回覆)
  onContinueWaitTeam(restype:number) {
   if(restype==2)this.CustomerService.getStateReply(restype);
    if(this.isAskAwait){
      this.CustomerService.isAskAwait$.next(false);
      this.rootSet.style.setProperty('--isMask', 'none');
      this.SharevarService.setupTime(1);//繼續閒置提醒
    }
  }
  //等候提醒-離開
  onLeaveWaitTeam() {
    this.setVisitorInfo();
    let data = {
      sessionNo: this.sessionNo,
    };
    this.mainService.cancelRealTimeQueue(data).subscribe(res => {
      this.SharevarService.setupTime(1);//繼續閒置提醒
      this.CustomerService.isAskAwait$.next(false);
      this.rootSet.style.setProperty('--isMask', 'none');
      this.CustomerService.stopUpdate();
      this.CustomerService.getStateReply(1);
      this.SharevarService.isTestConsoleLog(res)
    }, error => { this.SharevarService.isTestConsoleLog("失敗") });
  }
  //API ChatRoom SET
  childRender() {
    this.router.navigate(['/main/main-child']);
  }
  //目前不知道這是幹嘛的
  handleOk(): void {
    setTimeout(() => {
      this.isVisible = false;
    }, 1000);
  }

  //取得sessionStorage
  setVisitorInfo() {
    if (sessionStorage.getItem("VisitorInfo-key")) {
      var storage = JSON.parse(sessionStorage.getItem("VisitorInfo-key"))
      this.sessionNo = storage.sessionNo;
      this.memberKey = storage.memberKey;
      this.askerId = storage.askerId;
    }
  }

  FaqCategoryOptions: CategoryOptions[];
  selectedValue: CategoryOptions;
  getOption() { //取得Faq類別選項
    this.mainService.getFaqCategoryOptions().subscribe((res: CategoryOptions[]) => {
      this.FaqCategoryOptions = res;
    }, error => { this.SharevarService.isTestConsoleLog("建立失敗") });
  }

  inputValue: string = "";
  get select() {
    return this.sendMsgForm.get('select');
  }
  get comment() {
    return this.sendMsgForm.get('comment');
  }
  //打開留言紀錄
  onClickSendMessag() {
    if (this.sendMsgForm.valid) {
      // this.SharevarService.isTestConsoleLog(this.sendMsgForm.valid)
      let data: creatMessage = {
        sessionNo: 0, //will將API調整為判斷token所以session帶0即可
        memberKey: 0, //will將API調整為判斷token所以memberKey帶0即可
        categoryFaqSettingId: this.sendMsgForm.value.select,
        text: this.sendMsgForm.value.comment,
      }
      this.CustomerService.onMemberMessage(data);
      this.CustomerService.isMessage.next(false);
      this.rootSet.style.setProperty('--isMask', 'none');
    } else {
      this.sendMsgForm.markAllAsTouched();
    }
  }
  //關閉留言紀錄
  onCloseMessage() {
    this.CustomerService.isMessage.next(false);
    this.rootSet.style.setProperty('--isMask', 'none');
    this.SharevarService.setupTime(1)
  }
  //打開登入視窗
  showMenuLoginModal() {
    this.SharevarService.stopSetUpTime();
    this.SharevarService.showLoginModal.next(true);
    this.rootSet.style.setProperty('--isMask', 'block');
  }
  //登入視窗-取消
  onCloseLogin() {
    // this.SharevarService.setupTime(1, false)
    for (const key in this.loginForm.controls) {
      this.loginForm.get(key).clearValidators();
      this.loginForm.get(key).updateValueAndValidity();
    }
    this.showLogin = false;
    this.rootSet.style.setProperty('--isMask', 'none');
    if (sessionStorage.getItem("VisitorInfo-key")) {
      this.SharevarService.setupTime(1)
    }
  }
  transduceMsg: string = "";
  //登入視窗-登入
  onLoginSubmit() {
    this.CustomerService.transduceMsg.subscribe((res: string) => {
      this.transduceMsg = res;//是否有帶留言的demand
    })
    if (this.showLogin) { //判斷有無開啟此登入視窗(為阻擋enter會一起執行)
      if (this.loginForm.valid) { //判斷form填寫完全
        if (!sessionStorage.getItem("VisitorInfo-key")) { //判斷是否有session(沒有的話取得新的)(有的話應該要是因為訪客轉登入)
          this.SharevarService.storeVisitorInfo();  //取得新的session資訊
        }
        setTimeout(() => { //因同步不會等subscribe，所以用時間等待解決此問題。
          this.setVisitorInfo(); //設定參數為最新的session
          // this.SharevarService.isTestConsoleLog(sessionStorage.getItem("VisitorInfo-key"));  
          this.mainService.memberLogin({ //登入
            sessionNo: this.sessionNo,
            askerId: this.askerId,
            username: this.loginForm.value.username,
            password: this.loginForm.value.password
          }).subscribe((res: MemberInfo) => {
            if (res.isAuth) {
              //如果登入成功
              this.HistoryService.clearHistory(); //重置歷史紀錄
              this.SharevarService.memberInfo.next(res);  //存memberinfo
              localStorage.setItem('memberToken', res.token); //存token
              sessionStorage.clear(); //清除session
              sessionStorage.setItem('userInfo', JSON.stringify(res.userInfo)); //存新的sessionStorage
              sessionStorage.setItem("VisitorInfo-key", JSON.stringify({ //存新的sessionStorage
                sessionNo: res.userInfo.sessionNo,
                memberKey: res.userInfo.memberKey,
                askerId: this.askerId
              }))
              this.HistoryService.getHistoryDate("登入")//登入確認有無歷史紀錄
              this.showLogin = false; //關閉畫面

              // this.SharevarService.isTestConsoleLog(res.isAuth)
              /* CSS設定 */
              this.rootSet.style.setProperty('--loadrecord', 'block');
              this.rootSet.style.setProperty('--isMask', 'none'); //關閉遮罩
              this.SharevarService.setUserInfo(); //VIP設定
              //開始計時
              this.SharevarService.setupTime(1);
              //如果從留言判斷轉過來
              if (this.transduceMsg) this.CustomerService.isLoginAsnwer(this.transduceMsg,null);
            }
            else {
              this.loginFormError = '帳號或密碼錯誤';
            }
          }, error => { this.SharevarService.isTestConsoleLog("登入錯誤") });
        }, 500)
      } else {
        this.loginForm.markAllAsTouched();
      }
    } else {
      this.SharevarService.isTestConsoleLog("關掉了")
    }
  }

  //開啟結束對話確認框
  closeNotify: boolean = false;
  onCloseChatRoom() {
    this.setVisitorInfo();
    if (sessionStorage.getItem("VisitorInfo-key")) {
      this.closeNotify = true;
      this.rootSet.style.setProperty('--isMask', 'block');
      this.SharevarService.stopSetUpTime();
    } else {
      this.handleCancelAll();
    }
  }
  //開啟結束對話確認框-取消
  onCancelCloseChatRoom() {
    this.closeNotify = false;
    this.rootSet.style.setProperty('--isMask', 'none');
    this.SharevarService.setupTime(1);
  }

  //對話紀錄
  chatFullfill(num: number) {
    this.setVisitorInfo();
    if (sessionStorage.getItem("VisitorInfo-key")) {
      this.SharevarService.getChatFulfill(num);
      this.SharevarService.isTestConsoleLog("我執行了getChatFulfill(" + num + ")")
      localStorage.clear();
    }
  }
  /*------------------------------------------------------------*/
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: any) {
    // this.SharevarService.isTestConsoleLog('a')
    if (sessionStorage.getItem("VisitorInfo-key")) {
      this.chatFullfill(9);
      event.preventDefault();
      event.returnValue = false;
    }
    return
  }

  @HostListener("window:unload", ["$event"])
  onUnloadHandler(event: any) {
    if (sessionStorage.getItem("VisitorInfo-key")) this.chatFullfill(9);
    return
  }

  /*------------------------------------------------------------*/
  public removeEventListener: () => void;
  aaa() {
    this.removeEventListener = this.renderer.listen(this.elementRef.nativeElement, 'click', (event) => {
      this.SharevarService.isTestConsoleLog("1111")
    });
  }
}
