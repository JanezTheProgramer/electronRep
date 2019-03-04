const sqlite3 = require('sqlite3');
const { ipcRenderer } = require('electron');

exports.createDB = () => {
    try {
        let db = new sqlite3.Database('database.db');
        let createQueries = [
            'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, pass TEXT, date_c TEXT)',
            'CREATE TABLE IF NOT EXISTS log_history (id INTEGER PRIMARY KEY AUTOINCREMENT, id_user INTEGER, date_l TEXT)'
        ];
        db.serialize(() => createQueries.forEach(query => db.run(query)));
        db.close();
    } catch (e) {
        ipcRenderer.send('request-failed-to-generate-action');
    }
}
exports.loginFunc = (name, pass) => {
    try {
        let db = new sqlite3.Database('database.db');
        console.log(`SELECT distinct id, count(*) as c FROM users WHERE name = '${name}' AND pass = '${require('./hash').method(pass)}' GROUP BY name HAVING c = 1`);
        db.get((`
            SELECT distinct id, count(*) as c 
            FROM users 
            WHERE name = '${name}' 
                AND pass = '${require('./hash').method(pass)}' 
            GROUP BY name HAVING c = 1`),
            [], (err, row) => {
                if (row && !err) {
                    db.run(`INSERT INTO log_history (id_user, date_l) VALUES ('${row.id}', '${new Date()}')`);
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
        db.get(`SELECT name FROM users WHERE name = '${name}'`, [], (err, row) => {
            if (!row && !err) {
                db.run(`
                    INSERT INTO users (name, pass, date_c)
                    VALUES ('${name}', '${require('./hash').method(pass)}', '${new Date()}')`
                );
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
        db.get((`
            SELECT DISTINCT users.id, users.name, users.date_c, log_history.date_l FROM log_history 
            INNER JOIN users on log_history.id_user = users.id
            ORDER BY log_history.id DESC LIMIT 1`),
            [], (err, row) => {
                user = !err ? row : null;
            });
        db.close();
    } catch (e) {
        ipcRenderer.send('request-failed-to-generate-action');
    }
    return user;
}

exports.setUsername = _user_ => {
    let success = false;
    try {
        let db = new sqlite3.Database('database.db');
        db.serialize(() => {
            db.run(`
                UPDATE users
                SET name='${_user_.name}'
                WHERE id='${_user_.id}';
            `);
        });
        db.close();
        success = true;
    } catch (e) {
        ipcRenderer.send('request-failed-to-generate-action');
    } finally {
        if(success)
            return true;
        else 
            return false;
        
    }
}

exports.resetValues = () => user = null;