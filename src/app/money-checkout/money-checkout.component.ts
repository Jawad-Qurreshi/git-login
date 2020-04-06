import { Component, OnInit, NgZone } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-money-checkout',
  templateUrl: './money-checkout.component.html',
  styleUrls: ['./money-checkout.component.css']
})
export class MoneyCheckoutComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;
  mamount: any;
  standerd_fee: any;
  total_amount: any;
  method: any;
  text: string;
  visa_fee: any;
  amex_fee: any;

  constructor(private http: Http, private router: Router, private zone: NgZone) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

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

          var finaldata = {
            "custid": this.custid,
            "token": tokenid,
            "amount": this.mamount,
            "method": this.method,
            "currency": "USD"
          }

          const url = `${this.hosturl + this.port + "/wallet_transaction"}`;
          this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
            .then((res: Response) => {

              if (res.json().success) {

                localStorage.removeItem("mamount");
                localStorage.removeItem("standerd_fee");
                localStorage.removeItem("total_amount");
                localStorage.removeItem("method");
                localStorage.removeItem("visa_fee");
                localStorage.removeItem("amex_fee");

                alertify.success("Your Money is Added Successfully");

                this.zone.run(() => this.router.navigate(['/my-wallet']));


              }
            });

        } else {
          alertify.error(response.error.message);
        }
      });

    }


  }

  cancel = function () {
    this.router.navigate(['/add-money']);
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

        let decryptedData_mamount = localStorage.getItem('mamount');
        var bytes_mamount = CryptoJS.AES.decrypt(decryptedData_mamount.toString(), 'Zipcoin');
        this.mamount = JSON.parse(bytes_mamount.toString(CryptoJS.enc.Utf8));

        let decryptedData_standerd_fee = localStorage.getItem('standerd_fee');
        var bytes_standerd_fee = CryptoJS.AES.decrypt(decryptedData_standerd_fee.toString(), 'Zipcoin');
        this.standerd_fee = JSON.parse(bytes_standerd_fee.toString(CryptoJS.enc.Utf8));

        let decryptedData_total_amount = localStorage.getItem('total_amount');
        var bytes_total_amount = CryptoJS.AES.decrypt(decryptedData_total_amount.toString(), 'Zipcoin');
        this.total_amount = JSON.parse(bytes_total_amount.toString(CryptoJS.enc.Utf8));

        let decryptedData_method = localStorage.getItem('method');
        var bytes_method = CryptoJS.AES.decrypt(decryptedData_method.toString(), 'Zipcoin');
        this.method = JSON.parse(bytes_method.toString(CryptoJS.enc.Utf8));

        if (this.method == 'visa_card') {
          this.text = "VISA/MASTERCARD";

          // let decryptedData_visa_fee = localStorage.getItem('visa_fee');
          // var bytes_visa_fee = CryptoJS.AES.decrypt(decryptedData_visa_fee.toString(), 'Zipcoin');
          // this.visa_fee = JSON.parse(bytes_visa_fee.toString(CryptoJS.enc.Utf8));

        } else {
          this.text = "AMERICAN EXPRESS CARD";

          // let decryptedData_amex_fee = localStorage.getItem('amex_fee');
          // var bytes_amex_fee = CryptoJS.AES.decrypt(decryptedData_amex_fee.toString(), 'Zipcoin');
          // this.amex_fee = JSON.parse(bytes_amex_fee.toString(CryptoJS.enc.Utf8));

        }

        let decryptedData_username = localStorage.getItem('username');
        var bytes_username = CryptoJS.AES.decrypt(decryptedData_username.toString(), 'Zipcoin');
        this.chkfname = JSON.parse(bytes_username.toString(CryptoJS.enc.Utf8));

        let decryptedData_lastname = localStorage.getItem('lastname');
        var bytes_lastname = CryptoJS.AES.decrypt(decryptedData_lastname.toString(), 'Zipcoin');
        this.chklname = JSON.parse(bytes_lastname.toString(CryptoJS.enc.Utf8));


      }
    } else {
      this.router.navigate(['/login']);
    }

  }

}
