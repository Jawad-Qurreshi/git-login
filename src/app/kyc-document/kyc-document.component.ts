import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-kyc-document',
  templateUrl: './kyc-document.component.html',
  styleUrls: ['./kyc-document.component.css']
})
export class KycDocumentComponent implements OnInit {
  show: boolean;
  halfkyc: boolean;

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  custid: any;
  kycdata: any;
  pending: any;
  approve: any;
  reject: any;
  new: any;
  note: any;

  constructor(private router: Router, private http: Http) { }

  clear = function () {
    localStorage.removeItem("fname");
    localStorage.removeItem("upemail");
    localStorage.removeItem("lname");
    localStorage.removeItem("phone");
    localStorage.removeItem("dob");
    localStorage.removeItem("state");
    localStorage.removeItem("streetaddress");
    localStorage.removeItem("occupation");
    localStorage.removeItem("country");
    localStorage.removeItem("city");
    localStorage.removeItem("postalcode");
    localStorage.removeItem("doctype");
    localStorage.removeItem("docnumber");
    localStorage.removeItem("issue_date");
    localStorage.removeItem("expiry_date");
    localStorage.removeItem("address_as_doc");
    localStorage.removeItem("frontval");
    localStorage.removeItem("frontside_photo");
    localStorage.removeItem("backval");
    localStorage.removeItem("backside_photo");
    localStorage.removeItem("writeval");
    localStorage.removeItem("writer_photo");

    localStorage.removeItem("billval");
    localStorage.removeItem("bill_photo");

    localStorage.removeItem("selfival");
    localStorage.removeItem("selfi_photo");

    localStorage.removeItem("oldbill");
    localStorage.removeItem("oldbpath");
    localStorage.removeItem("oldfpath");
    localStorage.removeItem("oldselfi");
    localStorage.removeItem("oldwpath");
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    let decryptedData = localStorage.getItem('custid');

    if (decryptedData != null) {
      var bytes = CryptoJS.AES.decrypt(decryptedData.toString(), 'Zipcoin');
      this.custid = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (!this.custid) {
        this.router.navigate(['/login']);
      } else {

        this.clear();

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
            // else {

            //   this.new = true;
            //   this.pending = false;
            //   this.approve = false;
            //   this.reject = false;
            // }

          }
        )

        const qrimages = `${this.hosturl + this.port + "/chk_qrcode/"}${this.custid}`;
        this.http.get(qrimages).subscribe(
          (res: Response) => {

            let status = res.json().auth_status;

            if (status == 0) {
              this.show = true;
            } else {
              this.show = false;
            }

          })

      }
    } else {
      this.router.navigate(['/login']);
    }

  }

}
