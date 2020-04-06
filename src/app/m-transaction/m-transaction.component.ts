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
  selector: 'app-m-transaction',
  templateUrl: './m-transaction.component.html',
  styleUrls: ['./m-transaction.component.css'],
  providers: [DatePipe]
})
export class MTransactionComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;
  payurl: any = Constants.PAYURL;

  adminid: any;
  m_transaction: any;
  searchText: any;
  p: number = 1;

  start_date: any;
  end_date: any;
  status: any;

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

  approve = function (id) {

    const action = `${this.hosturl + this.port + "/approve/"}${id}`;
    this.http.put(action).subscribe(
      (res: Response) => {

        if (res.json().success) {
          alertify.success("Approved Successfully");
          this.gettransaction();
        }
      }
    )

  }

  reject = function (id) {

    const action = `${this.hosturl + this.port + "/reject/"}${id}`;
    this.http.put(action).subscribe(
      (res: Response) => {

        if (res.json().success) {
          alertify.error("Rejected Successfully");
          this.gettransaction();
        }
      }
    )

  }

  searchdata = function (data) {

    let sdateformate = this.datepipe.transform(data.start_date, 'yyyy-MM-dd');
    let edateformate = this.datepipe.transform(data.end_date, 'yyyy-MM-dd');

    var searchdata = {
      "sdate": sdateformate,
      "edate": edateformate,
      "status": data.status
    }

    const url = `${this.hosturl + this.port + "/m-search-transaction"}`;
    this.http.post(url, JSON.stringify(searchdata), { headers: this.headers }).toPromise()
      .then((res: Response) => {

        if (res.json().success) {
          this.m_transaction = res.json().records;
        } else {
          alertify.error(res.json().msg);
          this.gettransaction();
        }

      })

  }

  gettransaction = function () {
    this.http.get(this.hosturl + this.port + "/m_get_transaction/").subscribe(
      (res: Response) => {
        this.m_transaction = res.json().transaction;
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
        this.status = "";

        this.http.get(this.hosturl + this.port + "/m_get_transaction/").subscribe(
          (res: Response) => {
            this.m_transaction = res.json().transaction;
          }
        )

      }

    } else {
      this.router.navigate(['/login']);
    }


  }

}
