import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';


@Component({
  selector: 'app-ref',
  templateUrl: './ref.component.html',
  styleUrls: ['./ref.component.css']
})
export class RefComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  constructor(private router: Router, private http: Http) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  ngOnInit() {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    let a = this.router.url;
    let lastChar = a.split('/');
    let refcode = lastChar[2];

    var code = CryptoJS.AES.encrypt(JSON.stringify(refcode), 'Zipcoin');
    localStorage.setItem("refercode", code.toString());

    this.router.navigate(['./login']);



  }

}
