import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import alertify from 'alertifyjs';
import CryptoJS from 'crypto-js';
import { Constants } from '../constants';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;

  deviceInfo = null;

  country: any;
  errfname: any;
  errmname: any;
  errlname: any;
  errcountry: any;
  errphoneno: any;
  erremail: any;
  errefa: any;
  errpassword: any;
  errrepassword: any;
  errmsg: any;

  countryname: any;
  phoneno: any;
  phonecode: any;

  data: any;

  chkfirst: any;
  fchk: any;

  chksecond: any;
  schk: any;

  chkthird: any;
  tchk: any;

  refcode: any;
  browser: any;
  os: any;
  ip: any;

  myStyle: object = {};
  myParams: object = {};
  width: number = 100;
  height: number = 100;

  constructor(private http: Http, private router: Router, private deviceService: DeviceDetectorService) {
    this.epicFunction();
  }
  private headers = new Headers({ 'Content-type': 'application/json' });

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.browser = this.deviceInfo.browser;
    this.os = this.deviceInfo.os;
  }

  change = function (cid) {

    if (cid != "") {
      const countrycode = `${this.hosturl + this.port + "/chk_code/"}${cid}`;
      this.http.get(countrycode).subscribe(
        (res: Response) => {
          this.phonecode = res.json().code;
        }
      )
    } else {
      this.phonecode = "";
    }


  }

  checkvalid_phone = function (data) {

    let valid_digit = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit.test(data);

    if (chkphone == false) {
      this.errphoneno = false;
      alertify.error("Please Enter Valid Phone Number");
    }

  }

  addnew = function (add) {

    let valid_name = /^[a-zA-Z ]*$/;
    let chkfname = valid_name.test(add.fname);
    let chkmname = valid_name.test(add.mname);
    let chklname = valid_name.test(add.lname);

    let valid_email = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let chkemail = valid_email.test(add.email);

    let valid_digit = /^-?([1-9]\d*)?$/;
    let chkphone = valid_digit.test(add.phoneno);

    let valid_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let chkpass = valid_password.test(add.password);
    let chkrepass = valid_password.test(add.repassword);

    if (add.fname == "" || chkfname == false) {
      this.errfname = false;
      alertify.error("Please Enter Valid First And Middle Name");
    } else {
      this.errfname = true;
    }

    if (add.mname == "" || chkmname == false) {
      this.errmname = false;
      alertify.error("Please Enter Valid Middle Name");
    } else {
      this.errmname = true;
    }

    if (add.lname == "" || chklname == false) {
      this.errlname = false;
      alertify.error("Please Enter Valid Last Name");
    } else {
      this.errlname = true;
    }

    if (this.countryname == "") {
      this.errcountry = false;
      alertify.error("Please Enter Valid Country Name");
    } else {
      this.errcountry = true;
    }

    if (this.phoneno == "" || chkphone == false) {
      this.errphoneno = false;
      alertify.error("Please Enter Valid Phone Number");
    } else {
      this.errphoneno = true;
    }

    if (add.email == "" || chkemail == false) {
      this.erremail = false;
      alertify.error("Please Enter Valid Email");
    } else {
      this.erremail = true;
    }

    if (add.password == "" || chkpass == false) {
      this.errpassword = false;
      alertify.error("Please Enter Password");
    } else {
      this.errpassword = true;
    }

    if (add.repassword == "" || chkrepass == false) {
      this.errrepassword = false;
      this.errmsg = false;
      alertify.error("Please Enter Valid Password");
    } else {
      if (add.password == add.repassword) {
        this.errrepassword = true;
        this.errmsg = false;
      } else {
        this.errmsg = true;
      }
    }

    if (this.chkfirst == true) {
      this.fchk = true;
    } else {
      this.fchk = false;
      alertify.error("Please Check I Accept Terms and Conditions");
    }

    if (this.chksecond == true) {
      this.schk = true;
    } else {
      this.schk = false;
      alertify.error("Please Check I agree to receive system notification and newsletters from ZipCoin");
    }

    if (this.errfname == true && this.errmname == true && this.errlname == true && this.errcountry == true
      && this.errphoneno == true && this.erremail == true && this.errpassword == true
      && this.errrepassword == true && this.fchk == true && this.schk == true) {

      this.data = {
        "fname": add.fname,
        "mname": add.mname,
        "lname": add.lname,
        "country": this.countryname,
        "phonecode": this.phonecode,
        "phoneno": this.phoneno,
        "email": add.email,
        "password": add.password,
        "repassword": add.repassword,
        "refcode": (add.refcode) ? add.refcode : this.refcode,
        "ip": this.ip,
        "browser": this.browser,
        "os": this.os
      }

      const url = `${this.hosturl + this.port + "/register"}`;
      this.http.post(url, JSON.stringify(this.data), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            alertify.success(res.json().msg);
            localStorage.removeItem("refercode");
            this.router.navigate(['./login']);
          } else {
            alertify.error(res.json().msg);
          }
        })

    }

  }

  checkfirst = function (event) {

    if (event.target.checked == true) {
      this.chkfirst = true;
    } else {
      this.chkfirst = false;
    }

  }

  checksecond = function (event) {

    if (event.target.checked == true) {
      this.chksecond = true;
    } else {
      this.chksecond = false;
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

    this.errfname = true;
    this.errmname = true;
    this.errlname = true;
    this.errcountry = true;
    this.errphoneno = true;
    this.erremail = true;
    this.errefa = true;
    this.errpassword = true;
    this.errrepassword = true;
    this.errmsg = false;

    this.countryname = "";
    this.phoneno = "";
    this.phonecode = "";

    let decryptedData_refcode = localStorage.getItem('refercode');
    if (decryptedData_refcode != null) {
      var bytes_refcode = CryptoJS.AES.decrypt(decryptedData_refcode.toString(), 'Zipcoin');
      let rcode = JSON.parse(bytes_refcode.toString(CryptoJS.enc.Utf8));

      if (rcode != "") {
        this.refcode = rcode;
      } else {
        this.refcode = "";
      }
    }


    const getcountry = `${this.hosturl + this.port + "/country"}`;
    this.http.get(getcountry).subscribe(
      (res: Response) => {
        this.country = res.json().country;
      }
    )

    this.http.get("https://jsonip.com/").subscribe(
      (res: Response) => {
        this.ip = res.json().ip;
      });
  }

}
