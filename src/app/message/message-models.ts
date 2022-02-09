export interface sendQuestionToBot {
  message: string,
  user: string,
  memberKey: number,
  sessionNo: number,
  faqId:number,
}
export class feedback {
  responseMessage: [];
  demand: '';
  buttons:getFaqBtnList[];
}
export class fAQAnswerPost {
  sessionNo: number = null;
  memberKey: number = null;
  faqId: any;
  demand: string = '';
  taskType:string='';
}
export class getClickPost {
  chatClickTypeId: number = null;
  clickId: any = null;
  clickSourdId: number = null;
  sessionNo: number = null;
  memberKey: number = null;
  demand: string = '';;
  taskType:string = '';;
}
export class getFaqBtnList {
  id:number= null;
  buttonId:number= null;
  buttonName:string= '';
  chatbotSolutionId:number= null;
  faqSettingId:number= null;
  sort:number= null;
}