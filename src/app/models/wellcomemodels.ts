/* 取得Wellcome 所有值-第一層 */
export class Wellcomeres {
    responseMessage: any[] = [];
    guidebuttons: number = null;
    taskType: string = "";
}
/* 取得Wellcome 所有值-第二層 */
export class Wellcomeresponse {
    kind: string = "";
    chatRecordType: string = "";
    createdTime: string = "";
    demand: string = "";
    chatContents: any[] = [];
    taskType: string = "";
}
/* 取得Wellcome 所有值-第三層 */
export class WellcomechatContents {
    kindId: number = 0;
    replyId: number = 0;
    replyName: string = "";
    replySort: number = 0;
    moduleId: number = 0;
    text: string = "";
    pictureUrl: string = "";
    sort: number = 0;
    pictureMemo: string = "";
    linkButtonId: number = 0;
    setUrl: string = "";
    setAPI:string="";
    setDemand: string = "";
    setReply: string = "";
    setLinkModuleId: number = 0;
    replies: any[] = [];
    actionCode: string = "";
}
/* 取得Wellcome 所有值-第四層 */
export class Wellcomereplies {
    replyId: number = 0;
    replyName: string = "";
    replySort: number = 0;
    moduleId: number = 0;
    text: string = "";
    pictureUrl: string = "";
    sort: number = 0;
    pictureMemo: string = "";
    linkButtonId: number = 0;
    setUrl: string = "";
    setReply: string = "";
    setLinkModuleId: number = 0;
    replies: any[] = [];
}
/* add */
export class addMessages {
    type: boolean = null;
    content:any={};
}
export class historyMessages {
    response: historyResponse[] = [];
}
export class historyResponse {
    kind: string = "";
    chatRecordType: string = "";
    createdTime: string = "";
    demand: string = "";
    chatContents: any[] = [];
    guideButtons: string = "";
    taskType: string = "";
}
export class addMessagesinfo {
    kind: string = "";
    demand: "";
    chatContents: any[] = [];
}
export class historyFragment {
    dateTime: string = "";
    chatFragment: chatFragment[];
}
export class chatFragment {
    historyDate: string = "";
    chatData: Wellcomeresponse[];
}
export class chatResponse {
    responseMessage: chatFragment[];
    guidebuttons: number = null;
    taskType: string = "";
    hadRows:boolean=null;
}

