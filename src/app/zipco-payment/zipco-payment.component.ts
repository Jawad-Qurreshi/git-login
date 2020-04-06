import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-zipco-payment',
  templateUrl: './zipco-payment.component.html',
  styleUrls: ['./zipco-payment.component.css']
})
export class ZipcoPaymentComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;
  custid: any;
  send_currency: any;
  send_amount: any;

  eos_address: any;
  finalrate: any;

  deviceInfo = null;
  browser: any;
  os: any;
  ip: any;

  upform: any;

  constructor(private http: Http, private router: Router, private deviceService: DeviceDetectorService) {
    this.epicFunction();
  }
  private headers = new Headers({ 'Content-type': 'application/json' });

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.browser = this.deviceInfo.browser;
    this.os = this.deviceInfo.os;
  }

  confirm = function () {

    let decryptedData_transfertype = localStorage.getItem('transfer_type');
    var bytes_transfertype = CryptoJS.AES.decrypt(decryptedData_transfertype.toString(), 'Zipcoin');
    let transfertype = JSON.parse(bytes_transfertype.toString(CryptoJS.enc.Utf8));

    let decryptedData_paytype = localStorage.getItem('paytype');
    var bytes_paytype = CryptoJS.AES.decrypt(decryptedData_paytype.toString(), 'Zipcoin');
    let paytype = JSON.parse(bytes_paytype.toString(CryptoJS.enc.Utf8));

    var finaldata = {
      "sendid": this.upform,
      "custid": this.custid,
      "pay_type": paytype,
      "transfer_type": transfertype,
      "payment_imgval": "",
      "payment_img_photo": "",
      "eosaddress": this.eos_address,
      "zipcoamount": this.finalrate,
      "ip": this.ip,
      "browser": this.browser,
      "os": this.os
    }

    const url = `${this.hosturl + this.port + "/five/send_money"}`;
    this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
      .then((res: Response) => {
        if (res.json().success) {
          localStorage.removeItem("sendid");

          localStorage.removeItem("fullname");
          localStorage.removeItem("ifsc_code");
          localStorage.removeItem("account_number");

          localStorage.removeItem("email");
          localStorage.removeItem("account_name");
          localStorage.removeItem("country");
          localStorage.removeItem("state");
          localStorage.removeItem("city");
          localStorage.removeItem("else_ifsc_code");
          localStorage.removeItem("else_account_number");

          localStorage.removeItem("recipient");
          localStorage.removeItem("lsid");
          localStorage.removeItem("send_amount");
          localStorage.removeItem("send_currency");
          localStorage.removeItem("transfer_type");

          this.router.navigate(['/transaction']);

        }
      });

  }

  alladdress = function () {
    const getaddress = `${this.hosturl + this.port + "/all_eosaddress"}`;
    this.http.get(getaddress).subscribe(
      (res: Response) => {
        this.eosaddress = res.json().address;

        this.eos_address = this.eosaddress[0].eosaddress;

        if (this.send_currency == "USD") {
          this.finalrate = (this.send_amount / 100) * this.eosaddress[0].usd_rate;
        } else if (this.send_currency == "CAD") {
          this.finalrate = (this.send_amount / 100) * this.eosaddress[0].cad_rate;
        } else if (this.send_currency == "GBP") {
          this.finalrate = (this.send_amount / 100) * this.eosaddress[0].gbp_rate;
        } else if (this.send_currency == "EUR") {
          this.finalrate = (this.send_amount / 100) * this.eosaddress[0].eur_rate;
        } else if (this.send_currency == "ZAR") {
          this.finalrate = (this.send_amount / 100) * this.eosaddress[0].zar_rate;
        }

      }
    )
  }

  previous = function () {
    this.router.navigate(['./send-money-five']);
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

        let decryptedData_upform = localStorage.getItem('sendid');
        var bytes_upform = CryptoJS.AES.decrypt(decryptedData_upform.toString(), 'Zipcoin');
        this.upform = JSON.parse(bytes_upform.toString(CryptoJS.enc.Utf8));

        let decryptedData_send_currency = localStorage.getItem('send_currency');
        var bytes_send_currency = CryptoJS.AES.decrypt(decryptedData_send_currency.toString(), 'Zipcoin');
        this.send_currency = JSON.parse(bytes_send_currency.toString(CryptoJS.enc.Utf8));

        let decryptedData_send_amount = localStorage.getItem('send_amount');
        var bytes_send_amount = CryptoJS.AES.decrypt(decryptedData_send_amount.toString(), 'Zipcoin');
        this.send_amount = JSON.parse(bytes_send_amount.toString(CryptoJS.enc.Utf8));

        this.alladdress();

        this.http.get("https://jsonip.com/").subscribe(
          (res: Response) => {
            this.ip = res.json().ip;
          });

      }
    } else {
      this.router.navigate(['/login']);
    }

  }

}
