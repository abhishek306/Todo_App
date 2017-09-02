
console.log("Is Script File Loading");
const RESPONSE_DONE = 4;
const STATUS_OK = 200;
const TODOS_LIST_ID = "active_todos_list_div";
const NEW_TODO_INPUT_ID = "new_todo_input";
const COMPLETED_TODO_LIST = "completed_todos_list";
const DELETED_TODO_LIST = "deleted_todos_list";
window.onload = getTodosAJAX();

function addTodoElements(id1, id2, id3, todos_data_json){

    var todos = JSON.parse(todos_data_json);
    var parentActive = document.getElementById(id1);
    var parentComplete = document.getElementById(id2);
    var parentDeleted = document.getElementById(id3);

    parentActive.innerHTML = "";
    parentComplete.innerHTML = "";
    parentDeleted.innerText = "";

    if(parentActive || parentComplete || parentDeleted){
        Object.keys(todos).forEach(
            function(key){
                var todo_element = createTodoElement(key, todos[key]);
                console.log(todo_element);
                if(todo_element.status == "ACTIVE") {
                    parentActive.appendChild(todo_element);
                }
                if(todo_element.status == "COMPLETE") {
                    //console.log("inside complete");
                    parentComplete.appendChild(todo_element);
                }
                if(todo_element.status == "DELETED") {
                   // console.log("inside deleted");
                    parentDeleted.appendChild(todo_element);
                }
            }
        )

    }
}

function createTodoElement(id, todo_object){
    var todo_element = document.createElement("div");
   // todo_element.innerText = todo_object.title;
    todo_element.setAttribute("data-id", id);
    // todo_element.setAttribute("class", "todoStatus"+ todo_object.status);
    todo_element.setAttribute("class", "todoStatus"+ todo_object.status + " breathVertical");
    todo_element.status = todo_object.status;
    var label=document.createElement('text');
    label.innerText=todo_object.title;
    if(todo_object.status == "ACTIVE"){
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.value=todo_object.title;
        checkbox.setAttribute("onchange", "completeTodoAJAX("+id+")");
        var delete_button = document.createElement("label");
        delete_button.innerText = 'X';
        delete_button.style.color = "red";
        delete_button.setAttribute("onclick", "deleteTodoAJAX("+id+")");
        delete_button.setAttribute("class", "breathHorizontal");
        delete_button.style.float = "right";
        delete_button.style.marginRight = "20%";
        todo_element.appendChild(checkbox);
        todo_element.appendChild(label);
        todo_element.appendChild(delete_button);
    }

    else if(todo_object.status == "COMPLETE"){
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.checked=true;
        checkbox.value=todo_object.title;
        checkbox.setAttribute("onchange", "activeTodoAJAX("+id+")");
        var delete_button = document.createElement("label");
        delete_button.innerText = "X";
        delete_button.style.color = "red";
        delete_button.style.float = "right";
        delete_button.style.marginRight = "20%";
        delete_button.setAttribute("onclick", "deleteTodoAJAX("+id+")");
        delete_button.setAttribute("class", "breathHorizontal");
        todo_element.appendChild(checkbox);
        todo_element.appendChild(label);
        todo_element.appendChild(delete_button);
    }
   else{
        todo_element.appendChild(label);
    }
    return todo_element;
}

function getTodosAJAX(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/todos", true);
    xhr.onreadystatechange = function(){
        // Write code here that needs to be
        // executed after response
        // Has response been received
        if (xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                addTodoElements(TODOS_LIST_ID, COMPLETED_TODO_LIST, DELETED_TODO_LIST,  xhr.responseText);
            }
        }
    }
    xhr.send(data=null);
}


function addTodoAJAX(){
    var title = document.getElementById(NEW_TODO_INPUT_ID).value;
    var xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/todos", true);//(request, url, asynchronous:true, else:false)
    //the data in this body is in this form
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //hw: look encodeURI, read format of X-W-F-U-E
    var data = "todo_title=" + encodeURI(title);
    xhr.onreadystatechange = function(){
        if (xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK){
                //xhr.responseText
                addTodoElements(TODOS_LIST_ID, COMPLETED_TODO_LIST, DELETED_TODO_LIST, xhr.responseText);
            }
            else{
                console.log(xhr.responseText);
            }
        }
    }

    xhr.send(data);
}

function completeTodoAJAX(id){

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data = "todo_status=COMPLETE";
    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                console.log("its working");
                addTodoElements(TODOS_LIST_ID, COMPLETED_TODO_LIST, DELETED_TODO_LIST, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}

function deleteTodoAJAX(id){

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data = "todo_status=DELETED";
    xhr.onreadystatechange = function(){
        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                //console.log("its working");
                addTodoElements(TODOS_LIST_ID, COMPLETED_TODO_LIST, DELETED_TODO_LIST, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}

function activeTodoAJAX(id){
    console.log("inside this");
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data = "todo_status=ACTIVE";
    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                console.log("its working");
                addTodoElements(TODOS_LIST_ID, COMPLETED_TODO_LIST, DELETED_TODO_LIST, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}

function changeVisibility(source_id) {

    var hidden_div_id = '';
    var src_label = '';
    if (source_id == 'hide_complete') {
        hidden_div_id = COMPLETED_TODO_LIST;
        src_label = 'hide_complete';
    }
    if (source_id == 'hide_delete') {
        hidden_div_id = DELETED_TODO_LIST;
        src_label = 'hide_delete';
    }

    var visibility = document.getElementById(hidden_div_id).style.display;

    if (visibility != 'none') {
        document.getElementById(hidden_div_id).style.display = 'none';
        console.log("none");
        document.getElementById(src_label).innerHTML = 'Show Todos';
    }
    else {
        document.getElementById(hidden_div_id).style.display = 'block';
        console.log("block");
        document.getElementById(src_label).innerHTML = 'Hide Todos';
    }
}