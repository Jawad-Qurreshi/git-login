import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-m-ikyc',
  templateUrl: './m-ikyc.component.html',
  styleUrls: ['./m-ikyc.component.css'],
  providers: [DatePipe]
})
export class MIkycComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;
  durl: any = Constants.DOCURL;

  adminid: any;
  searchText: any;
  p: number = 1;
  newfront = [];
  lastselfi: any;
  selfiext: any;
  lastbill: any;
  billext: any;
  lastfront: any;
  frontext: any;
  kyc: any;

  constructor(private http: Http, private router: Router, public datepipe: DatePipe) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

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

        this.http.get(this.hosturl + this.port + "/m_getkyc/").subscribe(
          (res: Response) => {
            this.kyc = res.json().getkycdata;

            for (var i = 0; i < this.kyc.length; i++) {

              this.frontext = this.kyc[i].front_side.split(".");
              this.lastfront = this.frontext[this.frontext.length - 1];

              this.billext = this.kyc[i].utility_bill.split(".");
              this.lastbill = this.billext[this.billext.length - 1];

              this.selfiext = this.kyc[i].selfie_id.split(".");
              this.lastselfi = this.selfiext[this.selfiext.length - 1];

              this.newfront.push({
                "extfront": this.lastfront,
                "extbill": this.lastbill,
                "extselfi": this.lastselfi,
                "accountid": this.kyc[i].accountid,
                "address_as_doc": this.kyc[i].address_as_doc,
                "browser": this.kyc[i].browser,
                "ip_address": this.kyc[i].ip_address,
                "os": this.kyc[i].os,
                "city": this.kyc[i].city,
                "country": this.kyc[i].country,
                "created_date": this.kyc[i].created_date,
                "cust_id": this.kyc[i].cust_id,
                "dob": this.kyc[i].dob,
                "document_number": this.kyc[i].document_number,
                "document_type": this.kyc[i].document_type,
                "email": this.kyc[i].email,
                "expiry_date": this.kyc[i].expiry_date,
                "first_name": this.kyc[i].first_name,
                "front_side": this.kyc[i].front_side,
                "ikyc_id": this.kyc[i].ikyc_id,
                "middle_name": this.kyc[i].middle_name,
                "issue_date": this.kyc[i].issue_date,
                "last_name": this.kyc[i].last_name,
                "note": this.kyc[i].note,
                "occupation": this.kyc[i].occupation,
                "phone_number": this.kyc[i].phone_number,
                "selfie_id": this.kyc[i].selfie_id,
                "state": this.kyc[i].state,
                "street_address": this.kyc[i].street_address,
                "utility_bill": this.kyc[i].utility_bill,
                "verified_status": this.kyc[i].verified_status,
                "zipcode": this.kyc[i].zipcode
              });

            }

            this.kyc = this.newfront;

          }
        )

      }

    } else {
      this.router.navigate(['/login']);
    }


  }

}
