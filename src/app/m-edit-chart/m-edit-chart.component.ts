import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-m-edit-chart',
  templateUrl: './m-edit-chart.component.html',
  styleUrls: ['./m-edit-chart.component.css']
})
export class MEditChartComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;
  errweek_1: boolean;
  errweek_2: boolean;
  errweek_3: boolean;
  errweek_4: boolean;
  errweek_5: boolean;
  errweek_6: boolean;
  errweek_7: boolean;
  errweek_8: boolean;
  errweek_9: boolean;
  errweek_10: boolean;
  errweek_11: boolean;
  errweek_12: boolean;


  constructor(private router: Router, private http: Http) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  adminid: any;
  id: any;

  week_1: any;
  week_2: any;
  week_3: any;
  week_4: any;
  week_5: any;
  week_6: any;
  week_7: any;
  week_8: any;
  week_9: any;
  week_10: any;
  week_11: any;
  week_12: any;

  edit_graphdata = function (data) {

    let valid_digit = /^[0-9. ]*$/;
    let chkweek_1 = valid_digit.test(data.week_1);
    let chkweek_2 = valid_digit.test(data.week_2);
    let chkweek_3 = valid_digit.test(data.week_3);
    let chkweek_4 = valid_digit.test(data.week_4);
    let chkweek_5 = valid_digit.test(data.week_5);
    let chkweek_6 = valid_digit.test(data.week_6);
    let chkweek_7 = valid_digit.test(data.week_7);
    let chkweek_8 = valid_digit.test(data.week_8);
    let chkweek_9 = valid_digit.test(data.week_9);
    let chkweek_10 = valid_digit.test(data.week_10);
    let chkweek_11 = valid_digit.test(data.week_11);
    let chkweek_12 = valid_digit.test(data.week_12);


    if (data.week_1 == "" || chkweek_1 == false) {
      this.errweek_1 = false;
    } else {
      this.errweek_1 = true;
    }

    if (data.week_2 == "" || chkweek_2 == false) {
      this.errweek_2 = false;
    } else {
      this.errweek_2 = true;
    }

    if (data.week_3 == "" || chkweek_3 == false) {
      this.errweek_3 = false;
    } else {
      this.errweek_3 = true;
    }

    if (data.week_4 == "" || chkweek_4 == false) {
      this.errweek_4 = false;
    } else {
      this.errweek_4 = true;
    }

    if (data.week_5 == "" || chkweek_5 == false) {
      this.errweek_5 = false;
    } else {
      this.errweek_5 = true;
    }

    if (data.week_6 == "" || chkweek_6 == false) {
      this.errweek_6 = false;
    } else {
      this.errweek_6 = true;
    }

    if (data.week_7 == "" || chkweek_7 == false) {
      this.errweek_7 = false;
    } else {
      this.errweek_7 = true;
    }

    if (data.week_8 == "" || chkweek_8 == false) {
      this.errweek_8 = false;
    } else {
      this.errweek_8 = true;
    }

    if (data.week_9 == "" || chkweek_9 == false) {
      this.errweek_9 = false;
    } else {
      this.errweek_9 = true;
    }

    if (data.week_10 == "" || chkweek_10 == false) {
      this.errweek_10 = false;
    } else {
      this.errweek_10 = true;
    }

    if (data.week_11 == "" || chkweek_11 == false) {
      this.errweek_11 = false;
    } else {
      this.errweek_11 = true;
    }

    if (data.week_12 == "" || chkweek_12 == false) {
      this.errweek_12 = false;
    } else {
      this.errweek_12 = true;
    }

    if (this.errweek_1 == true && this.errweek_2 == true && this.errweek_3 == true
      && this.errweek_4 == true && this.errweek_5 == true && this.errweek_6 == true
      && this.errweek_7 == true && this.errweek_8 == true && this.errweek_9 == true
      && this.errweek_10 == true && this.errweek_11 == true && this.errweek_12 == true) {

      var finaldata = {
        "chartid": this.id,
        "week1": data.week_1,
        "week2": data.week_2,
        "week3": data.week_3,
        "week4": data.week_4,
        "week5": data.week_5,
        "week6": data.week_6,
        "week7": data.week_7,
        "week8": data.week_8,
        "week9": data.week_9,
        "week10": data.week_10,
        "week11": data.week_11,
        "week12": data.week_12
      }

      const url = `${this.hosturl + this.port + "/m_edit_chart"}`;
      this.http.put(url, JSON.stringify(finaldata), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.router.navigate(['/m-graph-setting']);
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

        let a = this.router.url;
        let lastChar = a.split('/');
        this.id = lastChar[2];

        this.errweek_1 = true;
        this.errweek_2 = true;
        this.errweek_3 = true;
        this.errweek_4 = true;
        this.errweek_5 = true;
        this.errweek_6 = true;
        this.errweek_7 = true;
        this.errweek_8 = true;
        this.errweek_9 = true;
        this.errweek_10 = true;
        this.errweek_11 = true;
        this.errweek_12 = true;

        const getgraphdetails = `${this.hosturl + this.port + "/edit_graph_details/"}${this.id}`;
        this.http.get(getgraphdetails).subscribe(
          (res: Response) => {

            let graphdetail = res.json().details;

            this.week_1 = graphdetail[0].week_1;
            this.week_2 = graphdetail[0].week_2;
            this.week_3 = graphdetail[0].week_3;
            this.week_4 = graphdetail[0].week_4;
            this.week_5 = graphdetail[0].week_5;
            this.week_6 = graphdetail[0].week_6;
            this.week_7 = graphdetail[0].week_7;
            this.week_8 = graphdetail[0].week_8;
            this.week_9 = graphdetail[0].week_9;
            this.week_10 = graphdetail[0].week_10;
            this.week_11 = graphdetail[0].week_11;
            this.week_12 = graphdetail[0].week_12;

          });

      }

    } else {
      this.router.navigate(['/login']);
    }

  }

}
