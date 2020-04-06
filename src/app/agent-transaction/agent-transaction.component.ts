import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-agent-transaction',
  templateUrl: './agent-transaction.component.html',
  styleUrls: ['./agent-transaction.component.css'],
  providers: [DatePipe]
})
export class AgentTransactionComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  custid: any;
  alltrans: any;

  constructor(private http: Http, private router: Router, public datepipe: DatePipe) { }
  private headers = new Headers({ 'Content-type': 'application/json' });


  ngOnInit() {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    let decryptedData = localStorage.getItem('custid');

    if (decryptedData != null) {
      var bytes = CryptoJS.AES.decrypt(decryptedData.toString(), 'Zipcoin');
      this.custid = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (!this.custid) {
        this.router.navigate(['/login']);
      } else {

        const gettrans = `${this.hosturl + this.port + "/allagenttransaction/"}${this.custid}`;
        this.http.get(gettrans).subscribe(
          (res: Response) => {

            this.alltrans = res.json().transaction;

          }
        )

      }
    } else {
      this.router.navigate(['/login']);
    }

  }

}
