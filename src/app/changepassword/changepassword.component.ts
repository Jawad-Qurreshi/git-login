import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  change_data: any;
  cust_id: any;
  errpassword: any;
  errrepassword: any;

  constructor(private http: Http, private router: Router) { }
  private headers = new Headers({ 'Content-type': 'application/json' });

  change = function (data) {

    let valid_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let chkpass = valid_password.test(data.password);
    let chkrepass = valid_password.test(data.repassword);

    if (data.password == "" || chkpass == false) {
      this.errpassword = false;
    } else {
      this.errpassword = true;
    }

    if (data.repassword == "" || chkrepass == false) {
      this.errrepassword = false;
    } else {
      if (data.password == data.repassword) {
        this.errrepassword = true;
      } else {
        this.errrepassword = false;
      }
    }

    if (this.errpassword == true && this.errrepassword == true) {

      this.data = {
        "newpassword": data.password,
        "id": this.cust_id
      }

      const url = `${this.hosturl + this.port + "/changepassword"}`;
      this.http.post(url, JSON.stringify(this.data), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            this.router.navigate(['/login']);
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

    this.errpassword = true;
    this.errrepassword = true;

    let a = this.router.url;
    let b = a.split('/').reverse()[0];
    var code = b;

    this.change_data = {
      "code": code
    }

    const url = `${this.hosturl + this.port + "/chkid"}`;
    this.http.post(url, JSON.stringify(this.change_data), { headers: this.headers }).toPromise()
      .then((res: Response) => {
        if (res.json().success) {
          this.cust_id = res.json().id;
        } else {
          alertify.error(res.json().msg);
          this.router.navigate(['/login']);
        }
      })
  }

}
