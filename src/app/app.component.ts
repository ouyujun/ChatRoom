import { Component, OnInit } from '@angular/core';
import { ChatbotService } from './service/chatbot.service';
import { MemberServices } from './service/member.service';



// import { NgModule } from '@angular/core';
// import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  csrfToken = null;
  islogin = true;
  isenter = false;
  constructor(
    private ChatbotService: ChatbotService,
    private mainService: MemberServices,
  ) { }


  istoken: string = ""
  ngOnInit(): void {
    this.ChatbotService.isAuth();
    this.mainService.getAntiCsrfToken().subscribe((res: any) => {
      this.istoken = res.token;
    })
  }


}

