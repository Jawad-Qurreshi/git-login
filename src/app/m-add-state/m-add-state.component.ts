import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';



@Component({
  selector: 'app-m-add-state',
  templateUrl: './m-add-state.component.html',
  styleUrls: ['./m-add-state.component.css']
})
export class MAddStateComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;



  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  adminid: any;

  errcountry: any;
  errstate: any;

  state: any;
  country: any;
  countryname: any;

  addstate = function (data) {

    let valid_name = /^[a-zA-Z ]*$/;
    let chkstate = valid_name.test(data.state);

    if (data.countryname == "") {
      this.errcountry = false;
      alertify.error("Please Select Country Name");
    } else {
      this.errcountry = true;
    }

    if (data.state == "" || chkstate == false) {
      this.errstate = false;
      alertify.error("Please Enter Valid State Name");
    } else {
      this.errstate = true;
    }

    if (this.errcountry == true && this.errstate == true) {


      var statedata = {
        "country": data.countryname,
        "state": data.state
      }

      const url = `${this.hosturl + this.port + "/addstate"}`;
      this.http.post(url, JSON.stringify(statedata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.state = "";
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

        this.state = "";
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
