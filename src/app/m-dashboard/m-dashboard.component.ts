import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import 'rxjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';
import * as CanvasJS from '../canvasjs.min';


@Component({
  selector: 'app-m-dashboard',
  templateUrl: './m-dashboard.component.html',
  styleUrls: ['./m-dashboard.component.css']
})
export class MDashboardComponent implements OnInit {


  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  adminid: any;
  m_review_kyc_counter: any;
  m_reject_kyc_counter: any;
  m_approve_kyc_counter: any;
  m_user_counter: any;
  chartdetails: any;

  constructor(private router: Router, private http: Http) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  ngOnInit() {

    let a = localStorage.getItem("load");
    if (a == "1") {
      window.location.reload();
      localStorage.removeItem("load");
    }

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

        this.http.get(this.hosturl + this.port + "/m_get_user_count/").subscribe(
          (res: Response) => {
            let getuser = res.json().usercount;
            this.m_user_counter = getuser[0].count;
          }
        )

        this.http.get(this.hosturl + this.port + "/m_get_approve_kyc_count/").subscribe(
          (res: Response) => {
            let getapprovekyc = res.json().approve_kyc;
            this.m_approve_kyc_counter = getapprovekyc[0].count;
          }
        )

        this.http.get(this.hosturl + this.port + "/m_get_reject_kyc_count/").subscribe(
          (res: Response) => {
            let getrejectkyc = res.json().reject_kyc;
            this.m_reject_kyc_counter = getrejectkyc[0].count;
          }
        )

        this.http.get(this.hosturl + this.port + "/m_get_review_kyc_count/").subscribe(
          (res: Response) => {
            let getreviewkyc = res.json().review_kyc;
            this.m_review_kyc_counter = getreviewkyc[0].count;
          }
        )


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
                radius: "90%",
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

      }

    } else {
      this.router.navigate(['/login']);
    }

  }

}
