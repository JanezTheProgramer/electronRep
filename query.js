const sqlite3 = require('sqlite3');
exports.createDB = () => {
    try {
        let db = new sqlite3.Database('database.db');
        db.serialize(() => {
            db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, pass TEXT, date_c TEXT)");
            db.run("CREATE TABLE IF NOT EXISTS log_history (id INTEGER PRIMARY KEY AUTOINCREMENT, id_user INTEGER, date_l TEXT)");
        });
        db.close();
    } catch (e) {
        ipcRenderer.send('request-failed-to-generate-action');
    }
}
exports.loginFunc = (name, pass) => {
    try {
        let db = new sqlite3.Database('database.db');
        console.log(`SELECT distinct id, count(*) as c FROM users WHERE name = "${name}" AND pass = "${require("./hash").method(pass)}" GROUP BY name HAVING c = 1`);
        db.get(`SELECT distinct id, count(*) as c FROM users WHERE name = "${name}" AND pass = "${require("./hash").method(pass)}" GROUP BY name HAVING c = 1`,
            [], (err, row) => {
                if (row) {
                    db.run(`INSERT INTO log_history (id_user, date_l) VALUES ("${row.id}", "${new Date()}")`);
                    ipcRenderer.send('request-mainprocess-action');
                } else
                    ipcRenderer.send('request-account-not-found');
            });
        db.close();
    } catch (e) {
        ipcRenderer.send('request-failed-to-generate-action');
    }
}
exports.reqFunc = (name, pass) => {
    try {
        let db = new sqlite3.Database('database.db');
        db.get(`SELECT name FROM users WHERE name = "${name}"`, [], (err, row) => {
            if (!row) {
                db.run(`INSERT INTO users (name, pass, date_c)
                    VALUES ("${name}", "${require("./hash").method(pass)}", "${new Date()}")`);
                ipcRenderer.send('request-createdAcc-action');
            } else {
                ipcRenderer.send('request-already-exsists-action');
            }
        });
        db.close();
    } catch (e) {
        ipcRenderer.send('request-failed-to-generate-action');
    }
}
var user;
exports.getUser = () => {
    try {
        let db = new sqlite3.Database('database.db');
        db.get(`
            SELECT DISTINCT users.name as name FROM log_history 
            INNER JOIN users on log_history.id_user = users.id
            ORDER BY log_history.id DESC LIMIT 1`,
             [], (err, row) => {
                user = `${row.name}`;
        });
        db.close();
    } catch (e) {
        ipcRenderer.send('request-failed-to-generate-action');
    }
    return user;
}

exports.resetValues = () => {
    user = null;
}

exports.generateNotes = () => {
    let htmlObject = "";
    for(let i = 0; i < 10; i++){
        htmlObject +=`<div>${i}</div>`;
    }
    console.log(htmlObject);
    return htmlObject;
}

exports.generateStore = () => {
    let htmlObject = "";
    for(let i = 0; i < 10; i++){
        htmlObject +=`<div>${i}</div>`;
    }
    console.log(htmlObject);
    return htmlObject;
}

exports.generateLibrary = () => {
    let htmlObject = "";
    for(let i = 0; i < 10; i++){
        htmlObject +=`<div>${i}</div>`;
    }
    console.log(htmlObject);
    return htmlObject;
}

exports.generateAccInfo = () => {
    let htmlObject = "";
    for(let i = 0; i < 10; i++){
        htmlObject +=`<div>${i}</div>`;
    }
    console.log(htmlObject);
    return htmlObject;
}