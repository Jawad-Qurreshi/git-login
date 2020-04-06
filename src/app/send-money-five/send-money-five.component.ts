import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-send-money-five',
  templateUrl: './send-money-five.component.html',
  styleUrls: ['./send-money-five.component.css']
})
export class SendMoneyFiveComponent implements OnInit {


  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  deviceInfo = null;

  custid: any;

  account_number: any;
  ifsc_code: any;
  name: any;
  getcurrency: any;
  getamount: any;
  sendcurrency: any;
  sendamount: any;
  transdata: any;

  pay_type: any;
  errpay_type: any;

  sid: any;

  upform: any;

  btnshow: any;
  btncredit: any;
  btnwire: any;
  btnentrac: any;
  btnzipco: any;

  finalamount: number;

  totamount: any;
  totfee: any;

  browser: any;
  os: any;
  ip: any;

  vper: any;
  vfinalper: any;
  vtot: any;
  vtotal: any;
  vfinaltotal: any;

  aper: any;
  afinalper: any;
  atot: any;
  atotal: any;
  afinaltotal: any;

  private stripeCheckoutHandler: StripeCheckoutHandler;
  always: boolean;
  promoval: any;
  pretotal: any;
  getrs: any;

  constructor(private http: Http, private router: Router, private stripeCheckoutLoader: StripeCheckoutLoader, private deviceService: DeviceDetectorService) {
    this.epicFunction();
  }
  private headers = new Headers({ 'Content-type': 'application/json' });


  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.browser = this.deviceInfo.browser;
    this.os = this.deviceInfo.os;
  }

  previous = function () {
    this.router.navigate(['./send-money-four']);
  }

  chkbutton = function (data) {

    if (this.promoval != "") {
      this.pretotal = this.sendamount - this.totfee;
      this.totamount = parseFloat(this.pretotal) + parseFloat(this.promoval);
    } else {
      this.totamount = this.sendamount - this.totfee;
    }

    if (data == "debit_card") {
      this.btncredit = true;
      this.btnshow = false;
      this.btnwire = false;
      this.btnentrac = false;
      this.always = false;
      this.btnzipco = false;

      const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.totamount + ""}`;
      this.http.get(url).subscribe(
        (res: Response) => {
          this.getrs = res.json().result;
          this.getamount = parseFloat(this.getrs).toFixed(2);

          var finaldata = {
            "sendid": this.upform,
            "vsmc_fee": "",
            "amex_fee": "",
            "total_amount": this.totamount,
            "get_amount": this.getamount,
          }

          const url = `${this.hosturl + this.port + "/update_sendmoney_card_method"}`;
          this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
            .then((res: Response) => { });

        });

    } else if (data == "credit_card_vsmc") {
      this.btncredit = true;
      this.btnshow = false;
      this.btnwire = false;
      this.btnentrac = false;
      this.always = false;
      this.btnzipco = false;

      if (this.sendcurrency == "USD") {

        this.vper = (this.totamount * 3.5) / 100;
        this.vfinalper = this.vper + 0.40;
        this.vtot = parseFloat(this.vfinalper).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.vfinaltotal = parseFloat(this.vtotal).toFixed(2);

        const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.vfinaltotal + ""}`;
        this.http.get(url).subscribe(
          (res: Response) => {
            this.getrs = res.json().result;
            this.getamount = parseFloat(this.getrs).toFixed(2);

            var finaldata = {
              "sendid": this.upform,
              "vsmc_fee": this.vtot,
              "amex_fee": "",
              "total_amount": this.vfinaltotal,
              "get_amount": this.getamount,
            }

            const url = `${this.hosturl + this.port + "/update_sendmoney_card_method"}`;
            this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
              .then((res: Response) => { });

          });

      } else if (this.sendcurrency == "CAD") {

        this.vper = (this.totamount * 3.5) / 100;
        this.vfinalper = this.vper + 0.50;
        this.vtot = parseFloat(this.vfinalper).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.vfinaltotal = parseFloat(this.vtotal).toFixed(2);

        const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.vfinaltotal + ""}`;
        this.http.get(url).subscribe(
          (res: Response) => {
            this.getrs = res.json().result;
            this.getamount = parseFloat(this.getrs).toFixed(2);

            var finaldata = {
              "sendid": this.upform,
              "vsmc_fee": this.vtot,
              "amex_fee": "",
              "total_amount": this.vfinaltotal,
              "get_amount": this.getamount,
            }

            const url = `${this.hosturl + this.port + "/update_sendmoney_card_method"}`;
            this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
              .then((res: Response) => { });

          });

      } else if (this.sendcurrency == "GBP") {

        this.vper = (this.totamount * 3.5) / 100;
        this.vfinalper = this.vper + 0.20;
        this.vtot = parseFloat(this.vfinalper).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.vfinaltotal = parseFloat(this.vtotal).toFixed(2);

        const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.vfinaltotal + ""}`;
        this.http.get(url).subscribe(
          (res: Response) => {
            this.getrs = res.json().result;
            this.getamount = parseFloat(this.getrs).toFixed(2);

            var finaldata = {
              "sendid": this.upform,
              "vsmc_fee": this.vtot,
              "amex_fee": "",
              "total_amount": this.vfinaltotal,
              "get_amount": this.getamount,
            }

            const url = `${this.hosturl + this.port + "/update_sendmoney_card_method"}`;
            this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
              .then((res: Response) => { });

          });

      } else if (this.sendcurrency == "EUR") {

        this.vper = (this.totamount * 3.5) / 100;
        this.vfinalper = this.vper + 0.30;
        this.vtot = parseFloat(this.vfinalper).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.vfinaltotal = parseFloat(this.vtotal).toFixed(2);

        const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.vfinaltotal + ""}`;
        this.http.get(url).subscribe(
          (res: Response) => {
            this.getrs = res.json().result;
            this.getamount = parseFloat(this.getrs).toFixed(2);

            var finaldata = {
              "sendid": this.upform,
              "vsmc_fee": this.vtot,
              "amex_fee": "",
              "total_amount": this.vfinaltotal,
              "get_amount": this.getamount,
            }

            const url = `${this.hosturl + this.port + "/update_sendmoney_card_method"}`;
            this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
              .then((res: Response) => { });

          });

      } else if (this.sendcurrency == "ZAR") {

        this.vper = (this.totamount * 3.5) / 100;
        this.vfinalper = this.vper + 0.60;
        this.vtot = parseFloat(this.vfinalper).toFixed(2);
        this.vtotal = this.totamount - this.vtot;
        this.vfinaltotal = parseFloat(this.vtotal).toFixed(2);

        const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.vfinaltotal + ""}`;
        this.http.get(url).subscribe(
          (res: Response) => {
            this.getrs = res.json().result;
            this.getamount = parseFloat(this.getrs).toFixed(2);

            var finaldata = {
              "sendid": this.upform,
              "vsmc_fee": this.vtot,
              "amex_fee": "",
              "total_amount": this.vfinaltotal,
              "get_amount": this.getamount,
            }

            const url = `${this.hosturl + this.port + "/update_sendmoney_card_method"}`;
            this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
              .then((res: Response) => { });

          });

      }

    } else if (data == "credit_card_amex") {
      this.btncredit = true;
      this.btnshow = false;
      this.btnwire = false;
      this.btnentrac = false;
      this.always = false;
      this.btnzipco = false;

      this.aper = (this.totamount * 3.5) / 100;
      this.afinalper = this.aper + 0.80;
      this.atot = parseFloat(this.afinalper).toFixed(2);
      this.atotal = this.totamount - this.atot;
      this.afinaltotal = parseFloat(this.atotal).toFixed(2);

      const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.afinaltotal + ""}`;
      this.http.get(url).subscribe(
        (res: Response) => {
          this.getrs = res.json().result;
          this.getamount = parseFloat(this.getrs).toFixed(2);

          var finaldata = {
            "sendid": this.upform,
            "vsmc_fee": "",
            "amex_fee": this.atot,
            "total_amount": this.afinaltotal,
            "get_amount": this.getamount,
          }

          const url = `${this.hosturl + this.port + "/update_sendmoney_card_method"}`;
          this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
            .then((res: Response) => { });

        });

    } else if (data == "zipco_payment") {
      this.btncredit = false;
      this.btnshow = false;
      this.btnwire = false;
      this.btnentrac = false;
      this.always = false;
      this.btnzipco = true;

      const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.totamount + ""}`;
      this.http.get(url).subscribe(
        (res: Response) => {
          this.getrs = res.json().result;
          this.getamount = parseFloat(this.getrs).toFixed(2);

          var finaldata = {
            "sendid": this.upform,
            "vsmc_fee": "",
            "amex_fee": "",
            "total_amount": this.totamount,
            "get_amount": this.getamount,
          }

          const url = `${this.hosturl + this.port + "/update_sendmoney_card_method"}`;
          this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
            .then((res: Response) => { });

        });

    } else if (data == "cash") {
      this.btncredit = false;
      this.btnshow = true;
      this.btnwire = false;
      this.btnentrac = false;
      this.always = false;
      this.btnzipco = false;

      const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.totamount + ""}`;
      this.http.get(url).subscribe(
        (res: Response) => {
          this.getrs = res.json().result;
          this.getamount = parseFloat(this.getrs).toFixed(2);

          var finaldata = {
            "sendid": this.upform,
            "vsmc_fee": "",
            "amex_fee": "",
            "total_amount": this.totamount,
            "get_amount": this.getamount,
          }

          const url = `${this.hosturl + this.port + "/update_sendmoney_card_method"}`;
          this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
            .then((res: Response) => { });

        });

    } else if (data == "enterac_transfer") {
      this.btncredit = false;
      this.btnshow = false;
      this.btnwire = false;
      this.btnentrac = true;
      this.always = false;
      this.btnzipco = false;

      const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.totamount + ""}`;
      this.http.get(url).subscribe(
        (res: Response) => {
          this.getrs = res.json().result;
          this.getamount = parseFloat(this.getrs).toFixed(2);

          var finaldata = {
            "sendid": this.upform,
            "vsmc_fee": "",
            "amex_fee": "",
            "total_amount": this.totamount,
            "get_amount": this.getamount,
          }

          const url = `${this.hosturl + this.port + "/update_sendmoney_card_method"}`;
          this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
            .then((res: Response) => { });

        });

    } else if (data == "wire_payment") {
      this.btncredit = false;
      this.btnshow = false;
      this.btnwire = true;
      this.btnentrac = false;
      this.always = false;
      this.btnzipco = false;

      const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.totamount + ""}`;
      this.http.get(url).subscribe(
        (res: Response) => {
          this.getrs = res.json().result;
          this.getamount = parseFloat(this.getrs).toFixed(2);

          var finaldata = {
            "sendid": this.upform,
            "vsmc_fee": "",
            "amex_fee": "",
            "total_amount": this.totamount,
            "get_amount": this.getamount,
          }

          const url = `${this.hosturl + this.port + "/update_sendmoney_card_method"}`;
          this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
            .then((res: Response) => { });

        });

    }
  }

  sendmoney = function (data) {

    if (data.pay_type == "") {
      this.errpay_type = false;
      alertify.error("Please select any one payment method");
    } else {
      this.errpay_type = true;
    }

    let decryptedData_transfertype = localStorage.getItem('transfer_type');
    var bytes_transfertype = CryptoJS.AES.decrypt(decryptedData_transfertype.toString(), 'Zipcoin');
    let transfertype = JSON.parse(bytes_transfertype.toString(CryptoJS.enc.Utf8));

    if (this.errpay_type == true) {

      var finaldata = {
        "sendid": this.upform,
        "custid": this.custid,
        "pay_type": data.pay_type,
        "transfer_type": transfertype,
        "payment_imgval": "",
        "payment_img_photo": "",
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

  }

  payget = function () {

    var paytype = CryptoJS.AES.encrypt(JSON.stringify(this.pay_type), 'Zipcoin');
    localStorage.setItem("paytype", paytype.toString());

    if (this.pay_type == 'debit_card') {
      this.router.navigate(['/checkout']);
    } else if (this.pay_type == 'credit_card_vsmc') {
      this.router.navigate(['/vsmc_checkout']);
    } else if (this.pay_type == 'credit_card_amex') {
      this.router.navigate(['/amex_checkout']);
    }

  }

  wire_pay = function () {

    var paytype = CryptoJS.AES.encrypt(JSON.stringify(this.pay_type), 'Zipcoin');
    localStorage.setItem("paytype", paytype.toString());

    this.router.navigate(['/wire-payment']);

  }

  entrec_pay = function () {

    var paytype = CryptoJS.AES.encrypt(JSON.stringify(this.pay_type), 'Zipcoin');
    localStorage.setItem("paytype", paytype.toString());

    this.router.navigate(['/enterac-transfer']);

  }

  zipco_pay = function () {

    var paytype = CryptoJS.AES.encrypt(JSON.stringify(this.pay_type), 'Zipcoin');
    localStorage.setItem("paytype", paytype.toString());

    this.router.navigate(['/zipco_checkout']);

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

        this.pay_type = "";
        this.errpay_type = true;


        this.vper = "";
        this.aper = "";
        this.always = true;

        let decryptedData_upform = localStorage.getItem('sendid');
        var bytes_upform = CryptoJS.AES.decrypt(decryptedData_upform.toString(), 'Zipcoin');
        this.upform = JSON.parse(bytes_upform.toString(CryptoJS.enc.Utf8));

        let decryptedData_promoval = localStorage.getItem('promoval');
        if (decryptedData_promoval) {
          var bytes_promoval = CryptoJS.AES.decrypt(decryptedData_promoval.toString(), 'Zipcoin');
          this.promoval = JSON.parse(bytes_promoval.toString(CryptoJS.enc.Utf8));
        } else {
          this.promoval = "";
        }


        const gettrasferdata = `${this.hosturl + this.port + "/getsend_money_data/"}${this.upform}`;
        this.http.get(gettrasferdata).subscribe(
          (res: Response) => {
            this.transdata = res.json().transfer;

            this.sendamount = this.transdata[0].send_amount;
            this.sendcurrency = this.transdata[0].send_currency;
            this.getamount = this.transdata[0].get_amount;
            this.getcurrency = this.transdata[0].get_currency;

            this.totfee = this.transdata[0].total_fee;

            if (this.promoval != "") {
              this.pretotal = this.sendamount - this.totfee;
              this.totamount = parseFloat(this.pretotal) + parseFloat(this.promoval);

              const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.totamount + ""}`;
              this.http.get(url).subscribe(
                (res: Response) => {
                  this.getrs = res.json().result;
                  this.getamount = parseFloat(this.getrs).toFixed(2);
                });

            } else {
              this.totamount = this.sendamount - this.totfee;
              const url = `${"https://apilayer.net/api/convert?access_key=ec780c69929baa21cda7b7d252eaed72&from=" + this.sendcurrency + "&to=" + this.getcurrency + "&amount=" + this.totamount + ""}`;
              this.http.get(url).subscribe(
                (res: Response) => {
                  this.getrs = res.json().result;
                  this.getamount = parseFloat(this.getrs).toFixed(2);
                });
            }



            if (this.transdata[0].self_account_holder != "") {
              this.name = this.transdata[0].self_account_holder;
            }

            if (this.transdata[0].else_account_holder != "") {
              this.name = this.transdata[0].else_account_holder;
            }

            if (this.transdata[0].benificiary_id != "") {

              const recipientdata = `${this.hosturl + this.port + "/recipient_data/"}${this.transdata[0].benificiary_id}`;
              this.http.get(recipientdata).subscribe(
                (res: Response) => {
                  let getrec = res.json().benificiaryname;
                  this.name = getrec[0].name_business;
                });

            }

            if (this.transdata[0].agentid != "") {
              const agentdata = `${this.hosturl + this.port + "/agent_data/"}${this.transdata[0].agentid}`;
              this.http.get(agentdata).subscribe(
                (res: Response) => {
                  let getrec = res.json().agentname;
                  this.name = getrec[0].first_name;
                });
            }


            if (this.transdata[0].payment_type == "") {
              this.pay_type = "";
            } else {
              this.pay_type = this.transdata[0].payment_type;
            }

          }
        )

        this.http.get("https://jsonip.com/").subscribe(
          (res: Response) => {
            this.ip = res.json().ip;
          });

        this.btnshow = true;

      }
    } else {
      this.router.navigate(['/login']);
    }

  }


}
