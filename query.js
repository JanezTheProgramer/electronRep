const sqlite3 = require('sqlite3');
exports.createDB = function (){
    try{
        let db = new sqlite3.Database('database.db');
        db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, pass TEXT, date_c TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS log_history (id INTEGER PRIMARY KEY AUTOINCREMENT, id_user INTEGER, date_l TEXT)");
        });
        db.close();
    }catch(e){
        console.log(e.toString());
    }
}
function loginFunc(name, pass){
    try{
        let db = new sqlite3.Database('database.db');
        db.get('SELECT distinct id, count(*) as c FROM users WHERE name = "' + name + '" AND pass = "' + pass + '" GROUP BY name HAVING c = 1',
         [], (err, row) =>{
             console.log(row);
            //if(row) ipcRenderer.send('request-mainprocess-action');
        });
        db.close();
    }catch(e){
        alert(e.toString());
    }
}
exports.reqFunc = function (name, pass){
    try{
        let db = new sqlite3.Database('database.db');
        db.get('SELECT name FROM users WHERE name = "' + name + '"', [], (err, row) =>{
            if(!row){
                alert("new acc");
                db.run(`INSERT INTO users (name, pass, date_c)
                VALUES ("`+name+`", "`+pass+`", "`+ new Date().toJSON().slice(0,10).replace(/-/g,'/')+`")`);
            } 
        });
        db.close();
    }catch(e){
        alert(e.toString());
    }
}