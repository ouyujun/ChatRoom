export class creatMessage {
  sessionNo: number = null;
  memberKey: number = null;
  categoryFaqSettingId: number = null
  text: string = null;
  // account: string = '';
}
export class CategoryOptions {
  id: number = null;
  name: string = null;
  description: string = null;
  sort: number = null;
}
export class RealTimeQueueRes {
  csUserKey:number=null; //接聽號碼
  resType:number=null; //回應類型 1:留言訊息 2:詢問等待 3:開始連線
  enabledWait:number=null; //排隊數量
  csUserId:number=null; //客服編號
  chatTimetableId:number=null; //這是啥??
  isLink: boolean=null;
}
