import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-m-add-promocode',
  templateUrl: './m-add-promocode.component.html',
  styleUrls: ['./m-add-promocode.component.css']
})
export class MAddPromocodeComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  adminid: any;
  currency: any;
  pvalue: any;

  errcurrency: any;
  errpvalue: any;

  promocode = function (data) {

    if (data.currency == "") {
      this.errcurrency = false;
      alertify.error("Please Select Currency");
    } else {
      this.errcurrency = true;
    }

    if (data.pvalue == "") {
      this.errpvalue = false;
      alertify.error("Please Enter Promocode Value");
    } else {
      this.errpvalue = true;
    }

    if (this.errcurrency == true && this.errpvalue == true) {

      var finaldata = {
        "currency": data.currency,
        "value": data.pvalue
      }

      const url = `${this.hosturl + this.port + "/addpromocode"}`;
      this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.router.navigate(['/m-promocode']);
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

        this.currency = "";
        this.pvalue = "";

        this.errcurrency = true;
        this.errpvalue = true;

      }

    } else {
      this.router.navigate(['/login']);
    }

  }

}
