export class feedback {
    responseMessage: any[] = [];
    guideButtons: any[] = [];
    taskType: string = "";
}
export class fAQAnswer {
    id: number = null;
    buttonId: number = null;
    buttonName: string = "";
    sessionNo: number = null;
    memberKey: number = null;
    taskType: string = "";
}
/*------------------------------ */
export class QuestionModuleAnswer {
    memberKey: number;
    sessionNo: number;
    demand: string;
    replyName: string;
    setUrl: string;
    setReply: string;
    setDemand: string;
    setAPI:string;
    setLinkModuleId: number;
    taskType: string;
}

export interface EmailAnswer {
    memberKey: number;
    sessionNo: number;
    demand: string;
    email: string;
    taskType: string;

}
export interface ButtonModuleAnswer {
    kindId: number;
    sessionNo: number;
    memberKey: number;
    pictureUrl: string;
    linkButtonId: number;
    setUrl: string;
    setReply: string;
    setAPI:string;
    setDemand: string;
    setLinkModuleId: number;
    taskType: string;
    text:string;
}
export interface QuestionModuleAnswer {
    memberKey: number;
    sessionNo: number;
    demand: string;
    replyName: string;
    setUrl: string;
    setReply: string;
    setLinkModuleId: number;
    taskType: string;
}
export interface PictureModuleAnswer {
    sessionNo: number;
    kindId: number;
    setLinkModuleId: number;
    linkButtonId: number;
}
export class recordChatFufill {
    sessionNo:number=null;
    memberKey:number=null;
    demand:string=null;
    replyName:string=null;
    moduleId:number=null;
    fullfillType:number=null;
    taskType:string=null;
}
