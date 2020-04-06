import { Component, OnInit, NgZone } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  chkfname: any;
  chklname: any;
  errlastname: boolean;
  errcardnumber: boolean;
  errexpiryMonth: boolean;
  errexpiryYear: boolean;
  errcvc: boolean;
  finalamount: any;
  pay_type: any;
  ip: any;
  browser: any;
  os: any;
  deviceInfo: any;
  send_amount: any;
  send_currency: any;

  constructor(private http: Http, private router: Router, private deviceService: DeviceDetectorService, private zone: NgZone) {
    this.epicFunction();
  }
  private headers = new Headers({ 'Content-type': 'application/json' });

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.browser = this.deviceInfo.browser;
    this.os = this.deviceInfo.os;
  }


  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;

  custid: any;
  firstname: any;
  lastname: any;

  errfirstname: any;


  getToken() {

    if (this.firstname == "") {
      this.errfirstname = false;
      alertify.error("Please Enter First Name");
    } else {

      if (this.chkfname.toLowerCase() == this.firstname.toLowerCase()) {
        this.errfirstname = true;
      } else {
        this.errfirstname = false;
        alertify.error("First Name is Not Match");
      }

    }

    if (this.lastname == "") {
      this.errlastname = false;
      alertify.error("Please Enter Last Name");
    } else {

      if (this.chklname.toLowerCase() == this.lastname.toLowerCase()) {
        this.errlastname = true;
      } else {
        this.errlastname = false;
        alertify.error("Last Name is Not Match");
      }

    }

    if (this.cardNumber == "") {
      this.errcardnumber = false;
      alertify.error("Please Enter Card Number");
    } else {
      this.errcardnumber = true;
    }

    if (this.expiryMonth == "") {
      this.errexpiryMonth = false;
      alertify.error("Please Select Expiry Month");
    } else {
      this.errexpiryMonth = true;
    }

    if (this.expiryYear == "") {
      this.errexpiryYear = false;
      alertify.error("Please Select Expiry Year");
    } else {
      this.errexpiryYear = true;
    }

    if (this.cvc == "") {
      this.errcvc = false;
      alertify.error("Please Enter CVV");
    } else {
      this.errcvc = true;
    }

    if (this.errfirstname == true && this.errlastname == true && this.errcardnumber == true
      && this.errexpiryMonth == true && this.errexpiryYear == true && this.errcvc == true) {

      (<any>window).Stripe.card.createToken({
        number: this.cardNumber,
        exp_month: this.expiryMonth,
        exp_year: this.expiryYear,
        cvc: this.cvc
      }, (status: number, response: any) => {
        if (status === 200) {

          var tokenid = response.id;

          let decryptedData_upform = localStorage.getItem('sendid');
          var bytes_upform = CryptoJS.AES.decrypt(decryptedData_upform.toString(), 'Zipcoin');
          let sid = JSON.parse(bytes_upform.toString(CryptoJS.enc.Utf8));

          let decryptedData_samount = localStorage.getItem('send_amount');
          var bytes_samount = CryptoJS.AES.decrypt(decryptedData_samount.toString(), 'Zipcoin');
          let samount = JSON.parse(bytes_samount.toString(CryptoJS.enc.Utf8));

          let decryptedData_scurrency = localStorage.getItem('send_currency');
          var bytes_scurrency = CryptoJS.AES.decrypt(decryptedData_scurrency.toString(), 'Zipcoin');
          let scurrency = JSON.parse(bytes_scurrency.toString(CryptoJS.enc.Utf8));

          let decryptedData_transfertype = localStorage.getItem('transfer_type');
          var bytes_transfertype = CryptoJS.AES.decrypt(decryptedData_transfertype.toString(), 'Zipcoin');
          let transfertype = JSON.parse(bytes_transfertype.toString(CryptoJS.enc.Utf8));

          let decryptedData_paytype = localStorage.getItem('paytype');
          var bytes_paytype = CryptoJS.AES.decrypt(decryptedData_paytype.toString(), 'Zipcoin');
          let ptype = JSON.parse(bytes_paytype.toString(CryptoJS.enc.Utf8));

          this.finalamount = samount;

          var finaldata = {
            "sendid": sid,
            "custid": this.custid,
            "token": tokenid,
            "pay_type": ptype,
            "amount": this.finalamount,
            "currency": scurrency,
            "transfer_type": transfertype,
            "cardno": this.cardNumber,
            "ip": this.ip,
            "browser": this.browser,
            "os": this.os
          }

          const url = `${this.hosturl + this.port + "/create/token"}`;
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
                localStorage.removeItem("sendid");
                localStorage.removeItem("lsid");
                localStorage.removeItem("send_amount");
                localStorage.removeItem("send_currency");
                localStorage.removeItem("transfer_type");
                localStorage.removeItem("paytype");

                this.zone.run(() => this.router.navigate(['/transaction']));


              }
            });

        } else {
          alertify.error(response.error.message);
        }
      });

    }


  }

  cancel = function () {
    this.router.navigate(['/send-money-five']);
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

        this.firstname = "";
        this.lastname = "";

        this.cardNumber = "";
        this.expiryMonth = "";
        this.expiryYear = "";
        this.cvc = "";

        let decryptedData_send_amount = localStorage.getItem('send_amount');
        var bytes_send_amount = CryptoJS.AES.decrypt(decryptedData_send_amount.toString(), 'Zipcoin');
        this.send_amount = JSON.parse(bytes_send_amount.toString(CryptoJS.enc.Utf8));

        let decryptedData_send_currency = localStorage.getItem('send_currency');
        var bytes_send_currency = CryptoJS.AES.decrypt(decryptedData_send_currency.toString(), 'Zipcoin');
        this.send_currency = JSON.parse(bytes_send_currency.toString(CryptoJS.enc.Utf8));

        let decryptedData_username = localStorage.getItem('username');
        var bytes_username = CryptoJS.AES.decrypt(decryptedData_username.toString(), 'Zipcoin');
        this.chkfname = JSON.parse(bytes_username.toString(CryptoJS.enc.Utf8));

        let decryptedData_lastname = localStorage.getItem('lastname');
        var bytes_lastname = CryptoJS.AES.decrypt(decryptedData_lastname.toString(), 'Zipcoin');
        this.chklname = JSON.parse(bytes_lastname.toString(CryptoJS.enc.Utf8));

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
