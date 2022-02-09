import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { ChatbotService } from '../service/chatbot.service';
import { SharevarService } from '../service/sharevar.service';

import { chatResponse, chatFragment } from '../models/wellcomemodels'
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class HistoryService {
    public taskType$ = new BehaviorSubject<string>("");
    public onload$ = new BehaviorSubject<string>("載入先前對話紀錄");
    public historyMainSubject$ = new BehaviorSubject<chatFragment[]>([]);
    public historyMain$ = this.historyMainSubject$.asObservable();
    rootSet = document.querySelector<HTMLElement>(':root'); //css Style Root 
    constructor(
        private mainService: ChatbotService,
        private sharevarService: SharevarService
    ) { }
    addHistoryList(list: any) {
        this.rootSet.style.setProperty('--isFAQBtn', 'none');
        this.sharevarService.isTestConsoleLog(list)
        var messages: chatFragment = list
        this.historyMainSubject$.next([
            messages, ...this.historyMainSubject$.getValue()
        ])
    }
    sessionNo: number;
    memberKey: number;
    askerId: number;
    getSessionStorage() {
        if (sessionStorage.getItem("VisitorInfo-key")) {
            let storage = JSON.parse(sessionStorage.getItem("VisitorInfo-key"))
            this.sessionNo = storage.sessionNo;
            this.memberKey = storage.memberKey;
            this.askerId = storage.askerId;
        }
    }
    clearHistory() {
        this.historyMainSubject$.next([])
        this.setHistoryDate();
    }
    startToday = moment().startOf('day')
    endToday = moment().endOf('day')
    startDate: string = moment(this.startToday).add('days', -1).format('YYYY-MM-DD HH:mm:ss')
    endDate: string = moment(this.endToday).add('days', 1).format('YYYY-MM-DD HH:mm:ss')
    lastM = moment(Date.now()).subtract(1, 'month').startOf('month').add('days', -1).format('YYYY-MM-DD')
    setHistoryDate() {
        this.startDate = moment(this.startToday).add('days', -1).format('YYYY-MM-DD HH:mm:ss')
        this.endDate = moment(this.endToday).add('days', 1).format('YYYY-MM-DD HH:mm:ss')
    }

    getHistoryDate(action:string) {
        this.getSessionStorage();
        let data = {
            sessionNo: null, //帶0或nul取全部
            memberKey: this.memberKey, //會員編號
            startDate: null, //起始日期,帶空白或null時,預設為當下時間-1天(yyyy-MM-dd hh:mm:ss)
            endDate: this.endDate,//this.endDate
            days: 2//結束日期,帶空白或null時,預設為當下時間+1天(yyyy-MM-dd hh:mm:ss)
        }
        // console.log(data)
        this.mainService.getChatRecordHistory(data).subscribe((res: chatResponse) => {
            this.sharevarService.isTestConsoleLog(res)
            if(action==="載入"){
                let response: chatFragment[] = res.responseMessage;
                response.reverse();
                    response.forEach((chat:chatFragment)=> {
                            this.addHistoryList(chat);
                            this.endDate=chat.historyDate;
                    });
            }
            if(!res.hadRows){
               return this.rootSet.style.setProperty('--loadrecord', 'none');
            }
        });
    }
}