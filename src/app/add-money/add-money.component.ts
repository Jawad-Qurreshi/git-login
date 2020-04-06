import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.component.html',
  styleUrls: ['./add-money.component.css']
})
export class AddMoneyComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  custid: any;
  fee: any;
  amount: any;
  namount: any;
  totamount: any;
  pay_type: any;

  vper: any;
  vfinalper: any;

  aper: any;
  afinalper: any;

  erramount: any;
  errpay_type: any;
  method: any;
  vsm_card: boolean;
  amex_card: boolean;

  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  calculate_amount = function (price) {

    this.namount = price;
    this.fee = (this.namount * 1) / 100;
    this.totamount = parseFloat(this.namount) + parseFloat(this.fee);

  }

  chkbutton = function (val) {

    if (val == 'credit_card_vsmc') {

      this.vsm_card = true;
      this.amex_card = false;

      var method = CryptoJS.AES.encrypt(JSON.stringify("visa_card"), 'Zipcoin');
      localStorage.setItem("method", method.toString());

      if (this.vper == "") {

        localStorage.removeItem("amex_fee");
        this.aper = "";

        this.vper = (parseFloat(this.namount) * 3.5) / 100;
        this.vfinalper = parseFloat(this.vper) + 0.40;
        this.totamount = parseFloat(this.vfinalper) + parseFloat(this.namount) + parseFloat(this.fee);

        var vfinalper = CryptoJS.AES.encrypt(JSON.stringify(this.vfinalper), 'Zipcoin');
        localStorage.setItem("visa_fee", vfinalper.toString());

      }

    } else {

      this.vsm_card = false;
      this.amex_card = true;

      var method = CryptoJS.AES.encrypt(JSON.stringify("amex_card"), 'Zipcoin');
      localStorage.setItem("method", method.toString());

      if (this.aper == "") {

        localStorage.removeItem("visa_fee");
        this.vper = "";

        this.aper = (parseFloat(this.namount) * 3.5) / 100;
        this.afinalper = parseFloat(this.aper) + 0.80;
        this.totamount = parseFloat(this.afinalper) + parseFloat(this.namount) + parseFloat(this.fee);

        var afinalper = CryptoJS.AES.encrypt(JSON.stringify(this.afinalper), 'Zipcoin');
        localStorage.setItem("amex_fee", afinalper.toString());

      }

    }

  }

  addmoney = function (data) {

    if (data.amount == "") {
      this.erramount = false;
      alertify.error("Please Enter Amount");
    } else {
      this.erramount = true;
    }

    if (data.pay_type == "") {
      this.errpay_type = false;
      alertify.error("Please Choose Payment Method");
    } else {
      this.errpay_type = true;
    }

    if (this.erramount == true && this.errpay_type == true) {

      var mamount = CryptoJS.AES.encrypt(JSON.stringify(this.amount), 'Zipcoin');
      localStorage.setItem("mamount", mamount.toString());

      var fee = CryptoJS.AES.encrypt(JSON.stringify(this.fee), 'Zipcoin');
      localStorage.setItem("standerd_fee", fee.toString());

      var totamount = CryptoJS.AES.encrypt(JSON.stringify(this.totamount), 'Zipcoin');
      localStorage.setItem("total_amount", totamount.toString());

      this.router.navigate(['/money-checkout']);

    }

  }

  cancel = function () {
    this.router.navigate(['/my-wallet']);

    localStorage.removeItem("mamount");
    localStorage.removeItem("standerd_fee");
    localStorage.removeItem("total_amount");
    localStorage.removeItem("method");
    localStorage.removeItem("visa_fee");
    localStorage.removeItem("amex_fee");

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

        this.amount = "";
        this.namount = "";
        this.pay_type = "";

        this.erramount = true;
        this.errpay_type = true;

        this.vper = "";
        this.aper = "";

        let decryptedData_mamount = localStorage.getItem('mamount');
        if (decryptedData_mamount != null) {
          var bytes_mamount = CryptoJS.AES.decrypt(decryptedData_mamount.toString(), 'Zipcoin');
          this.amount = JSON.parse(bytes_mamount.toString(CryptoJS.enc.Utf8));
          this.namount = JSON.parse(bytes_mamount.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_standerd_fee = localStorage.getItem('standerd_fee');
        if (decryptedData_standerd_fee != null) {
          var bytes_standerd_fee = CryptoJS.AES.decrypt(decryptedData_standerd_fee.toString(), 'Zipcoin');
          this.fee = JSON.parse(bytes_standerd_fee.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_total_amount = localStorage.getItem('total_amount');
        if (decryptedData_total_amount != null) {
          var bytes_total_amount = CryptoJS.AES.decrypt(decryptedData_total_amount.toString(), 'Zipcoin');
          this.totamount = JSON.parse(bytes_total_amount.toString(CryptoJS.enc.Utf8));
        }

        let decryptedData_method = localStorage.getItem('method');
        if (decryptedData_method != null) {
          var bytes_method = CryptoJS.AES.decrypt(decryptedData_method.toString(), 'Zipcoin');
          this.method = JSON.parse(bytes_method.toString(CryptoJS.enc.Utf8));
        }


        if (this.method == 'visa_card') {

          let decryptedData_visa_fee = localStorage.getItem('visa_fee');
          if (decryptedData_visa_fee != null) {
            var bytes_visa_fee = CryptoJS.AES.decrypt(decryptedData_visa_fee.toString(), 'Zipcoin');
            this.vfinalper = JSON.parse(bytes_visa_fee.toString(CryptoJS.enc.Utf8));
          }

          this.vsm_card = true;
          this.amex_card = false;

          this.pay_type = "credit_card_vsmc";

        } else if (this.method == 'amex_card') {

          let decryptedData_amex_fee = localStorage.getItem('amex_fee');
          if (decryptedData_amex_fee != null) {
            var bytes_amex_fee = CryptoJS.AES.decrypt(decryptedData_amex_fee.toString(), 'Zipcoin');
            this.afinalper = JSON.parse(bytes_amex_fee.toString(CryptoJS.enc.Utf8));
          }

          this.vsm_card = false;
          this.amex_card = true;

          this.pay_type = "credit_card_amex";

        }

      }
    } else {
      this.router.navigate(['/login']);
    }

  }

}
