var statusENUMS = {
    ACTIVE : "ACTIVE",
    COMPLETE : "COMPLETE",
    DELETED : "DELETED"
}

var todos = {
    1 : {title: "learn Javascript", status:statusENUMS.ACTIVE},
    2 : {title: "Git tutorial", status:statusENUMS.ACTIVE},
    3 : {title: "Interactive Git", status:statusENUMS.ACTIVE},
}

var next_todo_id = 4;
module.exports = {
    statusENUMS: statusENUMS,
    todos: todos,
    next_todo_id : next_todo_id
};

//style="height:100px; overflow-y: scroll;