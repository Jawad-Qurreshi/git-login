import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-send-money-two',
  templateUrl: './send-money-two.component.html',
  styleUrls: ['./send-money-two.component.css']
})
export class SendMoneyTwoComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  custid: any;
  transdata: any;
  rdotype: any;
  errrdotype: any;

  upform: any;

  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  previous = function () {
    this.router.navigate(['/send-money']);
  }

  sendmoney = function (data) {

    if (data.rdotype == "") {
      this.errrdotype = false;
    } else {
      this.errrdotype = true;
    }
    
    if (this.errrdotype == true) {

      if (data.rdotype == "mobile top-up" || data.rdotype == "airtime top-up" || data.rdotype == "gift card") {

        this.router.navigate(['./recharge']);

      } else {

        var data_rdotype = CryptoJS.AES.encrypt(JSON.stringify(data.rdotype), 'Zipcoin');
        localStorage.setItem("transfer_type", data_rdotype.toString());

        var finaldata = {
          "sendid": this.upform,
          "transfer_type": data.rdotype
        }

        const url = `${this.hosturl + this.port + "/two/send_money"}`;
        this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
          .then((res: Response) => {
            if (res.json().success) {
              this.router.navigate(['./send-money-three']);
            }
          });

      }
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

        this.errrdotype = true;

        let decryptedData_upform = localStorage.getItem('sendid');
        var bytes_upform = CryptoJS.AES.decrypt(decryptedData_upform.toString(), 'Zipcoin');
        this.upform = JSON.parse(bytes_upform.toString(CryptoJS.enc.Utf8));

        const gettrasferdata = `${this.hosturl + this.port + "/getsend_money_data/"}${this.upform}`;
        this.http.get(gettrasferdata).subscribe(
          (res: Response) => {
            this.transdata = res.json().transfer;
            if (this.transdata[0].transfer_type == "") {
              this.rdotype = "";
            } else {
              this.rdotype = this.transdata[0].transfer_type;
            }
          }
        )

      }
    } else {
      this.router.navigate(['/login']);
    }

  }

}
