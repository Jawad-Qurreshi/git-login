import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-m-beneficiary-country',
  templateUrl: './m-beneficiary-country.component.html',
  styleUrls: ['./m-beneficiary-country.component.css']
})
export class MBeneficiaryCountryComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  country: any;
  bcountry: any;
  b_dis_country: any;

  errbcountry: any;
  adminid: any;

  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  bcountrydata = function (data) {

    if (data.bcountry == "") {
      this.errbcountry = false;
    } else {
      this.errbcountry = true;
    }

    if (this.errbcountry == true) {

      const getdata = `${this.hosturl + this.port + "/benificiary_country/"}${data.bcountry}`;
      this.http.get(getdata).subscribe(
        (res: Response) => {
          if (res.json().success) {
            this.getbcountry();
            alertify.success(res.json().msg);
          } else {
            this.getbcountry();
            alertify.error(res.json().msg);
          }
        }
      )

    }

  }

  delete_data = function (id) {
    const deldata = `${this.hosturl + this.port + "/delete_country/"}${id}`;
    this.http.delete(deldata).subscribe(
      (res: Response) => {
        if (res.json().success) {
          this.getbcountry();
          alertify.success(res.json().msg);
        }
      }
    )
  }

  edit_data = function (id) {
    this.router.navigate(['/m-edit-bcountry', id]);
  }

  getbcountry = function () {

    const getcountry = `${this.hosturl + this.port + "/get_bcountry"}`;
    this.http.get(getcountry).subscribe(
      (res: Response) => {
        this.b_dis_country = res.json().get_bcountry;
        this.bcountry = "";
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
        this.bcountry = "";
        this.errbcountry = true;

        const getcountry = `${this.hosturl + this.port + "/country"}`;
        this.http.get(getcountry).subscribe(
          (res: Response) => {
            this.country = res.json().country;
          }
        )

        const getbcountry = `${this.hosturl + this.port + "/get_bcountry"}`;
        this.http.get(getbcountry).subscribe(
          (res: Response) => {
            this.b_dis_country = res.json().get_bcountry;
          }
        )
      }

    } else {
      this.router.navigate(['/login']);
    }

  }

}
