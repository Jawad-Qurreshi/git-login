import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-m-add-city',
  templateUrl: './m-add-city.component.html',
  styleUrls: ['./m-add-city.component.css']
})
export class MAddCityComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  adminid: any;

  errcountry: any;
  errstate: any;
  errcity: any;

  country: any;
  state: any;
  city: any;

  countryname: any;
  statename: any;


  countrystate = function (cid) {
    const getstate = `${this.hosturl + this.port + "/state/"}${cid}`;
    this.http.get(getstate).subscribe(
      (res: Response) => {
        this.state = res.json().state;
      }
    )
  }

  addcity = function (data) {

    let valid_name = /^[a-zA-Z ]*$/;
    let chkcity = valid_name.test(data.city);

    if (data.countryname == "") {
      this.errcountry = false;
      alertify.error("Please Select Country Name");
    } else {
      this.errcountry = true;
    }

    if (data.statename == "") {
      this.errstate = false;
      alertify.error("Please Select State Name");
    } else {
      this.errstate = true;
    }

    if (data.city == "" || chkcity == false) {
      this.errcity = false;
      alertify.error("Please Enter Valid City Name");
    } else {
      this.errcity = true;
    }

    if (this.errcountry == true && this.errstate == true && this.errcity == true) {

      var citydata = {
        "state": data.statename,
        "city": data.city
      }

      const url = `${this.hosturl + this.port + "/addcity"}`;
      this.http.post(url, JSON.stringify(citydata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.city = "";
            this.statename = "";
            this.countryname = "";
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

        this.errcountry = true;
        this.errstate = true;
        this.errcity = true;

        this.city = "";
        this.statename = "";
        this.countryname = "";

        const getcountry = `${this.hosturl + this.port + "/country"}`;
        this.http.get(getcountry).subscribe(
          (res: Response) => {
            this.country = res.json().country;
          }
        )

      }

    } else {
      this.router.navigate(['/login']);
    }

  }

}
