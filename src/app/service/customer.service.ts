import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { ChatbotService } from '../service/chatbot.service';
import { SharevarService } from '../service/sharevar.service';
//--model
import { creatMessage, RealTimeQueueRes } from '../models/customer.model'
import { Wellcomeres, Wellcomeresponse, WellcomechatContents } from '../models/wellcomemodels';
//--moment
import * as moment from 'moment';

@Injectable()

export class CustomerService {
    //css Style Root
    rootSet = document.querySelector<HTMLElement>(':root');
    //存到token到header
    public isMessage = new BehaviorSubject<boolean>(false);
    public transduceMsg = new BehaviorSubject<string>(null);
    public isAskAwait$ = new BehaviorSubject<boolean>(false); //詢問等待視窗
    public isTotalWait$ = new BehaviorSubject<number>(null);//等待總人數
    public isWindowsMain$ = new BehaviorSubject<string>(null);//視窗顯示文字
    public resType$ = new BehaviorSubject<number>(null);//
    //取得sessionNo
    sessionNo: number = null;
    memberKey: number = null;
    token: string = "";
    //取得taskType
    taskType: string = "";
    //計時器
    time: number = 0;
    interval: any = {};
    //changeToRealTimeCustomerService轉真人客服須帶參數
    fromChat: number = 0;
    //等待排隊帶入取得的csUserId、chatTimetableId
    csUserId: number = null;
    chatTimetableId: number = null;
    constructor(
        private mainService: ChatbotService,
        private SharevarService: SharevarService,
    ) { }

    //取得其他資訊=============================================================
    getTaskType() {
        this.SharevarService.taskType$.subscribe(res => {
            this.taskType = res;
        })
    }
    getSessionInfo() {
        var storage = JSON.parse(sessionStorage.getItem("VisitorInfo-key"))
        this.sessionNo = storage.sessionNo;
        this.memberKey = storage.memberKey;
        var tokenStorage = localStorage.getItem("memberToken")
        this.token = tokenStorage;
    }
    //判斷登入流程=============================================================
    isLoginAsnwer(demand: string, actioncode: string) {
        this.getSessionInfo();
        if (this.token) {
            this.SharevarService.stopSetUpTime();
            this.switchCustomer(demand, actioncode)
            this.transduceMsg.next("");
        } else {
            this.SharevarService.stopSetUpTime();
            this.transduceMsg.next(demand);
            this.SharevarService.showLoginModal.next(true);
            this.rootSet.style.setProperty('--isMask', 'block');
        }
    }

    //判斷流程resType=============================================================
    switchCustomer(demand: string, actioncode: string) {
        this.getSessionInfo();
        if (actioncode === "S3") this.fromChat = 1;//由主動提問轉真人客服，目前為9_S3判斷fromChat帶1
        let memberInfo = {
            sessionNo: this.sessionNo,
            memberKey: this.memberKey,
            demand: demand, //需求
            fromChat: this.fromChat
        }
        this.mainService.changeToRealTimeCustomerService(memberInfo).subscribe((res: RealTimeQueueRes) => {
            if (res.enabledWait) this.isTotalWait$.next(res.enabledWait);
            if (res.resType) this.resType$.next(res.resType);
            switch (res.resType) {
                case 0: //無真人
                    // this.doNobody();
                    this.getStateReply(res.resType);
                    break;
                case 1: //留言訊息
                    this.isMessage.next(true);
                    this.rootSet.style.setProperty('--isMask', 'block');
                    break;
                case 2: //詢問等待
                    this.doAskWait(res.csUserId, res.chatTimetableId)
                    break;
                case 3: //開始連線
                    this.SharevarService.isTestConsoleLog("開始連線")
                    this.doStartConnect();
                    break;
                case 4: //詢問等待-2
                    if (!res.isLink) this.doResTypeFour();
                    else this.doResTypeFourtoConnect();
                    break;
                default:
                    this.SharevarService.isTestConsoleLog("No such res exists!");
                    break;

            }
            this.fromChat = 0;
        }, error => { console.log(Response) })
    }
    //轉真人客服流程-無真人在線上提醒
    //轉真人客服流程-取得回覆
    getStateReply(restype: number) {
        this.SharevarService.isTestConsoleLog(restype)
        this.getSessionInfo();
        let data = {
            sessionNo: this.sessionNo,
            resType: restype
        };
        this.mainService.getRealTimeWaitModuleMessage(data).subscribe((res: Wellcomeres) => {
            this.SharevarService.setupTime(1);
            this.SharevarService.isSetup.next(false);
            this.SharevarService.addHistoryList(res.taskType, res.responseMessage, true);
            if (restype === 2) this.setStartUpdate();
        }, error => { this.SharevarService.isTestConsoleLog("失敗") });
    }
    //轉真人客服流程-留言訊息(1)=============================================================
    onMemberMessage(message: creatMessage) {
        this.mainService.createMemberMessage(message).subscribe(res => {
            let chatSuccess = new WellcomechatContents;
            chatSuccess.text = "親愛的客戶您好!<br>留言已成功寄出，我們會盡快解決您的問題。(๑•̀ω•́)ノ";
            this.addChatModule("A", "Text", chatSuccess);//新增對話模組
        }, error => { this.SharevarService.isTestConsoleLog("建立失敗") })
    }
    //轉真人客服流程-詢問等待(2)=============================================================
    doAskWait(csUserId: number, chatTimetableId: number) {
        this.chatTimetableId = chatTimetableId;
        this.csUserId = csUserId;
        this.SharevarService.stopSetUpTime();
        //更新人數
        let Msg: string = "今日客服量較多，目前還有" + this.isTotalWait$.getValue() + "位等待中。客服妹子忙線後，會立即給您留訊息喔~感謝您，並請您留意。"
        this.isWindowsMain$.next(Msg);
        this.rootSet.style.setProperty('--isMask', 'block');
        this.isAskAwait$.next(true);
    }
    //轉真人客服流程-詢問等待(4)=============================================================
    doResTypeFour() {
        this.SharevarService.stopSetUpTime();
        let Msg: string = "目前已幫您安排，序位:" + this.isTotalWait$.getValue() + "。請您耐心等候，感謝。在等候過程中，您可以繼續和小幫手對話喔~";
        this.isWindowsMain$.next(Msg);
        this.resType$.next(4);
        this.rootSet.style.setProperty('--isMask', 'block');
        this.isAskAwait$.next(true);
    }
    doResTypeFourtoConnect() {
        this.getStateReply(3);//回覆類型 0: 無真人, 1: 取消排隊, 2: 等待排隊, 3:與客服對話中
    }
    //轉真人客服流程-開始連線(3)=============================================================
    doStartConnect() {
        // this.getStateReply(3);//回覆類型 0: 無真人, 1: 取消排隊, 2: 等待排隊, 3:與客服對話中
        let chatSuccess = new WellcomechatContents;
        chatSuccess.text = "轉真人了。✧*｡٩(ˊᗜˋ*)و✧*｡<br><br>這段是連線客服的狀態，不知道會接什麼樣的回覆，敬請期待!";
        this.addChatModule("A", "Text", chatSuccess);//新增對話模組
        this.stopUpdate();
    }

    //開始計時刷新排隊
    setStartUpdate() {
        this.time = 1;
        this.interval = setInterval(() => {
            if (this.time % 30 === 0) {
                this.SharevarService.isTestConsoleLog("刷新" + this.time)
                this.mainService.getCsUserQueueInfo(this.csUserId, this.chatTimetableId).subscribe(res => {
                    this.csUserId = res.csUserId;
                    this.isTotalWait$.next(res.enabledWait)
                    if (res.isLink) {
                        this.doStartConnect();
                        this.SharevarService.stopSetUpTime();
                    }
                })
            }
            this.time++
        }, 1000)
    }
    stopUpdate() {
        this.isTotalWait$.next(null)
        clearInterval(this.interval);
    }
    //新增對話模組
    addChatModule(chatRecordType: string, kind: string, newMsg: any) {
        //決定 問/答、類別、內容
        if (chatRecordType === "A") this.SharevarService.setupTime(1);
        const chatContents: WellcomechatContents[] = [];
        chatContents.push(newMsg);
        const newMsgKid: Wellcomeresponse = {
            kind: kind,
            demand: newMsg.text,
            chatContents: chatContents,
            chatRecordType: chatRecordType,
            createdTime: moment(Date.now()).format('HH:mm A'),
            taskType: "",
        }
        const response: Wellcomeresponse[] = [];
        response.push(newMsgKid);
        this.getTaskType();
        this.SharevarService.isTestConsoleLog(response)
        this.SharevarService.addHistoryList(this.taskType, response, true)
    }
}