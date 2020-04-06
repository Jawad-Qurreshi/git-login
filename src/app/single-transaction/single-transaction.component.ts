import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-single-transaction',
  templateUrl: './single-transaction.component.html',
  styleUrls: ['./single-transaction.component.css'],
  providers: [DatePipe]
})
export class SingleTransactionComponent implements OnInit {
  disdate: any;



  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  custid: any;
  allsendtrans: any;
  sendcurrency: any;
  sendamount: any;
  getcurrency: any;
  getamount: any;
  transfer_number: any;
  summery: any;
  self_account_number: any;
  else_account_number: any;
  self_ifsc_code: any;
  else_ifsc_code: any;
  self_account_holder: any;
  else_account_holder: any;
  recipient_name: any;

  totamount: any;
  totfee: any;
  rec_name: any;
  paymenttype: any;
  zipcoamount: any;
  promoval: any;


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
        let id = lastChar[2];

        const getsendtrans = `${this.hosturl + this.port + "/sendmoney_transaction/"}${id}`;
        this.http.get(getsendtrans).subscribe(
          (res: Response) => {

            this.allsendtrans = res.json().sendmoney_transaction;

            this.paymenttype = this.allsendtrans[0].payment_type;
            this.zipcoamount = this.allsendtrans[0].zipco_amount;
            this.transfer_number = this.allsendtrans[0].transaction_number;
            this.summery = this.allsendtrans[0].transfer_type;
            this.getamount = this.allsendtrans[0].get_amount;
            this.getcurrency = this.allsendtrans[0].get_currency;
            this.sendamount = this.allsendtrans[0].send_amount;
            this.sendcurrency = this.allsendtrans[0].send_currency;

            this.totfee = this.allsendtrans[0].total_fee;
            this.totamount = this.allsendtrans[0].total_amount;

            this.recipient_name = this.allsendtrans[0].name_business;
            this.else_account_holder = this.allsendtrans[0].else_account_holder;
            this.self_account_holder = this.allsendtrans[0].self_account_holder;
            this.rec_name = this.allsendtrans[0].recname;

            this.disdate = this.allsendtrans[0].date;

          }
        )

      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
