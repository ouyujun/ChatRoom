import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigLoaderService } from '../service/config-loder.service'; //Main.Url(API URL、IMG URL)
import { ChatbotService } from '../service/chatbot.service';
import { SharevarService } from '../service/sharevar.service';
import { VisitorInfo, BotMainData } from '../models/sendquestiontobot';
@Component({
  selector: 'app-web-content',
  templateUrl: './web-content.component.html',
  styleUrls: ['./web-content.component.scss']
})
export class WebContentComponent implements OnInit {
  imageUrl = this.mainUrl.appImg; //Image server front URL
  data: BotMainData;

  constructor(
    private mainService: ChatbotService,
    private router: Router,
    private SharevarService: SharevarService,
    private mainUrl: ConfigLoaderService
    ) { }

  ngOnInit(): void {
  }
  ngAfterContentInit(): void {
    this.getAllData();
  }
  
  ThirdParty: any = [];
  getTPData(): void {
    this.mainService.getTPList().subscribe(res => {
      this.ThirdParty = res;
      // this.ThirdParty = Array.of(this.ThirdParty);  
      this.imageUrl = `${this.imageUrl}`
    });
  }
//API Chatbot Ifon
getAllData(): void {
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
}
