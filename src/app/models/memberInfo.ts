export interface MemberInfo {
  isAuth: boolean;
  token: string;
  userInfo: UserInfo;
}

export interface UserInfo {
  memberKey: number,
  sessionNo: number,
  loginAccount: string,
  accountId: string,
  name: string,
  email: string,
  pictureUrl: string,
  provider: string,
  loginKind: number,
  isVIP:boolean
}
