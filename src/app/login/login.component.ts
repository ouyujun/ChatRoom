import { AfterContentInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ChatbotService } from '../service/chatbot.service';
import { SharevarService } from '../service/sharevar.service';
import { ConfigLoaderService } from '../service/config-loder.service'; //Main.Url(API URL、IMG URL)
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthResponse } from '../models/userAuthRes';
import { MemberInfo } from '../models/memberInfo';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterContentInit {
  rootSet = document.querySelector<HTMLElement>(':root'); //css Style Root
  title:string = 'login';
  visible: boolean = true;
  message: boolean = false;
  public show: boolean = false;
  public buttonName: any = true;
  loginForm: FormGroup;

  isLogin: boolean;
  userInfoRes: UserAuthResponse;
  loading: boolean = false;
  img: string;

  constructor(
    private mainService: ChatbotService,
    private mainUrl: ConfigLoaderService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private SharevarService: SharevarService,
  ) { }
  imageUrl = this.mainUrl.appImg;

  ngAfterContentInit(): void {
    this.getTPData();
    this.message = false;
    this.visible = true;

  }
  ngOnInit(): void {
    var TDloginitem = document.querySelector<HTMLElement>(':root');
    TDloginitem.style.setProperty('--isTDitem', 'none');
    this.loading = true;
    this.validateLogin();
    this.showMemberLogin();
  }

  showMemberLogin() {
    this.SharevarService.memberInfo$.subscribe((res: MemberInfo) => {
      if (res) {
        if (res.isAuth) {
          this.message = true;
          this.visible = false;
          var TDloginitem = document.querySelector<HTMLElement>(':root');
          TDloginitem.style.setProperty('--isTDitem', 'block');
        }
      }
    })
  }

  showhideutility(): void {
    this.message = !this.message;
    this.visible = this.visible ? false : true;
    this.SharevarService.storeVisitorInfo();
    let TDloginitem = document.querySelector<HTMLElement>(':root');
    TDloginitem.style.setProperty('--isTDitem', 'block');
    this.SharevarService.setupTime(1);
  }

  ThirdParty: any = [];

  getTPData(): void {
    this.mainService.getTPList().subscribe(res => {
      // this.SharevarService.isTestConsoleLog(res);
      this.ThirdParty = res;
      // this.ThirdParty = Array.of(this.ThirdParty);
      this.imageUrl = `${this.imageUrl}`
    });
  }
  /*-------------------------------------------------- */
  logout() {
    this.http.get(`${this.mainUrl.appApi}api/Account/logout`).subscribe(res => {
      window.location.href = '/';
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
  loginSubmit() {

    if (this.loginForm.valid) {
      this.mainService.getCsrfToken().subscribe(() => {
        this.mainService.login(this.loginForm.value).subscribe((res: UserAuthResponse) => {
          // this.SharevarService.isTestConsoleLog(res)
          this.mainService.authRes.next(res);
        }, errors => {
          // this.SharevarService.isTestConsoleLog(errors);
          // this.SharevarService.isTestConsoleLog(errors.statusText);
          alert(errors.error)
        });
      });
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }
  validateLogin() {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
  getUserInfo(isAuth: boolean) {
    if (!isAuth) {
      this.http.get(`${this.mainUrl.appApi}api/Chatbot/getVisitorInfo`).subscribe((res: any) => {
        // this.SharevarService.isTestConsoleLog(res);
        sessionStorage.setItem('memberkey', res.memberKey)
        sessionStorage.setItem('sessionNo', res.sessionNo);
        sessionStorage.setItem('askerId', res.askerId);
      });
    }
  }

  showLoginModal() {
    this.SharevarService.showLoginModal.next(true);
    this.rootSet.style.setProperty('--isMask', 'block');
  }


}
