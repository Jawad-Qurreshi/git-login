import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-two-auth',
  templateUrl: './two-auth.component.html',
  styleUrls: ['./two-auth.component.css']
})
export class TwoAuthComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  custid: any;
  show: any;
  url: any;
  address: any;
  qrcode: any;
  errcode: any;
  appcode: any;

  otp: any;
  errotp: any;
  errphone: any;
  phone: any;

  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  clear = function () {
    localStorage.removeItem("fname");
    localStorage.removeItem("lname");
    localStorage.removeItem("phone");
    localStorage.removeItem("dob");
    localStorage.removeItem("state");
    localStorage.removeItem("streetaddress");
    localStorage.removeItem("occupation");
    localStorage.removeItem("country");
    localStorage.removeItem("city");
    localStorage.removeItem("postalcode");
    localStorage.removeItem("doctype");
    localStorage.removeItem("docnumber");
    localStorage.removeItem("issue_date");
    localStorage.removeItem("expiry_date");
    localStorage.removeItem("address_as_doc");
    localStorage.removeItem("frontval");
    localStorage.removeItem("frontside_photo");
    localStorage.removeItem("backval");
    localStorage.removeItem("backside_photo");
    localStorage.removeItem("writeval");
    localStorage.removeItem("writer_photo");

    localStorage.removeItem("billval");
    localStorage.removeItem("bill_photo");

    localStorage.removeItem("selfival");
    localStorage.removeItem("selfi_photo");

    localStorage.removeItem("oldbill");
    localStorage.removeItem("oldbpath");
    localStorage.removeItem("oldfpath");
    localStorage.removeItem("oldselfi");
    localStorage.removeItem("oldwpath");
  }

  getqrauth = function () {

    let decryptedData = localStorage.getItem('custid');

    var bytes = CryptoJS.AES.decrypt(decryptedData.toString(), 'Zipcoin');
    var cid = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    let val = {
      "custid": cid
    }

    const qr = `${this.hosturl + this.port + "/get_auth_config"}`;
    this.http.post(qr, val, { headers: this.headers }).toPromise()
      .then((res: Response) => {
        this.address = res.json().address;
        this.url = res.json().qrcode;
        this.show = true;
      })

  }

  enbl_dsbl = function (data) {

    if (data.appcode == "") {
      this.errcode = false;
    } else {
      this.errcode = true;
    }

    if (this.errcode == true) {

      let authdata = {
        "cid": this.custid,
        "address": this.address,
        "code": data.appcode
      }

      const url = `${this.hosturl + this.port + "/auth_code_verify"}`;
      this.http.post(url, authdata, { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.dis_status();
            this.appcode = "";
          } else {
            alertify.error(res.json().msg);
            this.dis_status();
            this.appcode = "";
          }
        });
    }


  }

  dis_status = function () {
    const qrimages = `${this.hosturl + this.port + "/chk_qrcode/"}${this.custid}`;
    this.http.get(qrimages).subscribe(
      (res: Response) => {

        let status = res.json().auth_status;
        if (status == 0) {
          this.show = true;
        } else {
          this.show = false;
        }

      }
    )
  }

  reotpdate = function (redata) {

    if (redata.phone == "") {
      this.errphone = false;
      alertify.error("Please Enter Valid Mobile Number");
    } else {
      this.errphone = true;
    }

    if (this.errphone == true) {

      var redatastorage = {
        "custid": this.custid,
        "phone": redata.phone
      }

      const url = `${this.hosturl + this.port + "/new_resend_otp"}`;
      this.http.post(url, JSON.stringify(redatastorage), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.phone = "";
          } else {
            alertify.error(res.json().msg);
          }
        })

    }

  }

  otpdate = function (data) {

    if (data.otp == "") {
      this.errotp = false;
      alertify.error("Please Enter OTP");
    } else {
      this.errotp = true;
    }

    if (this.errotp == true) {

      var otpstorage = {
        "custid": this.custid,
        "otp": data.otp
      }

      const url = `${this.hosturl + this.port + "/new_active"}`;
      this.http.post(url, JSON.stringify(otpstorage), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.otp = "";
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

        this.errcode = true;
        this.appcode = "";

        this.errotp = true;
        this.errphone = true;
        this.otp = "";
        this.phone = "";

        const qrimages = `${this.hosturl + this.port + "/chk_qrcode/"}${this.custid}`;
        this.http.get(qrimages).subscribe(
          (res: Response) => {

            let address = res.json().address;
            let status = res.json().auth_status;
            let imageurl = res.json().url;

            if (status == 0) {
              this.show = true;
            } else {
              this.show = false;
            }

            if (address == null || address == "") {
              this.getqrauth();
            } else {
              this.address = address;
              this.url = imageurl;
            }

          }
        )

      }
    } else {
      this.router.navigate(['/login']);
    }

  }

}
