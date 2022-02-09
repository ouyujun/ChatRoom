export interface UserAuthResponse {
  isAuth: boolean,
  userInfo: UserInfo
}

export interface UserInfo {
  id: string,
  name: string,
  email: string,
  pictureUrl: string,
  provider: string
  memberKey: number,
  memberLoginId: number
}
