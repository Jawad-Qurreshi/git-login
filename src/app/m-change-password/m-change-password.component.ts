import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-m-change-password',
  templateUrl: './m-change-password.component.html',
  styleUrls: ['./m-change-password.component.css']
})
export class MChangePasswordComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  adminid: any;
  erropass: any;
  errnpass: boolean;
  errcpass: boolean;
  conpassword: string;
  newpassword: string;
  oldpassword: string;

  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  changepassword = function (data) {

    let valid_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let chkpass = valid_password.test(data.newpassword);
    let chkconpass = valid_password.test(data.conpassword);

    if (data.oldpassword == "") {
      this.erropass = false;
      alertify.error("Please Enter Old Password");
    } else {
      this.erropass = true;
    }

    if (data.newpassword == "" || chkpass == false) {
      this.errnpass = false;
      alertify.error("Please Enter Valid New Password");
    } else {
      this.errnpass = true;
    }

    if (data.conpassword == "" || chkconpass == false) {
      this.errcpass = false;
      alertify.error("Please Enter Valid Confirm Password");
    } else {

      if (data.conpassword == data.newpassword) {
        this.errcpass = true;
      } else {
        this.errcpass = false;
        alertify.error("Password Does't Match");
      }
    }

    if (this.erropass == true && this.errnpass == true && this.errcpass == true) {

      var chkdata = {
        "adminid": this.adminid,
        "oldpass": data.oldpassword,
        "newpass": data.newpassword
      }

      const url = `${this.hosturl + this.port + "/up_admin_password"}`;
      this.http.put(url, JSON.stringify(chkdata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.oldpassword = "";
            this.newpassword = "";
            this.conpassword = "";
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

    let decryptedData = localStorage.getItem('adminid');
    if (decryptedData != null) {

      var bytes = CryptoJS.AES.decrypt(decryptedData.toString(), 'Zipcoin');
      this.adminid = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (!this.adminid) {
        this.router.navigate(['/login']);
      } else {

        this.oldpassword = "";
        this.newpassword = "";
        this.conpassword = "";

        this.erropass = true;
        this.errnpass = true;
        this.errcpass = true;

      }

    } else {
      this.router.navigate(['/login']);
    }

  }

}
