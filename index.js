//here we have builded the backend of our web applicaton
var express = require("express");
var app = express();

var bodyparser = require("body-parser");
app.use("/",bodyparser.urlencoded({extended:false}));

var todos_db = require("./seed.js");

//serve static assets
app.use("/", express.static(__dirname+"/public"));

app.use("/", function(req, res, next){
    console.log("Request");
    console.log(req.url);
    console.log(req.method);
    next();
});


// What all interactions?
// 1. get all todos
// 2. add a todo
// 3. complete a todo (modifying)
// 4. delete a todo


// HW : RESTful APIs
// Let's you put some structure to your API

// Endpoint - that denotes a noun
// Request Method - action you want to take


// 1. get all todos
// http://localhost:4000/todos/ GET
// GET /todos
// Return a JSON object of all of these todos

app.get("/api/todos", function(req, res){
    res.json(todos_db.todos);
})


// 2. delete a todo (with some id:id)
// http://localhost:4000/todos/:id DELETE
app.delete("/api/todos/:id", function(req, res){
    var del_id = req.params.id;
    var todo = todos_db.todos[del_id];//it is like call by refrence
    //if this todo exixt then delete it
    //if not exist then send appropriate response
    if(!todo){
        res.status(400).json({err : "todo doesn't exist"});
    }
    else{
        //we will not delete this todo, instead we just mark it as deleted
        todo.status = todos_db.statusENUMS.DELETED;
        res.json(todos_db.todos);
    }
});


// 3. add a todo
// http://localhost:4000/todos POST
app.post("/api/todos", function(req, res){
    //expect a title in the body of the request
    //in the X-www-form-urlencoded format
    //in the style
    //todo_title=<the new title>
    //need body-parser
    var todo = req.body.todo_title;
    //if todo is blank not send then raise error
    if(!todo || todo=="" || todo.trim()==""){
        res.status(400).json({error : "todo title can't be blank/empty"});
    }
    else{
        var new_todo = {
            title: req.body.todo_title,
            status : todos_db.statusENUMS.ACTIVE
        };
        todos_db.todos[todos_db.next_todo_id++] = new_todo;
        res.json(todos_db.todos);
    }
});


// 4. complete a todo - that's like modifying
// http://localhost:4000/todos/:id PUT
app.put("/api/todos/:id", function (req,res) {
    var mod_id = req.params.id;
    var todo = todos_db.todos[mod_id];
    if(!todo) {
        res.status(400).json({error: "Can't modify a todo that doesn't exist."})
    }
    else {
        var todo_title = req.body.todo_title;
        if(todo_title && todo_title != "" && todo_title.trim() != "") {
            todo.title = todo_title;
        }
        var todo_status = req.body.todo_status;
        if(todo_status && (todo_status == todos_db.statusENUMS.ACTIVE || todo_status == todos_db.statusENUMS.COMPLETE)) {
            todo.status = todo_status;
        }
        console.log(todo);
        todos_db.todos[mod_id] = todo;
        res.json(todos_db.todos);
    }

});


//homework implementation
//getting active todos
app.get("/api/todos/active", function(req, res){
    var db = {};
    for(var i in todos_db.todos ){
        if(todos_db.todos[i].status === todos_db.statusENUMS.ACTIVE){
            db[i] = todos_db.todos[i];
        }
    }
    res.send(db);
})
//getting deleted todos
app.get("/api/todos/deleted", function(req, res){
    var db = {};
    for(var i in todos_db.todos ){
        if(todos_db.todos[i].status === todos_db.statusENUMS.DELETED){
            db[i] = todos_db.todos[i];
        }
    }
    res.send(db);
})
//getting complete todos
app.get("/api/todos/complete", function(req, res){
    var db = {};
    for(var i in todos_db.todos ){
        if(todos_db.todos[i].status === todos_db.statusENUMS.COMPLETE){
            db[i] = todos_db.todos[i];
        }
    }
    res.send(db);
})


//puting or modifying todos status:
// as active
app.put("/api/todos/active/:id", function (req,res) {
    console.log("HI");
    var mod_id = req.params.id;
    var todo = todos_db.todos[mod_id];
    if(!todo) {
        res.status(400).json({error: "Can't modify a todo that doesn't exist."})
    }
    else {

        todo.status = todos_db.statusENUMS.ACTIVE;

        todos_db.todos[mod_id] = todo;
        res.json(todos_db.todos);
    }

});

app.put("/api/todos/complete/:id", function (req,res) {
    console.log("HI2");
    var mod_id = req.params.id;
    var todo = todos_db.todos[mod_id];
    if(!todo) {
        res.status(400).json({error: "Can't modify a todo that doesn't exist."})
    }
    else {

        todo.status = todos_db.statusENUMS.COMPLETE;

        todos_db.todos[mod_id] = todo;
        res.json(todos_db.todos);
    }

});



app.listen(3000);