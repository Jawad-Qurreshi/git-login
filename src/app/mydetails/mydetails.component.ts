import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-mydetails',
  templateUrl: './mydetails.component.html',
  styleUrls: ['./mydetails.component.css'],
  providers: [DatePipe]
})
export class MydetailsComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;
  refurl: any = Constants.REFURL;
  profileurl: any = Constants.PROFILEURL;

  address: any;
  postcode: any;
  occupation: any;
  phone: any;
  rdogender: any;
  city: any;
  state: any;
  email: any;
  country: any;
  lname: any;
  fname: any;
  accountid: any;
  statename: any;
  countryname: any;
  cityname: any;

  get_fname: any;
  get_lname: any;
  get_country: any;
  get_state: any;
  get_city: any;
  get_rdogender: any;
  get_phone: any;
  get_mobile: any;
  get_occupation: any;
  get_postcode: any;
  get_address: any;
  phonecode: any;

  custid: any;

  erraddress: boolean;
  errpostcode: boolean;
  erroccupation: boolean;
  errphone: boolean;
  errmobile: boolean;
  errrdogender: boolean;
  errcity: boolean;
  errcountry: boolean;
  errlname: boolean;
  errfname: boolean;
  errstate: boolean;
  kycdata: any;
  note: any;
  pending: boolean;
  approve: boolean;
  reject: boolean;
  halfkyc: boolean;
  refcode: any;
  refere_link: any;
  form: any;

  @ViewChild('userprofile') inputuserprofile: ElementRef;

  profileextention: any;
  lastprofile: any;
  profilerand: any;
  errprofile: any;
  pval: any;
  pphoto: any;
  profilepic: any;

  oldpass: any;
  newpass: any;
  conpass: any;

  erroldpass: any;
  errnewpass: any;
  errconpass: any;
  mname: any;
  errmname: any;
  get_mname: any;
  erraccountid: boolean;
  mobile: any;

  constructor(private router: Router, private http: Http, public datepipe: DatePipe, private fb: FormBuilder) {
    this.createForm();
  }
  private headers = new Headers({ 'Content-type': 'application/json' });

  createForm() {
    this.form = this.fb.group({
      profile_pic: null
    });
  }

  upload_profile(event) {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('profile_pic').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        })
      };

      this.profileextention = file.name.split(".");
      this.lastprofile = this.profileextention[this.profileextention.length - 1];
      this.profilerand = this.getrand(0, 1000000);

      if (this.lastprofile != "png" && this.lastprofile != "jpg" && this.lastprofile != "jpeg") {
        alertify.error("Please upload only png, jpg and jpeg file");
        this.errprofile = false;
      }
    }
  }

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

  mydetails = function (data) {

    const formModel = this.form.value;

    let valid_holder = /^[a-zA-Z ]*$/;
    let chkfname = valid_holder.test(data.fname);
    let chkmname = valid_holder.test(data.mname);
    let chklname = valid_holder.test(data.lname);

    let valid_digit = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit.test(data.phone);
    let chkmobile = valid_digit.test(data.mobile);

    if (data.fname == "" || chkfname == false) {
      this.errfname = false;
      alertify.error("Please Enter First Name");
    } else {
      this.get_fname = data.fname;
      this.errfname = true;
    }

    if (data.mname == "" || chkmname == false) {
      this.errmname = false;
      alertify.error("Please Enter Middle Name");
    } else {
      this.get_mname = data.mname;
      this.errmname = true;
    }

    if (data.lname == "" || chklname == false) {
      this.errlname = false;
      alertify.error("Please Enter Last Name");
    } else {
      this.get_lname = data.lname;
      this.errlname = true;
    }

    if (data.country == "") {
      this.errcountry = false;
      alertify.error("Please Select Country Name");
    } else {
      this.get_country = data.country;
      this.errcountry = true;
    }

    if (data.state == "") {
      this.errstate = false;
      alertify.error("Please Select State Name");
    } else {
      this.get_state = data.state;
      this.errstate = true;
    }

    if (data.city == "") {
      this.errcity = false;
      alertify.error("Please Select City Name");
    } else {
      this.get_city = data.city;
      this.errcity = true;
    }

    if (data.rdogender == "") {
      this.errrdogender = false;
      alertify.error("Please Select Your Gender");
    } else {
      this.get_rdogender = data.rdogender;
      this.errrdogender = true;
    }

    if (data.phone == "" || chkphone == false) {
      this.errphone = false;
      alertify.error("Please Enter Phone Number");
    } else {
      this.get_phone = data.phone;
      this.errphone = true;
    }

    if (data.mobile == "" || chkmobile == false) {
      this.errmobile = false;
      alertify.error("Please Enter Mobile Number");
    } else {
      this.get_mobile = data.mobile;
      this.errmobile = true;
    }

    if (data.occupation == "") {
      this.erroccupation = false;
      alertify.error("Please Enter Your Occupation");
    } else {
      this.get_occupation = data.occupation;
      this.erroccupation = true;
    }

    if (data.postcode == "") {
      this.errpostcode = false;
      alertify.error("Please Enter Your Postcode");
    } else {
      this.get_postcode = data.postcode;
      this.errpostcode = true;
    }

    if (data.address == "") {
      this.erraddress = false;
      alertify.error("Please Enter Your Postcode");
    } else {
      this.get_address = data.address;
      this.erraddress = true;
    }

    if (formModel.profile_pic == null) {
      this.pval = "";
      this.pphoto = "";
      this.errprofile = true;
    } else {
      if (this.lastprofile != "png" && this.lastprofile != "jpg" && this.lastprofile != "jpeg") {
        alertify.error("Please upload only png, jpg and jpeg file of profile photo");
        this.errprofile = false;
      } else {
        this.errprofile = true;
      }
    }

    if (this.errfname == true && this.errmname == true && this.errlname == true && this.errcountry == true
      && this.errstate == true && this.errcity == true && this.errrdogender == true && this.errphone == true
      && this.errmobile == true && this.erroccupation == true && this.errpostcode == true 
      && this.erraddress == true && this.errprofile == true) {

      let mydetails_data = {
        "custid": this.custid,
        "fname": this.get_fname,
        "mname": this.get_mname,
        "lname": this.get_lname,
        "country": this.get_country,
        "state": this.get_state,
        "city": this.get_city,
        "gander": this.get_rdogender,
        "phonecode": this.phonecode,
        "phone": this.get_phone,
        "mobile": this.get_mobile,
        "occupation": this.get_occupation,
        "postcode": this.get_postcode,
        "address": this.get_address,
        "profileval": (formModel.profile_pic) ? formModel.profile_pic.value : this.pval,
        "profile_photo": (formModel.profile_pic) ? this.profilerand + formModel.profile_pic.filename : this.pphoto,
      }

      const url = `${this.hosturl + this.port + "/update_mydetails"}`;
      this.http.put(url, JSON.stringify(mydetails_data), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.getalldetails();
          }
        })

    }
  }

  getalldetails = function () {
    const gettrasferdata = `${this.hosturl + this.port + "/customer_details/"}${this.custid}`;
    this.http.get(gettrasferdata).subscribe(
      (res: Response) => {
        let custdetails = res.json().details;

        this.customerid = custdetails[0].account_id;
        this.fname = custdetails[0].first_name;
        this.mname = custdetails[0].middle_name;
        this.lname = custdetails[0].last_name;
        this.email = custdetails[0].email;
        this.country = custdetails[0].country;
        this.countrystate(this.country);
        this.state = custdetails[0].state;
        this.city = custdetails[0].city;
        this.rdogender = custdetails[0].gender;
        this.phone = custdetails[0].phone;
        this.occupation = custdetails[0].occupation;
        this.postcode = custdetails[0].postcode;
        this.address = custdetails[0].address;
        this.profilepic = custdetails[0].profile_pic;
        var profile = CryptoJS.AES.encrypt(JSON.stringify(this.profilepic), 'Zipcoin');
        localStorage.setItem("profile", profile.toString());

      }
    )
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    alertify.success("Copied");
  }

  updatepass = function (data) {

    let valid_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let chkpass = valid_password.test(data.newpass);
    let chkconpass = valid_password.test(data.conpass);

    if (data.oldpass == "") {
      this.erroldpass = false;
      alertify.error("Please Enter Old Password");
    } else {
      this.erroldpass = true;
    }

    if (data.newpass == "" || chkpass == false) {
      this.errnewpass = false;
      alertify.error("Please Enter Valid New Password");
    } else {
      this.errnewpass = true;
    }

    if (data.conpass == "" || chkconpass == false) {
      this.errconpass = false;
      alertify.error("Please Enter Valid Confirm Password");
    } else {

      if (data.conpass == data.newpass) {
        this.errconpass = true;
      } else {
        this.errconpass = false;
        alertify.error("Password Does't Match");
      }
    }

    if (this.erroldpass == true && this.errnewpass == true && this.errconpass == true) {

      var up_pass_details = {
        "custid": this.custid,
        "oldpass": data.oldpass,
        "newpass": data.newpass
      }

      const url = `${this.hosturl + this.port + "/up_password"}`;
      this.http.put(url, JSON.stringify(up_pass_details), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.oldpass = "";
            this.newpass = "";
            this.conpass = "";
          } else {
            alertify.error(res.json().msg);
          }
        })

    }

  }

  getrand = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

      this.erraccountid = true;
      this.errstate = true;
      this.errfname = true;
      this.errmname = true;
      this.errlname = true;
      this.errcountry = true;
      this.errcity = true;
      this.errrdogender = true;
      this.errmobile = true;
      this.errphone = true;
      this.erroccupation = true;
      this.errpostcode = true;
      this.erraddress = true;

      this.oldpass = "";
      this.newpass = "";
      this.conpass = "";

      this.erroldpass = true;
      this.errnewpass = true;
      this.errconpass = true;

      var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
      this.custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

      const getcountry = `${this.hosturl + this.port + "/country"}`;
      this.http.get(getcountry).subscribe(
        (res: Response) => {
          this.countryname = res.json().country;
        }
      )

      const gettrasferdata = `${this.hosturl + this.port + "/customer_details/"}${this.custid}`;
      this.http.get(gettrasferdata).subscribe(
        (res: Response) => {
          let custdetails = res.json().details;

          this.accountid = custdetails[0].account_id;
          this.fname = custdetails[0].first_name;
          this.mname = custdetails[0].middle_name;
          this.lname = custdetails[0].last_name;
          this.email = custdetails[0].email;
          this.country = custdetails[0].country;
          this.state = custdetails[0].state;
          this.countrystate(this.country);
          this.city = custdetails[0].city;
          if (this.city != "") {
            this.statecity(this.state);
          }
          this.rdogender = custdetails[0].gender;
          this.phone = custdetails[0].phone;
          this.mobile = custdetails[0].mobile;
          this.occupation = custdetails[0].occupation;
          this.postcode = custdetails[0].postcode;
          this.address = custdetails[0].address;
          this.profilepic = custdetails[0].profile_pic;
          var profile = CryptoJS.AES.encrypt(JSON.stringify(this.profilepic), 'Zipcoin');
          localStorage.setItem("profile", profile.toString());

        }
      )

      const getkyc = `${this.hosturl + this.port + "/getkycdata/"}${this.custid}`;
      this.http.get(getkyc).subscribe(
        (res: Response) => {

          if (res.json().success) {

            this.kycdata = res.json().customer;

            this.note = this.kycdata[0].note;

            if (this.kycdata[0].kyc_fill_status == "0") {
              this.pending = false;
              this.approve = false;
              this.reject = false;
              this.halfkyc = true;
            } else {

              if (this.kycdata[0].verified_status == "0") {
                this.pending = true;
                this.approve = false;
                this.reject = false;
                this.halfkyc = false;
              } else if (this.kycdata[0].verified_status == "1") {
                this.pending = false;
                this.approve = true;
                this.reject = false;
                this.halfkyc = false;
              } else {
                this.pending = false;
                this.approve = false;
                this.reject = true;
                this.halfkyc = false;
              }

            }

          }

        }
      )

      const getrefdata = `${this.hosturl + this.port + "/get_refer_customer/"}${this.custid}`;
      this.http.get(getrefdata).subscribe(
        (res: Response) => {
          this.refcode = res.json().refercode;
          this.refere_link = this.refurl + this.refcode[0].referralcode;
        });

    } else {
      this.router.navigate(['/login']);
    }

  }

}
