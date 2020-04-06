import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-m-two-auth',
  templateUrl: './m-two-auth.component.html',
  styleUrls: ['./m-two-auth.component.css'],
  providers: [DatePipe]
})
export class MTwoAuthComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  adminid: any;
  show: any;
  url: any;
  address: any;
  qrcode: any;
  errcode: any;
  appcode: any;

  constructor(private http: Http, private router: Router, public datepipe: DatePipe) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  getqrauth = function () {

    let val = {
      "adminid": this.adminid
    }

    const qr = `${this.hosturl + this.port + "/get_admin_auth_config"}`;
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
        "aid": this.adminid,
        "address": this.address,
        "code": data.appcode
      }

      const url = `${this.hosturl + this.port + "/auth_admin_code_verify"}`;
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

    const qrimages = `${this.hosturl + this.port + "/chk_admin_qrcode/"}${this.adminid}`;
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

        this.errcode = true;
        this.appcode = "";

        const qrimages = `${this.hosturl + this.port + "/chk_admin_qrcode/"}${this.adminid}`;
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
