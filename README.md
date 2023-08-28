# CurdApp Nodejs

# Node.js Express CRUD Example With MySQL


```yml
Step 1: Create Node js Application for Node js CRUD example

Step 2: Install Prerequisite for node js

Step 3: Create Database, Table, and Connection for node js CRUD example with MySQL

Step 4: Create CRUD Routes

Step 5: Crete View Files for CRUD example in node.js

Step 6: Run the index.js file
```

Node.js is an open-source, cross-platform runtime environment for developing server-side and networking applications. You should have a basic understanding of node js.
<br>
https://nodejs.org/en 

Express.js is one of the most trending web frameworks for node.js. It is built on top of the node.js http module and adds support for routing, middleware, view system, etc.
<br>
https://expressjs.com/

MySQL is an open-source relational database management system that can operate on various platforms. It is easy to manage.
<br>
https://dev.mysql.com/downloads/installer/

## Step 1: Create Node.js Application for node.js crud example

In this step, we will create a node.js application using the below commands.

```cmd
mkdir CurdAppNodejs

cd CurdAppNodejs

npm init
```

## Step 2: Install Embedded JavaScript templates (ejs)

 In this step, we will install ejs using the below command :
```cmd
npm install ejs
```
 
## Step 3: Install express.js in App

Now, install express js using the below command.
```cmd
$ npm install express --save
```
 
## Step 4: Install Dependency

Next, we need to install some dependencies. So, copy the below command and paste it into your terminal
```cmd
# flash message:
npm install express-flash --save

# session like PHP:
npm install express-session --save

# to send PUT and DELETE requests:
npm install method-override --save

# driver to connect Node.js with MySQL:
npm install mysql --save
```

## Step 5: Create Database and Table for node js crud example with mysql

```sql
show databases;

create database cwp;

use cwp;


CREATE TABLE `users` (
  `id` int(50) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `users`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT;
COMMIT;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';

select * from users;
```

After creating the table and database. we are connecting the database and application. In the project directory, make a folder called `lib`. In the lib folder, make a file named `db.js`.

path: `lib/db.js`
```js
var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'node_js_crud'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Database Connected Successfully..!!');
	}
});

module.exports = connection;
```
## Step 6: Make Routes

In this step, we will create the routes folder. In the routes folder, creates a `users.js` file and add the below code.
```js
var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display user page
router.get('/', function(req, res, next) {      
    dbConn.query('SELECT * FROM users ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            res.render('users',{data:''});   
        } else {
            // render to views/users/index.ejs
            res.render('users',{data:rows});
        }
    });
});

// display add user page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('users/add', {
        name: '',
        email: '',
        position:''
    })
})

// add a new user
router.post('/add', function(req, res, next) {    

    let name = req.body.name;
    let email = req.body.email;
    let position = req.body.position;
    let errors = false;

    if(name.length === 0 || email.length === 0 || position === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and email and position");
        // render to add.ejs with flash message
        res.render('users/add', {
            name: name,
            email: email,
            position:position
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            email: email,
            position:position
        }
        
        // insert query
        dbConn.query('INSERT INTO users SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('users/add', {
                    name: form_data.name,
                    email: form_data.email,
                    position:form_data.position
                })
            } else {                
                req.flash('success', 'User successfully added');
                res.redirect('/users');
            }
        })
    }
})

// display edit user page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM users WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('/users')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('users/edit', {
                title: 'Edit User', 
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email,
                position: rows[0].position
            })
        }
    })
})

// update user data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let position = req.body.position;
    let errors = false;

    if(name.length === 0 || email.length === 0 || position.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and email and position");
        // render to add.ejs with flash message
        res.render('users/edit', {
            id: req.params.id,
            name: name,
            email: email,
            position:position
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            name: name,
            email: email,
            position:position
        }
        // update query
        dbConn.query('UPDATE users SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('users/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    email: form_data.email,
                    position: form_data.position
                })
            } else {
                req.flash('success', 'User successfully updated');
                res.redirect('/users');
            }
        })
    }
})
   
// delete user
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM users WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/users')
        } else {
            // set flash message
            req.flash('success', 'User successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/users')
        }
    })
})

module.exports = router;
```
## Step 7: Create View Files for crud xample in `node.js`

Now, We need to create view files for add, edit, and view. We've set EJS for templating. Go to the views folder & create a folder called users. Under the user's folder, make files named `index.ejs`, `add.ejs` and `edit.ejs`.

`users/index.ejs`
```html
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Users</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
</head>
<body class="container" style="margin-top: 50px;">
    <% if (messages.success) { %>
    <div class="alert alert-success" role="alert"><%- messages.success %></div>
    <% } %>

    <% if (messages.error) { %>
    <div class="alert alert-danger" role="alert"><%- messages.error %></div>
    <% } %>

    <div class="card"> 
        <div class="card-header">
            <ul class="nav nav-pills w-100">
                <li class="nav-pill active">
                    <a class="nav-link">Users</a>
                </li>
                <li class="nav-pill ml-auto">
                    <a class="nav-link active" href="/users/add">Add User</a>
                </li>
            </ul>
        </div>
    <div class="card-body">        
        <% if(data.length) { %>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
					<th scope="col">Position</th>
                    <th width="200px">Action</th>
                </tr>
            </thead>
            <tbody>
            <% for(var i = 0; i< data.length; i++) { %>
                <tr>
                    <th scope="row"><%= (i+1) %></th>
                    <td><%= data[i].name%></td>
                    <td><%= data[i].email%></td>
					<td><%= data[i].position%></td>
                    <td>
                        <a class="btn btn-success edit" href="../users/edit/<%=data[i].id%>">Edit</a>
                        <a class="btn btn-danger delete" onclick="return alert('Are you sure want to delete this record?')" href="../users/delete/<%=data[i].id%>">Delete</a> 
                    </td>
                </tr>
            <% } %>
            </tbody>
        </table>
        <% } %>
        
        <!-- if result is empty -->
        <% if(!data.length) { %>
            <p class="text-center">No users found!</p>
        <% } %>
        </div>
    </div>
</body>
</html>
```
`users/add.ejs`
```html
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>Add User</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
</head>
<body class="container" style="margin-top: 50px;">
	<% if (messages.error) { %>
	<div class="alert alert-danger" role="alert"><%- messages.error %></div>
	<% } %>
    <div class="card"> 
    	<div class="card-header">
			Add Users
		</div>
        <div class="card-body">
            <form action="/users/add" method="post">
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" class="form-control" name="name" value="<%= name %>" autocomplete="off">
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="text" class="form-control" name="email" value="<%= email %>" autocomplete="off">
                </div>
				<div class="form-group">
                    <label>Position:</label>
                    <input type="text" class="form-control" name="position" value="<%= position %>" autocomplete="off">
                </div>
                <div class="form-group">
                    <input type="submit" class="btn btn-info" value="Add"/>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
```
`users/edit.ejs`

```html
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>Edit User</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
</head>
<body class="container" style="margin-top: 50px;">
	<% if (messages.error) { %>
	<div class="alert alert-danger" role="alert"><%- messages.error %></div>
	<% } %>
    <div class="card"> 
    	<div class="card-header">
			Edit User
		</div>
        <div class="card-body">
            <form action="/users/update/<%= id %>" method="post">
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" class="form-control" name="name" value="<%= name %>" autocomplete="off">
                </div>
				<div class="form-group">
                    <label>Email:</label>
                    <input type="text" class="form-control" name="email" value="<%= email %>" autocomplete="off">
                </div>
				<div class="form-group">
                    <label>Position:</label>
                    <input type="text" class="form-control" name="position" value="<%= position %>" autocomplete="off">
                </div>
                <div class="form-group">
                    <input type="submit" class="btn btn-info" value="Update"/>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
```
## Step 8: Create `index.js` File

In this step, import all dependencies like `express js`, flash message, MySQL drivers, etc. 

```js
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var flash = require('express-flash');
var session = require('express-session');
var mysql = require('mysql');
var connection  = require('./lib/db');
var usersRouter = require('./routes/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))

app.use(flash());
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(3000);
```
## Step 9: Run the index.js file

Now, run index.js using the below code

```cmd
node index.js
```

In your browser open the below URL.

http://localhost:3000/users

