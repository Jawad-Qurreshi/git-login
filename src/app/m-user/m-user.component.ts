import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';


@Component({
  selector: 'app-m-user',
  templateUrl: './m-user.component.html',
  styleUrls: ['./m-user.component.css'],
  providers: [DatePipe]
})
export class MUserComponent implements OnInit {


  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  adminid: any;
  userdetails: any;
  searchText: any;
  p: number = 1;

  show: any;
  customerid: any;
  start_date: any;
  end_date: any;
  countryname: any;
  country: any;
  ip_address: any;
  devicename: any;
  osname: any;
  accountid: any;

  errenddate: any;

  cid: any;
  showdel: any;

  options: DatepickerOptions = {
    locale: enLocale,
    addClass: 'form-control',
    displayFormat: 'DD-MMM-YYYY',
    barTitleIfEmpty: 'Select Date',
    placeholder: 'dd-----yyyy',
    addStyle: {
      padding: '12px',
      border: 'none',
      width: '140px'
    },
  };

  constructor(private http: Http, private router: Router, public datepipe: DatePipe) { }
  private headers = new Headers({ 'Content-type': 'application/json' });


  login = function (cid) {

    const cust_data = `${this.hosturl + this.port + "/get_customer/"}${cid}`;
    this.http.get(cust_data).subscribe(
      (res: Response) => {
        let fulldata = res.json().get_customer;

        localStorage.removeItem("adminid");

        var type = CryptoJS.AES.encrypt(JSON.stringify('0'), 'Zipcoin');
        localStorage.setItem("type", type.toString());

        var custid = CryptoJS.AES.encrypt(JSON.stringify(fulldata[0].cust_id), 'Zipcoin');
        localStorage.setItem("custid", custid.toString());

        var fullname = CryptoJS.AES.encrypt(JSON.stringify(fulldata[0].fullname), 'Zipcoin');
        localStorage.setItem("username", fullname.toString());

        var email = CryptoJS.AES.encrypt(JSON.stringify(fulldata[0].email), 'Zipcoin');
        localStorage.setItem("email", email.toString());

        var accountid = CryptoJS.AES.encrypt(JSON.stringify(fulldata[0].account_id), 'Zipcoin');
        localStorage.setItem("accountid", accountid.toString());

        var profile = CryptoJS.AES.encrypt(JSON.stringify(fulldata[0].profile_pic), 'Zipcoin');
        localStorage.setItem("profile", profile.toString());

        localStorage.setItem('load', '0');

        setTimeout(() => {
          this.router.navigate(['dashboard']);
        }, 1000);

      });
  }

  open = function (data) {
    this.customerid = data;
    this.show = true;
  }

  opendel = function (id) {
    this.cid = id;
    this.showdel = true;
  }

  close = function () {
    this.show = false;
  }

  closedel = function () {
    this.showdel = false;
  }

  makeagent = function () {

    const gettrasferdata = `${this.hosturl + this.port + "/make_as_agent/"}${this.customerid}`;
    this.http.get(gettrasferdata).subscribe(
      (res: Response) => {
        if (res.json().success) {
          alertify.success(res.json().msg);
          this.alldata();
          this.close();
        } else {
          alertify.error(res.json().msg);
          this.alldata();
          this.close();
        }
      });

  }

  searchdata = function (data) {

    let soriginal = this.datepipe.transform(data.start_date, 'yyyy-MM-dd');
    let eoriginal = this.datepipe.transform(data.end_date, 'yyyy-MM-dd');

    if (data.start_date != "") {

      if (data.end_date == "") {
        this.errenddate = false;
        alertify.error("Please Select End Date");
      } else {
        this.errenddate = true;
      }

    } else {
      this.errenddate = true;
    }

    if (this.errenddate == true) {

      var finaldata = {
        "start_date": soriginal,
        "end_date": eoriginal,
        "country": data.countryname,
        "ipaddress": data.ip_address,
        "device": data.devicename,
        "os": data.osname,
        "accountid": data.accountid
      }

      const url = `${this.hosturl + this.port + "/searchdata"}`;
      this.http.post(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            this.userdetails = res.json().searchdata;
          } else {
            alertify.error(res.json().msg);
            if (res.json().rec == "yes") {
              this.userdetails = res.json().searchdata;
            } else {
              this.alldata();
            }
          }
        })
    }

  }

  deleteuser = function () {

    const deluser = `${this.hosturl + this.port + "/m_delete_user/"}${this.cid}`;
    this.http.get(deluser).subscribe(
      (res: Response) => {
        alertify.error(res.json().msg);
        this.alldata();
        this.closedel();
      });

  }

  alldata = function () {
    this.http.get(this.hosturl + this.port + "/m_getuser_details/").subscribe(
      (res: Response) => {
        this.userdetails = res.json().getuser_details;
      }
    )

    const getcountry = `${this.hosturl + this.port + "/country"}`;
    this.http.get(getcountry).subscribe(
      (res: Response) => {
        this.country = res.json().country;
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

        this.start_date = "";
        this.end_date = "";
        this.countryname = "";
        this.ip_address = "";
        this.devicename = "";
        this.osname = "";
        this.accountid = "";

        this.show = false;
        this.errenddate = true;

        this.showdel = false;

        this.alldata();

      }

    } else {
      this.router.navigate(['/login']);
    }

  }

}
