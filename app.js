const express = require("express");
const bParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
//////////////////////////////////////////////////////////////
app.use(express.static("public"));
app.use(bParser.urlencoded({extended:true}));
////////////////////////////////////////////////////
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);
//JSON data/////////////////////////
  const data = {
  members: [{
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName
    }
  }]
}; //"const data" object
 //"data" object packed into string//////////
 const jsonData = JSON.stringify(data);
 console.log(jsonData);
 //List url with list id/////////////ENTER YOUR LIST ID HERE////////
 const url = "https://us1.api.mailchimp.com/3.0/lists/<Your List ID>";
 //Options for https request///////////////////////////////////////
 const options = {
   method: "POST",
   //PROVIDE YOUR MAILCHIMP API KEY HERE
   auth: "Your <username:API-key>"
 };
//making a request to the provided url
//with a callback function(response) wich will
//get us response from mailchimp server
  const request =
  https.request(url, options, function(response){
    //after we've done a request we get back a response
    //and check what "data" mailchimp server sent us
    response.on("data", function(data){
        console.log(response.statusCode);
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }) //response.on
  }); // https.request
/////////////////////////////////////////////////////////////
//parsing the JSON data user provided to the mailchimp server
request.write(jsonData);
request.end();

}); //app.post "/"

app.post("/failure", function(req, res){
res.redirect("/");
}); // app.post "failure"

app.listen(process.env.PORT || 3000, function(){
console.log("server started at port 3000");
});
