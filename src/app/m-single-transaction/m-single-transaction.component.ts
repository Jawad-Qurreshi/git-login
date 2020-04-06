import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-m-single-transaction',
  templateUrl: './m-single-transaction.component.html',
  styleUrls: ['./m-single-transaction.component.css'],
  providers: [DatePipe]
})
export class MSingleTransactionComponent implements OnInit {



  totfee: any;
  ransdate: any;

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  adminid: any;
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

  za: any;
  er: any;
  gb: any;
  ca: any;
  us: any;

  us_rouoting_no: any;
  us_account_no: any;
  us_account_type: any;

  ca_account_type: any;
  ca_account_no: any;
  ca_transit_no: any;
  ca_institution_no: any;

  gb_ukcode: any;
  gb_account_no: any;

  za_phone_no: any;
  za_account_no: any;
  za_bank_name: any;
  
  er_iban: any;
  btype: any;
  rname: any;
  remail: any;
  rphone: any;
  zipcoamount: any;

  constructor(private router: Router, private http: Http, public datepipe: DatePipe) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  ngOnInit() {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    let decryptedData = localStorage.getItem('adminid');
    if (decryptedData != null) {

      var bytes = CryptoJS.AES.decrypt(decryptedData.toString(), 'Zipcoin');
      this.adminid = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (!this.adminid) {
        this.router.navigate(['/login']);
      } else {

        let a = this.router.url;
        let lastChar = a.split('/');
        let id = lastChar[2];

        const getsendtrans = `${this.hosturl + this.port + "/sendmoney_transaction/"}${id}`;
        this.http.get(getsendtrans).subscribe(
          (res: Response) => {

            this.allsendtrans = res.json().sendmoney_transaction;

            this.btype = this.allsendtrans[0].benificiary_type;

            this.summery = this.allsendtrans[0].transfer_type;
            this.transfer_number = this.allsendtrans[0].transaction_number;
            this.zipcoamount = this.allsendtrans[0].zipco_amount;
            this.getamount = this.allsendtrans[0].get_amount;
            this.getcurrency = this.allsendtrans[0].get_currency;
            this.sendamount = this.allsendtrans[0].send_amount;
            this.sendcurrency = this.allsendtrans[0].send_currency;

            this.recipient_name = this.allsendtrans[0].name_business;
            this.else_account_holder = this.allsendtrans[0].else_account_holder;
            this.self_account_holder = this.allsendtrans[0].self_account_holder;
            this.rname = this.allsendtrans[0].recname;
            this.remail = this.allsendtrans[0].recemail;
            this.rphone = this.allsendtrans[0].recphone;

            this.ransdate = this.allsendtrans[0].date;
            this.totfee = this.allsendtrans[0].total_fee;

            if (this.allsendtrans[0].US_account_no != "") {
              this.us = true;
              this.ca = false;
              this.gb = false;
              this.er = false;
              this.za = false;

              this.us_rouoting_no = this.allsendtrans[0].US_routing_no;
              this.us_account_no = this.allsendtrans[0].US_account_no;
              this.us_account_type = this.allsendtrans[0].US_account_type;

            }

            if (this.allsendtrans[0].CA_account_no != "") {

              this.us = false;
              this.ca = true;
              this.gb = false;
              this.er = false;
              this.za = false;

              this.ca_institution_no = this.allsendtrans[0].CA_institution_no;
              this.ca_transit_no = this.allsendtrans[0].CA_transit_no;
              this.ca_account_no = this.allsendtrans[0].CA_account_no;
              this.ca_account_type = this.allsendtrans[0].CA_account_type;

            }

            if (this.allsendtrans[0].GB_account_no != "") {
              this.us = false;
              this.ca = false;
              this.gb = true;
              this.er = false;
              this.za = false;

              this.gb_ukcode = this.allsendtrans[0].GB_ukcode;
              this.gb_account_no = this.allsendtrans[0].GB_account_no;

            }

            if (this.allsendtrans[0].ER_iban != "") {
              this.us = false;
              this.ca = false;
              this.gb = false;
              this.er = true;
              this.za = false;

              this.er_iban = this.allsendtrans[0].ER_iban;

            }

            if (this.allsendtrans[0].ZA_account_no != "") {
              this.us = false;
              this.ca = false;
              this.gb = false;
              this.er = false;
              this.za = true;

              this.za_bank_name = this.allsendtrans[0].ZA_bank_name;
              this.za_account_no = this.allsendtrans[0].ZA_account_no;
              this.za_phone_no = this.allsendtrans[0].ZA_phone_no;
            }

          }
        )

      }

    } else {
      this.router.navigate(['/login']);
    }

  }

}
