import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-m-single-ikyc',
  templateUrl: './m-single-ikyc.component.html',
  styleUrls: ['./m-single-ikyc.component.css'],
  providers: [DatePipe]
})
export class MSingleIkycComponent implements OnInit {
  note: any;


  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;
  durl: any = Constants.DOCURL;

  adminid: any;
  comment: any;
  utilitybilldate: any;
  status: any;
  lastselfi: any;
  selfietext: any;
  selfie: any;
  lastbill: any;
  billtext: any;
  bill: any;
  lastback: any;
  backtext: any;
  backside: any;
  lastfront: any;
  frontext: any;
  frontside: any;
  adddocs: any;
  edate: any;
  idate: any;
  docno: any;
  doctype: any;
  occupation: any;
  zipcode: any;
  streetaddress: any;
  city: any;
  state: any;
  country: any;
  phone: any;
  dob: any;
  fullname: string;
  cid: any;
  kyc_id: string;

  display: any;
  errreason: any;
  block: any;

  constructor(private router: Router, private http: Http, public datepipe: DatePipe) { }
  private headers = new Headers({ 'Content-type': 'application/json' });


  verified = function (id) {
    const kycstatus = `${this.hosturl + this.port + "/kyc_approve_status/"}${id}`;
    this.http.get(kycstatus).subscribe(
      (res: Response) => {
        if (res.json().success) {
          alertify.success(res.json().msg);
          this.router.navigate(['/m-ikyc']);
        }
      });
  }

  open = function () {
    this.display = true;
    this.errreason = true;
    this.wreason = "";
  }

  reason = function (data) {

    if (this.wreason == "") {
      this.errreason = false;
    } else {
      this.errreason = true;
    }

    if (this.errreason == true) {

      let reject_data = {
        "kid": this.kyc_id,
        "reason": this.wreason
      }

      const url = `${this.hosturl + this.port + "/kyc_reject_status"}`;
      this.http.post(url, JSON.stringify(reject_data), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            // this.getkyc();
            alertify.success(res.json().msg);
            this.close();
            this.router.navigate(['/m-ikyc']);
          }
        })

    }
  }

  close = function () {
    this.display = false;
    this.errreason = true;
    this.wreason = "";
  }

  blockdata = function () {

    const kycid = `${this.hosturl + this.port + "/blockdata/"}${this.cid}`;
    this.http.get(kycid).subscribe(
      (res: Response) => {

        if (res.json().success) {
          alertify.success(res.json().msg);
          this.getallviewkyc();
        }

      });

  }

  unblockdata = function () {
    const kycid = `${this.hosturl + this.port + "/unblockdata/"}${this.cid}`;
    this.http.get(kycid).subscribe(
      (res: Response) => {

        if (res.json().success) {
          alertify.success(res.json().msg);
          this.getallviewkyc();
        }

      });
  }

  getallviewkyc = function () {
    let a = this.router.url;
    let lastChar = a.split('/');
    let kid = lastChar[2];

    const kycid = `${this.hosturl + this.port + "/viewkyc/"}${kid}`;
    this.http.get(kycid).subscribe(
      (res: Response) => {
        let kycdetails = res.json().viewkyc;

        this.kyc_id = kid;
        this.cid = kycdetails[0].cust_id;
        this.fullname = kycdetails[0].first_name + " " + kycdetails[0].middle_name + " " + kycdetails[0].last_name;
        this.dob = kycdetails[0].dob;
        this.phone = kycdetails[0].phone_number;
        this.country = kycdetails[0].country_name;
        this.state = kycdetails[0].state_name;
        this.city = kycdetails[0].city_name;
        this.streetaddress = kycdetails[0].street_address;
        this.zipcode = kycdetails[0].zipcode;
        this.occupation = kycdetails[0].occupation;
        this.doctype = kycdetails[0].document_type;
        this.docno = kycdetails[0].document_number;
        this.idate = kycdetails[0].issue_date;
        this.edate = kycdetails[0].expiry_date;
        this.adddocs = kycdetails[0].address_as_doc;

        this.block = kycdetails[0].block;

        this.frontside = kycdetails[0].front_side;

        this.frontext = this.frontside.split(".");
        this.lastfront = this.frontext[this.frontext.length - 1];

        this.backside = kycdetails[0].back_side;

        this.backtext = this.backside.split(".");
        this.lastback = this.backtext[this.backtext.length - 1];

        this.bill = kycdetails[0].utility_bill;

        this.billtext = this.bill.split(".");
        this.lastbill = this.billtext[this.billtext.length - 1];

        this.selfie = kycdetails[0].selfie_id;

        this.selfietext = this.selfie.split(".");
        this.lastselfi = this.selfietext[this.selfietext.length - 1];

        this.status = kycdetails[0].verified_status;
        this.utilitybilldate = kycdetails[0].bill_expiry_date;

        this.comment = kycdetails[0].comment;
        this.note = kycdetails[0].note;
      });
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

        this.getallviewkyc();

      }

    } else {
      this.router.navigate(['/login']);
    }

  }

}
