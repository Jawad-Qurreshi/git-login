import { Component, OnInit, HostListener } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from './constants';
import 'rxjs';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;
  profileurl: any = Constants.PROFILEURL;

  custid: any;
  profile: any;
  username: any;
  accountid: any;
  type: any;

  ausername: any;
  adminid: any;
  role: any;


  constructor(private router: Router, private http: Http) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  removeitem = function () {
    localStorage.removeItem('custid');
    localStorage.removeItem('profile');
    localStorage.removeItem('username');
    localStorage.removeItem('accountid');
    localStorage.removeItem('email');
  }



  ngOnInit() {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)

      let decryptedData_type = localStorage.getItem('type');
      let decryptedData_custid = localStorage.getItem('custid');
      let decryptedData_profile = localStorage.getItem('profile');
      let decryptedData_username = localStorage.getItem('username');
      let decryptedData_accountid = localStorage.getItem('accountid');
      let decryptedData_role = localStorage.getItem('role');
      let decryptedData_email = localStorage.getItem('email');

      let decryptedData_adminid = localStorage.getItem('adminid');
      let decryptedData_ausername = localStorage.getItem('username');


      if (decryptedData_type != null) {

        var bytes_type = CryptoJS.AES.decrypt(decryptedData_type.toString(), 'Zipcoin');

        if (bytes_type.toString(CryptoJS.enc.Utf8) == "") {

          this.removeitem();

        } else {


          this.type = JSON.parse(bytes_type.toString(CryptoJS.enc.Utf8));

          if (this.type == 0) {

            // if (decryptedData_custid != null && decryptedData_profile != null &&
            //   decryptedData_username != null && decryptedData_accountid != null &&
            //   decryptedData_email != null && decryptedData_role != null) {


            var bytes = CryptoJS.AES.decrypt(decryptedData_custid.toString(), 'Zipcoin');
            this.custid = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            var bytes_profile = CryptoJS.AES.decrypt(decryptedData_profile.toString(), 'Zipcoin');
            this.profile = JSON.parse(bytes_profile.toString(CryptoJS.enc.Utf8));

            var bytes_username = CryptoJS.AES.decrypt(decryptedData_username.toString(), 'Zipcoin');
            this.username = JSON.parse(bytes_username.toString(CryptoJS.enc.Utf8));

            var bytes_accountid = CryptoJS.AES.decrypt(decryptedData_accountid.toString(), 'Zipcoin');
            this.accountid = JSON.parse(bytes_accountid.toString(CryptoJS.enc.Utf8));

            var bytes_role = CryptoJS.AES.decrypt(decryptedData_role.toString(), 'Zipcoin');
            this.role = JSON.parse(bytes_role.toString(CryptoJS.enc.Utf8));

            // } else {
            //   this.type = 3;
            // }

          } else if (this.type == 1) {

            // if (decryptedData_adminid != null && decryptedData_ausername != null) {

            var bytesadminid = CryptoJS.AES.decrypt(decryptedData_adminid.toString(), 'Zipcoin');
            this.adminid = JSON.parse(bytesadminid.toString(CryptoJS.enc.Utf8));

            var bytes_ausername = CryptoJS.AES.decrypt(decryptedData_ausername.toString(), 'Zipcoin');
            this.ausername = JSON.parse(bytes_ausername.toString(CryptoJS.enc.Utf8));

            // } else {
            //   this.type = 3;
            // }

          } else {
            this.type = 3;
          }

        }

      } else {
        this.type = 3;
      }

    });

  }
}
