import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.css'],
  providers: [DatePipe]
})
export class ReferComponent implements OnInit {
  comonlink: any;
  getreferraldata: any;
  show: boolean;

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;
  refurl: any = Constants.REFURL;

  custid: any;
  refere_link: any;
  refcode: any;

  constructor(private router: Router, private http: Http, public datepipe: DatePipe) { }


  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    alertify.success("Copied");
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

        const getrefdata = `${this.hosturl + this.port + "/get_refer_customer/"}${this.custid}`;
        this.http.get(getrefdata).subscribe(
          (res: Response) => {
            this.refcode = res.json().refercode;
            this.refere_link = this.refurl + this.refcode[0].referralcode;

            this.comonlink = this.refurl + this.refcode[0].referralcode;

            const getrefdata = `${this.hosturl + this.port + "/get_refer_customer_history/"}${this.refcode[0].email}`;
            this.http.get(getrefdata).subscribe(
              (res: Response) => {
                this.getreferraldata = res.json().refercode_history;
              });
          });
      }
    } else {
      this.router.navigate(['/login']);
    }

  }

}
