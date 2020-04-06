import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-m-edit-bcountry',
  templateUrl: './m-edit-bcountry.component.html',
  styleUrls: ['./m-edit-bcountry.component.css']
})
export class MEditBcountryComponent implements OnInit {


  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  adminid: any;
  countryname: any;
  errcountryname: any;

  bcid: any;

  constructor(private router: Router, private http: Http) { }
  private headers = new Headers({ 'Content-type': 'application/json' });


  editbcountry = function (data) {

    if (data.countryname == "") {
      this.errcountryname = false;
    } else {
      this.errcountryname = true;
    }

    if (this.errcountryname == true) {

      var bcdata = {
        "bcid": this.bcid,
        "bcountry": data.countryname
      }

      const url = `${this.hosturl + this.port + "/edit_country"}`;
      this.http.post(url, JSON.stringify(bcdata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.router.navigate(['./m-beneficiary-country']);
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

        this.errcountryname = true;

        let a = this.router.url;
        let lastChar = a.split('/');
        this.bcid = lastChar[2];


        const updata = `${this.hosturl + this.port + "/m_get_country/"}${this.bcid}`;
        this.http.get(updata).subscribe(
          (res: Response) => {
            if (res.json().success) {

              var getdata = res.json().bcountry;
              this.countryname = getdata[0].country_name;

            }
          }
        )


      }

    } else {
      this.router.navigate(['/login']);
    }


  }
}