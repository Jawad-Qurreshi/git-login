import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';



@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  phone: any;
  country: any;
  email: any;
  custid: any;
  phonecode: any;
  show: any;

  erremail: any;

  showphone: any;
  errphoneno: any;

  upphonecode: any;

  errcountry: any;
  countryname: any;
  upcountry: any;
  upphoneno: any;

  upemail: string;

  password: any;
  newpassword: any;

  errpassword: any;
  errnewpassword: any;

  constructor(private router: Router, private http: Http) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  change = function (cid) {

    if (cid != "") {
      const countrycode = `${this.hosturl + this.port + "/chk_code/"}${cid}`;
      this.http.get(countrycode).subscribe(
        (res: Response) => {
          this.upphonecode = res.json().code;
        }
      )
    } else {
      this.upphonecode = "";
    }


  }

  open = function () {
    this.show = true;
  }

  close = function () {
    this.show = false;
  }

  changeemail = function (data) {

    let valid_email = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let chkemail = valid_email.test(data.upemail);

    if (data.upemail == "" || chkemail == false) {
      this.erremail = false;
      alertify.error("Please Enter Valid Email");
    } else {
      this.erremail = true;
    }

    if (this.erremail == true) {

      let updata = {
        "cid": this.custid,
        "email": data.upemail
      }

      const url = `${this.hosturl + this.port + "/update_email"}`;
      this.http.post(url, JSON.stringify(updata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.email = res.json().email;
            localStorage.setItem("email", this.email);
            this.upemail = "";
            this.close();
          } else {
            alertify.error(res.json().msg);
          }
        })

    }

  }

  open_phone_popup = function () {
    this.showphone = true;
  }

  close_phone_popup = function () {
    this.showphone = false;
  }

  changephone = function (data) {

    let valid_digit = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit.test(data.upphoneno);

    if (data.countryname == "") {
      this.errcountry = false;
      alertify.error("Please Select Country Name");
    } else {
      this.errcountry = true;
    }

    if (data.upphoneno == "" || chkphone == false) {
      this.errphoneno = false;
      alertify.error("Please Enter Valid Phone Number");
    } else {
      this.errphoneno = true;
    }

    if (this.errcountry == true && this.errphoneno == true) {

      let updata = {
        "cid": this.custid,
        "phonecode": this.upphonecode,
        "phoneno": data.upphoneno
      }

      const url = `${this.hosturl + this.port + "/update_phone"}`;
      this.http.post(url, JSON.stringify(updata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.phone = res.json().phoneno;
            this.phonecode = res.json().phonecode;

            this.countryname = "";
            this.upphoneno = "";
            this.upphonecode = "";

            this.display();
            this.close_phone_popup();
          } else {
            alertify.error(res.json().msg);
          }
        })

    }

  }

  changepassword = function (data) {

    let valid_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let chkpass = valid_password.test(data.password);
    let chkrepass = valid_password.test(data.newpassword);

    if (data.password == "" || chkpass == false) {
      this.errpassword = false;
      alertify.error("Please Enter Valid Current Password");
    } else {
      this.errpassword = true;
    }

    if (data.newpassword == "" || chkrepass == false) {
      this.errnewpassword = false;
      alertify.error("Please Enter Valid New Password");
    } else {
      this.errnewpassword = true;
    }

    if (this.errpassword == true && this.errnewpassword == true) {

      this.data = {
        "oldpassword": data.password,
        "newpassword": data.newpassword,
        "id": this.custid
      }

      const url = `${this.hosturl + this.port + "/changepassword"}`;
      this.http.post(url, JSON.stringify(this.data), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.password = "";
            this.newpassword = "";
          } else {
            alertify.error(res.json().msg);
          }
        })

    }

  }

  checkvalid_phone = function (data) {

    let valid_digit = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit.test(data);

    if (chkphone == false) {
      this.errphoneno = false;
      alertify.error("Please Enter Valid Phone Number");
    }

  }

  display = function () {
    const gettrasferdata = `${this.hosturl + this.port + "/customer_details/"}${this.custid}`;
    this.http.get(gettrasferdata).subscribe(
      (res: Response) => {
        let custdetails = res.json().details;

        this.email = custdetails[0].email;
        this.countryname = custdetails[0].country;
        this.upphonecode = custdetails[0].phonecode;
        this.phone = custdetails[0].phone;

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

    var id = localStorage.getItem("custid");

    if (id != null) {

      var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
      this.custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

      this.show = false;
      this.erremail = true;

      this.errcountry = true;
      this.errphoneno = true;

      this.countryname = "";
      this.upphoneno = "";

      this.upemail = "";

      this.password = "";
      this.newpassword = "";
      this.errpassword = true;
      this.errnewpassword = true;

      const getcountry = `${this.hosturl + this.port + "/country"}`;
      this.http.get(getcountry).subscribe(
        (res: Response) => {
          this.upcountry = res.json().country;
        }
      )

      const gettrasferdata = `${this.hosturl + this.port + "/customer_details/"}${this.custid}`;
      this.http.get(gettrasferdata).subscribe(
        (res: Response) => {
          let custdetails = res.json().details;

          this.email = custdetails[0].email;
          this.countryname = custdetails[0].country;
          this.upphonecode = custdetails[0].phonecode;
          this.phone = custdetails[0].phone;

        }
      )

    } else {
      this.router.navigate(['/login']);
    }

  }

}
