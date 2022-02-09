export interface VisitorInfo{
  memberKey: number,
  sessionNo: number,
  askerId:number,
}
export interface sendQuestionToBot{
    message:string;
    user:string;
    memberKey: number;
    sessionNo: number;
  }

export interface getClickAnswer{
  clickId: number,
  sessionNo: number,
  memberKey: number,
  demand: string,
  taskType: string
  }

export class loginInfodata{
  kind:string="";
  name:string="";
  iconUrl:string="";
  url:string="";
  sort: number=null;
  disabledId: number=null;
  }
export interface BotMainData{
    colorUrl: string,
    headerUrl: string,
    name: string,
  }
  export class messageMain{
    type:boolean=true;
    kind:string='';
    pictureUrl:string='';
    pictureMemo:string='';
    text:any=[];
    sort?:number= null;
    setLinkModuleId?:number= null;
    imgUrl:string='';
    webUrl:string='';
    setReply:string='';
    replyName:string='';
    replySort:string= '';
    replies:any[]=[];
   }
   export class btnReplies{
    linkButtonId: number=null;
    replyId: number=null;
    replyName: string='';
    replySort: number=null;
    setLinkModuleId?:string='';
    setReply: string='';
    webUrl?: string=''; 
    imgUrl?: string=''; 
}
export class getModalPost {
  replyName: string = '';
  moduleId: number = null;
  sessionNo: number = null;
  memberKey: number = null;
  taskType: string = '';
}

export class messageAllTest{
  messageModal:any[];
  type:boolean=true;
  time:string=null;
}
export interface notifyTimes {
  lazyCsUserA: number,
  //真人閒置提醒秒數180
  lazyBotUserA: number,
  //Bot閒置提醒秒數45
  endCsUserQ: number,
  //第一階段真人結束提醒秒數300
  endBotUserQ: number,
  //第一階段Bot結束提醒秒數45
  endCsUserQWait: number,
  //第二階段真人結束提醒秒數60
  endBotUserQWait: number,
  //第二階段Bot結束提醒秒數30
  chatTaskS: number,
  //對話恢復提醒秒數30
}
export class reconnectionData{
  sessionNo: number=null;
  memberKey: number=null;
  demand: string=null;
  replyName: string=null;
  moduleId: number=null;
  fullfillType: number=null;
  taskType: string=null;
}
