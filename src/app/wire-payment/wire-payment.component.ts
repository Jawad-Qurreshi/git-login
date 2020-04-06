import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-wire-payment',
  templateUrl: './wire-payment.component.html',
  styleUrls: ['./wire-payment.component.css']
})
export class WirePaymentComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  deviceInfo = null;

  custid: any;
  browser: any;
  os: any;
  ip: any;

  @ViewChild('wirepaym') inputwirepay: ElementRef;

  form: FormGroup;
  paywiretextention: any;
  lastpaywire: any;
  paywirerand: any;
  errpaywire: boolean;
  upform: any;
  send_currency: any;
  showcad: boolean;
  showusd: boolean;
  referenceno: any;
  send_amount: any;

  constructor(private http: Http, private router: Router, private fb: FormBuilder, private deviceService: DeviceDetectorService) {
    this.epicFunction();
    this.createForm();
  }
  private headers = new Headers({ 'Content-type': 'application/json' });


  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.browser = this.deviceInfo.browser;
    this.os = this.deviceInfo.os;
  }

  createForm() {
    this.form = this.fb.group({
      payment_img: null
    });
  }

  upload_wirepay(event) {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('payment_img').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        })
      };

      this.paywiretextention = file.name.split(".");
      this.lastpaywire = this.paywiretextention[this.paywiretextention.length - 1];
      this.paywirerand = this.getrand(0, 1000000);

      if (this.lastpaywire != "png" && this.lastpaywire != "jpg" && this.lastpaywire != "jpeg") {
        alertify.error("Please upload only png, jpg and jpeg file");
        this.errpaywire = false;
      }
    }
  }

  wirepay = function (data) {

    // const formModel = this.form.value;

    // if (formModel.payment_img == null) {
    //   this.errpaywire = false;
    //   alertify.error("Please Choose Wire Payment Photo");
    // } else {
    //   if (this.lastpaywire != "png" && this.lastpaywire != "jpg" && this.lastpaywire != "jpeg") {
    //     alertify.error("Please upload only png, jpg and jpeg file of Wire Payment photo");
    //     this.errpaywire = false;
    //   } else {
    //     this.errpaywire = true;
    //   }
    // }

    // if (this.errpaywire == true) {


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
      // "payment_imgval": formModel.payment_img.value,
      // "payment_img_photo": this.paywirerand + formModel.payment_img.filename,
      "payment_imgval": "",
      "payment_img_photo": "",
      "referenceno": this.referenceno,
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

    // }

  }

  previous = function () {
    this.router.navigate(['./send-money-five']);
  }

  getrand = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

        this.referenceno = this.getrand(0, 100000000);

        this.http.get("https://jsonip.com/").subscribe(
          (res: Response) => {
            this.ip = res.json().ip;
          });

        let decryptedData_send_currency = localStorage.getItem('send_currency');
        var bytes_send_currency = CryptoJS.AES.decrypt(decryptedData_send_currency.toString(), 'Zipcoin');
        this.send_currency = JSON.parse(bytes_send_currency.toString(CryptoJS.enc.Utf8));

        let decryptedData_send_amount = localStorage.getItem('send_amount');
        var bytes_send_amount = CryptoJS.AES.decrypt(decryptedData_send_amount.toString(), 'Zipcoin');
        this.send_amount = JSON.parse(bytes_send_amount.toString(CryptoJS.enc.Utf8));

        if (this.send_currency == 'USD') {
          this.showusd = true;
          this.showcad = false;
        } else if (this.send_currency == 'CAD') {
          this.showusd = false;
          this.showcad = true;
        }

      }
    } else {
      this.router.navigate(['/login']);
    }

  }

}
