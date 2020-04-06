var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: 'upload/' });
var mysql = require('mysql');
const app = express();
var fs = require('fs');
var nodemailer = require('nodemailer');
var CryptoJS = require("crypto-js");
var speakeasy = require('speakeasy');
var QRCode = require('qrcode');
var unirest = require('unirest');
const stripe = require("stripe")("sk_test_1Z67qGxaLoVFRJUi15Qiu6EP");
const PORT = 4100;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "zipcx_db_meanstack",
    multipleStatements: true
});

con.connect(function (err) {
    if (err)
        throw err;
    console.log("Connected!");
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true,
    limit: '1000mb'
}));


function random_code(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function random_digit_code(length) {
    var text = "";
    var possible = "0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

app.post('/login', function (req, res) {

    var postdata = req.body;

    con.query("select * from customer_master where email = '" + postdata.email + "'", function (err, login) {

        con.query("select * from admin where username = '" + postdata.email + "'", function (err, admin_data) {

            if (login[0] != null) {

                let data = login[0].password;
                let buff = new Buffer(data, 'base64');
                let pass = buff.toString('ascii');

                if (postdata.password == pass) {

                    if (login[0].activation_status == 0) {

                        var rec = { "success": false, "msg": "Please check your mail and activate your account" };
                        res.end(JSON.stringify(rec));

                    } else {
                        con.query("select * from countries where c_id = '" + login[0].country + "'", function (err, country_data) {

                            var loghistory = {
                                "cust_id": login[0].cust_id,
                                "browser": postdata.browser,
                                "ip_address": postdata.ip,
                                "os": postdata.os,
                                "status": 1
                            }

                            var log_data = 'insert into customerloginhistory set ?';
                            con.query(log_data, loghistory, function (err, result) {

                                var rec = {
                                    "success": true,
                                    "msg": "Login successfully",
                                    "custid": login[0].cust_id,
                                    "fullname": login[0].first_name,
                                    "lastname": login[0].last_name,
                                    "email": login[0].email,
                                    "accountid": login[0].account_id,
                                    "profile": login[0].profile_pic,
                                    "type": "0",
                                    "auth": login[0].two_auth,
                                    "block": login[0].block,
                                    "role": login[0].role,
                                    "login": {
                                        "success": true,
                                        "msg": "Login successfully",
                                        "custid": login[0].cust_id,
                                        "first_name": login[0].first_name,
                                        "middle_name": login[0].middle_name,
                                        "last_name": login[0].last_name,
                                        "email": login[0].email,
                                        "accountid": login[0].account_id,
                                        "profile": login[0].profile_pic,
                                        "type": "0",
                                        "lastname": login[0].last_name,
                                        "country_id": login[0].country,
                                        "country_name": country_data[0].country_name,
                                        "currency": country_data[0].currency_code,
                                        "gender": login[0].gender,
                                        "phonecode": login[0].phonecode,
                                        "phone": login[0].phone,
                                        "occupation": login[0].occupation,
                                        "postcode": login[0].postcode,
                                        "address": login[0].address,
                                        "referralcode": login[0].referralcode
                                    }
                                };

                                res.end(JSON.stringify(rec));

                            });


                        });
                    }
                    
                } else {

                    var loghistory = {
                        "cust_id": login[0].cust_id,
                        "browser": postdata.browser,
                        "ip_address": postdata.ip,
                        "os": postdata.os,
                        "status": 0
                    }

                    var log_data = 'insert into customerloginhistory set ?';
                    con.query(log_data, loghistory, function (err, result) {
                        var rec = { "success": false, "msg": "Your Password Is Wrong." };
                        res.end(JSON.stringify(rec));
                    });
                }

            } else if (admin_data[0] != null) {

                if (postdata.password == admin_data[0].password) {

                    var loghistory = {
                        "admin_id": admin_data[0].admin_id,
                        "browser": postdata.browser,
                        "ip_address": postdata.ip,
                        "os": postdata.os,
                        "status": 1
                    }

                    var log_data = 'insert into adminloginhistory set ?';
                    con.query(log_data, loghistory, function (err, result) {

                        var rec = {
                            "success": true,
                            "msg": "Login successfully",
                            "adminid": admin_data[0].admin_id,
                            "username": admin_data[0].username,
                            "auth": admin_data[0].two_auth,
                            "type": "1"
                        };

                        res.end(JSON.stringify(rec));

                    });

                } else {

                    var loghistory = {
                        "admin_id": admin_data[0].admin_id,
                        "browser": postdata.browser,
                        "ip_address": postdata.ip,
                        "os": postdata.os,
                        "status": 0
                    }

                    var log_data = 'insert into adminloginhistory set ?';
                    con.query(log_data, loghistory, function (err, result) {
                        var rec = { "success": false, "msg": "Your Password Is Wrong." };
                        res.end(JSON.stringify(rec));
                    });
                }

            } else {
                var rec = { "success": false, "msg": "User does not exist" };
                res.end(JSON.stringify(rec));
            }

        });

    });
});

app.post('/social_login', function (req, res) {

    var postdata = req.body;

    con.query("select * from customer_master where email = '" + postdata.email + "'", function (err, login) {
        if (login[0] != null) {

            var rec = {
                "success": true,
                "msg": "Login successfully",
                "custid": login[0].cust_id,
                "fullname": login[0].first_name,
                "email": login[0].email,
                "accountid": login[0].account_id,
                "profile": login[0].profile_pic,
                "type": "0",
                "auth": login[0].two_auth
            };

            res.end(JSON.stringify(rec));

        } else {

            var a = postdata.name.split(' ')[0];
            var refcode = a + random_code(6);
            var accountid = "ZIPCO" + random_digit_code(8) + "REM";

            var data = {
                "account_id": accountid,
                "first_name": postdata.name,
                "last_name": "",
                "email": postdata.email,
                "phone": "",
                "password": "",
                "country": "",
                "status": "0",
                "referralcode": refcode,
                "referralcodefrom": "",
                "oauth_provider": "Google",
                "oauth_uid": postdata.id,
                "activation_status": "1"
            };

            var cust_data = 'insert into customer_master set ?';
            con.query(cust_data, data, function (err, result) {

                var id = result.insertId;

                con.query("select * from customer_master where cust_id = '" + id + "'", function (err, googlelogin) {

                    var rec = {
                        "success": true,
                        "msg": "Login successfully",
                        "custid": googlelogin[0].cust_id,
                        "fullname": googlelogin[0].first_name,
                        "email": googlelogin[0].email,
                        "accountid": googlelogin[0].account_id,
                        "profile": googlelogin[0].profile_pic,
                        "type": "0",
                        "auth": googlelogin[0].two_auth
                    };

                    res.end(JSON.stringify(rec));

                });
            });
        }
    });
});

app.get('/country', function (req, res) {

    con.query('select * from countries', function (err, country) {
        var rec = { "country": country };
        res.end(JSON.stringify(rec));
    });

});

app.get('/chk_code/:cid', function (req, res) {

    var country_id = req.params.cid;

    con.query('select * from countries where c_id = ?', [country_id], function (err, country) {
        var rec = { "code": country[0].country_code };
        res.end(JSON.stringify(rec));
    });

});

app.post('/register', function (req, res) {

    var postdata = req.body;
    var a = "";

    con.query('select * from customer_master where email = ?', [postdata.email], function (err, chkcust) {

        con.query('select * from countries where c_id = ?', [postdata.country], function (err, currency) {

            con.query('select * from customer_master where referralcode = ?', [postdata.refcode], function (err, ref) {

                if (ref == "") {
                    a = "";
                } else {
                    a = ref[0].email;
                }

                if (chkcust[0] == null) {

                    var refcode = postdata.fname + random_code(6);

                    let buff = new Buffer(postdata.password);
                    let base64pass = buff.toString('base64');

                    var data = {
                        "account_id": "",
                        "first_name": postdata.fname,
                        "middle_name": postdata.mname,
                        "last_name": postdata.lname,
                        "email": postdata.email,
                        "phonecode": postdata.phonecode,
                        "phone": postdata.phoneno,
                        "gender": "",
                        "password": base64pass,
                        "country": postdata.country,
                        "state": "",
                        "city": "",
                        "currency_name": currency[0].currency_code,
                        "occupation": "",
                        "postcode": "",
                        "status": "0",
                        "referralcode": refcode,
                        "referralcodefrom": a,
                        "browser": postdata.browser,
                        "ip_address": postdata.ip,
                        "os": postdata.os
                    };

                    var cust_data = 'insert into customer_master set ?';
                    con.query(cust_data, data, function (err, result) {

                        var id = result.insertId;
                        var accountid = "ZIPCO" + random_digit_code(8) + "REM";

                        con.query('update customer_master set account_id = ?  where cust_id = ?', [accountid, id], function (err, result, fields) { });

                        /* start send mail */

                        let buff = new Buffer(id.toString());
                        let base64data = buff.toString('base64');

                        var link = "http://localhost:4200/#/active/" + base64data;
                        var output = "<p>Welcome " + postdata.fname + "<p><br><br> Thank you for registering for the ZIPCO tokens. <br>" + link + "<br>Please activate your account using the following link: <br>" + link;

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: postdata.email, // list of receivers
                            subject: 'ZIPCOIN : Activate Your Account', // Subject line
                            text: 'Welcome', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var code = random_digit_code(4);

                        con.query('update customer_master set mobile_otp = ?  where cust_id = ?', [code, id], function (err, result, fields) { });

                        unirest
                            .post('https://2factor.in/API/V1/d03ce752-7c1e-11e9-ade6-0200cd936042/SMS/+' + postdata.phoneno + '/' + code)
                            .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
                            .then((response) => {

                                var rec = { "success": true, "msg": "Signup successfully please check your e-mail, we sent you verification link." };
                                res.end(JSON.stringify(rec));

                            })
                    });

                } else {
                    var rec = { "success": false, "msg": "Email Address All Ready Exist ..!" };
                    res.end(JSON.stringify(rec));
                }
            });
        });
    });
});

app.post('/active', function (req, res) {

    var postdata = req.body;
    var customerid = postdata.custid;
    let buff = new Buffer(customerid, 'base64');
    let id = buff.toString('ascii');

    con.query("select * from customer_master where mobile_otp = ? and cust_id = ?", [postdata.otp, id], function (err, login) {
        if (login[0] != null) {

            con.query('update customer_master set activation_status = 1, mobile_otp = "" where cust_id = ?', [id], function (err, result, fields) {
                var rec = { "success": true, "msg": "Your account is activated" };
                res.end(JSON.stringify(rec));
            });

        } else {

            var rec = { "success": false, "msg": "Please enter valid otp otherwise resend otp on your phone number." };
            res.end(JSON.stringify(rec));

        }
    });

});

app.post('/resend_otp', function (req, res) {

    var postdata = req.body;
    var customerid = postdata.custid;
    let buff = new Buffer(customerid, 'base64');
    let id = buff.toString('ascii');

    var code = random_digit_code(4);

    con.query('update customer_master set mobile_otp = ?  where cust_id = ?', [code, id], function (err, result, fields) { });

    unirest
        .post('https://2factor.in/API/V1/d03ce752-7c1e-11e9-ade6-0200cd936042/SMS/+' + postdata.phone + '/' + code)
        .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        .then((response) => {

            var rec = { "success": true, "msg": "New OTP Send on Your Number" };
            res.end(JSON.stringify(rec));

        })

});

app.post('/new_resend_otp', function (req, res) {

    var postdata = req.body;
    var id = postdata.custid;

    var code = random_digit_code(4);

    con.query('update customer_master set mobile_otp = ?  where cust_id = ?', [code, id], function (err, result, fields) { });

    unirest
        .post('https://2factor.in/API/V1/d03ce752-7c1e-11e9-ade6-0200cd936042/SMS/+' + postdata.phone + '/' + code)
        .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        .then((response) => {

            var rec = { "success": true, "msg": "New OTP Send on Your Number" };
            res.end(JSON.stringify(rec));

        })

});

app.post('/new_active', function (req, res) {

    var postdata = req.body;
    var id = postdata.custid;

    con.query("select * from customer_master where mobile_otp = ? and cust_id = ?", [postdata.otp, id], function (err, login) {
        if (login[0] != null) {

            con.query('update customer_master set mobile_otp = "" where cust_id = ?', [id], function (err, result, fields) {
                var rec = { "success": true, "msg": "Your mobile number is verified" };
                res.end(JSON.stringify(rec));
            });

        } else {

            var rec = { "success": false, "msg": "Please enter valid otp otherwise resend otp on your phone number." };
            res.end(JSON.stringify(rec));

        }
    });

});

app.post('/forgot_mail', function (req, res) {

    var postdata = req.body;

    if (postdata.email != "") {
        con.query("select * from customer_master where email = '" + postdata.email + "'", function (err, login) {
            if (login[0] == null) {
                var rec = { "success": false, "msg": "Invalid EmailID" };
                res.end(JSON.stringify(rec));
            } else {

                /* start send mail */
                let code = login[0].cust_id;
                let buff = new Buffer(code.toString());
                let id = buff.toString('base64');

                var link = "http://localhost:4200/#/changepassword/" + id;
                var output = "<p>Hello, <br><br>Please copy-paste following link on the browser <br><br><br>" + link + "<br><br> or <a href='" + link + "'>Click Here</a> to reset your password <br><br> Best Regards,<br>Team ZipCoin.";

                var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465, //587
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: 'kalgudechandu204@gmail.com', // generated ethereal user
                        pass: '204204204'  // generated ethereal password
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                var mailOptions = {
                    from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                    to: postdata.email, // list of receivers
                    subject: 'ZIPCOIN:Forgot Password', // Subject line
                    text: 'Change assword', // plain text body
                    html: output // html body
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                });

                /* end mail code */

                var rec = { "success": true, "msg": "We have sent you an e-mail with a link to restore your password" };
                res.end(JSON.stringify(rec));

            }
        });

    } else {
        var rec = { "success": false, "msg": "Please enter your email" };
        res.end(JSON.stringify(rec));
    }

});

app.post('/chkid', function (req, res) {

    var postdata = req.body;
    var code = postdata.code;
    let buff = new Buffer(code, 'base64');
    let id = buff.toString('ascii');

    con.query("select * from customer_master where cust_id = ?", [id], function (err, login) {

        if (login[0] != null) {
            var rec = { "success": true, "msg": "Your account is activated", "id": id };
            res.end(JSON.stringify(rec));
        } else {
            var rec = { "success": false, "msg": "Something want to wrong" };
            res.end(JSON.stringify(rec));
        }
    });

});

app.post('/changepassword', function (req, res) {

    var postdata = req.body;
    var id = postdata.id;
    con.query('select * from customer_master where cust_id = ?', [id], function (err, getrecord, fields) {

        let data = getrecord[0].password;
        let buff = new Buffer(data, 'base64');
        let pass = buff.toString('ascii');

        if (postdata.oldpassword == pass) {

            let buff = new Buffer(postdata.newpassword);
            let base64pass = buff.toString('base64');

            con.query('update customer_master set password = ? where cust_id = ?', [base64pass, id], function (err, result, fields) {
                var rec = { "success": true, "msg": "Your password is change" };
                res.end(JSON.stringify(rec));
            });

        } else {
            var rec = { "success": false, "msg": "Currenct password is not match" };
            res.end(JSON.stringify(rec));
        }

    });

});

app.post('/resend_mail', function (req, res) {

    var postdata = req.body;
    var email = postdata.email;

    con.query("select * from customer_master where email = '" + email + "'", function (err, login) {

        if (login[0] == null) {
            var rec = { "success": false, "msg": "User does not exist" };
            res.end(JSON.stringify(rec));
        } else {

            if (login[0].activation_status == 0) {

                /* start send mail */

                let id = login[0].cust_id;
                let buff = new Buffer(id.toString());
                let base64data = buff.toString('base64');

                var link = "http://localhost:4200/#/active/" + base64data;
                var output = "<p>Welcome " + login[0].fname + "<p><br><br> Thank you for registering for the ZIPCO tokens. <br>" + link + "<br>Please activate your account using the following link: <br>" + link;

                var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465, //587
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: 'kalgudechandu204@gmail.com', // generated ethereal user
                        pass: '204204204'  // generated ethereal password
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                var mailOptions = {
                    from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                    to: email, // list of receivers
                    subject: 'ZIPCOIN : Re-Activate Your Account', // Subject line
                    text: 'Welcome', // plain text body
                    html: output // html body
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                });

                /* end mail code */


                var code = random_digit_code(4);

                con.query('update customer_master set mobile_otp = ?  where cust_id = ?', [code, id], function (err, result, fields) { });

                unirest
                    .post('https://2factor.in/API/V1/d03ce752-7c1e-11e9-ade6-0200cd936042/SMS/+' + login[0].phone + '/' + code)
                    .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
                    .then((response) => {

                        var rec = { "success": true, "msg": "Please check your e-mail, we sent you re-verification link." };
                        res.end(JSON.stringify(rec));

                    })

            } else {
                var rec = { "success": false, "msg": "Your account is already activated." };
                res.end(JSON.stringify(rec));
            }
        }
    });
});

app.get('/state/:cid', function (req, res) {

    var country_id = req.params.cid;

    con.query('select * from states where country_id = ?', [country_id], function (err, state) {
        var rec = { "state": state };
        res.end(JSON.stringify(rec));
    });

});

app.get('/city/:sid', function (req, res) {

    var state_id = req.params.sid;

    con.query('select * from city where state_id = ?', [state_id], function (err, city) {
        var rec = { "city": city };
        res.end(JSON.stringify(rec));
    });

});

app.post('/firstkyc', function (req, res) {

    var postdata = req.body;

    var kyc_document = {
        "cust_id": postdata.custid,
        "first_name": postdata.fname,
        "middle_name": postdata.mname,
        "last_name": postdata.lname,
        "email": postdata.email,
        "dob": postdata.dob,
        "phonecode": postdata.phonecode,
        "phone_number": postdata.phone,
        "country": postdata.country,
        "state": postdata.state,
        "city": postdata.city,
        "street_address": postdata.streetaddress,
        "zipcode": postdata.postalcode,
        "occupation": postdata.occupation
    }

    con.query("insert into ikyc_tbl set ?", kyc_document, function (err, kyc_data) {
        var rec = { "success": true };
        res.end(JSON.stringify(rec));
    });

});

app.post('/secoundkyc', function (req, res) {

    var postdata = req.body;

    con.query('select * from ikyc_tbl where cust_id = ?', [postdata.custid], function (err, getdata) {

        var dire = "../src/assets/KycDoc/kyc_" + postdata.custid;
        if (!fs.existsSync(dire)) {
            fs.mkdirSync(dire);
        }

        /*------------------------------------------- UPLOADING ----------------------------------------------*/

        if (getdata[0].front_side == "") {
            var bitmap_file_frontside = new Buffer(postdata.frontval, 'base64');
            fs.writeFileSync("../src/assets/KycDoc/kyc_" + postdata.custid + "/" + postdata.frontside_photo, bitmap_file_frontside);
        }

        if (getdata[0].back_side == "") {
            var bitmap_file_backside = new Buffer(postdata.backval, 'base64');
            fs.writeFileSync("../src/assets/KycDoc/kyc_" + postdata.custid + "/" + postdata.backside_photo, bitmap_file_backside);
        }

        con.query('update ikyc_tbl set document_type = ?, document_number = ?, issue_date = ?, expirechk = ?, expiry_date = ?, address_as_doc = ?, front_side = ?, back_side = ? where cust_id = ?',
            [postdata.doctype, postdata.docnumber, postdata.issue_date, postdata.expirechk, postdata.expiry_date
                , postdata.address_as_doc, postdata.frontside_photo, postdata.backside_photo,
            postdata.custid], function (err, result) {

                var rec = { "success": true };
                res.end(JSON.stringify(rec));

            });

        /*--------------------------------------------- END UPLOADING -------------------------------------------------*/

    });

});

app.post('/thirdkyc', function (req, res) {

    var postdata = req.body;

    con.query('select * from ikyc_tbl where cust_id = ?', [postdata.custid], function (err, getdata) {

        var dire = "../src/assets/KycDoc/kyc_" + postdata.custid;
        if (!fs.existsSync(dire)) {
            fs.mkdirSync(dire);
        }

        /*------------------------------------------- UPLOADING ----------------------------------------------*/

        if (getdata[0].utility_bill == "") {
            var bitmap_file_bill = new Buffer(postdata.billval, 'base64');
            fs.writeFileSync("../src/assets/KycDoc/kyc_" + postdata.custid + "/" + postdata.bill_photo, bitmap_file_bill);
        }

        if (getdata[0].selfie_id == "") {
            var bitmap_file_selfi = new Buffer(postdata.selfival, 'base64');
            fs.writeFileSync("../src/assets/KycDoc/kyc_" + postdata.custid + "/" + postdata.selfi_photo, bitmap_file_selfi);
        }

        con.query('update ikyc_tbl set bill_expiry_date = ?, utility_bill = ?, selfie_id = ?, comment = ?, browser = ?, ip_address = ?, os = ?, kyc_fill_status = "1" where cust_id = ?',
            [postdata.billdate, postdata.bill_photo, postdata.selfi_photo, postdata.comment, postdata.browser, postdata.ip, postdata.os, postdata.custid], function (err, result) {

                var rec = { "success": true };
                res.end(JSON.stringify(rec));

            });

        /*--------------------------------------------- END UPLOADING -------------------------------------------------*/

    });
});

app.post('/upfirstkyc', function (req, res) {

    var postdata = req.body;

    con.query('update ikyc_tbl set first_name = ?, middle_name = ?, last_name = ?, email = ?, dob = ?, phonecode = ?, phone_number = ?, country = ?, state = ?, city = ?, street_address = ?, zipcode = ?, occupation = ? where cust_id = ?',
        [postdata.fname, postdata.mname, postdata.lname, postdata.email, postdata.dob, postdata.phonecode, postdata.phone, postdata.country
            , postdata.state, postdata.city, postdata.streetaddress, postdata.postalcode, postdata.occupation,
        postdata.custid], function (err, result) {

            var rec = { "success": true };
            res.end(JSON.stringify(rec));

        });
});

app.post('/upsecoundkyc', function (req, res) {

    var postdata = req.body;

    con.query('select * from ikyc_tbl where cust_id = ?', [postdata.custid], function (err, getdata) {

        var dire = "../src/assets/KycDoc/kyc_" + postdata.custid;
        if (!fs.existsSync(dire)) {
            fs.mkdirSync(dire);
        }

        /*------------------------------------------- UPLOADING ----------------------------------------------*/

        if (postdata.frontval != "") {

            var check_frontside_path = '../src/assets/KycDoc/kyc_' + postdata.custid + '/' + getdata[0].front_side;
            if (fs.existsSync(check_frontside_path)) {
                fs.unlink('../src/assets/KycDoc/kyc_' + postdata.custid + '/' + getdata[0].front_side, (err) => { });
            } else { }

            var bitmap_file_frontside = new Buffer(postdata.frontval, 'base64');
            fs.writeFileSync('../src/assets/KycDoc/kyc_' + postdata.custid + '/' + postdata.frontside_photo, bitmap_file_frontside);

            con.query('update ikyc_tbl set front_side = ? where cust_id = ?', [postdata.frontside_photo, postdata.custid], function (err, result) { });
        }

        if (postdata.backval != "") {

            var check_backside_path = '../src/assets/KycDoc/kyc_' + postdata.custid + '/' + getdata[0].back_side;
            if (fs.existsSync(check_backside_path)) {
                fs.unlink('../src/assets/KycDoc/kyc_' + postdata.custid + '/' + getdata[0].back_side, (err) => { });
            } else { }

            var bitmap_file_backside = new Buffer(postdata.backval, 'base64');
            fs.writeFileSync('../src/assets/KycDoc/kyc_' + postdata.custid + '/' + postdata.backside_photo, bitmap_file_backside);

            con.query('update ikyc_tbl set back_side = ? where cust_id = ?', [postdata.backside_photo, postdata.custid], function (err, result) { });
        }

        con.query('update ikyc_tbl set document_type = ?, document_number = ?, issue_date = ?, expirechk = ?, expiry_date = ?, address_as_doc = ? where cust_id = ?',
            [postdata.doctype, postdata.docnumber, postdata.issue_date, postdata.expirechk, postdata.expiry_date
                , postdata.address_as_doc, postdata.custid], function (err, result) {

                    var rec = { "success": true };
                    res.end(JSON.stringify(rec));

                });

        /*--------------------------------------------- END UPLOADING -------------------------------------------------*/

    });
});

app.post('/upthirdkyc', function (req, res) {

    var postdata = req.body;

    con.query('select * from ikyc_tbl where cust_id = ?', [postdata.custid], function (err, getdata) {

        var dire = "../src/assets/KycDoc/kyc_" + postdata.custid;
        if (!fs.existsSync(dire)) {
            fs.mkdirSync(dire);
        }

        /*------------------------------------------- UPLOADING ----------------------------------------------*/

        if (postdata.billval != "") {

            var check_bill_path = '../src/assets/KycDoc/kyc_' + postdata.custid + '/' + getdata[0].utility_bill;
            if (fs.existsSync(check_bill_path)) {
                fs.unlink('../src/assets/KycDoc/kyc_' + postdata.custid + '/' + getdata[0].utility_bill, (err) => { });
            } else { }

            var bitmap_file_bill = new Buffer(postdata.billval, 'base64');
            fs.writeFileSync('../src/assets/KycDoc/kyc_' + postdata.custid + '/' + postdata.bill_photo, bitmap_file_bill);

            con.query('update ikyc_tbl set utility_bill = ? where cust_id = ?', [postdata.bill_photo, postdata.custid], function (err, result) { });
        }

        if (postdata.selfival != "") {

            var check_selfi_path = '../src/assets/KycDoc/kyc_' + postdata.custid + '/' + getdata[0].selfie_id;
            if (fs.existsSync(check_selfi_path)) {
                fs.unlink('../src/assets/KycDoc/kyc_' + postdata.custid + '/' + getdata[0].selfie_id, (err) => { });
            } else { }

            var bitmap_file_selfi = new Buffer(postdata.selfival, 'base64');
            fs.writeFileSync('../src/assets/KycDoc/kyc_' + postdata.custid + '/' + postdata.selfi_photo, bitmap_file_selfi);

            con.query('update ikyc_tbl set selfie_id = ? where cust_id = ?', [postdata.selfi_photo, postdata.custid], function (err, result) { });
        }

        con.query('update ikyc_tbl set bill_expiry_date = ?, comment = ?, browser = ?, ip_address = ?, os = ?, verified_status = 0 where cust_id = ?',
            [postdata.bill_expiry_date, postdata.comment, postdata.browser, postdata.ip, postdata.os, postdata.custid], function (err, result) {

                var rec = { "success": true };
                res.end(JSON.stringify(rec));

            });

        /*--------------------------------------------- END UPLOADING -------------------------------------------------*/

    });
});

app.get('/getkycdata/:cid', function (req, res) {

    var custid = req.params.cid;

    con.query('select k.*, cr.country_name, st.state_name, ct.city_name from ikyc_tbl k left join countries cr on k.country = cr.c_id left join states st on k.state = st.id left join city ct on k.city = ct.id where k.cust_id = ?', [custid], function (err, customer_data) {
        if (customer_data == "") {
            var rec = { "success": false, "customer": customer_data };
            res.end(JSON.stringify(rec));
        } else {
            var rec = { "success": true, "customer": customer_data };
            res.end(JSON.stringify(rec));
        }
    });

});

app.get('/m_getkyc', function (req, res) {

    con.query('select k.*, c.account_id as accountid, con.country_name as country from ikyc_tbl k, customer_master c, countries con where k.cust_id = c.cust_id and k.country = con.c_id and k.kyc_fill_status = 1 ORDER BY ikyc_id DESC', function (err, ikyc) {
        var rec = { "getkycdata": ikyc };
        res.end(JSON.stringify(rec));
    });

});

app.get('/viewkyc/:kid', function (req, res) {
    var kid = req.params.kid;
    con.query('select k.*, c.country_name, s.state_name, ct.city_name, cc.block from ikyc_tbl k, countries c, states s, city ct, customer_master cc where k.country = c.c_id and k.state = s.id and k.city = ct.id and cc.cust_id = k.cust_id and k.ikyc_id = ?', [kid], function (err, m_kyc_id) {
        var rec = { "viewkyc": m_kyc_id };
        res.end(JSON.stringify(rec));
    });
});

app.get('/kyc_approve_status/:kid', function (req, res) {
    var kid = req.params.kid;

    con.query('select * from ikyc_tbl where ikyc_id = ?', [kid], function (err, result) {
        con.query('select * from customer_master where cust_id = ?', [result[0].cust_id], function (err, custdata) {
            /* start send mail */

            var output = '<p>Hi ' + custdata[0].first_name + ' <br><br> Your KYC is successfully approved by our team.<br><br><br>Best Regards,<br>Team ZipCoin.<p>';

            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465, //587
                secure: true, // true for 465, false for other ports
                auth: {
                    user: 'kalgudechandu204@gmail.com', // generated ethereal user
                    pass: '204204204'  // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            var mailOptions = {
                from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                to: custdata[0].email, // list of receivers
                subject: 'ZIPCOIN : Your KYC is approved', // Subject line
                text: 'Approved', // plain text body
                html: output // html body
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
            });

            /* end mail code */

            con.query('update ikyc_tbl set verified_status = 1 where ikyc_id = ?', [kid], function (err, result) {
                var rec = { "success": true, "msg": "KYC-Document is verified" };
                res.end(JSON.stringify(rec));
            });
        });
    });
});

app.post('/kyc_reject_status', function (req, res) {

    var postdata = req.body;

    con.query('select * from ikyc_tbl where ikyc_id = ?', [postdata.kid], function (err, result) {
        con.query('select * from customer_master where cust_id = ?', [result[0].cust_id], function (err, custdata) {

            /* start send mail */

            var output = '<p>Hi ' + custdata[0].first_name + ' <br><br> Your KYC is reject because of ' + postdata.reason + ' . <br><br><br>Best Regards,<br>Team ZipCoin.<p>';

            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465, //587
                secure: true, // true for 465, false for other ports
                auth: {
                    user: 'kalgudechandu204@gmail.com', // generated ethereal user
                    pass: '204204204'  // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            var mailOptions = {
                from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                to: custdata[0].email, // list of receivers
                subject: 'ZIPCOIN : Your KYC is reject', // Subject line
                text: 'Rejected', // plain text body
                html: output // html body
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
            });

            /* end mail code */

            con.query('update ikyc_tbl set verified_status = 2, note = ? where ikyc_id = ?', [postdata.reason, postdata.kid], function (err, result) {
                var rec = { "success": true, "msg": "KYC-Document is rejected" };
                res.end(JSON.stringify(rec));
            });
        });
    });
});

app.post('/search', function (req, res) {
    var postdata = req.body;
    if (postdata.status != "" && postdata.country != "") {
        var seo = "select k.*, c.account_id as accountid, con.country_name as country from ikyc_tbl k, customer_master c, countries con where k.cust_id = c.cust_id and k.country = con.c_id and k.verified_status = '" + postdata.status + "' and k.country = '" + postdata.country + "'";
        con.query(seo, function (err, ikyc) {
            if (ikyc == "") {
                var rec = { "success": false, "msg": "No data available in table", "search": ikyc };
                res.end(JSON.stringify(rec));
            } else {
                var rec = { "success": true, "search": ikyc };
                res.end(JSON.stringify(rec));
            }

        });
    } else if (postdata.status != "") {
        var seo = "select k.*, c.account_id as accountid, con.country_name as country from ikyc_tbl k, customer_master c, countries con where k.cust_id = c.cust_id and k.country = con.c_id and k.verified_status = '" + postdata.status + "'";
        con.query(seo, function (err, ikyc) {
            if (ikyc == "") {
                var rec = { "success": false, "msg": "No data available in table", "search": ikyc };
                res.end(JSON.stringify(rec));
            } else {
                var rec = { "success": true, "search": ikyc };
                res.end(JSON.stringify(rec));
            }
        });
    } else if (postdata.country != "") {
        var seo = "select k.*, c.account_id as accountid, con.country_name as country from ikyc_tbl k, customer_master c, countries con where k.cust_id = c.cust_id and k.country = con.c_id and k.country = '" + postdata.country + "'";
        con.query(seo, function (err, ikyc) {
            if (ikyc == "") {
                var rec = { "success": false, "msg": "No data available in table", "search": ikyc };
                res.end(JSON.stringify(rec));
            } else {
                var rec = { "success": true, "search": ikyc };
                res.end(JSON.stringify(rec));
            }
        });
    } else {
        var rec = { "success": false, "msg": "Please select what you are search" };
        res.end(JSON.stringify(rec));
    }
});

app.post('/get_auth_config', function (req, res) {

    var postdata = req.body;

    var secret = speakeasy.generateSecret({ length: 10, name: 'Zipcoin' });
    var address = secret.base32;
    var cid = postdata.custid;

    QRCode.toDataURL(secret.otpauth_url, function (err, image_data) {

        con.query('update customer_master set google_auth_code = ? where cust_id = ?', [address, cid], function (err, result) { });

        var url = speakeasy.otpauthURL({ secret: address, label: 'Zipcoin', encoding: 'base32' });

        var rec = { "address": address, "qrcode": url };
        res.end(JSON.stringify(rec));
    });
});

app.get('/chk_qrcode/:cid', function (req, res) {
    var cid = req.params.cid;
    con.query('select * from customer_master where cust_id = ?', [cid], function (err, chk_image) {

        if (chk_image[0].google_auth_code) {
            var url = speakeasy.otpauthURL({ secret: chk_image[0].google_auth_code, label: 'Zipcoin', encoding: 'base32' });
        }

        var rec = { "address": chk_image[0].google_auth_code, "auth_status": chk_image[0].two_auth, "url": url };
        res.end(JSON.stringify(rec));
    });
});

app.post('/auth_code_verify', function (req, res) {

    var postdata = req.body;
    var cid = postdata.cid;
    var address = postdata.address;
    var token = postdata.code;

    con.query('select * from customer_master where cust_id = ?', [cid], function (err, chk_two_auth) {

        var verified = speakeasy.totp.verify({
            secret: address,
            encoding: 'base32',
            token: token
        });

        if (verified == true) {


            if (chk_two_auth[0].two_auth == 1) {
                con.query('update customer_master set two_auth = 0 where cust_id = ?', [cid], function (err, result) {
                    var rec = { "success": true, "msg": "Disabled successfully" };
                    res.end(JSON.stringify(rec));
                });
            } else {
                con.query('update customer_master set two_auth = 1 where cust_id = ?', [cid], function (err, result) {
                    var rec = { "success": true, "msg": "Enable successfully" };
                    res.end(JSON.stringify(rec));
                });
            }



        } else {
            var rec = { "success": false, "msg": "Please Enter Valid Code" };
            res.end(JSON.stringify(rec));
        }

    });

});

app.post('/auth_code_verify_from_login', function (req, res) {

    var postdata = req.body;
    var cid = postdata.cid;
    var token = postdata.code;

    con.query('select * from customer_master where cust_id = ?', [cid], function (err, chk_two_auth) {

        var verified = speakeasy.totp.verify({
            secret: chk_two_auth[0].google_auth_code,
            encoding: 'base32',
            token: token
        });

        if (verified == true) {
            var rec = { "success": true, "msg": "Login successfully" };
            res.end(JSON.stringify(rec));
        } else {
            var rec = { "success": false, "msg": "Please Enter Valid Token" };
            res.end(JSON.stringify(rec));
        }

    });

});

app.post('/auth_enbl_dsbl', function (req, res) {

    var postdata = req.body;
    var cid = postdata.cid;

    con.query('select * from customer_master where cust_id = ?', [cid], function (err, chk_two_auth) {

        if (chk_two_auth[0].two_auth == 1) {
            con.query('update customer_master set two_auth = 0 where cust_id = ?', [cid], function (err, result) {
                var rec = { "success": true, "msg": "Disabled successfully" };
                res.end(JSON.stringify(rec));
            });
        } else {
            con.query('update customer_master set two_auth = 1 where cust_id = ?', [cid], function (err, result) {
                var rec = { "success": true, "msg": "Enable successfully" };
                res.end(JSON.stringify(rec));
            });
        }

    });
});

app.get('/getauthdata/:cid', function (req, res) {

    var custid = req.params.cid;

    con.query('select * from customer_master where cust_id = ?', [custid], function (err, customer_data) {
        var rec = { "status": customer_data[0].two_auth };
        res.end(JSON.stringify(rec));
    });

});

app.get('/benificiary_country/:cid', function (req, res) {
    var cid = req.params.cid;

    con.query('select * from countries where c_id = ?', [cid], function (err, result) {
        con.query('select * from benificiary_country where country_name = ?', [result[0].country_name], function (err, bcountry) {

            if (bcountry == "") {
                var data = {
                    "country_name": result[0].country_name,
                    "country_code": result[0].country_code,
                    "country_iso": result[0].country_iso,
                    "flage_iso": result[0].country_iso.toLowerCase()
                };

                var country_data = 'insert into benificiary_country set ?';
                con.query(country_data, data, function (err, result) {
                    var rec = { "success": true, "msg": "Insert Successfully" };
                    res.end(JSON.stringify(rec));
                });
            } else {
                var rec = { "success": false, "msg": "Country already exist" };
                res.end(JSON.stringify(rec));
            }
        });
    });
});

app.get('/get_bcountry', function (req, res) {

    con.query('select * from benificiary_country', function (err, country) {
        var rec = { "get_bcountry": country };
        res.end(JSON.stringify(rec));
    });

});

app.delete('/delete_country/:cid', function (req, res) {
    var cid = req.params.cid;

    con.query('delete from benificiary_country where bc_id = ?', [cid], function (err, result) {
        var rec = { "success": true, "msg": "Deleted Successfully" };
        res.end(JSON.stringify(rec));
    });

});

app.get('/m_get_country/:cid', function (req, res) {
    var cid = req.params.cid;

    con.query('select * from benificiary_country where bc_id = ?', [cid], function (err, result) {
        var rec = { "success": true, "bcountry": result };
        res.end(JSON.stringify(rec));
    });

});

app.post('/edit_country', function (req, res) {

    var postdata = req.body;

    var data = {
        "country_name": postdata.bcountry
    };

    var up_transfer = 'update benificiary_country set ? where bc_id = ' + postdata.bcid;
    con.query(up_transfer, data, function (err, result) {
        var rec = { "success": true, "msg": "Update Successfully" };
        res.end(JSON.stringify(rec));
    });

});

app.post('/addbenificiary', function (req, res) {

    var postdata = req.body;

    var data = {
        "cust_id": postdata.custid,
        "currency": postdata.currency,
        "recipient_type": postdata.recipienttype,
        "name_business": postdata.name_business,
        "phoneno": postdata.phoneno,
        "email": postdata.email,
        "chkverify": postdata.chkverify,
        "IN_ifsc_code": (postdata.ifsc_code) ? postdata.ifsc_code : "",
        "IN_account_no": (postdata.accountno) ? postdata.accountno : "",
        "US_bank_acc_country": (postdata.bank_account_country) ? postdata.bank_account_country : "",
        "US_routing_no": (postdata.routingno) ? postdata.routingno : "",
        "US_account_no": (postdata.us_accountno) ? postdata.us_accountno : "",
        "US_account_type": (postdata.us_accounttype) ? postdata.us_accounttype : "",
        "CA_institution_no": (postdata.institutionno) ? postdata.institutionno : "",
        "CA_transit_no": (postdata.transitno) ? postdata.transitno : "",
        "CA_account_no": (postdata.ca_accountno) ? postdata.ca_accountno : "",
        "CA_account_type": (postdata.ca_accounttype) ? postdata.ca_accounttype : "",
        "PH_bank_name": (postdata.ph_bank_name) ? postdata.ph_bank_name : "",
        "PH_account_no": (postdata.ph_accountno) ? postdata.ph_accountno : "",
        "NZ_account_no": (postdata.nz_account_no) ? postdata.nz_account_no : "",
        "BR_bank_name": (postdata.br_bank_name) ? postdata.br_bank_name : "",
        "BR_branch_code": (postdata.br_branchcode) ? postdata.br_branchcode : "",
        "BR_account_no": (postdata.br_accountno) ? postdata.br_accountno : "",
        "BR_account_type": (postdata.br_accounttype) ? postdata.br_accounttype : "",
        "BR_recipient_phone_no": (postdata.br_phoneno) ? postdata.br_phoneno : "",
        "BR_cpf_no": (postdata.br_cpf) ? postdata.br_cpf : "",
        "GB_ukcode": (postdata.gb_ukcode) ? postdata.gb_ukcode : "",
        "GB_account_no": (postdata.gb_accountno) ? postdata.gb_accountno : "",
        "KE_banificiary_bank": (postdata.banificiary_bank) ? postdata.banificiary_bank : "",
        "KE_account_no": (postdata.ke_accountno) ? postdata.ke_accountno : "",
        "NG_banificiary_bank": (postdata.ng_banificiary_bank) ? postdata.ng_banificiary_bank : "",
        "NG_account_no": (postdata.ng_accountno) ? postdata.ng_accountno : "",
        "ZA_bank_name": (postdata.za_bankname) ? postdata.za_bankname : "",
        "ZA_account_no": (postdata.za_accountno) ? postdata.za_accountno : "",
        "ZA_phone_no": (postdata.za_phoneno) ? postdata.za_phoneno : "",
        "ER_iban": (postdata.er_iban) ? postdata.er_iban : "",
        "ip_address": postdata.ip,
        "browser": postdata.browser,
        "os": postdata.os
    };

    var benificiary_data = 'insert into benificiary set ?';
    con.query(benificiary_data, data, function (err, result) {
        var rec = { "success": true, "msg": "Add Benificiary Details" };
        res.end(JSON.stringify(rec));
    });

});

app.get('/cust_benificiary/:bid', function (req, res) {
    var bid = req.params.bid;

    con.query('select b.*, c.first_name, cr.country_name, cr.flage_iso, cr.country_code from benificiary b, customer_master c, benificiary_country cr where b.cust_id = c.cust_id and b.currency = cr.bc_id and b.bid = ?', [bid], function (err, result) {
        var rec = { "success": true, "cust_benificiary": result };
        res.end(JSON.stringify(rec));
    });
});

app.get('/get_benificiary/:cid', function (req, res) {
    var cid = req.params.cid;

    con.query('select b.*, c.first_name, cr.country_name, cr.flage_iso from benificiary b, customer_master c, benificiary_country cr where b.cust_id = c.cust_id and b.currency = cr.bc_id and b.cust_id = ?', [cid], function (err, result) {
        var rec = { "success": true, "get_benificiary": result };
        res.end(JSON.stringify(rec));
    });
});

app.delete('/delete_benificiary/:bid', function (req, res) {
    var bid = req.params.bid;

    con.query('delete from benificiary where bid = ?', [bid], function (err, result) {
        var rec = { "success": true, "msg": "Deleted Successfully" };
        res.end(JSON.stringify(rec));
    });

});

app.put('/upbenificiary', function (req, res) {

    var postdata = req.body;

    var beni_id = postdata.bid;

    var data = {
        "bid": postdata.bid,
        "currency": postdata.currency,
        "recipient_type": postdata.recipienttype,
        "name_business": postdata.name_business,
        "phoneno": postdata.phoneno,
        "email": postdata.email,
        "chkverify": postdata.chkverify,
        "IN_ifsc_code": (postdata.ifsc_code) ? postdata.ifsc_code : "",
        "IN_account_no": (postdata.accountno) ? postdata.accountno : "",
        "US_bank_acc_country": (postdata.bank_account_country) ? postdata.bank_account_country : "",
        "US_routing_no": (postdata.routingno) ? postdata.routingno : "",
        "US_account_no": (postdata.us_accountno) ? postdata.us_accountno : "",
        "US_account_type": (postdata.us_accounttype) ? postdata.us_accounttype : "",
        "CA_institution_no": (postdata.institutionno) ? postdata.institutionno : "",
        "CA_transit_no": (postdata.transitno) ? postdata.transitno : "",
        "CA_account_no": (postdata.ca_accountno) ? postdata.ca_accountno : "",
        "CA_account_type": (postdata.ca_accounttype) ? postdata.ca_accounttype : "",
        "PH_bank_name": (postdata.ph_bank_name) ? postdata.ph_bank_name : "",
        "PH_account_no": (postdata.ph_accountno) ? postdata.ph_accountno : "",
        "NZ_account_no": (postdata.nz_accountno) ? postdata.nz_accountno : "",
        "BR_bank_name": (postdata.br_bank_name) ? postdata.br_bank_name : "",
        "BR_branch_code": (postdata.br_branchcode) ? postdata.br_branchcode : "",
        "BR_account_no": (postdata.br_accountno) ? postdata.br_accountno : "",
        "BR_account_type": (postdata.br_accounttype) ? postdata.br_accounttype : "",
        "BR_recipient_phone_no": (postdata.br_phoneno) ? postdata.br_phoneno : "",
        "BR_cpf_no": (postdata.br_cpf) ? postdata.br_cpf : "",
        "GB_ukcode": (postdata.gb_ukcode) ? postdata.gb_ukcode : "",
        "GB_account_no": (postdata.gb_accountno) ? postdata.gb_accountno : "",
        "KE_banificiary_bank": (postdata.banificiary_bank) ? postdata.banificiary_bank : "",
        "KE_account_no": (postdata.ke_accountno) ? postdata.ke_accountno : "",
        "NG_banificiary_bank": (postdata.ng_banificiary_bank) ? postdata.ng_banificiary_bank : "",
        "NG_account_no": (postdata.ng_accountno) ? postdata.ng_accountno : "",
        "ZA_bank_name": (postdata.za_bankname) ? postdata.za_bankname : "",
        "ZA_account_no": (postdata.za_accountno) ? postdata.za_accountno : "",
        "ZA_phone_no": (postdata.za_phoneno) ? postdata.za_phoneno : "",
        "ER_iban": (postdata.er_iban) ? postdata.er_iban : "",
    };

    var cust_up_data = 'update benificiary set ? where bid = ' + beni_id;
    con.query(cust_up_data, data, function (err, result) {
        var rec = { "success": true, "msg": "Edit Benificiary Details" };
        res.end(JSON.stringify(rec));
    });

});

app.get('/benificiary_flage/:cid', function (req, res) {
    var cid = req.params.cid;

    con.query('select * from benificiary_country where bc_id = ?', [cid], function (err, result) {
        var rec = { "success": true, "benificiary_flage": result };
        res.end(JSON.stringify(rec));
    });
});

app.get('/m_getuser_details', function (req, res) {

    var sql = "select c.*, con.country_name, kyc.verified_status as kycstatus from customer_master c left join countries con on c.country = con.c_id left join ikyc_tbl kyc on kyc.cust_id = c.cust_id ORDER BY c.cust_id DESC";

    con.query(sql, function (err, customer) {
        var rec = { "getuser_details": customer };
        res.end(JSON.stringify(rec));
    });

});

app.get('/get_customer/:cid', function (req, res) {
    var cid = req.params.cid;

    con.query('select * from customer_master where cust_id = ?', [cid], function (err, result) {
        var rec = { "success": true, "get_customer": result };
        res.end(JSON.stringify(rec));
    });
});

app.post('/addstate', function (req, res) {

    var postdata = req.body;

    con.query('select * from states where country_id = ? and state_name = ?', [postdata.country, postdata.state], function (err, duplicate_state) {

        if (duplicate_state == "") {

            var data = {
                "country_id": postdata.country,
                "state_name": postdata.state,
                "status": "Enable",
                "created_ip": null
            };

            var state_data = 'insert into states set ?';
            con.query(state_data, data, function (err, result) {
                var rec = { "success": true, "msg": "Add Successfully" };
                res.end(JSON.stringify(rec));
            });

        } else {
            var rec = { "success": false, "msg": "State is allready exist" };
            res.end(JSON.stringify(rec));
        }
    });

});

app.post('/addcity', function (req, res) {

    var postdata = req.body;

    con.query('select * from city where state_id = ? and city_name = ?', [postdata.state, postdata.city], function (err, duplicate_city) {
        if (duplicate_city == "") {
            var data = {
                "state_id": postdata.state,
                "city_name": postdata.city,
                "status": "Enable",
                "created_ip": null
            };

            var city_data = 'insert into city set ?';
            con.query(city_data, data, function (err, result) {
                var rec = { "success": true, "msg": "Add Successfully" };
                res.end(JSON.stringify(rec));
            });
        } else {
            var rec = { "success": false, "msg": "City is allready exist" };
            res.end(JSON.stringify(rec));
        }
    });

});

app.post('/one/upsend_money', function (req, res) {

    var postdata = req.body;

    var data = {
        "send_amount": postdata.send_amount,
        "send_currency": postdata.send_currency,
        "get_amount": postdata.get_amount,
        "get_currency": postdata.get_currency,
        "total_fee": postdata.fee,
        "total_amount": postdata.amount,
        "visa_mc_fee": postdata.visafee,
        "amex_fee": postdata.amexfee
    };

    var one_up_transfer = 'update sendmony set ? where sid = ' + postdata.sendid;
    con.query(one_up_transfer, data, function (err, result) {
        var rec = { "success": true };
        res.end(JSON.stringify(rec));
    });

});

app.post('/one/send_money', function (req, res) {

    var postdata = req.body;

    var data = {
        "cust_id": postdata.custid,
        "send_amount": postdata.send_amount,
        "send_currency": postdata.send_currency,
        "get_amount": postdata.get_amount,
        "get_currency": postdata.get_currency,
        "total_fee": postdata.fee,
        "total_amount": postdata.amount,
        "visa_mc_fee": postdata.visafee,
        "amex_fee": postdata.amexfee
    };

    var send_data = 'insert into sendmony set ?';
    con.query(send_data, data, function (err, result) {
        var id = result.insertId;
        var rec = { "success": true, "sid": id };
        res.end(JSON.stringify(rec));
    });

});

app.post('/two/send_money', function (req, res) {

    var postdata = req.body;

    var data = {
        "transfer_type": postdata.transfer_type
    };

    var up_transfer = 'update sendmony set ? where sid = ' + postdata.sendid;
    con.query(up_transfer, data, function (err, result) {
        var rec = { "success": true };
        res.end(JSON.stringify(rec));
    });

});

app.post('/three/send_money', function (req, res) {

    var postdata = req.body;

    var data = {
        "benificiary_id": postdata.benificiary_id,
        "benificiary_type": postdata.benificiary_type,
        "email": postdata.email,
        "self_account_holder": postdata.self_account_holder,
        "else_account_holder": postdata.else_account_holder,
        "country": postdata.country,
        "state": postdata.state,
        "city": postdata.city,
        "self_ifsc_code": postdata.self_ifsc_code,
        "else_ifsc_code": postdata.else_ifsc_code,
        "self_account_number": postdata.self_account_number,
        "else_account_number": postdata.else_account_number,
        "agentid": postdata.agentid,
        "recemail": postdata.recemail,
        "recname": postdata.recname,
        "recaddress": postdata.recaddress,
        "reccountry": postdata.reccountry,
        "recstate": postdata.recstate,
        "reccity": postdata.reccity,
        "recphone": postdata.recphone,
        "transfer_reason": postdata.transfer_reason
    };

    var up_transfer = 'update sendmony set ? where sid = ' + postdata.sendid;
    con.query(up_transfer, data, function (err, result) {
        var rec = { "success": true };
        res.end(JSON.stringify(rec));
    });

});

app.post('/four/send_money', function (req, res) {

    var postdata = req.body;

    if (postdata.promocode != "") {

        var currency = postdata.scurrency.toLowerCase();

        con.query('select * from promocode where pcode = ? and currency = ?', [postdata.promocode, currency], function (err, promocode_data) {

            if (promocode_data == "") {
                var rec = { "success": false };
                res.end(JSON.stringify(rec));
            } else {

                var data = {
                    "promocode": postdata.promocode,
                    "promoval": promocode_data[0].promocode_value
                };

                var up_transfer = 'update sendmony set ? where sid = ' + postdata.sendid;
                con.query(up_transfer, data, function (err, result) {
                    var rec = { "success": true, "promo_val": promocode_data[0].promocode_value };
                    res.end(JSON.stringify(rec));
                });
            }

        });

    } else {
        var data = {
            "promocode": postdata.promocode,
            "promoval": ""
        };

        var up_transfer = 'update sendmony set ? where sid = ' + postdata.sendid;
        con.query(up_transfer, data, function (err, result) {
            var rec = { "success": true, "promo_val": "" };
            res.end(JSON.stringify(rec));
        });
    }

});

app.post('/create/token', function (req, res) {

    var postdata = req.body;

    stripe.charges.create({
        amount: postdata.amount,
        currency: postdata.currency,
        source: postdata.token,
        description: "Charge for Zipcoin Remit"
    }, function (err, charge) {

        var data = {
            "payment_type": postdata.pay_type,
            "transfer_number": random_digit_code(8),
            "final_status": 1
        };

        var up_transfer = 'update sendmony set ? where sid = ' + postdata.sendid;
        con.query(up_transfer, data, function (err, result) {

            if (postdata.transfer_type == "bank transfer") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {
                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "stripe_id": postdata.token,
                            "cardno": postdata.cardno,
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true };
                            res.end(JSON.stringify(rec));
                        });
                    });
                });

            } else if (postdata.transfer_type == "cash pick-up") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {

                    var code = random_digit_code(4);

                    con.query('update customer_master set mobile_otp = ?  where cust_id = ?', [code, sender_data[0].agentid], function (err, result, fields) { });



                    unirest
                        .post('https://2factor.in/API/V1/d03ce752-7c1e-11e9-ade6-0200cd936042/SMS/+' + sender_data[0].recphone + '/' + code)
                        .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
                        .then((response) => {

                            var zrmt = random_digit_code(8);

                            /* start send mail */

                            var output = "<p>Please you go nearest ZIPCO REMIT center and verify your transaction with help from agent and your verify code is " + code + " and yor ZRMT no is </p>" + zrmt;

                            var transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 465, //587
                                secure: true, // true for 465, false for other ports
                                auth: {
                                    user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                    pass: '204204204'  // generated ethereal password
                                },
                                tls: {
                                    rejectUnauthorized: false
                                }
                            });

                            var mailOptions = {
                                from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                                to: sender_data[0].recemail, // list of receivers
                                subject: 'ZIPCOIN : Verification Code', // Subject line
                                text: 'Transaction', // plain text body
                                html: output // html body
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    return console.log(error);
                                }
                            });

                            /* end mail code */

                            var transferdata = {
                                "sid": postdata.sendid,
                                "cust_id": postdata.custid,
                                "zrmt_no": zrmt,
                                "transaction_number": random_digit_code(8),
                                "stripe_id": postdata.token,
                                "cardno": postdata.cardno,
                                "status": 0,
                                "browser": postdata.browser,
                                "ip_address": postdata.ip,
                                "os": postdata.os,
                            };

                            var trans_data = 'insert into transaction set ?';
                            con.query(trans_data, transferdata, function (err, result) {

                                var agent_trans_data = 'insert into agent_transaction set ?';
                                con.query(agent_trans_data, transferdata, function (err, result) {

                                    var rec = { "success": true };
                                    res.end(JSON.stringify(rec));

                                });
                            });
                        })
                });

            } else if (postdata.transfer_type == "mobile top-up") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {
                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "stripe_id": postdata.token,
                            "cardno": postdata.cardno,
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true };
                            res.end(JSON.stringify(rec));
                        });
                    });
                });

            } else if (postdata.transfer_type == "airtime top-up") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {
                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "stripe_id": postdata.token,
                            "cardno": postdata.cardno,
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true };
                            res.end(JSON.stringify(rec));
                        });
                    });
                });

            } else if (postdata.transfer_type == "gift card") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {
                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "stripe_id": postdata.token,
                            "cardno": postdata.cardno,
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true };
                            res.end(JSON.stringify(rec));
                        });
                    });
                });

            } else if (postdata.transfer_type == "zipco wallet") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {
                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "stripe_id": postdata.token,
                            "cardno": postdata.cardno,
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true };
                            res.end(JSON.stringify(rec));
                        });
                    });
                });

            } else if (postdata.transfer_type == "cash pickup") {

                var transferdata = {
                    "sid": postdata.sendid,
                    "cust_id": postdata.custid,
                    "transaction_number": random_digit_code(8),
                    "stripe_id": postdata.token,
                    "cardno": postdata.cardno,
                    "status": 0,
                    "browser": postdata.browser,
                    "ip_address": postdata.ip,
                    "os": postdata.os,
                };

                var trans_data = 'insert into transaction set ?';
                con.query(trans_data, transferdata, function (err, result) {
                    var rec = { "success": true };
                    res.end(JSON.stringify(rec));
                });

            }

        });
    });
});

app.post('/five/send_money', function (req, res) {

    var postdata = req.body;

    var data = {
        "payment_type": postdata.pay_type,
        "transfer_number": random_digit_code(8),
        "final_status": 1
    };

    var up_transfer = 'update sendmony set ? where sid = ' + postdata.sendid;
    con.query(up_transfer, data, function (err, result) {

        var dire = "../src/assets/KycDoc/kyc_" + postdata.custid;
        if (!fs.existsSync(dire)) {
            fs.mkdirSync(dire);
        }

        /*------------------------------------------- UPLOADING ----------------------------------------------*/

        if (postdata.payment_imgval != "") {

            var bitmap_file_payment = new Buffer(postdata.payment_imgval, 'base64');
            fs.writeFileSync('../src/assets/KycDoc/kyc_' + postdata.custid + '/' + postdata.payment_img_photo, bitmap_file_payment);
        }

        /*------------------------------------------- UPLOADING END ----------------------------------------------*/

        if (postdata.token) {

            if (postdata.transfer_type == "bank transfer") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {
                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "stripe_id": postdata.token,
                            "cardno": postdata.cardno,
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true };
                            res.end(JSON.stringify(rec));
                        });
                    });
                });

            } else if (postdata.transfer_type == "cash pick-up") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {

                    var code = random_digit_code(4);

                    con.query('update customer_master set mobile_otp = ?  where cust_id = ?', [code, sender_data[0].agentid], function (err, result, fields) { });

                    /* start send mail */

                    var output = "<p>Please you go nearest ZIPCO REMIT center and verify your transaction with help from agent and your verify code is </p>" + code;

                    var transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465, //587
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: 'kalgudechandu204@gmail.com', // generated ethereal user
                            pass: '204204204'  // generated ethereal password
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    });

                    var mailOptions = {
                        from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                        to: sender_data[0].recemail, // list of receivers
                        subject: 'ZIPCOIN : Verification Code', // Subject line
                        text: 'Transaction', // plain text body
                        html: output // html body
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            return console.log(error);
                        }
                    });

                    /* end mail code */

                    unirest
                        .post('https://2factor.in/API/V1/d03ce752-7c1e-11e9-ade6-0200cd936042/SMS/+' + sender_data[0].recphone + '/' + code)
                        .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
                        .then((response) => {

                            var transferdata = {
                                "sid": postdata.sendid,
                                "cust_id": postdata.custid,
                                "zrmt_no": random_digit_code(8),
                                "transaction_number": random_digit_code(8),
                                "stripe_id": postdata.token,
                                "cardno": postdata.cardno,
                                "status": 0,
                                "browser": postdata.browser,
                                "ip_address": postdata.ip,
                                "os": postdata.os,
                            };

                            var trans_data = 'insert into transaction set ?';
                            con.query(trans_data, transferdata, function (err, result) {

                                var agent_trans_data = 'insert into agent_transaction set ?';
                                con.query(agent_trans_data, transferdata, function (err, result) {

                                    var rec = { "success": true };
                                    res.end(JSON.stringify(rec));

                                });
                            });
                        })
                });

            } else if (postdata.transfer_type == "mobile top-up") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {
                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "stripe_id": postdata.token,
                            "cardno": postdata.cardno,
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true };
                            res.end(JSON.stringify(rec));
                        });
                    });
                });

            } else if (postdata.transfer_type == "airtime top-up") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {
                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "stripe_id": postdata.token,
                            "cardno": postdata.cardno,
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true };
                            res.end(JSON.stringify(rec));
                        });
                    });
                });

            } else if (postdata.transfer_type == "gift card") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {
                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "stripe_id": postdata.token,
                            "cardno": postdata.cardno,
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true };
                            res.end(JSON.stringify(rec));
                        });
                    });
                });

            } else if (postdata.transfer_type == "zipco wallet") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {
                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "stripe_id": postdata.token,
                            "cardno": postdata.cardno,
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true };
                            res.end(JSON.stringify(rec));
                        });
                    });
                });

            } else if (postdata.transfer_type == "cash pickup") {

                var transferdata = {
                    "sid": postdata.sendid,
                    "cust_id": postdata.custid,
                    "transaction_number": random_digit_code(8),
                    "stripe_id": postdata.token,
                    "cardno": postdata.cardno,
                    "status": 0,
                    "browser": postdata.browser,
                    "ip_address": postdata.ip,
                    "os": postdata.os,
                };

                var trans_data = 'insert into transaction set ?';
                con.query(trans_data, transferdata, function (err, result) {
                    var rec = { "success": true };
                    res.end(JSON.stringify(rec));
                });

            }

        } else {

            if (postdata.transfer_type == "bank transfer") {
                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {
                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "referenceno": (postdata.referenceno) ? postdata.referenceno : "",
                            "payment_screenshot": (postdata.payment_img_photo) ? postdata.payment_img_photo : "",
                            "eos_address": (postdata.eosaddress) ? postdata.eosaddress : "",
                            "zipco_amount": (postdata.zipcoamount) ? postdata.zipcoamount : "",
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true, "redirect": "regular" };
                            res.end(JSON.stringify(rec));
                        });
                    });
                });
            } else if (postdata.transfer_type == "cash pick-up") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {

                    var code = random_digit_code(4);

                    con.query('update customer_master set mobile_otp = ?  where cust_id = ?', [code, sender_data[0].agentid], function (err, result, fields) { });

                    unirest
                        .post('https://2factor.in/API/V1/d03ce752-7c1e-11e9-ade6-0200cd936042/SMS/+' + sender_data[0].recphone + '/' + code)
                        .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
                        .then((response) => {

                            var zrmt = random_digit_code(8);

                            /* start send mail */

                            var output = "<p>Please you go nearest ZIPCO REMIT center and verify your transaction with help from agent and your verify code is " + code + " and yor ZRMT no is </p>" + zrmt;

                            var transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 465, //587
                                secure: true, // true for 465, false for other ports
                                auth: {
                                    user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                    pass: '204204204'  // generated ethereal password
                                },
                                tls: {
                                    rejectUnauthorized: false
                                }
                            });

                            var mailOptions = {
                                from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                                to: sender_data[0].recemail, // list of receivers
                                subject: 'ZIPCOIN : Verification Code', // Subject line
                                text: 'Transaction', // plain text body
                                html: output // html body
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    return console.log(error);
                                }
                            });

                            /* end mail code */

                            var transferdata = {
                                "sid": postdata.sendid,
                                "cust_id": postdata.custid,
                                "zrmt_no": zrmt,
                                "transaction_number": random_digit_code(8),
                                "stripe_id": postdata.token,
                                "cardno": postdata.cardno,
                                "status": 0,
                                "browser": postdata.browser,
                                "ip_address": postdata.ip,
                                "os": postdata.os,
                            };

                            var trans_data = 'insert into transaction set ?';
                            con.query(trans_data, transferdata, function (err, result) {

                                var agent_trans_data = 'insert into agent_transaction set ?';
                                con.query(agent_trans_data, transferdata, function (err, result) {

                                    var rec = { "success": true };
                                    res.end(JSON.stringify(rec));

                                });
                            });
                        })
                });

            } else if (postdata.transfer_type == "mobile top-up") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {
                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "referenceno": (postdata.referenceno) ? postdata.referenceno : "",
                            "payment_screenshot": (postdata.payment_img_photo) ? postdata.payment_img_photo : "",
                            "eos_address": (postdata.eosaddress) ? postdata.eosaddress : "",
                            "zipco_amount": (postdata.zipcoamount) ? postdata.zipcoamount : "",
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true, "redirect": "regular" };
                            res.end(JSON.stringify(rec));
                        });

                    });
                });

            } else if (postdata.transfer_type == "airtime top-up") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {
                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "referenceno": (postdata.referenceno) ? postdata.referenceno : "",
                            "payment_screenshot": (postdata.payment_img_photo) ? postdata.payment_img_photo : "",
                            "eos_address": (postdata.eosaddress) ? postdata.eosaddress : "",
                            "zipco_amount": (postdata.zipcoamount) ? postdata.zipcoamount : "",
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true, "redirect": "regular" };
                            res.end(JSON.stringify(rec));
                        });
                    });
                });

            } else if (postdata.transfer_type == "gift card") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {
                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "referenceno": (postdata.referenceno) ? postdata.referenceno : "",
                            "payment_screenshot": (postdata.payment_img_photo) ? postdata.payment_img_photo : "",
                            "eos_address": (postdata.eosaddress) ? postdata.eosaddress : "",
                            "zipco_amount": (postdata.zipcoamount) ? postdata.zipcoamount : "",
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true, "redirect": "regular" };
                            res.end(JSON.stringify(rec));
                        });
                    });
                });

            } else if (postdata.transfer_type == "zipco wallet") {

                con.query('select * from sendmony where sid = ?', [postdata.sendid], function (err, sender_data) {

                    con.query('select * from benificiary where bid = ?', [sender_data[0].benificiary_id], function (err, beneficiary_data) {

                        /* start send mail */

                        var output = "<p>You will get " + sender_data[0].get_amount + " " + sender_data[0].get_currency + " </p>";

                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465, //587
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: 'kalgudechandu204@gmail.com', // generated ethereal user
                                pass: '204204204'  // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });

                        var mailOptions = {
                            from: '"ZIPCOIN" <no-reply@chandu.managemyapp.online>', // sender address
                            to: beneficiary_data[0].email, // list of receivers
                            subject: 'ZIPCOIN : Send Money', // Subject line
                            text: 'Transaction', // plain text body
                            html: output // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        /* end mail code */

                        var transferdata = {
                            "sid": postdata.sendid,
                            "cust_id": postdata.custid,
                            "transaction_number": random_digit_code(8),
                            "referenceno": (postdata.referenceno) ? postdata.referenceno : "",
                            "payment_screenshot": (postdata.payment_img_photo) ? postdata.payment_img_photo : "",
                            "eos_address": (postdata.eosaddress) ? postdata.eosaddress : "",
                            "zipco_amount": (postdata.zipcoamount) ? postdata.zipcoamount : "",
                            "status": 0,
                            "browser": postdata.browser,
                            "ip_address": postdata.ip,
                            "os": postdata.os,
                        };

                        var trans_data = 'insert into transaction set ?';
                        con.query(trans_data, transferdata, function (err, result) {
                            var rec = { "success": true, "redirect": "regular" };
                            res.end(JSON.stringify(rec));
                        });
                    });
                });

            } else if (postdata.transfer_type == "cash pickup") {

                var transferdata = {
                    "sid": postdata.sendid,
                    "cust_id": postdata.custid,
                    "transaction_number": random_digit_code(8),
                    "referenceno": (postdata.referenceno) ? postdata.referenceno : "",
                    "payment_screenshot": (postdata.payment_img_photo) ? postdata.payment_img_photo : "",
                    "eos_address": (postdata.eosaddress) ? postdata.eosaddress : "",
                    "zipco_amount": (postdata.zipcoamount) ? postdata.zipcoamount : "",
                    "status": 0,
                    "browser": postdata.browser,
                    "ip_address": postdata.ip,
                    "os": postdata.os,
                };

                var trans_data = 'insert into transaction set ?';
                con.query(trans_data, transferdata, function (err, result) {
                    var rec = { "success": true, "redirect": "regular" };
                    res.end(JSON.stringify(rec));
                });

            }

        }

    });
});

app.get('/getsend_money_data/:sid', function (req, res) {

    var sendid = req.params.sid;

    con.query('select * from sendmony where sid = ?', [sendid], function (err, transfer_data) {
        if (transfer_data == "") {
            var rec = { "success": false, "transfer": transfer_data };
            res.end(JSON.stringify(rec));
        } else {
            var rec = { "success": true, "transfer": transfer_data };
            res.end(JSON.stringify(rec));
        }
    });

});

app.get('/getrecipient_data/:cid', function (req, res) {

    var custid = req.params.cid;

    // "select b.*, bc.country_name from benificiary b left join benificiary_country bc on b.currency = bc.bc_id where b.cust_id = ?"

    con.query('select * from benificiary where cust_id = ?', [custid], function (err, benificiary_data) {
        if (benificiary_data == "") {
            var rec = { "success": false, "benificiary": benificiary_data };
            res.end(JSON.stringify(rec));
        } else {
            var rec = { "success": true, "benificiary": benificiary_data };
            res.end(JSON.stringify(rec));
        }
    });

});

app.get('/recipient_data/:bid', function (req, res) {

    var bid = req.params.bid;

    con.query('select * from benificiary where bid = ?', [bid], function (err, benificiary_data) {
        if (benificiary_data == "") {
            var rec = { "success": false, "benificiaryname": benificiary_data };
            res.end(JSON.stringify(rec));
        } else {
            var rec = { "success": true, "benificiaryname": benificiary_data };
            res.end(JSON.stringify(rec));
        }
    });

});

app.get('/alltransaction/:cid', function (req, res) {

    var custid = req.params.cid;

    var sql = "SELECT t.*, DATE_FORMAT(t.date, '%d %b %Y') as created_date, b.name_business as beificiary_name, s.get_amount, s.get_currency, s.self_account_holder, s.else_account_holder , c.account_id, s.recname, s.payment_type FROM transaction t left join sendmony s on t.sid = s.sid left join benificiary b on s.benificiary_id = b.bid left join customer_master c on c.cust_id = t.cust_id where t.cust_id = '" + custid + "' ORDER BY t.tid DESC";
    con.query(sql, function (err, transaction) {
        var rec = { "success": true, "transaction": transaction };
        res.end(JSON.stringify(rec));
    });
});

app.get('/customer_details/:cid', function (req, res) {

    var custid = req.params.cid;

    var sql = "select cust.*, cn.c_id as country_id, cn.country_name as countryname, cn.currency_code as currency, st.id as state_id, st.state_name, ct.id as city_id, ct.city_name from customer_master cust left join countries cn on cust.country = cn.c_id left join states st on cust.state = st.id left join city ct on cust.city = ct.id where cust.cust_id = '" + custid + "'";
    con.query(sql, function (err, show_details) {
        var rec = { "success": true, "details": show_details };
        res.end(JSON.stringify(rec));
    });
});

app.get('/sendmoney_transaction/:sid', function (req, res) {

    var sendid = req.params.sid;

    var sql = "select s.*, b.*, DATE_FORMAT(t.date, '%d %b %Y') as created_date, t.transaction_number, c.account_id, t.ip_address, t.browser, t.os, t.zipco_amount from sendmony s left join benificiary b on s.benificiary_id = b.bid left join customer_master c on c.cust_id = s.cust_id join transaction t on t.sid = s.sid where s.sid = '" + sendid + "'";
    con.query(sql, function (err, transaction) {
        var rec = { "success": true, "sendmoney_transaction": transaction };
        res.end(JSON.stringify(rec));
    });
});

app.put('/update_mydetails', function (req, res) {

    var postdata = req.body;

    con.query('select * from customer_master where cust_id = ?', [postdata.custid], function (err, getdata) {

        var dire = "../src/assets/profile/pro_" + postdata.custid;
        if (!fs.existsSync(dire)) {
            fs.mkdirSync(dire);
        }

        /*------------------------------------------- UPLOADING ----------------------------------------------*/

        if (postdata.profileval != "") {

            var check_profile_path = '../src/assets/profile/pro_' + postdata.custid + '/' + getdata[0].profile_pic;
            if (fs.existsSync(check_profile_path)) {
                fs.unlink('../src/assets/profile/pro_' + postdata.custid + '/' + getdata[0].profile_pic, (err) => { });
            } else { }

            var bitmap_file_profile = new Buffer(postdata.profileval, 'base64');
            fs.writeFileSync('../src/assets/profile/pro_' + postdata.custid + '/' + postdata.profile_photo, bitmap_file_profile);

            con.query('update customer_master set profile_pic = ? where cust_id = ?', [postdata.profile_photo, postdata.custid], function (err, result) { });
        }

        var data = {
            "first_name": postdata.fname,
            "middle_name": postdata.mname,
            "last_name": postdata.lname,
            "country": postdata.country,
            "state": postdata.state,
            "city": postdata.city,
            "gender": postdata.gander,
            "phonecode": postdata.phonecode,
            "phone": postdata.phone,
            "mobile": postdata.mobile,
            "occupation": postdata.occupation,
            "postcode": postdata.postcode,
            "address": postdata.address
        };

        var cust_up_data = 'update customer_master set ? where cust_id = ' + postdata.custid;
        con.query(cust_up_data, data, function (err, result) {
            var rec = { "success": true, "msg": "Your details successfully updated." };
            res.end(JSON.stringify(rec));
        });

    });


});

app.get('/m_get_transaction', function (req, res) {

    var sql = "select t.*, b.name_business as beificiary_name, b.email as benificiary_email, s.get_amount, s.get_currency, s.self_account_holder, s.else_account_holder, c.first_name as fname, c.middle_name as mname, c.last_name as lname, c.email as custemail, c.account_id as accountid , s.recname, s.recemail, s.payment_type FROM transaction t   join sendmony s on t.sid = s.sid join customer_master c on t.cust_id = c.cust_id left join benificiary b on s.benificiary_id = b.bid ORDER BY t.tid DESC";
    con.query(sql, function (err, m_get_transaction) {
        var rec = { "success": true, "transaction": m_get_transaction };
        res.end(JSON.stringify(rec));
    });
});

app.put('/approve/:tid', function (req, res) {

    var transid = req.params.tid;

    con.query('update transaction set status = 1 where tid = ?', [transid], function (err, transaction) {
        var rec = { "success": true };
        res.end(JSON.stringify(rec));
    });
});

app.put('/reject/:tid', function (req, res) {

    var transid = req.params.tid;

    con.query('update transaction set status = 2 where tid = ?', [transid], function (err, transaction) {
        var rec = { "success": true };
        res.end(JSON.stringify(rec));
    });
});

app.get('/chk_admin_qrcode/:aid', function (req, res) {

    var adminid = req.params.aid;

    con.query('select * from admin where admin_id = ?', [adminid], function (err, chk_image) {

        if (chk_image[0].google_auth_code) {
            var url = speakeasy.otpauthURL({ secret: chk_image[0].google_auth_code, label: 'Zipcoin', encoding: 'base32' });
        }

        var rec = { "address": chk_image[0].google_auth_code, "auth_status": chk_image[0].two_auth, "url": url };
        res.end(JSON.stringify(rec));
    });
});

app.post('/get_admin_auth_config', function (req, res) {

    var postdata = req.body;

    var secret = speakeasy.generateSecret({ length: 10, name: 'Zipcoin' });
    var address = secret.base32;
    var aid = postdata.adminid;

    QRCode.toDataURL(secret.otpauth_url, function (err, image_data) {

        con.query('update admin set google_auth_code = ? where admin_id = ?', [address, aid], function (err, result) { });

        var url = speakeasy.otpauthURL({ secret: address, label: 'Zipcoin', encoding: 'base32' });

        var rec = { "address": address, "qrcode": url };
        res.end(JSON.stringify(rec));
    });
});

app.post('/auth_admin_code_verify', function (req, res) {

    var postdata = req.body;
    var aid = postdata.aid;
    var address = postdata.address;
    var token = postdata.code;

    con.query('select * from admin where admin_id = ?', [aid], function (err, chk_two_auth) {

        var verified = speakeasy.totp.verify({
            secret: address,
            encoding: 'base32',
            token: token
        });

        if (verified == true) {

            if (chk_two_auth[0].two_auth == 1) {
                con.query('update admin set two_auth = 0 where admin_id = ?', [aid], function (err, result) {
                    var rec = { "success": true, "msg": "Disabled successfully" };
                    res.end(JSON.stringify(rec));
                });
            } else {
                con.query('update admin set two_auth = 1 where admin_id = ?', [aid], function (err, result) {
                    var rec = { "success": true, "msg": "Enable successfully" };
                    res.end(JSON.stringify(rec));
                });
            }

        } else {
            var rec = { "success": false, "msg": "Please Enter Valid Code" };
            res.end(JSON.stringify(rec));
        }

    });

});

app.post('/admin_auth_code_verify_from_login', function (req, res) {

    var postdata = req.body;
    var aid = postdata.aid;
    var token = postdata.code;

    con.query('select * from admin where admin_id = ?', [aid], function (err, chk_two_auth) {

        var verified = speakeasy.totp.verify({
            secret: chk_two_auth[0].google_auth_code,
            encoding: 'base32',
            token: token
        });

        if (verified == true) {
            var rec = { "success": true, "msg": "Login successfully" };
            res.end(JSON.stringify(rec));
        } else {
            var rec = { "success": false, "msg": "Please Enter Valid Token" };
            res.end(JSON.stringify(rec));
        }

    });

});

app.post('/m-search-transaction', function (req, res) {

    var postdata = req.body;

    if (postdata.sdate == "" || postdata.edate == "" || postdata.status == "") {
        var rec = { "success": false, "msg": "Please fill all details" };
        res.end(JSON.stringify(rec));
    } else {

        var sql = "select t.*, b.name_business as beificiary_name, b.email as benificiary_email, s.get_amount, s.get_currency, s.self_account_holder, s.else_account_holder, c.first_name as fname, c.middle_name as mname, c.last_name as lname, c.email as custemail, c.account_id as accountid , s.recname, s.recemail, s.payment_type FROM transaction t join sendmony s on t.sid = s.sid join customer_master c on t.cust_id = c.cust_id left join benificiary b on s.benificiary_id = b.bid where t.date BETWEEN '" + postdata.sdate + "' AND '" + postdata.edate + "' and t.status = " + postdata.status + " ORDER BY t.tid DESC";
        con.query(sql, function (err, m_search_transaction) {

            if (m_search_transaction == "") {
                var rec = { "success": false, "records": m_search_transaction, "msg": "Something want to wrong" };
                res.end(JSON.stringify(rec));
            } else {
                var rec = { "success": true, "records": m_search_transaction };
                res.end(JSON.stringify(rec));
            }
        });
    }
});

app.post('/search-transaction', function (req, res) {

    var postdata = req.body;

    if (postdata.sdate == "" || postdata.edate == "" || postdata.status == "") {
        var rec = { "success": false, "msg": "Please fill all details" };
        res.end(JSON.stringify(rec));
    } else {

        var sql = "select t.*, b.name_business as beificiary_name, s.get_amount, s.get_currency, s.self_account_holder, s.else_account_holder, c.first_name as sendername , c.account_id, s.recname, s.payment_type FROM transaction t join sendmony s on t.sid = s.sid join customer_master c on t.cust_id = c.cust_id left join benificiary b on s.benificiary_id = b.bid where t.date BETWEEN '" + postdata.sdate + "' AND '" + postdata.edate + "' and t.status = " + postdata.status + " and t.cust_id = " + postdata.custid + " ORDER BY t.tid DESC";
        con.query(sql, function (err, m_search_transaction) {

            if (m_search_transaction == "") {
                var rec = { "success": false, "records": m_search_transaction, "msg": "Something want to wrong" };
                res.end(JSON.stringify(rec));
            } else {
                var rec = { "success": true, "records": m_search_transaction };
                res.end(JSON.stringify(rec));
            }
        });
    }
});

app.get('/delete_sendmoney/:sid', function (req, res) {

    var send_id = req.params.sid;

    con.query('delete from sendmony where sid = ?', [send_id], function (err, sendmoney) {
        var rec = { "success": true };
        res.end(JSON.stringify(rec));
    });

});

app.get('/get_benificiary_count/:cid', function (req, res) {

    var custid = req.params.cid;

    con.query('select COUNT(*) as count from benificiary where cust_id = ?', [custid], function (err, benificiary_data) {
        var rec = { "success": true, "benificiary_counter": benificiary_data };
        res.end(JSON.stringify(rec));
    });

});

app.get('/get_transaction_count/:cid', function (req, res) {

    var custid = req.params.cid;

    con.query('select COUNT(*) as count from transaction where cust_id = ?', [custid], function (err, transaction_data) {
        var rec = { "success": true, "transaction_counter": transaction_data };
        res.end(JSON.stringify(rec));
    });

});

app.get('/m_get_user_count', function (req, res) {

    var sql = "select COUNT(*) as count from customer_master";
    con.query(sql, function (err, m_get_customer) {
        var rec = { "success": true, "usercount": m_get_customer };
        res.end(JSON.stringify(rec));
    });
});

app.get('/m_get_approve_kyc_count', function (req, res) {

    var sql = "select COUNT(*) as count from ikyc_tbl where verified_status = 1";
    con.query(sql, function (err, m_get_approve_kyc) {
        var rec = { "success": true, "approve_kyc": m_get_approve_kyc };
        res.end(JSON.stringify(rec));
    });
});

app.get('/m_get_reject_kyc_count', function (req, res) {

    var sql = "select COUNT(*) as count from ikyc_tbl where verified_status = 2";
    con.query(sql, function (err, m_get_reject_kyc) {
        var rec = { "success": true, "reject_kyc": m_get_reject_kyc };
        res.end(JSON.stringify(rec));
    });
});

app.get('/m_get_review_kyc_count', function (req, res) {

    var sql = "select COUNT(*) as count from ikyc_tbl where verified_status = 0 and kyc_fill_status = 1";
    con.query(sql, function (err, m_get_review_kyc) {
        var rec = { "success": true, "review_kyc": m_get_review_kyc };
        res.end(JSON.stringify(rec));
    });
});

app.get('/get_recent_transaction/:cid', function (req, res) {

    var custid = req.params.cid;

    var sql = "SELECT t.*, DATE_FORMAT(t.date, '%d %b %Y') as created_date, b.name_business as beificiary_name, s.get_amount, s.get_currency, s.self_account_holder, s.else_account_holder , c.account_id, s.recname FROM transaction t left join sendmony s on t.sid = s.sid left join benificiary b on s.benificiary_id = b.bid left join customer_master c on c.cust_id = t.cust_id where t.cust_id = '" + custid + "' ORDER BY t.tid DESC LIMIT 5";
    con.query(sql, function (err, transaction) {
        var rec = { "success": true, "recent_transaction": transaction };
        res.end(JSON.stringify(rec));
    });
});

app.get('/get_refer_customer/:cid', function (req, res) {

    var custid = req.params.cid;

    con.query('select * from customer_master where cust_id = ?', [custid], function (err, refercode) {
        var rec = { "success": true, "refercode": refercode };
        res.end(JSON.stringify(rec));
    });

});

app.get('/get_refer_customer_history/:cid', function (req, res) {

    var referralcode = req.params.cid;

    con.query('select cust.*, cr.country_name from customer_master cust left join countries cr on cust.country = cr.c_id where cust.referralcodefrom = ? order by cust.cust_id', [referralcode], function (err, refercode_history) {
        var rec = { "success": true, "refercode_history": refercode_history };
        res.end(JSON.stringify(rec));
    });

});

app.get('/make_as_agent/:cid', function (req, res) {

    var cust_id = req.params.cid;

    con.query('select * from customer_master where cust_id = ?', [cust_id], function (err, getdata) {

        if (getdata == "") {
            var rec = { "success": false, "msg": "Something Want to Wrong" };
            res.end(JSON.stringify(rec));
        } else {

            con.query('update customer_master set role = 1 where cust_id = ?', [cust_id], function (err, result) {
                var rec = { "success": true, "msg": "Make As Agent Successfully" };
                res.end(JSON.stringify(rec));
            });

        }

    });

});

app.get('/get_all_agent', function (req, res) {

    var cust_id = req.params.cid;

    var sql = "select cust.*, cr.country_name, ct.city_name from customer_master cust left join countries cr on cust.country = cr.c_id left join city ct on cust.city = ct.id where cust.role = 1 order by cust.cust_id"

    con.query(sql, function (err, getdata) {
        var rec = { "success": true, "allagent_details": getdata };
        res.end(JSON.stringify(rec));
    });

});

app.post('/update_email', function (req, res) {

    var postdata = req.body;

    con.query('select * from customer_master where email = ?', [postdata.email], function (err, getdata) {

        if (getdata == "") {

            con.query('update customer_master set email = ? where cust_id = ?', [postdata.email, postdata.cid], function (err, result) {
                var rec = { "success": true, "msg": "Email Update Successfully", "email": postdata.email };
                res.end(JSON.stringify(rec));
            });

        } else {

            var rec = { "success": false, "msg": "Email is All Ready Exist" };
            res.end(JSON.stringify(rec));

        }

    });

});

app.post('/update_phone', function (req, res) {

    var postdata = req.body;

    con.query('update customer_master set phonecode = ?, phone = ? where cust_id = ?', [postdata.phonecode, postdata.phoneno, postdata.cid], function (err, result) {
        var rec = { "success": true, "msg": "Phone Number Update Successfully", "phoneno": postdata.phoneno, "phonecode": postdata.phonecode };
        res.end(JSON.stringify(rec));
    });

});

app.get('/agent_data/:aid', function (req, res) {

    var aid = req.params.aid;

    con.query('select * from customer_master where cust_id = ?', [aid], function (err, agent_data) {
        if (agent_data == "") {
            var rec = { "success": false, "agentname": agent_data };
            res.end(JSON.stringify(rec));
        } else {
            var rec = { "success": true, "agentname": agent_data };
            res.end(JSON.stringify(rec));
        }
    });

});

app.put('/up_password', function (req, res) {
    var postdata = req.body;

    con.query('select * from customer_master where cust_id = ?', [postdata.custid], function (err, getdata) {

        let data = getdata[0].password;
        let buff = new Buffer(data, 'base64');
        let pass = buff.toString('ascii');

        if (postdata.oldpass == pass) {

            let buff = new Buffer(postdata.newpass);
            let base64pass = buff.toString('base64');

            var cust_up_data = 'update customer_master set password = ? where cust_id = ?'
            con.query(cust_up_data, [base64pass, postdata.custid], function (err, result) {
                var rec = { "success": true, "msg": "Your Password is Updated" };
                res.end(JSON.stringify(rec));
            });

        } else {
            var rec = { "success": false, "msg": "Old Password is Wrong" };
            res.end(JSON.stringify(rec));
        }



    });
});

app.post('/searchdata', function (req, res) {

    var postdata = req.body;

    var sqldata = "";

    if (postdata.start_date != "") {
        sqldata += "(DATE(c.register_date) >= '" + postdata.start_date + "' and ";
    }

    if (postdata.end_date != "") {
        sqldata += "DATE(c.register_date) <= '" + postdata.end_date + "' ) or ";
    }

    if (postdata.country != "") {
        sqldata += "c.country = " + postdata.country + " or ";
    }

    if (postdata.ipaddress != "") {
        sqldata += "c.ip_address like '%" + postdata.ipaddress + "%'" + " or ";
    }

    if (postdata.device != "") {
        sqldata += "c.browser like '%" + postdata.device + "%'" + " or ";
    }

    if (postdata.os != "") {
        sqldata += "c.os like '%" + postdata.os + "%'" + " or ";
    }

    if (postdata.accountid != "") {
        sqldata += "c.account_id like '%" + postdata.accountid + "%'" + " or ";
    }

    var lastIndex = sqldata.lastIndexOf("or");
    sqldata = sqldata.substring(0, lastIndex);



    if (sqldata == "") {
        var rec = { "success": false, "msg": "No Result Found", "rec": "no" };
        res.end(JSON.stringify(rec));
    } else {

        var sql = "select c.*, kyc.verified_status as kycstatus, con.country_name from customer_master c left join ikyc_tbl kyc on c.cust_id = kyc.cust_id left join countries con on c.country = con.c_id where " + sqldata;
        con.query(sql, function (err, search_data) {

            if (search_data == "") {
                var rec = { "success": false, "msg": "No Result Found", "rec": "yes", "searchdata": "" };
                res.end(JSON.stringify(rec));
            } else {
                var rec = { "success": true, "rec": "yes", "searchdata": search_data };
                res.end(JSON.stringify(rec));
            }
        });

    }


});

app.get('/blockdata/:cid', function (req, res) {
    var cid = req.params.cid;
    con.query('update customer_master set block = 1 where cust_id = ?', [cid], function (err, m_block) {
        var rec = { "success": true, "msg": "User Is Blocked" };
        res.end(JSON.stringify(rec));
    });
});

app.get('/unblockdata/:cid', function (req, res) {
    var cid = req.params.cid;
    con.query('update customer_master set block = 0 where cust_id = ?', [cid], function (err, m_block) {
        var rec = { "success": true, "msg": "User Is Unblocked" };
        res.end(JSON.stringify(rec));
    });
});

app.put('/m_edit_user', function (req, res) {

    var postdata = req.body;

    var cust_up_data = 'update customer_master set first_name = ?, middle_name = ?, last_name = ?, phone = ?, country = ? where cust_id = ?'
    con.query(cust_up_data, [postdata.fname, postdata.mname, postdata.lname, postdata.phone, postdata.country, postdata.custid], function (err, result) {
        var rec = { "success": true, "msg": "User Detail is Updated" };
        res.end(JSON.stringify(rec));
    });

});

app.get('/m_delete_user/:cid', function (req, res) {
    var cid = req.params.cid;
    con.query('delete from customer_master where cust_id = ?', [cid], function (err, m_block) {
        var rec = { "success": true, "msg": "User is Deleted" };
        res.end(JSON.stringify(rec));
    });
});

app.get('/allagenttransaction/:cid', function (req, res) {

    var custid = req.params.cid;

    var sql = "SELECT t.*, DATE_FORMAT(t.date, '%d %b %Y') as created_date, c.first_name as sname, s.recname FROM agent_transaction t left join sendmony s on t.sid = s.sid left join customer_master c on c.cust_id = t.cust_id where t.cust_id = '" + custid + "' and ( t.status = 1 or t.status = 2 ) ORDER BY t.atid DESC";
    con.query(sql, function (err, transaction) {
        var rec = { "success": true, "transaction": transaction };
        res.end(JSON.stringify(rec));
    });
});

app.get('/agent_single_transaction/:tid', function (req, res) {

    var tid = req.params.tid;

    var sql = "SELECT t.*, DATE_FORMAT(t.date, '%d %b %Y') as created_date, c.first_name as sname, c.address as saddress, cc.country_name as scountry, c.phone as sphone, c.phonecode as sphonecode, c.email as semail, s.recname, s.recaddress, con.country_name as reccountry, st.state_name as recstate, ct.city_name as reccity, s.recemail, s.recphone, s.get_amount, s.get_currency, s.send_amount, s.send_currency, flag.country_iso FROM agent_transaction t left join sendmony s on t.sid = s.sid left join customer_master c on c.cust_id = t.cust_id left join countries cc on cc.c_id = c.country left join countries con on con.c_id = s.reccountry left join countries flag on flag.currency_code = s.get_currency left join states st on st.id = s.recstate left join city ct on ct.id = s.reccity where t.atid = '" + tid + "' ORDER BY t.atid DESC";
    con.query(sql, function (err, transaction) {
        var rec = { "success": true, "transaction": transaction };
        res.end(JSON.stringify(rec));
    });
});

app.get('/search_agent/:zrmtno', function (req, res) {

    var code = req.params.zrmtno;

    var sql = "SELECT t.*, DATE_FORMAT(t.date, '%d %b %Y') as created_date, c.first_name as sname, c.address as saddress, cc.country_name as scountry, c.phone as sphone, c.phonecode as sphonecode, c.email as semail, s.recname, s.recaddress, con.country_name as reccountry, st.state_name as recstate, ct.city_name as reccity, s.recemail, s.recphone, s.get_amount, s.get_currency, s.send_amount, s.send_currency, flag.country_iso FROM agent_transaction t left join sendmony s on t.sid = s.sid left join customer_master c on c.cust_id = t.cust_id left join countries cc on cc.c_id = c.country left join countries con on con.c_id = s.reccountry left join countries flag on flag.currency_code = s.get_currency left join states st on st.id = s.recstate left join city ct on ct.id = s.reccity where t.zrmt_no like '" + code + "' ORDER BY t.atid DESC";
    con.query(sql, function (err, transaction) {
        var rec = { "success": true, "transaction": transaction };
        res.end(JSON.stringify(rec));
    });
});

app.post('/verify', function (req, res) {

    var postdata = req.body;

    var sql = "select * from customer_master where mobile_otp = ?";
    con.query(sql, [postdata.secretcode], function (err, verifydata) {

        if (verifydata == "") {
            var rec = { "success": false, "msg": "Please Enter Valid Code" };
            res.end(JSON.stringify(rec));
        } else {

            con.query('update agent_transaction set status = 1, cust_id = ? where atid = ?', [postdata.custid, postdata.atid], function (err, m_block) {

                con.query('update transaction set status = 1 where zrmt_no = ?', [postdata.zrmt_no], function (err, m_block) { });

                con.query('update customer_master set mobile_otp = "" where cust_id = ?', [verifydata[0].cust_id], function (err, m_block) {
                    var rec = { "success": true, "msg": "Transaction Successfully" };
                    res.end(JSON.stringify(rec));
                });
            });

        }
    });
});

app.get('/m_login_history', function (req, res) {

    var sql = "select * from adminloginhistory ORDER BY loginhistory_id DESC";

    con.query(sql, function (err, admin) {
        var rec = { "login_history": admin };
        res.end(JSON.stringify(rec));
    });

});

app.get('/login_history', function (req, res) {

    var sql = "select * from customerloginhistory ORDER BY loginhistory_id DESC";

    con.query(sql, function (err, admin) {
        var rec = { "login_history": admin };
        res.end(JSON.stringify(rec));
    });

});

app.put('/up_admin_password', function (req, res) {
    var postdata = req.body;

    con.query('select * from admin where admin_id = ?', [postdata.adminid], function (err, getdata) {

        if (postdata.oldpass == getdata[0].password) {

            var admin_up_data = 'update admin set password = ? where admin_id = ?'
            con.query(admin_up_data, [postdata.newpass, postdata.adminid], function (err, result) {
                var rec = { "success": true, "msg": "Your Password is Updated" };
                res.end(JSON.stringify(rec));
            });

        } else {
            var rec = { "success": false, "msg": "Old Password is Wrong" };
            res.end(JSON.stringify(rec));
        }

    });
});

app.post('/agent_transaction_reject', function (req, res) {

    var postdata = req.body;

    var sql = "select * from customer_master where mobile_otp = ?";
    con.query(sql, [postdata.secretcode], function (err, verifydata) {

        if (verifydata == "") {
            var rec = { "success": false, "msg": "Please Enter Valid Code" };
            res.end(JSON.stringify(rec));
        } else {

            con.query('update agent_transaction set status = 2, cust_id = ? where atid = ?', [postdata.custid, postdata.atid], function (err, m_block) {

                con.query('update transaction set status = 2 where zrmt_no = ?', [postdata.zrmt_no], function (err, m_block) { });

                con.query('update customer_master set mobile_otp = "" where cust_id = ?', [verifydata[0].cust_id], function (err, m_block) {
                    var rec = { "success": true, "msg": "Transaction Successfully" };
                    res.end(JSON.stringify(rec));
                });
            });

        }
    });
});

app.get('/get_lastyear_transaction/:date', function (req, res) {

    var date = req.params.date;

    var sql = "select COUNT(*) as count, SUM(s.send_amount) as total_amount from transaction t left join sendmony s on s.sid = t.sid where YEAR(t.date) = YEAR('" + date + "' - INTERVAL 1 YEAR)";
    con.query(sql, function (err, transaction) {
        var rec = { "success": true, "last_year": transaction };
        res.end(JSON.stringify(rec));
    });
});

app.get('/get_lastmonth_transaction/:date', function (req, res) {

    var date = req.params.date;

    var sql = "select COUNT(*) as count, SUM(s.send_amount) as total_amount from transaction t left join sendmony s on s.sid = t.sid where MONTH(t.date) = MONTH('" + date + "' - INTERVAL 1 MONTH)";
    con.query(sql, function (err, transaction) {
        var rec = { "success": true, "last_month": transaction };
        res.end(JSON.stringify(rec));
    });
});

app.get('/get_currentmonth_transaction/:date', function (req, res) {

    var date = req.params.date;

    var sql = "select COUNT(*) as count, SUM(s.send_amount) as total_amount from transaction t left join sendmony s on s.sid = t.sid where MONTH(t.date) = MONTH('" + date + "')";
    con.query(sql, function (err, transaction) {
        var rec = { "success": true, "current_month": transaction };
        res.end(JSON.stringify(rec));
    });
});

app.post('/graph', function (req, res) {

    var postdata = req.body;

    var data = {
        "week_1": postdata.week1,
        "week_2": postdata.week2,
        "week_3": postdata.week3,
        "week_4": postdata.week4,
        "week_5": postdata.week5,
        "week_6": postdata.week6,
        "week_7": postdata.week7,
        "week_8": postdata.week8,
        "week_9": postdata.week9,
        "week_10": postdata.week10,
        "week_11": postdata.week11,
        "week_12": postdata.week12,
    };

    var chat_data = 'insert into total_transaction_chart set ?';
    con.query(chat_data, data, function (err, result) {

        var rec = { "success": true, "msg": "Transaction is Added" };
        res.end(JSON.stringify(rec));

    });

});

app.get('/m_getgraph_data', function (req, res) {

    var sql = "select * from total_transaction_chart ORDER BY chart_id DESC";

    con.query(sql, function (err, chart) {
        var rec = { "getchart_details": chart };
        res.end(JSON.stringify(rec));
    });

});

app.get('/edit_graph_details/:cid', function (req, res) {

    var chartid = req.params.cid;

    var sql = "select * from total_transaction_chart where chart_id = '" + chartid + "'";
    con.query(sql, function (err, show_details) {
        var rec = { "success": true, "details": show_details };
        res.end(JSON.stringify(rec));
    });
});

app.put('/m_edit_chart', function (req, res) {

    var postdata = req.body;

    var cust_up_data = 'update total_transaction_chart set week_1 = ?, week_2 = ?, week_3 = ?, week_4 = ?, week_5 = ?, week_6 = ?, week_7 = ?, week_8 = ?, week_9 = ?, week_10 = ?, week_11 = ?, week_12 = ? where chart_id = ?'
    con.query(cust_up_data, [postdata.week1, postdata.week2, postdata.week3, postdata.week4, postdata.week5, postdata.week6, postdata.week7, postdata.week8, postdata.week9, postdata.week10, postdata.week11, postdata.week12, postdata.chartid], function (err, result) {
        var rec = { "success": true, "msg": "Chart Detail is Updated" };
        res.end(JSON.stringify(rec));
    });

});

app.post('/update_sendmoney_card_method', function (req, res) {

    var postdata = req.body;

    var cust_up_data = 'update sendmony set visa_mc_fee = ?, amex_fee = ?, total_amount = ?, get_amount = ? where sid = ?'
    con.query(cust_up_data, [postdata.vsmc_fee, postdata.amex_fee, postdata.total_amount, postdata.get_amount, postdata.sendid], function (err, result) {
        var rec = { "success": true, "msg": "Updated Successfully" };
        res.end(JSON.stringify(rec));
    });

});

app.post('/add_eosaddress', function (req, res) {

    var postdata = req.body;

    con.query('select * from eos_address where eosaddress = ?', [postdata.address], function (err, duplicate) {

        if (duplicate == "") {

            var data = {
                "eosaddress": postdata.address,
                "usd_rate": postdata.rateusd,
                "cad_rate": postdata.ratecad,
                "gbp_rate": postdata.rategbp,
                "eur_rate": postdata.rateeur,
                "zar_rate": postdata.ratezar
            };

            var addressdata = 'insert into eos_address set ?';
            con.query(addressdata, data, function (err, result) {
                var rec = { "success": true, "msg": "Add Successfully" };
                res.end(JSON.stringify(rec));
            });

        } else {
            var rec = { "success": false, "msg": "This address is allready exist" };
            res.end(JSON.stringify(rec));
        }

    });

});

app.post('/edit_eosaddress', function (req, res) {

    var postdata = req.body;

    var data = {
        "eosaddress": postdata.address,
        "usd_rate": postdata.rateusd,
        "cad_rate": postdata.ratecad,
        "gbp_rate": postdata.rategbp,
        "eur_rate": postdata.rateeur,
        "zar_rate": postdata.ratezar
    };

    var editressdata = 'update eos_address set ?';
    con.query(editressdata, data, function (err, result) {
        var rec = { "success": true, "msg": "Update Successfully" };
        res.end(JSON.stringify(rec));
    });

});

app.get('/all_eosaddress', function (req, res) {

    con.query('select * from eos_address', function (err, eosaddress) {
        var rec = { "address": eosaddress };
        res.end(JSON.stringify(rec));
    });

});

app.post('/wallet_transaction', function (req, res) {

    var postdata = req.body;

    stripe.charges.create({
        amount: postdata.amount,
        currency: postdata.currency,
        source: postdata.token,
        description: "Charge for Zipcoin Remit"
    }, function (err, charge) {

        var transferdata = {
            "cust_id": postdata.custid,
            "amount": postdata.amount,
            "method": postdata.method
        };

        var wallet_trans_data = 'insert into wallet set ?';
        con.query(wallet_trans_data, transferdata, function (err, result) {
            var rec = { "success": true };
            res.end(JSON.stringify(rec));
        });

    });
});

app.get('/allwalletdata/:cid', function (req, res) {

    var custid = req.params.cid;

    var sql = "select * from wallet where cust_id = '" + custid + "' ORDER BY wid DESC";
    con.query(sql, function (err, transaction) {
        var rec = { "success": true, "transaction": transaction };
        res.end(JSON.stringify(rec));
    });
});

app.get('/total_wallet/:cid', function (req, res) {

    var custid = req.params.cid;

    var sql = "select SUM(amount) as amount from wallet where cust_id = '" + custid + "'";
    con.query(sql, function (err, wallet_amount) {
        var rec = { "success": true, "wallet_amount": wallet_amount };
        res.end(JSON.stringify(rec));
    });
});

app.post('/addpromocode', function (req, res) {

    var postdata = req.body;

    var data = {
        "currency": postdata.currency,
        "promocode_value": postdata.value,
        "pcode": random_digit_code(6)
    };

    var promo_data = 'insert into promocode set ?';
    con.query(promo_data, data, function (err, result) {
        var rec = { "success": true, "msg": "Add Successfully" };
        res.end(JSON.stringify(rec));
    });

});

app.get('/m_get_promocode', function (req, res) {

    var sql = "select * from promocode ORDER BY pid DESC";
    con.query(sql, function (err, m_get_promocode) {
        var rec = { "success": true, "promocode": m_get_promocode };
        res.end(JSON.stringify(rec));
    });
});


















































app.get('/demo', function (req, res) {



});


app.listen(PORT, function () {
    console.log('Your node js server is running on PORT:', PORT);
});