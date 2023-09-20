
var express = require('express');
const Cloudant = require('@cloudant/cloudant');
const mysql = require('mysql');
const fs  = require('fs');
const path = require('path');
session = require('express-session')
var app = express();
const cloudant = new Cloudant({ url: 'https://e54a2fde-501e-490d-abe5-053c61fb9f2a-bluemix.cloudantnosqldb.appdomain.cloud', plugins: { iamauth: { iamApiKey: 'F4N-Ey5aYVOkPESn9SQA4aJHhJeXJiHLdtrH-ByRxscV' } } });
const dbs = cloudant.db.use('couchdb');
const db = cloudant.db.use('couchdb');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
var encoder = bodyParser.urlencoded();
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file

app.use('/assets',express.static(__dirname + '/public'));

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: "3306",
  password: "VB9159267234",
  database: "crud_db"
});

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(express.static("/app/static-files"));

const staticDirlogin = path.join(__dirname, 'login.html');
app.get('/', (req, res) => {
  try {
    // Read the HTML file asynchronously and send it as a response
    fs.readFile(staticDirlogin, 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.send(data);
      }
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/product_view', function (req, res) {
  // Retrieve all documents from the database
  const cloudant = new Cloudant({ url: 'https://e54a2fde-501e-490d-abe5-053c61fb9f2a-bluemix.cloudantnosqldb.appdomain.cloud', plugins: { iamauth: { iamApiKey: 'F4N-Ey5aYVOkPESn9SQA4aJHhJeXJiHLdtrH-ByRxscV' } } });
  const dbs = cloudant.db.use('couchdb');
  dbs.list({ include_docs: true }, function (err, data) {
    if (err) {
      console.error(err);
    } else {
      // Pass the list of documents to the EJS page as a variable
      console.log(data);
      res.render('product_view.hbs', { results: data.rows});
    }
  });
});
app.get('/product_view_cust', function (req, res) {
  // Retrieve all documents from the database
  const cloudant = new Cloudant({ url: 'https://e54a2fde-501e-490d-abe5-053c61fb9f2a-bluemix.cloudantnosqldb.appdomain.cloud', plugins: { iamauth: { iamApiKey: 'F4N-Ey5aYVOkPESn9SQA4aJHhJeXJiHLdtrH-ByRxscV' } } });
  const dbs = cloudant.db.use('couchdb');
  dbs.list({ include_docs: true }, function (err, data) {
    if (err) {
      console.error(err);
    } else {
      // Pass the list of documents to the EJS page as a variable
      console.log(data);
      res.render('product_view', { results: data });
    }
  });
});



//route for insert data
app.post('/save',(req, res) => {
  

  const cloudant = new Cloudant({ url: 'https://e54a2fde-501e-490d-abe5-053c61fb9f2a-bluemix.cloudantnosqldb.appdomain.cloud', plugins: { iamauth: { iamApiKey: 'F4N-Ey5aYVOkPESn9SQA4aJHhJeXJiHLdtrH-ByRxscV' } } });
  const db = cloudant.db.use('couchdb');

  const newDoc = { product_name: req.body.product_name,
     product_author: req.body.product_author,
      product_price: req.body.product_price };

  db.insert(newDoc, function (err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log('Document inserted:', data);
      res.redirect('/product_view');
    }
  });
});


//route for update data
app.post('/update',(req, res) => {
  // let sql = "UPDATE product1 SET product_name='"+req.body.product_name+"',product_author='"+req.body.product_author +"', product_price='"+req.body.product_price+"' WHERE product_id="+req.body.id;
  // let query = connection.query(sql, (err, results) => {
  //   if(err) throw err;
  //   res.redirect('/product_view');
  // });
  const cloudant = new Cloudant({ url: 'https://e54a2fde-501e-490d-abe5-053c61fb9f2a-bluemix.cloudantnosqldb.appdomain.cloud', plugins: { iamauth: { iamApiKey: 'F4N-Ey5aYVOkPESn9SQA4aJHhJeXJiHLdtrH-ByRxscV' } } });
  const db = cloudant.db.use('couchdb');
console.log(req.body.id);
  db.get('39b67155c5fb4764f81b609f2fa6d831', function (err, data) {
    if (err) {
      console.error(err);
    } else {
 
      db.insert(data, function (err, data) {
        if (err) {
          console.error(err);
        } else {
          console.log('Document updated:', data);
          res.redirect('/product_view');
        }
      });
    }
  });

});

app.post('/update/:id',(req, res) => {
    
 
  db.get(req.params.id, function (err, data) {
    if (err) {
      console.error(err);
    } else {
 
      data.product_author = req.body.product_author;
      data.product_name = req.body.product_name;
      data.product_price = req.body.product_price;
      db.insert(data, function (err, data) {
        if (err) {
          console.error(err);
        } else {
          console.log('Document updated:', data);
          res.redirect('/product_view');
        }
      });
    }
  });

});
app.post('/edit/:id',(req, res) => {  
 
const cloudant = new Cloudant({ url: 'https://e54a2fde-501e-490d-abe5-053c61fb9f2a-bluemix.cloudantnosqldb.appdomain.cloud', plugins: { iamauth: { iamApiKey: 'F4N-Ey5aYVOkPESn9SQA4aJHhJeXJiHLdtrH-ByRxscV' } } });
  const db = cloudant.db.use('couchdb');
console.log(req.body.id);
  db.get(req.params.id, function (err, data) {
    if (err) {
      console.error(err);
    } else {
 console.log(data);
      res.render('editdata', { results: data });
    }
  });

});



//route for delete data
app.post('/delete/:id/:rev',(req, res) => {
  db.get(req.params.id, function (err, data) {
    if (err) {
      console.error(err);
    } else {
      db.destroy(req.params.id, req.params.rev, function(err, body) {
        if (err) {
          console.log(err);
        } else {
          console.log('Deleted document with ID: ' );
          res.redirect('/product_view');
        }
      });

    }
  });
 
});

app.post('/register',encoder,(req, res) => {
  var userName=req.body.username;
  var emailId=req.body.email;
  var password=req.body.password;
  var sql = "INSERT INTO log_data (username,mail,password) VALUES ('"+userName+"', '"+emailId+"', '"+password+"')";
    connection.query(sql, function (err, result) {
        if (err) 
        {
          return console.error('error: ' + err.message);
        }
        res.sendFile(path.join(__dirname+'/login.html'));
        console.log("1 record inserted");
      })
})


app.post('/login', encoder,function(req, res) {
  // Capture the input fields
  var userName=req.body.username;
  var password=req.body.password;
  // Ensure the input fields exists and are not empty
  if (userName && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query('SELECT * FROM log_data WHERE username = ? AND password = ?', [userName, password], function(error, results, fields) {
      // If there is an issue with the query, output the error
      if (error) throw error;
      // If the account exists
      if (results.length > 0) {
        // Authenticate the user
        req.session.loggedIn = true;
        req.session.username = userName;
        // Redirect to home page
        res.redirect('/home2.html');
      } else {
        res.send('Incorrect Username and/or Password!');
      }     
      res.end();
    });
  } else {
    res.send('Please enter Username and Password!');
    res.end();
  }
});

app.post('/adminlogin', encoder, function(req, res){
  var adminName =  req.body.adminname;
  var password = req.body.password;
  if(adminName == "bashar" && password == "sankar"){
    res.redirect('/product_view');
  }
  else{
    res.send('Incorrect Adminname and/or Password');
  }
  res.end();
});

/*
app.post('/search',encoder, function(req, res){
  var book_name =  req.body.book_name;
  console.log(1);
  if (book_name) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query('SELECT * FROM log_data WHERE product_name = ?', [book_name], function(error, results, fields) {
      // If there is an issue with the query, output the error
      console.log(result);
      if (error) throw error;
      // If the account exists
      if (results.length > 0) {
        // Authenticate the user
        req.session.loggedIn = true;
        req.session.username = userName;
        // Redirect to home page
        res.redirect('/product_view_cust');
      } else {
        res.send('Incorrect Username and/or Password!');
      }     
      res.end();
    });
  }
});


/*app.post('/adminpage', encoder, function(req, res){
  var product_name =  req.body.product_name;
  var product_author = req.body.product_author;
  var product_price = req.body.product_price;

  var query = req.body.query;

  if( query == 'insert'){
    var sql = "INSERT INTO product1 (product_name,product_author,product_price) VALUES ('"+product_name+"', '"+product_author+"', '"+product_price+"')";
  }
  else if( query == 'update'){
    var sql = "UPDATE product1 set product_name = '"+product_name+"', product_author = '" + product_author + "', product_price = '" + product_price + "' where product_name = '" + product_name +"'";
  }
  else if(query == 'delete'){
    var sql = "DELETE from product1 WHERE product_name = '" + product_name + "'";
  }
  else{
    res.redirect('/login.html');
  }

  if(query != 'back'){
    connection.query(sql, function (err, result) {
        if (err) 
        {
          return console.error('error: ' + err.message);
        }
        console.log("1 row affected");

      })
    res.redirect('/admin_page.html');
  }
});*/


app.listen(8000,'0.0.0.0', () => {
  console.log('Server is running at port 8000');
});
