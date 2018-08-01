var express=require("express");
var request = require("request");
var unirest=require("unirest");
var app =express();
var flutterwave = require("flutterwave");
var methodOverride = require("method-override");
var fileParser = require('connect-multiparty')();
var request = require("request");
var bodyParser = require("body-parser");
app.set("port", process.env.PORT || 8000);
app.set("view engine","ejs");
app.set("views","views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
require('dotenv').config({ path: 'variables.env' });
var apiKey = "FLWPUBK-02ad06ed9671c20dc78057a1d72ddb33-X";
var seckey = "FLWSECK-06da147416f0a6788c422ed2acec5016-X";
app.get("/",function (req,res) {
    request("https://ravesandboxapi.flutterwave.com/banks",{json:true}, function (error, response, body) {
        if (error) throw new Error(error);
        // console.log(body);
        // console.log(body.status);
        res.render("form",{
            body:body
        });

    });
});
app.post("/post", function (req, res) {
    var account_bank = req.body.account_bank;
    var account_number = req.body.account_number;
    var narration = req.body.narration;
    var amount = req.body.amount;
     var seckey = "FLWSECK-06da147416f0a6788c422ed2acec5016-X";
    var currency = "NGN";
    var ref = "mk-902837-jk";
    var makeTransfer = {
        account_bank: account_bank,
        account_number: account_number,
        amount: amount,
        seckey: seckey,
        narration: narration,
        currency: currency,
        ref: ref   
    };
    console.log(makeTransfer);
    var options = { method: 'POST',
  url: 'https://ravesandboxapi.flutterwave.com/v2/gpx/transfers/create',
  qs: {seckey:'FLWSECK-06da147416f0a6788c422ed2acec5016-X'},
  headers: { 'content-type': 'application/json' },
  body: makeTransfer,
  json: true };
    
    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
        res.redirect("/receipt");
    });

    
});
app.get("/receipt",function (req,res) {
    var options = {
  qs: {seckey:'FLWSECK-06da147416f0a6788c422ed2acec5016-X'},
  headers: { 'content-type': 'application/json' }
};

request('https://ravesandboxapi.flutterwave.com/v2/gpx/transfers',options, function (error, response, body) {
  if (error) throw new Error(error);
    var parseData=JSON.parse(body);
    // console.log("=========="+body[1]);
//   console.log(parseData["data"]["transfers"]);
    var content = parseData["data"]["transfers"];
  res.render("receipt",{
      content: content
  });

});
});

var server =app.listen(app.get("port"),function () {
    console.log("you are listening to port " + app.get("port"));
});
