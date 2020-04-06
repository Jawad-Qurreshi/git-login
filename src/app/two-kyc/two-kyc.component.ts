import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { Location, DatePipe } from "@angular/common";
import { Router, NavigationEnd } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import alertify from 'alertifyjs';
import { Constants } from '../constants';
import CryptoJS from 'crypto-js';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';



@Component({
  selector: 'app-two-kyc',
  templateUrl: './two-kyc.component.html',
  styleUrls: ['./two-kyc.component.css'],
  providers: [DatePipe]
})

export class TwoKycComponent implements OnInit {
  never_expire: any;


  hosturl: any = Constants.HOST_URL;
  port: any = Constants.PORT_NO;
  durl: any = Constants.DOCURL;
  firsturl: any = Constants.DOCFIRSTURL;
  secondurl: any = Constants.DOCSECONDURL;

  docurl: any;

  errdoctype: any;
  errdocno: any;
  errissuedate: any;
  errexpdate: any;
  erraddress_as_doc: any;
  errfrontside: any;
  errbackside: any;

  form: any;

  frontextention: any;
  lastfront: any;
  frontrand: any;

  backextention: any;
  lastback: any;
  backrand: any;

  document_type: any;
  document_number: any;
  issue_date: any;
  expiry_date: any;
  address_as_doc: any;

  kycdata: any;
  view: any;
  setidate: any;
  setexdate: any;

  frontval: any;
  frontname: any;

  backtval: any;
  backtname: any;

  fdata: any;
  bdata: any;

  dfrontextention: any;
  dlastfront: any;

  bfrontextention: any;
  blastfront: any;

  fval: any;
  fphoto: any;

  bval: any;
  bphoto: any;

  wait: any;
  expirechk: any;

  @ViewChild('filefrontside') inputfrontside: ElementRef;
  @ViewChild('filebackside') inputbackside: ElementRef;

  options: DatepickerOptions = {
    locale: enLocale,
    addClass: 'form-control',
    displayFormat: 'DD-MMM-YYYY',
    barTitleIfEmpty: 'Select Date',
    placeholder: 'dd-----yyyy',
    addStyle: {
      padding: '12px',
      border: 'none',
      width: '100%'
    },
  };
  swait: boolean;

  constructor(private router: Router, private http: Http, private fb: FormBuilder, public datepipe: DatePipe) {
    this.createForm();
  }

  private headers = new Headers({ 'Content-type': 'application/json' });

  createForm() {
    this.form = this.fb.group({
      frontside: null,
      backside: null
    });
  }

  upload_frontside(event) {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('frontside').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        })
      };

      this.frontextention = file.name.split(".");
      this.lastfront = this.frontextention[this.frontextention.length - 1];
      this.frontrand = this.getrand(0, 1000000);

      if (this.lastfront != "png" && this.lastfront != "jpg" && this.lastfront != "jpeg"
        && this.lastfront != "pdf" && this.lastfront != "docx" && this.lastfront != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file");
        this.errfrontside = false;
      }
    }
  }

  upload_backside(event) {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('backside').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        })
      };

      this.backextention = file.name.split(".");
      this.lastback = this.backextention[this.backextention.length - 1];
      this.backrand = this.getrand(0, 1000000);

      if (this.lastback != "png" && this.lastback != "jpg" && this.lastback != "jpeg"
        && this.lastback != "pdf" && this.lastback != "docx" && this.lastback != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file");
        this.errbackside = false;
      }
    }
  }

  first = function () {
    this.router.navigate(['/kyc-document-one']);
  }

  kyc_second = function (data) {

    var id = localStorage.getItem("custid");
    var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
    var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

    const formModel = this.form.value;

    let valid_docno = /^[a-zA-Z0-9 ]*$/;
    let chkdocument_number = valid_docno.test(this.document_number);

    if (this.document_type == "") {
      this.errdoctype = false;
      alertify.error("Please Select Document Type");
    } else {
      this.errdoctype = true;
    }

    if (this.document_number == "" || chkdocument_number == false) {
      this.errdocno = false;
      alertify.error("Please Enter Valid Document Number");
    } else {
      this.errdocno = true;
    }

    if (this.issue_date == "") {
      this.errissuedate = false;
      alertify.error("Please Select Issue Date");
    } else {
      this.errissuedate = true;
    }

    let original = this.datepipe.transform(this.expiry_date, 'yyyy-MM-dd');
    var exp_timestamp = new Date(this.expiry_date).getTime();
    var cuurent_timestamp = new Date().getTime() + (90 * 24 * 60 * 60 * 1000);

    if (this.expiry_date == "") {
      this.errexpdate = false;
      alertify.error("Please Select Expiry Date");
    } else {
      if (cuurent_timestamp <= exp_timestamp) {
        this.errexpdate = true;
      } else {
        this.errexpdate = false;
        alertify.error("Sorry!, Document expiry date must have validity of 90 days from the current date, Please submit valid document.");
      }
    }

    if (this.address_as_doc == "") {
      this.erraddress_as_doc = false;
      alertify.error("Please Enter Address As Per Document");
    } else {
      this.erraddress_as_doc = true;
    }

    if (formModel.frontside == null) {
      this.errfrontside = false;
      alertify.error("Please Choose Frontside Photo");
    } else {
      if (this.lastfront != "png" && this.lastfront != "jpg" && this.lastfront != "jpeg"
        && this.lastfront != "pdf" && this.lastfront != "docx" && this.lastfront != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of FRONTSIDE photo");
        this.errfrontside = false;
      } else {
        this.errfrontside = true;
      }
    }


    if (formModel.backside == null) {
      this.errbackside = false;
      alertify.error("Please Choose Backside Photo");
    } else {
      if (this.lastback != "png" && this.lastback != "jpg" && this.lastback != "jpeg"
        && this.lastback != "pdf" && this.lastback != "docx" && this.lastback != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of BACKEND photo");
        this.errbackside = false;
      } else {
        this.errbackside = true;
      }
    }


    if (this.errdoctype == true && this.errdocno == true && this.errissuedate == true &&
      this.errexpdate == true && this.erraddress_as_doc == true && this.errfrontside == true
      && this.errbackside == true) {

      this.wait = false;

      let secoundkyc = {
        "custid": custid,
        "doctype": data.document_type,
        "docnumber": data.document_number,
        "issue_date": data.issue_date,
        "expirechk": this.expirechk,
        "expiry_date": original,
        "address_as_doc": data.address_as_doc,
        "frontval": formModel.frontside.value,
        "frontside_photo": this.frontrand + formModel.frontside.filename,
        "backval": formModel.backside.value,
        "backside_photo": this.backrand + formModel.backside.filename
      }

      const url = `${this.hosturl + this.port + "/secoundkyc"}`;
      this.http.post(url, JSON.stringify(secoundkyc), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            this.wait = true;
            this.router.navigate(['kyc-document-three']);
          }
        });
    }
  }

  save_kyc_second = function () {

    var id = localStorage.getItem("custid");
    var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
    var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

    const formModel = this.form.value;

    let valid_docno = /^[a-zA-Z0-9 ]*$/;
    let chkdocument_number = valid_docno.test(this.document_number);

    if (this.document_type == "") {
      this.errdoctype = false;
      alertify.error("Please Select Document Type");
    } else {
      this.errdoctype = true;
    }

    if (this.document_number == "" || chkdocument_number == false) {
      this.errdocno = false;
      alertify.error("Please Enter Valid Document Number");
    } else {
      this.errdocno = true;
    }

    if (this.issue_date == "") {
      this.errissuedate = false;
      alertify.error("Please Select Issue Date");
    } else {
      this.errissuedate = true;
    }

    let original = this.datepipe.transform(this.expiry_date, 'yyyy-MM-dd');
    var exp_timestamp = new Date(this.expiry_date).getTime();
    var cuurent_timestamp = new Date().getTime() + (90 * 24 * 60 * 60 * 1000);

    if (this.expiry_date == "") {
      this.errexpdate = false;
      alertify.error("Please Select Expiry Date");
    } else {
      if (cuurent_timestamp <= exp_timestamp) {
        this.errexpdate = true;
      } else {
        this.errexpdate = false;
        alertify.error("Sorry!, Document expiry date must have validity of 90 days from the current date, Please submit valid document.");
      }
    }

    if (this.address_as_doc == "") {
      this.erraddress_as_doc = false;
      alertify.error("Please Enter Address As Per Document");
    } else {
      this.erraddress_as_doc = true;
    }

    if (formModel.frontside == null) {
      this.errfrontside = false;
      alertify.error("Please Choose Frontside Photo");
    } else {
      if (this.lastfront != "png" && this.lastfront != "jpg" && this.lastfront != "jpeg"
        && this.lastfront != "pdf" && this.lastfront != "docx" && this.lastfront != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of FRONTSIDE photo");
        this.errfrontside = false;
      } else {
        this.errfrontside = true;
      }
    }


    if (formModel.backside == null) {
      this.errbackside = false;
      alertify.error("Please Choose Backside Photo");
    } else {
      if (this.lastback != "png" && this.lastback != "jpg" && this.lastback != "jpeg"
        && this.lastback != "pdf" && this.lastback != "docx" && this.lastback != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of BACKEND photo");
        this.errbackside = false;
      } else {
        this.errbackside = true;
      }
    }


    if (this.errdoctype == true && this.errdocno == true && this.errissuedate == true &&
      this.errexpdate == true && this.erraddress_as_doc == true && this.errfrontside == true
      && this.errbackside == true) {

      this.swait = false;

      let secoundkyc = {
        "custid": custid,
        "doctype": this.document_type,
        "docnumber": this.document_number,
        "issue_date": this.issue_date,
        "expirechk": this.expirechk,
        "expiry_date": original,
        "address_as_doc": this.address_as_doc,
        "frontval": formModel.frontside.value,
        "frontside_photo": this.frontrand + formModel.frontside.filename,
        "backval": formModel.backside.value,
        "backside_photo": this.backrand + formModel.backside.filename
      }

      const url = `${this.hosturl + this.port + "/secoundkyc"}`;
      this.http.post(url, JSON.stringify(secoundkyc), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            this.swait = true;


            var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
            var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

            const getkyc = `${this.hosturl + this.port + "/getkycdata/"}${custid}`;
            this.http.get(getkyc).subscribe(
              (res: Response) => {
                this.kycdata = res.json().customer;

                this.view = false;
                this.wait = true;
                this.swait = true;

                this.document_type = this.kycdata[0].document_type;
                this.document_number = this.kycdata[0].document_number;

                let idate = this.kycdata[0].issue_date;
                this.issue_date = this.datepipe.transform(idate, 'yyyy-MM-dd');

                let chkexpire = this.kycdata[0].expirechk;
                if (chkexpire == 1) {

                  this.expirechk = true;
                  this.never_expire = true;

                } else {

                  this.expirechk = false;
                  this.never_expire = false;

                }

                let edate = this.kycdata[0].expiry_date;
                this.expiry_date = this.datepipe.transform(edate, 'yyyy-MM-dd');

                this.address_as_doc = this.kycdata[0].address_as_doc;

                this.fdata = this.kycdata[0].front_side;
                this.frontextention = this.fdata.split(".");
                this.dlastfront = this.frontextention[this.frontextention.length - 1];

                this.bdata = this.kycdata[0].back_side;
                this.backextention = this.bdata.split(".");
                this.blastfront = this.backextention[this.backextention.length - 1];

                this.docurl = this.durl + custid + "/";


              }
            )

          }
        });
    }
  }

  up_kyc_second = function (data) {

    var id = localStorage.getItem("custid");
    var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
    var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

    const formModel = this.form.value;

    let valid_docno = /^[a-zA-Z0-9 ]*$/;
    let chkdocument_number = valid_docno.test(this.document_number);

    if (this.document_type == "") {
      this.errdoctype = false;
      alertify.error("Please Select Document Type");
    } else {
      this.errdoctype = true;
    }

    if (this.document_number == "" || chkdocument_number == false) {
      this.errdocno = false;
      alertify.error("Please Enter Valid Document Number");
    } else {
      this.errdocno = true;
    }

    if (this.issue_date == "") {
      this.errissuedate = false;
      alertify.error("Please Select Issue Date");
    } else {
      this.errissuedate = true;
    }

    let original = this.datepipe.transform(this.expiry_date, 'yyyy-MM-dd');
    var exp_timestamp = new Date(this.expiry_date).getTime();
    var cuurent_timestamp = new Date().getTime() + (90 * 24 * 60 * 60 * 1000);

    if (this.expiry_date == "") {
      this.errexpdate = false;
      alertify.error("Please Select Expiry Date");
    } else {
      if (cuurent_timestamp <= exp_timestamp) {
        this.errexpdate = true;
      } else {
        this.errexpdate = false;
        alertify.error("Sorry!, Document expiry date must have validity of 90 days from the current date, Please submit valid document.");
      }
    }

    if (this.address_as_doc == "") {
      this.erraddress_as_doc = false;
      alertify.error("Please Enter Address As Per Document");
    } else {
      this.erraddress_as_doc = true;
    }

    if (formModel.frontside == null) {
      this.fval = "";
      this.fphoto = "";
      this.errfrontside = true;
    } else {
      if (this.lastfront != "png" && this.lastfront != "jpg" && this.lastfront != "jpeg"
        && this.lastfront != "pdf" && this.lastfront != "docx" && this.lastfront != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of FRONTSIDE photo");
        this.errfrontside = false;
      } else {
        this.errfrontside = true;
      }
    }


    if (formModel.backside == null) {
      this.bval = "";
      this.bphoto = "";
      this.errbackside = true;
    } else {
      if (this.lastback != "png" && this.lastback != "jpg" && this.lastback != "jpeg"
        && this.lastback != "pdf" && this.lastback != "docx" && this.lastback != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of BACKEND photo");
        this.errbackside = false;
      } else {
        this.errbackside = true;
      }
    }

    if (this.errdoctype == true && this.errdocno == true && this.errissuedate == true &&
      this.errexpdate == true && this.erraddress_as_doc == true && this.errfrontside == true
      && this.errbackside == true) {

      this.wait = false;

      let secoundkyc = {
        "custid": custid,
        "doctype": data.document_type,
        "docnumber": data.document_number,
        "issue_date": data.issue_date,
        "expirechk": this.expirechk,
        "expiry_date": original,
        "address_as_doc": data.address_as_doc,
        "frontval": (formModel.frontside) ? formModel.frontside.value : this.fval,
        "frontside_photo": (formModel.frontside) ? this.frontrand + formModel.frontside.filename : this.fphoto,
        "backval": (formModel.backside) ? formModel.backside.value : this.bval,
        "backside_photo": (formModel.backside) ? this.backrand + formModel.backside.filename : this.bphoto
      }

      const url = `${this.hosturl + this.port + "/upsecoundkyc"}`;
      this.http.post(url, JSON.stringify(secoundkyc), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            this.wait = true;
            this.router.navigate(['kyc-document-three']);
          }
        });

    }

  }

  save_up_kyc_second = function () {

    var id = localStorage.getItem("custid");
    var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
    var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

    const formModel = this.form.value;

    let valid_docno = /^[a-zA-Z0-9 ]*$/;
    let chkdocument_number = valid_docno.test(this.document_number);

    if (this.document_type == "") {
      this.errdoctype = false;
      alertify.error("Please Select Document Type");
    } else {
      this.errdoctype = true;
    }

    if (this.document_number == "" || chkdocument_number == false) {
      this.errdocno = false;
      alertify.error("Please Enter Valid Document Number");
    } else {
      this.errdocno = true;
    }

    if (this.issue_date == "") {
      this.errissuedate = false;
      alertify.error("Please Select Issue Date");
    } else {
      this.errissuedate = true;
    }

    let original = this.datepipe.transform(this.expiry_date, 'yyyy-MM-dd');
    var exp_timestamp = new Date(this.expiry_date).getTime();
    var cuurent_timestamp = new Date().getTime() + (90 * 24 * 60 * 60 * 1000);

    if (this.expiry_date == "") {
      this.errexpdate = false;
      alertify.error("Please Select Expiry Date");
    } else {
      if (cuurent_timestamp <= exp_timestamp) {
        this.errexpdate = true;
      } else {
        this.errexpdate = false;
        alertify.error("Sorry!, Document expiry date must have validity of 90 days from the current date, Please submit valid document.");
      }
    }

    if (this.address_as_doc == "") {
      this.erraddress_as_doc = false;
      alertify.error("Please Enter Address As Per Document");
    } else {
      this.erraddress_as_doc = true;
    }

    if (formModel.frontside == null) {
      this.fval = "";
      this.fphoto = "";
      this.errfrontside = true;
    } else {
      if (this.lastfront != "png" && this.lastfront != "jpg" && this.lastfront != "jpeg"
        && this.lastfront != "pdf" && this.lastfront != "docx" && this.lastfront != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of FRONTSIDE photo");
        this.errfrontside = false;
      } else {
        this.errfrontside = true;
      }
    }


    if (formModel.backside == null) {
      this.bval = "";
      this.bphoto = "";
      this.errbackside = true;
    } else {
      if (this.lastback != "png" && this.lastback != "jpg" && this.lastback != "jpeg"
        && this.lastback != "pdf" && this.lastback != "docx" && this.lastback != "doc") {
        alertify.error("Please upload only png, jpg, jpeg, doc and docx file of BACKEND photo");
        this.errbackside = false;
      } else {
        this.errbackside = true;
      }
    }

    if (this.errdoctype == true && this.errdocno == true && this.errissuedate == true &&
      this.errexpdate == true && this.erraddress_as_doc == true && this.errfrontside == true
      && this.errbackside == true) {

      this.swait = false;

      let secoundkyc = {
        "custid": custid,
        "doctype": this.document_type,
        "docnumber": this.document_number,
        "issue_date": this.issue_date,
        "expirechk": this.expirechk,
        "expiry_date": original,
        "address_as_doc": this.address_as_doc,
        "frontval": (formModel.frontside) ? formModel.frontside.value : this.fval,
        "frontside_photo": (formModel.frontside) ? this.frontrand + formModel.frontside.filename : this.fphoto,
        "backval": (formModel.backside) ? formModel.backside.value : this.bval,
        "backside_photo": (formModel.backside) ? this.backrand + formModel.backside.filename : this.bphoto
      }

      const url = `${this.hosturl + this.port + "/upsecoundkyc"}`;
      this.http.post(url, JSON.stringify(secoundkyc), { headers: this.headers }).toPromise()
        .then((res: Response) => {
          if (res.json().success) {
            this.swait = true;
          }
        });

    }

  }

  neverexpire = function (event) {

    if (event.target.checked == true) {
      var d = new Date();
      var n = d.getFullYear();
      var c = n + 20;
      d.setFullYear(c);

      this.expirechk = true;
      this.expiry_date = this.datepipe.transform(d, 'yyyy-MM-dd');

    } else {
      var d = new Date();
      this.expiry_date = this.datepipe.transform(d, 'yyyy-MM-dd');
      this.expirechk = false;
    }

  }

  getrand = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  errorvariable = function () {
    this.errdoctype = true;
    this.errdocno = true;
    this.errissuedate = true;
    this.errexpdate = true;
    this.erraddress_as_doc = true;
    this.errfrontside = true;
    this.errbackside = true;

    this.document_type = "";
    this.document_number = "";
    this.issue_date = "";
    this.expiry_date = "";
    this.address_as_doc = "";

  }

  ngOnInit() {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    var id = localStorage.getItem("custid");

    if (id != null) {
      var bytes_custid = CryptoJS.AES.decrypt(id.toString(), 'Zipcoin');
      var custid = JSON.parse(bytes_custid.toString(CryptoJS.enc.Utf8));

      const getkyc = `${this.hosturl + this.port + "/getkycdata/"}${custid}`;
      this.http.get(getkyc).subscribe(
        (res: Response) => {
          this.kycdata = res.json().customer;
          if (this.kycdata[0].document_type == "") {

            this.view = true;
            this.wait = true;
            this.swait = true;
            this.expirechk = false;

          } else {

            this.view = false;
            this.wait = true;
            this.swait = true;

            this.document_type = this.kycdata[0].document_type;
            this.document_number = this.kycdata[0].document_number;

            let idate = this.kycdata[0].issue_date;
            this.issue_date = this.datepipe.transform(idate, 'yyyy-MM-dd');

            let chkexpire = this.kycdata[0].expirechk;
            if (chkexpire == 1) {

              this.expirechk = true;
              this.never_expire = true;

            } else {

              this.expirechk = false;
              this.never_expire = false;

            }

            let edate = this.kycdata[0].expiry_date;
            this.expiry_date = this.datepipe.transform(edate, 'yyyy-MM-dd');

            this.address_as_doc = this.kycdata[0].address_as_doc;

            this.fdata = this.kycdata[0].front_side;
            this.frontextention = this.fdata.split(".");
            this.dlastfront = this.frontextention[this.frontextention.length - 1];

            this.bdata = this.kycdata[0].back_side;
            this.backextention = this.bdata.split(".");
            this.blastfront = this.backextention[this.backextention.length - 1];

            this.docurl = this.durl + custid + "/";

          }
        }
      )

      this.errorvariable();
    } else {
      this.router.navigate(['/login']);
    }

  }

}
