import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-agent-single-transaction',
  templateUrl: './agent-single-transaction.component.html',
  styleUrls: ['./agent-single-transaction.component.css'],
  providers: [DatePipe]
})
export class AgentSingleTransactionComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  custid: any;
  alltrans: any;
  send_currency: any;
  send_amount: any;
  get_currency: any;
  get_amount: any;
  recphone: any;
  recemail: any;
  reccity: any;
  recstate: any;
  reccountry: any;
  recaddress: any;
  recname: any;
  semail: any;
  sphone: any;
  scountry: any;
  saddress: any;
  sname: any;
  zipcoin_code: any;
  sphonecode: any;
  country_iso: any;

  constructor(private router: Router, private http: Http, public datepipe: DatePipe) { }
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

        let a = this.router.url;
        let lastChar = a.split('/');
        let tid = lastChar[2];

        const gettrans = `${this.hosturl + this.port + "/agent_single_transaction/"}${tid}`;
        this.http.get(gettrans).subscribe(
          (res: Response) => {

            this.alltrans = res.json().transaction;

            this.zipcoin_code = this.alltrans[0].transaction_number;
            this.sname = this.alltrans[0].sname;
            this.saddress = this.alltrans[0].saddress;
            this.scountry = this.alltrans[0].scountry;
            this.sphone = this.alltrans[0].sphone;
            this.semail = this.alltrans[0].semail;
            this.sphonecode = this.alltrans[0].sphonecode;

            this.recname = this.alltrans[0].recname;
            this.recaddress = this.alltrans[0].recaddress;
            this.reccountry = this.alltrans[0].reccountry;
            this.recstate = this.alltrans[0].recstate;
            this.reccity = this.alltrans[0].reccity;
            this.recemail = this.alltrans[0].recemail;
            this.recphone = this.alltrans[0].recphone;

            this.get_amount = this.alltrans[0].get_amount;
            this.get_currency = this.alltrans[0].get_currency;
            this.country_iso = this.alltrans[0].country_iso;
            this.send_amount = this.alltrans[0].send_amount;
            this.send_currency = this.alltrans[0].send_currency;

          }
        )

      }
    } else {
      this.router.navigate(['/login']);
    }

  }

}
