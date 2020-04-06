import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';



@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
  providers: [DatePipe]
})
export class TransactionComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;
  payurl: any = Constants.PAYURL;

  custid: any;
  alltrans: any;

  start_date: any;
  end_date: any;
  status: any;
  p: number = 1;

  options: DatepickerOptions = {
    locale: enLocale,
    addClass: 'form-control',
    displayFormat: 'DD-MMM-YYYY',
    barTitleIfEmpty: 'Select Date',
    placeholder: 'dd-----yyyy',
    addStyle: {
      padding: '12px',
      border: 'none',
      width: '225px'
    },
  };

  constructor(private http: Http, private router: Router, public datepipe: DatePipe) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  searchdata = function (data) {

    let sdateformate = this.datepipe.transform(data.start_date, 'yyyy-MM-dd');
    let edateformate = this.datepipe.transform(data.end_date, 'yyyy-MM-dd');

    var searchdata = {
      "custid": this.custid,
      "sdate": sdateformate,
      "edate": edateformate,
      "status": data.status
    }

    const url = `${this.hosturl + this.port + "/search-transaction"}`;
    this.http.post(url, JSON.stringify(searchdata), { headers: this.headers }).toPromise()
      .then((res: Response) => {

        if (res.json().success) {
          this.alltrans = res.json().records;
        } else {
          alertify.error(res.json().msg);
          this.gettransaction();
        }

      })

  }

  gettransaction = function () {
    const gettrans = `${this.hosturl + this.port + "/alltransaction/"}${this.custid}`;
    this.http.get(gettrans).subscribe(
      (res: Response) => {
        this.alltrans = res.json().transaction;
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

    let decryptedData = localStorage.getItem('custid');

    if (decryptedData != null) {
      var bytes = CryptoJS.AES.decrypt(decryptedData.toString(), 'Zipcoin');
      this.custid = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (!this.custid) {
        this.router.navigate(['/login']);
      } else {

        this.start_date = "";
        this.end_date = "";
        this.status = "";

        const gettrans = `${this.hosturl + this.port + "/alltransaction/"}${this.custid}`;
        this.http.get(gettrans).subscribe(
          (res: Response) => {

            this.alltrans = res.json().transaction;

          }
        )

      }
    } else {
      this.router.navigate(['/login']);
    }

  }

}
