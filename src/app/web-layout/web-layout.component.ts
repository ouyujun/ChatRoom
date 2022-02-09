import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ChatbotService } from '../service/chatbot.service';
import { SharevarService } from '../service/sharevar.service';
import { ConfigLoaderService } from '../service/config-loder.service'; //Main.Url(API URL、IMG URL)

import { VisitorInfo, BotMainData } from '../models/sendquestiontobot';

@Component({
  selector: 'app-web-layout',
  templateUrl: './web-layout.component.html',
  styleUrls: ['./web-layout.component.scss']
})
export class WebLayoutComponent implements OnInit {
  imageUrl = this.mainUrl.appImg; //Image server front URL
  title = 'Project-Chatbot';//The name of this project
  isVisible = false; //Bounce window settings
  btnVisible: boolean = true;
  private window: Window;

  //API
  data: BotMainData;
  constructor(
    private mainService: ChatbotService,
    private router: Router,
    private SharevarService: SharevarService,
    private mainUrl: ConfigLoaderService,
  ) { }

  ngOnInit(): void {
    this.getChatbotInfo();
  }
  /* 接API Function */
  //API Chatbot info
  getChatbotInfo(): void {
    this.mainService.getMainData().subscribe((res: BotMainData) => {
      this.data = res;
      var xcolor = res.colorUrl + 'A0';
      var allcolor = res.colorUrl + '0f';
      var r = document.querySelector<HTMLElement>(':root');
      r.style.setProperty('--blue', res.colorUrl);
      r.style.setProperty('--Gradient', xcolor);
      r.style.setProperty('--background', allcolor);
      this.imageUrl = `${this.imageUrl}`
    });
  }


  /*---------------------------------------*/
  // const openBtn = document.body.querySelector('.open')
  // closeBtn = document.body.querySelector('.close')
  // chat = document.body.querySelector('.chatbot')
  // iframe = window.frameElement;

  openBtn($event) {
    alert('test');
    // this.chat.setAttribute('aria-hidden',"false")
    // angular use $event.target
    // $event.target.style.display = 'none';
    // this.iframe['style'].width = '370px'
    // this.iframe['style'].height = '580px'
    // this.iframe['src'] = 'http://localhost:1337/#/webcontent'
    // console.log(this.iframe['style'].width)

    //
    //   window.addEventListener('click', function(e){
    //     frame.style.width ='370px'
    //     frame.style.height = '580px'
    // })
  }

  // fullscreenBtn.addEventListener('click', (event) => {
  //     iframe.style.width = '100%'
  //     iframe.style.height = '100%'
  // })

  // closeBtn.addEventListener('click', (event) => {
  //     iframe.removeAttribute('style')
  //     openBtn.style.display = 'block'
  //     chat.setAttribute('aria-hidden', true)
  // })
}
