import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';


@Component({
  selector: 'app-one-kyc',
  templateUrl: './one-kyc.component.html',
  styleUrls: ['./one-kyc.component.css'],
  providers: [DatePipe]
})
export class OneKycComponent implements OnInit {


  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  errfname: any;
  errmname: any;
  erremail: any;
  errlname: any;
  errphone: any;
  errdob: any;
  errstate: any;
  errsadd: any;
  erroccu: any;
  errcountry: any;
  errcity: any;
  errpostcode: any;

  fname: any;
  mname: any;
  email: any;
  lname: any;
  phone: any;
  dob: any;
  state: any;
  streetaddress: any;
  occupation: any;
  country: any;
  city: any;
  postalcode: any;

  countryname: any;
  statename: any;
  cityname: any;

  kycdata: any;
  view: any;
  settdate: any;

  wait: any;

  phonecode: any;

  options: DatepickerOptions = {
    locale: enLocale,
    addClass: 'form-control',
    displayFormat: 'DD-MMM-YYYY',
    barTitleIfEmpty: 'Select Date',
    placeholder: 'dd-----yyyy',
    addStyle: {
      padding: '12px',
      border: 'none',
      width: '100%'
    },
  };
  swait: boolean;

  constructor(private router: Router, private http: Http, public datepipe: DatePipe) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  countrystate = function (cid) {

    if (cid != "") {
      const countrycode = `${this.hosturl + this.port + "/chk_code/"}${cid}`;
      this.http.get(countrycode).subscribe(
        (res: Response) => {
          this.phonecode = res.json().code;
        }
      )
    } else {
      this.phonecode = "";
    }

    const getstate = `${this.hosturl + this.port + "/state/"}${cid}`;
    this.http.get(getstate).subscribe(
      (res: Response) => {
        this.statename = res.json().state;
      }
    )
  }

  statecity = function (sid) {
    const getcity = `${this.hosturl + this.port + "/city/"}${sid}`;
    this.http.get(getcity).subscribe(
      (res: Response) => {
        this.cityname = res.json().city;
      }
    )
  }

  checkvalid_fname = function (data) {

    let valid_name = /^[a-zA-Z ]*$/;
    let chkfname = valid_name.test(data);

    if (chkfname == false) {
      this.errfname = false;
      alertify.error("Please Enter Valid First Name");
    } else {
      this.errfname = true;
    }

  }

  checkvalid_mname = function (data) {

    let valid_name = /^[a-zA-Z ]*$/;
    let chkmname = valid_name.test(data);

    if (chkmname == false) {
      this.errmname = false;
      alertify.error("Please Enter Valid Middle Name");
    } else {
      this.errmname = true;
    }

  }

  checkvalid_lname = function (data) {

    let valid_name = /^[a-zA-Z ]*$/;
    let chklname = valid_name.test(data);

    if (chklname == false) {
      this.errlname = false;
      alertify.error("Please Enter Valid Last Name");
    } else {
      this.errlname = true;
    }

  }

  checkvalid_email = function (data) {

    let valid_email = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let chklemail = valid_email.test(data);

    if (chklemail == false) {
      this.erremail = false;
      alertify.error("Please Enter Valid Email");
    } else {
      this.erremail = true;
    }

  }

  checkvalid_phone = function (data) {

    let valid_digit = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit.test(data);

    if (chkphone == false) {
      this.errphone = false;
      alertify.error("Please Enter Valid Phone Number");
    } else {
      this.errphone = true;
    }

  }

  checkvalid_postcode = function (data) {

    let valid_postcode = /^[a-zA-Z0-9 ]*$/;
    let chklpostcode = valid_postcode.test(data);

    if (chklpostcode == false) {
      this.errpostcode = false;
      alertify.error("Please Enter Valid Postal Code");
    } else {
      this.errpostcode = true;
    }

  }

  kyc_first = function (data) {

    var id = localStorage.getItem("custid");
    var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
    var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

    let valid_name = /^[a-zA-Z ]*$/;
    let chkfname = valid_name.test(this.fname);
    let chkmname = valid_name.test(this.mname);
    let chklname = valid_name.test(this.lname);
    let chkoccupation = valid_name.test(this.occupation);

    let valid_email = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let chkemail = valid_email.test(this.email);

    let valid_digit = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit.test(this.phone);

    let valid_postcode = /^[a-zA-Z0-9 ]*$/;
    let chkpostalcode = valid_postcode.test(this.postalcode);

    if (this.fname == "" || chkfname == false) {
      this.errfname = false;
      alertify.error("Please Enter Valid First Name");
    } else {
      this.errfname = true;
    }

    if (this.mname == "" || chkmname == false) {
      this.errmname = false;
      alertify.error("Please Enter Valid Middle Name");
    } else {
      this.errmname = true;
    }

    if (this.email == "" || chkemail == false) {
      this.erremail = false;
      alertify.error("Please Enter Valid Email");
    } else {
      this.erremail = true;
    }

    if (this.lname == "" || chklname == false) {
      this.errlname = false;
      alertify.error("Please Enter Valid Last Name");
    } else {
      this.errlname = true;
    }

    if (this.phone == "" || chkphone == false) {
      this.errphone = false;
      alertify.error("Please Enter Valid Phone Number");
    } else {
      this.errphone = true;
    }

    let currentdate = new Date();
    let matchdate = this.datepipe.transform(currentdate, 'yyyy-MM-dd');
    let original = this.datepipe.transform(this.dob, 'yyyy-MM-dd');

    if (this.dob == "") {
      this.errdob = false;
      alertify.error("Please Enter Date of Birth");
    } else {
      if (matchdate >= original) {
        this.errdob = true;
      } else {
        this.errdob = false;
        alertify.error("Please Enter Valid Date Of Birth");
      }
    }

    if (this.state == "") {
      this.errstate = false;
      alertify.error("Please Select State Name");
    } else {
      this.errstate = true;
    }

    if (this.streetaddress == "") {
      this.errsadd = false;
      alertify.error("Please Enter Valid Street Address");
    } else {
      this.errsadd = true;
    }

    if (this.occupation == "" || chkoccupation == false) {
      this.erroccu = false;
      alertify.error("Please Enter Valid Occupation");
    } else {
      this.erroccu = true;
    }

    if (this.country == "") {
      this.errcountry = false;
      alertify.error("Please Select Country Name");
    } else {
      this.errcountry = true;
    }

    if (this.city == "") {
      this.errcity = false;
      alertify.error("Please Select City Name");
    } else {
      this.errcity = true;
    }

    if (this.postalcode == "" || chkpostalcode == false) {
      this.errpostcode = false;
      alertify.error("Please Enter Valid Postal Code");
    } else {
      this.errpostcode = true;
    }

    if (this.errfname == true && this.errmname == true && this.erremail == true && this.errlname == true && this.errphone == true
      && this.errdob == true && this.errstate == true && this.errsadd == true && this.erroccu == true
      && this.errcountry == true && this.errcity == true && this.errpostcode == true) {

      this.wait = false;

      let firstdata = {
        "custid": custid,
        "fname": data.fname,
        "mname": data.mname,
        "email": data.email,
        "lname": data.lname,
        "phonecode": this.phonecode,
        "phone": data.phone,
        "dob": original,
        "state": data.state,
        "streetaddress": data.streetaddress,
        "occupation": data.occupation,
        "country": data.country,
        "city": data.city,
        "postalcode": data.postalcode
      }

      const url = `${this.hosturl + this.port + "/firstkyc"}`;
      this.http.post(url, JSON.stringify(firstdata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            this.clear();
            this.wait = true;
            this.router.navigate(['kyc-document-two']);
          }
        })

    }

  }

  save_kyc_first = function () {

    var id = localStorage.getItem("custid");
    var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
    var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

    let valid_name = /^[a-zA-Z ]*$/;
    let chkfname = valid_name.test(this.fname);
    let chkmname = valid_name.test(this.mname);
    let chklname = valid_name.test(this.lname);
    let chkoccupation = valid_name.test(this.occupation);

    let valid_email = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let chkemail = valid_email.test(this.email);

    let valid_digit = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit.test(this.phone);

    let valid_postcode = /^[a-zA-Z0-9 ]*$/;
    let chkpostalcode = valid_postcode.test(this.postalcode);

    if (this.fname == "" || chkfname == false) {
      this.errfname = false;
      alertify.error("Please Enter Valid First Name");
    } else {
      this.errfname = true;
    }

    if (this.mname == "" || chkmname == false) {
      this.errmname = false;
      alertify.error("Please Enter Valid Middle Name");
    } else {
      this.errmname = true;
    }

    if (this.email == "" || chkemail == false) {
      this.erremail = false;
      alertify.error("Please Enter Valid Email");
    } else {
      this.erremail = true;
    }

    if (this.lname == "" || chklname == false) {
      this.errlname = false;
      alertify.error("Please Enter Valid Last Name");
    } else {
      this.errlname = true;
    }

    if (this.phone == "" || chkphone == false) {
      this.errphone = false;
      alertify.error("Please Enter Valid Phone Number");
    } else {
      this.errphone = true;
    }

    let currentdate = new Date();
    let matchdate = this.datepipe.transform(currentdate, 'yyyy-MM-dd');
    let original = this.datepipe.transform(this.dob, 'yyyy-MM-dd');

    if (this.dob == "") {
      this.errdob = false;
      alertify.error("Please Enter Date of Birth");
    } else {
      if (matchdate >= original) {
        this.errdob = true;
      } else {
        this.errdob = false;
        alertify.error("Please Enter Valid Date Of Birth");
      }
    }

    if (this.state == "") {
      this.errstate = false;
      alertify.error("Please Select State Name");
    } else {
      this.errstate = true;
    }

    if (this.streetaddress == "") {
      this.errsadd = false;
      alertify.error("Please Enter Valid Street Address");
    } else {
      this.errsadd = true;
    }

    if (this.occupation == "" || chkoccupation == false) {
      this.erroccu = false;
      alertify.error("Please Enter Valid Occupation");
    } else {
      this.erroccu = true;
    }

    if (this.country == "") {
      this.errcountry = false;
      alertify.error("Please Select Country Name");
    } else {
      this.errcountry = true;
    }

    if (this.city == "") {
      this.errcity = false;
      alertify.error("Please Select City Name");
    } else {
      this.errcity = true;
    }

    if (this.postalcode == "" || chkpostalcode == false) {
      this.errpostcode = false;
      alertify.error("Please Enter Valid Postal Code");
    } else {
      this.errpostcode = true;
    }

    if (this.errfname == true && this.errmname == true && this.erremail == true && this.errlname == true && this.errphone == true
      && this.errdob == true && this.errstate == true && this.errsadd == true && this.erroccu == true
      && this.errcountry == true && this.errcity == true && this.errpostcode == true) {

      this.swait = false;

      let firstdata = {
        "custid": custid,
        "fname": this.fname,
        "mname": this.mname,
        "email": this.email,
        "lname": this.lname,
        "phonecode": this.phonecode,
        "phone": this.phone,
        "dob": original,
        "state": this.state,
        "streetaddress": this.streetaddress,
        "occupation": this.occupation,
        "country": this.country,
        "city": this.city,
        "postalcode": this.postalcode
      }

      const url = `${this.hosturl + this.port + "/firstkyc"}`;
      this.http.post(url, JSON.stringify(firstdata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            this.clear();
            this.swait = true;

            var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
            var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

            const getkyc = `${this.hosturl + this.port + "/getkycdata/"}${custid}`;
            this.http.get(getkyc).subscribe(
              (res: Response) => {
                this.kycdata = res.json().customer;

                this.view = false;
                this.wait = true;
                this.swait = true;

                this.fname = this.kycdata[0].first_name;
                this.mname = this.kycdata[0].middle_name;
                this.email = this.kycdata[0].email;
                this.lname = this.kycdata[0].last_name;
                this.phone = this.kycdata[0].phone_number;
                this.phonecode = this.kycdata[0].phonecode;
                let bdate = this.kycdata[0].dob;
                this.dob = this.datepipe.transform(bdate, 'yyyy-MM-dd');
                this.state = this.kycdata[0].state;
                this.statecity(this.state);
                this.streetaddress = this.kycdata[0].street_address;
                this.occupation = this.kycdata[0].occupation;
                this.country = this.kycdata[0].country;
                this.countrystate(this.country);
                this.city = this.kycdata[0].city;
                this.postalcode = this.kycdata[0].zipcode;

              }
            )

          }
        })

    }

  }

  up_kyc_first = function (data) {

    var id = localStorage.getItem("custid");
    var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
    var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

    let valid_name = /^[a-zA-Z ]*$/;
    let chkfname = valid_name.test(this.fname);
    let chkmname = valid_name.test(this.mname);
    let chklname = valid_name.test(this.lname);
    let chkoccupation = valid_name.test(this.occupation);

    let valid_email = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let chkemail = valid_email.test(this.email);

    let valid_digit = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit.test(this.phone);

    let valid_postcode = /^[a-zA-Z0-9 ]*$/;
    let chkpostalcode = valid_postcode.test(this.postalcode);

    if (this.fname == "" || chkfname == false) {
      this.errfname = false;
      alertify.error("Please Enter Valid First Name");
    } else {
      this.errfname = true;
    }

    if (this.mname == "" || chkmname == false) {
      this.errmname = false;
      alertify.error("Please Enter Valid Middle Name");
    } else {
      this.errmname = true;
    }

    if (this.email == "" || chkemail == false) {
      this.erremail = false;
      alertify.error("Please Enter Valid Email");
    } else {
      this.erremail = true;
    }

    if (this.lname == "" || chklname == false) {
      this.errlname = false;
      alertify.error("Please Enter Valid Last Name");
    } else {
      this.errlname = true;
    }

    if (this.phone == "" || chkphone == false) {
      this.errphone = false;
      alertify.error("Please Enter Valid Phone Number");
    } else {
      this.errphone = true;
    }

    let currentdate = new Date();
    let matchdate = this.datepipe.transform(currentdate, 'yyyy-MM-dd');
    let original = this.datepipe.transform(this.dob, 'yyyy-MM-dd');

    if (this.dob == "") {
      this.errdob = false;
      alertify.error("Please Enter Date of Birth");
    } else {
      if (matchdate >= original) {
        this.errdob = true;
      } else {
        this.errdob = false;
        alertify.error("Please Enter Valid Date Of Birth");
      }
    }

    if (this.state == "") {
      this.errstate = false;
      alertify.error("Please Select State Name");
    } else {
      this.errstate = true;
    }

    if (this.streetaddress == "") {
      this.errsadd = false;
      alertify.error("Please Enter Valid Street Address");
    } else {
      this.errsadd = true;
    }

    if (this.occupation == "" || chkoccupation == false) {
      this.erroccu = false;
      alertify.error("Please Enter Valid Occupation");
    } else {
      this.erroccu = true;
    }

    if (this.country == "") {
      this.errcountry = false;
      alertify.error("Please Select Country Name");
    } else {
      this.errcountry = true;
    }

    if (this.city == "") {
      this.errcity = false;
      alertify.error("Please Select City Name");
    } else {
      this.errcity = true;
    }

    if (this.postalcode == "" || chkpostalcode == false) {
      this.errpostcode = false;
      alertify.error("Please Enter Valid Postal Code");
    } else {
      this.errpostcode = true;
    }

    if (this.errfname == true && this.errmname == true && this.erremail == true && this.errlname == true && this.errphone == true
      && this.errdob == true && this.errstate == true && this.errsadd == true && this.erroccu == true
      && this.errcountry == true && this.errcity == true && this.errpostcode == true) {

      this.wait = false;

      let firstdata = {
        "custid": custid,
        "fname": data.fname,
        "mname": data.mname,
        "email": data.email,
        "lname": data.lname,
        "phonecode": this.phonecode,
        "phone": data.phone,
        "dob": original,
        "state": data.state,
        "streetaddress": data.streetaddress,
        "occupation": data.occupation,
        "country": data.country,
        "city": data.city,
        "postalcode": data.postalcode
      }

      const url = `${this.hosturl + this.port + "/upfirstkyc"}`;
      this.http.post(url, JSON.stringify(firstdata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            this.wait = true;
            this.router.navigate(['kyc-document-two']);
          }
        })

    }
  }

  save_up_kyc_first = function () {

    var id = localStorage.getItem("custid");
    var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
    var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

    let valid_name = /^[a-zA-Z ]*$/;
    let chkfname = valid_name.test(this.fname);
    let chkmname = valid_name.test(this.mname);
    let chklname = valid_name.test(this.lname);
    let chkoccupation = valid_name.test(this.occupation);

    let valid_email = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let chkemail = valid_email.test(this.email);

    let valid_digit = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit.test(this.phone);

    let valid_postcode = /^[a-zA-Z0-9 ]*$/;
    let chkpostalcode = valid_postcode.test(this.postalcode);

    if (this.fname == "" || chkfname == false) {
      this.errfname = false;
      alertify.error("Please Enter Valid First Name");
    } else {
      this.errfname = true;
    }

    if (this.mname == "" || chkmname == false) {
      this.errmname = false;
      alertify.error("Please Enter Valid Middle Name");
    } else {
      this.errmname = true;
    }

    if (this.email == "" || chkemail == false) {
      this.erremail = false;
      alertify.error("Please Enter Valid Email");
    } else {
      this.erremail = true;
    }

    if (this.lname == "" || chklname == false) {
      this.errlname = false;
      alertify.error("Please Enter Valid Last Name");
    } else {
      this.errlname = true;
    }

    if (this.phone == "" || chkphone == false) {
      this.errphone = false;
      alertify.error("Please Enter Valid Phone Number");
    } else {
      this.errphone = true;
    }

    let currentdate = new Date();
    let matchdate = this.datepipe.transform(currentdate, 'yyyy-MM-dd');
    let original = this.datepipe.transform(this.dob, 'yyyy-MM-dd');

    if (this.dob == "") {
      this.errdob = false;
      alertify.error("Please Enter Date of Birth");
    } else {
      if (matchdate >= original) {
        this.errdob = true;
      } else {
        this.errdob = false;
        alertify.error("Please Enter Valid Date Of Birth");
      }
    }

    if (this.state == "") {
      this.errstate = false;
      alertify.error("Please Select State Name");
    } else {
      this.errstate = true;
    }

    if (this.streetaddress == "") {
      this.errsadd = false;
      alertify.error("Please Enter Valid Street Address");
    } else {
      this.errsadd = true;
    }

    if (this.occupation == "" || chkoccupation == false) {
      this.erroccu = false;
      alertify.error("Please Enter Valid Occupation");
    } else {
      this.erroccu = true;
    }

    if (this.country == "") {
      this.errcountry = false;
      alertify.error("Please Select Country Name");
    } else {
      this.errcountry = true;
    }

    if (this.city == "") {
      this.errcity = false;
      alertify.error("Please Select City Name");
    } else {
      this.errcity = true;
    }

    if (this.postalcode == "" || chkpostalcode == false) {
      this.errpostcode = false;
      alertify.error("Please Enter Valid Postal Code");
    } else {
      this.errpostcode = true;
    }

    if (this.errfname == true && this.errmname == true && this.erremail == true && this.errlname == true && this.errphone == true
      && this.errdob == true && this.errstate == true && this.errsadd == true && this.erroccu == true
      && this.errcountry == true && this.errcity == true && this.errpostcode == true) {

      this.swait = false;

      let firstdata = {
        "custid": custid,
        "fname": this.fname,
        "mname": this.mname,
        "email": this.email,
        "lname": this.lname,
        "phonecode": this.phonecode,
        "phone": this.phone,
        "dob": original,
        "state": this.state,
        "streetaddress": this.streetaddress,
        "occupation": this.occupation,
        "country": this.country,
        "city": this.city,
        "postalcode": this.postalcode
      }

      const url = `${this.hosturl + this.port + "/upfirstkyc"}`;
      this.http.post(url, JSON.stringify(firstdata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            this.swait = true;
          }
        })

    }
  }

  errorvariable = function () {
    this.errfname = true;
    this.errmname = true;
    this.erremail = true;
    this.errlname = true;
    this.errphone = true;
    this.errdob = true;
    this.errstate = true;
    this.errsadd = true;
    this.erroccu = true;
    this.errcountry = true;
    this.errcity = true;
    this.errpostcode = true;
  }

  clear = function () {
    this.fname = "";
    this.mname = "";
    this.email = "";
    this.lname = "";
    this.phone = "";
    this.dob = "";
    this.state = "";
    this.streetaddress = "";
    this.occupation = "";
    this.country = "";
    this.city = "";
    this.postalcode = "";
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
      var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

      const getkyc = `${this.hosturl + this.port + "/getkycdata/"}${custid}`;
      this.http.get(getkyc).subscribe(
        (res: Response) => {
          this.kycdata = res.json().customer;
          if (this.kycdata == "") {

            this.view = true;
            this.wait = true;
            this.swait = true;
            this.clear();

          } else {
            this.view = false;
            this.wait = true;
            this.swait = true;

            this.fname = this.kycdata[0].first_name;
            this.mname = this.kycdata[0].middle_name;
            this.email = this.kycdata[0].email;
            this.lname = this.kycdata[0].last_name;
            this.phone = this.kycdata[0].phone_number;
            this.phonecode = this.kycdata[0].phonecode;
            let bdate = this.kycdata[0].dob;
            this.dob = this.datepipe.transform(bdate, 'yyyy-MM-dd');
            this.state = this.kycdata[0].state;
            this.statecity(this.state);
            this.streetaddress = this.kycdata[0].street_address;
            this.occupation = this.kycdata[0].occupation;
            this.country = this.kycdata[0].country;
            this.countrystate(this.country);
            this.city = this.kycdata[0].city;
            this.postalcode = this.kycdata[0].zipcode;

          }
        }
      )

      this.errorvariable();

      const getcountry = `${this.hosturl + this.port + "/country"}`;
      this.http.get(getcountry).subscribe(
        (res: Response) => {
          this.countryname = res.json().country;
        }
      )

    } else {
      this.router.navigate(['/login']);
    }

  }

}
