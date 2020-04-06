import { Component, OnInit, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import CryptoJS from 'crypto-js';
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  deviceInfo = null;

  email: any;
  erremail: any;
  password: any;
  errpassword: any;
  login_data: any;
  chkrem: any;

  myStyle: object = {};
  myParams: object = {};
  width: number = 100;
  height: number = 100;

  ip: any;
  browser: any;
  os: any;

  constructor(private http: Http, private router: Router, private socialAuthService: AuthService, private deviceService: DeviceDetectorService) {
    this.epicFunction();
  }
  private headers = new Headers({ 'Content-type': 'application/json' });

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.browser = this.deviceInfo.browser;
    this.os = this.deviceInfo.os;
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    switch (socialPlatform) {
      case 'google':
        socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        break;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {

        const url = `${this.hosturl + this.port + "/social_login"}`;
        this.http.post(url, JSON.stringify(userData), { headers: this.headers }).toPromise()
          .then((res: Response) => {
            if (res.json().success) {
              if (res.json().type == 0) {

                if (res.json().auth == 0) {

                  alertify.success(res.json().msg);

                  var type = CryptoJS.AES.encrypt(JSON.stringify(res.json().type), 'Zipcoin');
                  localStorage.setItem("type", type.toString());

                  var cid = CryptoJS.AES.encrypt(JSON.stringify(res.json().custid), 'Zipcoin');
                  localStorage.setItem("custid", cid.toString());

                  var fullname = CryptoJS.AES.encrypt(JSON.stringify(res.json().fullname), 'Zipcoin');
                  localStorage.setItem("username", fullname.toString());

                  var email = CryptoJS.AES.encrypt(JSON.stringify(res.json().email), 'Zipcoin');
                  localStorage.setItem("email", email.toString());

                  var accountid = CryptoJS.AES.encrypt(JSON.stringify(res.json().accountid), 'Zipcoin');
                  localStorage.setItem("accountid", accountid.toString());

                  var profile = CryptoJS.AES.encrypt(JSON.stringify(res.json().profile), 'Zipcoin');
                  localStorage.setItem("profile", profile.toString());

                  localStorage.setItem('load', '0');

                  setTimeout(() => {
                    this.router.navigate(['dashboard']);
                  }, 1000);

                } else {

                  var cid = CryptoJS.AES.encrypt(JSON.stringify(res.json().custid), 'Zipcoin');
                  localStorage.setItem("custid", cid.toString());

                  var fullname = CryptoJS.AES.encrypt(JSON.stringify(res.json().fullname), 'Zipcoin');
                  localStorage.setItem("username", fullname.toString());

                  var email = CryptoJS.AES.encrypt(JSON.stringify(res.json().email), 'Zipcoin');
                  localStorage.setItem("email", email.toString());

                  var accountid = CryptoJS.AES.encrypt(JSON.stringify(res.json().accountid), 'Zipcoin');
                  localStorage.setItem("accountid", accountid.toString());

                  var profile = CryptoJS.AES.encrypt(JSON.stringify(res.json().profile), 'Zipcoin');
                  localStorage.setItem("profile", profile.toString());

                  localStorage.setItem('load', '0');

                  setTimeout(() => {
                    this.router.navigate(['two-auth']);
                  }, 1000);

                }

              }
            }
          })

      }
    );
  }


  chk_login_or_not = function () {

    let decryptedData = localStorage.getItem('type');

    if (decryptedData != null) {
      var bytes = CryptoJS.AES.decrypt(decryptedData.toString(), 'Zipcoin');
      let get_type = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (get_type == '1') {
        this.router.navigate(['m-dashboard']);
      } else if (get_type == '0') {
        this.router.navigate(['dashboard']);
      } else {
        this.router.navigate(['login']);
      }
    }

  }

  login = function (login) {

    if (login.email == "") {
      this.erremail = false;
    } else {
      this.erremail = true;
    }

    if (login.password == "") {
      this.errpassword = false;
    } else {
      this.errpassword = true;
    }

    if (this.erremail == true && this.errpassword == true) {

      if (this.chkrem == true) {

        var email = CryptoJS.AES.encrypt(JSON.stringify(login.email), 'Zipcoin');
        localStorage.setItem("rem_email", email.toString());

        var password = CryptoJS.AES.encrypt(JSON.stringify(login.password), 'Zipcoin');
        localStorage.setItem("rem_password", password.toString());

      }

      this.login_data = {
        "email": login.email,
        "password": login.password,
        "ip": this.ip,
        "browser": this.browser,
        "os": this.os
      }

      const url = `${this.hosturl + this.port + "/login"}`;
      this.http.post(url, JSON.stringify(this.login_data), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {

            if (res.json().type == 0) {

              if (res.json().block == 1) {

                alertify.error("Your ID is Blocked");

              } else {

                if (res.json().auth == 0) {

                  alertify.success(res.json().msg);

                  var type = CryptoJS.AES.encrypt(JSON.stringify(res.json().type), 'Zipcoin');
                  localStorage.setItem("type", type.toString());

                  var cid = CryptoJS.AES.encrypt(JSON.stringify(res.json().custid), 'Zipcoin');
                  localStorage.setItem("custid", cid.toString());

                  var fullname = CryptoJS.AES.encrypt(JSON.stringify(res.json().fullname), 'Zipcoin');
                  localStorage.setItem("username", fullname.toString());

                  var lastname = CryptoJS.AES.encrypt(JSON.stringify(res.json().lastname), 'Zipcoin');
                  localStorage.setItem("lastname", lastname.toString());

                  var email = CryptoJS.AES.encrypt(JSON.stringify(res.json().email), 'Zipcoin');
                  localStorage.setItem("email", email.toString());

                  var accountid = CryptoJS.AES.encrypt(JSON.stringify(res.json().accountid), 'Zipcoin');
                  localStorage.setItem("accountid", accountid.toString());

                  var profile = CryptoJS.AES.encrypt(JSON.stringify(res.json().profile), 'Zipcoin');
                  localStorage.setItem("profile", profile.toString());

                  var role = CryptoJS.AES.encrypt(JSON.stringify(res.json().role), 'Zipcoin');
                  localStorage.setItem("role", role.toString());

                  localStorage.setItem('load', '0');

                  setTimeout(() => {
                    this.router.navigate(['dashboard']);
                  }, 1000);

                } else {

                  var cid = CryptoJS.AES.encrypt(JSON.stringify(res.json().custid), 'Zipcoin');
                  localStorage.setItem("custid", cid.toString());

                  var fullname = CryptoJS.AES.encrypt(JSON.stringify(res.json().fullname), 'Zipcoin');
                  localStorage.setItem("username", fullname.toString());

                  var lastname = CryptoJS.AES.encrypt(JSON.stringify(res.json().lastname), 'Zipcoin');
                  localStorage.setItem("lastname", lastname.toString());

                  var email = CryptoJS.AES.encrypt(JSON.stringify(res.json().email), 'Zipcoin');
                  localStorage.setItem("email", email.toString());

                  var accountid = CryptoJS.AES.encrypt(JSON.stringify(res.json().accountid), 'Zipcoin');
                  localStorage.setItem("accountid", accountid.toString());

                  var profile = CryptoJS.AES.encrypt(JSON.stringify(res.json().profile), 'Zipcoin');
                  localStorage.setItem("profile", profile.toString());

                  var role = CryptoJS.AES.encrypt(JSON.stringify(res.json().role), 'Zipcoin');
                  localStorage.setItem("role", role.toString());

                  localStorage.setItem('load', '0');

                  setTimeout(() => {
                    this.router.navigate(['auth']);
                  }, 1000);

                }

              }
            } else {

              if (res.json().auth == 0) {

                alertify.success(res.json().msg);

                var type = CryptoJS.AES.encrypt(JSON.stringify(res.json().type), 'Zipcoin');
                localStorage.setItem("type", type.toString());

                var aid = CryptoJS.AES.encrypt(JSON.stringify(res.json().adminid), 'Zipcoin');
                localStorage.setItem("adminid", aid.toString());

                var username = CryptoJS.AES.encrypt(JSON.stringify(res.json().username), 'Zipcoin');
                localStorage.setItem("username", username.toString());

                localStorage.setItem('load', "1");

                setTimeout(() => {
                  this.router.navigate(['m-dashboard']);
                }, 1000);

              } else {

                var aid = CryptoJS.AES.encrypt(JSON.stringify(res.json().adminid), 'Zipcoin');
                localStorage.setItem("adminid", aid.toString());

                var username = CryptoJS.AES.encrypt(JSON.stringify(res.json().username), 'Zipcoin');
                localStorage.setItem("username", username.toString());

                localStorage.setItem('load', "1");

                setTimeout(() => {
                  this.router.navigate(['m-auth']);
                }, 1000);

              }
            }
          } else {
            alertify.error(res.json().msg);
          }
        })
    }
  }

  remove = function () {

    localStorage.removeItem('type');
    localStorage.removeItem('custid');
    localStorage.removeItem('sendid');
    localStorage.removeItem('adminid');
    localStorage.removeItem('profile');
    localStorage.removeItem('username');
    localStorage.removeItem('accountid');
    localStorage.removeItem('email');
    localStorage.removeItem('kid');
    localStorage.removeItem("recipient");
    localStorage.removeItem("lsid");
    localStorage.removeItem("send_amount");
    localStorage.removeItem("send_currency");
    localStorage.removeItem('bid');
    localStorage.removeItem('load');
    localStorage.removeItem('lastname');
    localStorage.removeItem('transfer_type');
    localStorage.removeItem('paytype');
    localStorage.removeItem('role');
  }

  checkremember = function (event) {

    if (event.target.checked == true) {
      this.chkrem = true;
    } else {
      this.chkrem = false;
    }
  }

  ngOnInit() {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);

    });


    this.myStyle = {
      'position': 'fixed',
      'top': 0,
      'right': 0,
      'bottom': 0,
      'left': 0
    };

    this.myParams = {
      particles: {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#f9b707"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            //"src": "img/github.svg",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 5,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.5,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 6,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "repulse"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 400,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true,
        "config_demo": {
          "hide_card": false,
          "background_color": "#b61924",
          "background_image": "",
          "background_position": "50% 50%",
          "background_repeat": "no-repeat",
          "background_size": "cover"
        }
      }
    };

    this.email = "";

    let decryptedData_email = localStorage.getItem('rem_email');
    let decryptedData_password = localStorage.getItem('rem_password');

    if (decryptedData_email != null) {

      var remail = CryptoJS.AES.decrypt(decryptedData_email.toString(), 'Zipcoin');
      this.email = JSON.parse(remail.toString(CryptoJS.enc.Utf8));

    } else {
      this.email = "";
    }

    if (decryptedData_password != null) {

      var rpassword = CryptoJS.AES.decrypt(decryptedData_password.toString(), 'Zipcoin');
      this.password = JSON.parse(rpassword.toString(CryptoJS.enc.Utf8));

    } else {
      this.password = "";
    }

    this.http.get("https://jsonip.com/").subscribe(
      (res: Response) => {
        this.ip = res.json().ip;
      });

    this.erremail = true;
    this.errpassword = true;
    this.chk_login_or_not();
    this.remove();

  }

}
