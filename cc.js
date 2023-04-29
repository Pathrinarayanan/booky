var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();
xhr.open("POST", "https://e54a2fde-501e-490d-abe5-053c61fb9f2a-bluemix.cloudant.com/couchdb", true);
xhr.setRequestHeader("Content-Type", "application/json");

var data = {
    "name": "John Doe",
    "age": 35,
    "email": "johndoe@example.com"
  };

  xhr.setRequestHeader("Authorization", "Basic " + btoa("pathrinarayananmdu@gmail.com:Pathri@001"));

  xhr.send(JSON.stringify(data));

console.log("writed");