import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-m-auth',
  templateUrl: './m-auth.component.html',
  styleUrls: ['./m-auth.component.css'],
  providers: [DatePipe]
})
export class MAuthComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  adminid: any;
  errtoken: any;

  constructor(private http: Http, private router: Router, public datepipe: DatePipe) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  two_auth = function (data) {

    if (data.token == "") {
      this.errtoken = false;
    } else {
      this.errtoken = true;
    }

    if (this.errtoken == true) {

      let authdata = {
        "aid": this.adminid,
        "code": data.token
      }

      const url = `${this.hosturl + this.port + "/admin_auth_code_verify_from_login"}`;
      this.http.post(url, authdata, { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {

            alertify.success(res.json().msg);

            var type = CryptoJS.AES.encrypt(JSON.stringify('1'), 'Zipcoin');
            localStorage.setItem("type", type.toString());

            setTimeout(() => {
              this.router.navigate(['m-dashboard']);
            }, 1000);

          } else {
            alertify.error(res.json().msg);
          }
        });
    }

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
        this.errtoken = true;
      }

    } else {
      this.router.navigate(['/login']);
    }

  }

}
