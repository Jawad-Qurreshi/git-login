import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css'],
  providers: [DatePipe]
})
export class AgentComponent implements OnInit {

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

  zrmt_no: any;
  errzrmt_no: any;
  show: any;

  secret_code: any;
  errsecret_code: any;

  tid: any;

  transp: any;
  transs: any;
  transr: any;

  constructor(private router: Router, private http: Http, public datepipe: DatePipe) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  searchagent = function (data) {

    if (data.zrmt_no == "") {
      this.errzrmt_no = false;
      alertify.error("Please Enter ZipCoRemit Money Transfer Code(ZRMT)");
    } else {
      this.errzrmt_no = true;
    }

    if (this.errzrmt_no == true) {

      const gettrans = `${this.hosturl + this.port + "/search_agent/"}${data.zrmt_no}`;
      this.http.get(gettrans).subscribe(
        (res: Response) => {

          this.alltrans = res.json().transaction;


          if (this.alltrans == "") {
            this.show = false;
            alertify.error("No Result Found");
          } else {
            this.show = true;

            let get_status = this.alltrans[0].status;
            if (get_status == 0) {
              this.transp = true;
              this.transs = false;
              this.transr = false;

              this.tid = this.alltrans[0].atid;
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

            } else if (get_status == 1) {
              this.transp = false;
              this.transs = true;
              this.transr = false;
            } else {
              this.transp = false;
              this.transs = false;
              this.transr = true;
            }
          }
        }
      )

    }
  }

  secretcode = function (data) {

    if (data.secret_code == "") {
      this.errsecret_code = false;
      alertify.error("Please Enter Secret Code From Receiver");
    } else {
      this.errsecret_code = true;
    }

    if (this.errsecret_code == true) {

      var secretdata = {
        "atid": this.tid,
        "custid": this.custid,
        "secretcode": data.secret_code,
        "zrmt_no": this.zrmt_no
      }

      const url = `${this.hosturl + this.port + "/verify"}`;
      this.http.post(url, JSON.stringify(secretdata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.router.navigate(['/agent-transaction']);
          } else {
            alertify.error(res.json().msg);
          }
        })

    }

  }

  reject = function () {


    if (this.secret_code == "") {
      this.errsecret_code = false;
      alertify.error("Please Enter Secret Code From Receiver");
    } else {
      this.errsecret_code = true;
    }

    if (this.errsecret_code == true) {

      var secretdata = {
        "atid": this.tid,
        "custid": this.custid,
        "secretcode": this.secret_code,
        "zrmt_no": this.zrmt_no
      }

      const url = `${this.hosturl + this.port + "/agent_transaction_reject"}`;
      this.http.post(url, JSON.stringify(secretdata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.router.navigate(['/agent-transaction']);
          } else {
            alertify.error(res.json().msg);
          }
        })

    }

  }

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

        this.zrmt_no = "";
        this.errzrmt_no = true;

        this.secret_code = "";
        this.errsecret_code = true;

      }
    } else {
      this.router.navigate(['/login']);
    }

  }

}
