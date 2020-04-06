import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';
import * as CanvasJS from '../canvasjs.min';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit {


  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;
  refurl: any = Constants.REFURL;

  custid: any;
  reject: boolean;
  pending: boolean;
  halfkyc: boolean;
  approve: boolean;
  tcount: any;
  note: any;
  kycdata: any;

  bcount: any;
  status: any;
  recenttransaction: any;
  lastmonth: any;
  current_month: any;
  lastyear: any;
  chartdetails: any;

  show: boolean;
  refcode: any;
  refere_link: any;

  constructor(private router: Router, private http: Http, public datepipe: DatePipe) { }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    alertify.success("Copied");
  }

  ngOnInit() {

    let a = localStorage.getItem("load");
    if (a == "0") {
      window.location.reload();
      localStorage.removeItem("load");
    }

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

        let currentdate = new Date();
        let matchdate = this.datepipe.transform(currentdate, 'yyyy-MM-dd');

        const getcountbeni = `${this.hosturl + this.port + "/get_benificiary_count/"}${this.custid}`;
        this.http.get(getcountbeni).subscribe(
          (res: Response) => {
            let bcount = res.json().benificiary_counter;
            this.bcount = bcount[0].count;
          });

        const getcounttrans = `${this.hosturl + this.port + "/get_transaction_count/"}${this.custid}`;
        this.http.get(getcounttrans).subscribe(
          (res: Response) => {
            let tcount = res.json().transaction_counter;
            this.tcount = tcount[0].count;
          });



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

        const qrimages = `${this.hosturl + this.port + "/chk_qrcode/"}${this.custid}`;
        this.http.get(qrimages).subscribe(
          (res: Response) => {

            this.status = res.json().auth_status;

            if (this.status == 0) {
              this.show = true;
            } else {
              this.show = false;
            }

          });


        const getrecent = `${this.hosturl + this.port + "/get_recent_transaction/"}${this.custid}`;
        this.http.get(getrecent).subscribe(
          (res: Response) => {
            this.recenttransaction = res.json().recent_transaction;
          });

        const getlastyear = `${this.hosturl + this.port + "/get_lastyear_transaction/"}${matchdate}`;
        this.http.get(getlastyear).subscribe(
          (res: Response) => {
            let lyear = res.json().last_year;
            this.lastyear = lyear[0].count;
            // this.lastyear = lyear[0].total_amount;
          });

        const getlastmonth = `${this.hosturl + this.port + "/get_lastmonth_transaction/"}${matchdate}`;
        this.http.get(getlastmonth).subscribe(
          (res: Response) => {
            let lmonth = res.json().last_month;
            this.lastmonth = lmonth[0].count;
            // this.lastmonth = lmonth[0].total_amount;
          });

        const getcurrentmonth = `${this.hosturl + this.port + "/get_currentmonth_transaction/"}${matchdate}`;
        this.http.get(getcurrentmonth).subscribe(
          (res: Response) => {
            let cmonth = res.json().current_month;
            this.current_month = cmonth[0].count;
            // this.current_month = cmonth[0].total_amount;
          });


        this.http.get(this.hosturl + this.port + "/m_getgraph_data/").subscribe(
          (res: Response) => {
            this.chartdetails = res.json().getchart_details;

            let chart = new CanvasJS.Chart("chartContainer", {

              animationEnabled: true,
              backgroundColor: "transparent",
              dataPointMaxWidth: 30,
              data: [{
                type: "column",
                color: "#dead53",
                radius: "0% 0% 90% 90%",
                dataPoints: [
                  { y: this.chartdetails[0].week_1, label: "18 MARCH - 24 MARCH" },
                  { y: this.chartdetails[0].week_2, label: "25 MARCH - 31 MARCH" },
                  { y: this.chartdetails[0].week_3, label: "1 APRIL - 7 APRIL" },
                  { y: this.chartdetails[0].week_4, label: "8 APRIL - 14 APRIL" },
                  { y: this.chartdetails[0].week_5, label: "15 APRIL - 21 APRIL" },
                  { y: this.chartdetails[0].week_6, label: "22 APRIL - 28 APRIL" },
                  { y: this.chartdetails[0].week_7, label: "29 APRIL - 5 MAY" },
                  { y: this.chartdetails[0].week_8, label: "6 MAY - 12 MAY" },
                  { y: this.chartdetails[0].week_9, label: "13 MAY - 19 MAY" },
                  { y: this.chartdetails[0].week_10, label: "20 MAY - 26 MAY" },
                  { y: this.chartdetails[0].week_11, label: "27 MAY - 2 JUNE" },
                  { y: this.chartdetails[0].week_12, label: "3 JUNE - 9 JUNE" }
                ]
              }],
              axisX: {
                labelFontColor: "white",
                labelMaxWidth: 70,
                labelWrap: true,
                interval: 1,
                labelFontSize: 10,
              },
              axisY: {
                labelFontColor: "white"
              }
            });

            chart.render();

          }
        )

        const getrefdata = `${this.hosturl + this.port + "/get_refer_customer/"}${this.custid}`;
        this.http.get(getrefdata).subscribe(
          (res: Response) => {
            this.refcode = res.json().refercode;
            this.refere_link = this.refurl + this.refcode[0].referralcode;
          });


      }
    } else {
      this.router.navigate(['/login']);
    }
  }

}
