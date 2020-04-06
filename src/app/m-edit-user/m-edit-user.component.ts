import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-m-edit-user',
  templateUrl: './m-edit-user.component.html',
  styleUrls: ['./m-edit-user.component.css']
})
export class MEditUserComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;


  constructor(private router: Router, private http: Http) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  adminid: any;
  customerid: any;

  firstname: any;
  middlename: any;
  lastname: any;
  email: any;
  country: any;
  countryname: any;
  phonecode: any;
  phone: any;

  id: string;

  errfirstname: any;
  errmiddlename: any;
  errlastname: any;
  errcountry: any;
  errphone: any;

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

  }

  edituser = function (data) {

    let valid_holder = /^[a-zA-Z ]*$/;
    let chkfirstname = valid_holder.test(data.firstname);
    let chkmiddlename = valid_holder.test(data.middlename);
    let chklastname = valid_holder.test(data.lastname);

    let valid_digit = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit.test(data.phone);

    if (data.firstname == "" || chkfirstname == false) {
      this.errfirstname = false;
    } else {
      this.errfirstname = true;
    }

    if (data.middlename == "" || chkmiddlename == false) {
      this.errmiddlename = false;
    } else {
      this.errmiddlename = true;
    }

    if (data.lastname == "" || chklastname == false) {
      this.errlastname = false;
    } else {
      this.errlastname = true;
    }

    if (data.country == "") {
      this.errcountry = false;
    } else {
      this.errcountry = true;
    }

    if (data.phone == "" || chkphone == false) {
      this.errphone = false;
    } else {
      this.errphone = true;
    }

    if (this.errfirstname == true && this.errmiddlename == true && this.errlastname == true && this.errcountry == true && this.errphone == true) {

      var updata = {
        "custid": this.id,
        "fname": data.firstname,
        "mname": data.middlename,
        "lname": data.lastname,
        "country": data.country,
        "phone": data.phone
      }

      const url = `${this.hosturl + this.port + "/m_edit_user"}`;
      this.http.put(url, JSON.stringify(updata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.router.navigate(['/m-user']);
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


        this.errfirstname = true;
        this.errmiddlename = true;
        this.errlastname = true;
        this.errcountry = true;
        this.errphone = true;


        const getcountry = `${this.hosturl + this.port + "/country"}`;
        this.http.get(getcountry).subscribe(
          (res: Response) => {
            this.countryname = res.json().country;
          }
        )

        let a = this.router.url;
        let lastChar = a.split('/');
        this.id = lastChar[2];

        const getuserdata = `${this.hosturl + this.port + "/customer_details/"}${this.id}`;
        this.http.get(getuserdata).subscribe(
          (res: Response) => {

            let custdetails = res.json().details;

            this.customerid = custdetails[0].account_id;
            this.firstname = custdetails[0].first_name;
            this.middlename = custdetails[0].middle_name;
            this.lastname = custdetails[0].last_name;
            this.email = custdetails[0].email;
            this.country = custdetails[0].country;
            this.countrystate(this.country);
            this.phone = custdetails[0].phone;

          });

      }

    } else {
      this.router.navigate(['/login']);
    }

  }

}
