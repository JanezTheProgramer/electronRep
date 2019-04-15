exports.createDB = () => {
    try {
        let db = new sqlite3.Database('database.db');
        let settings = {
            navigationMenu: [
                { name: "games", enabled: true },
                { name: "calculator", enabled: true },
                { name: "notes", enabled: true },
                { name: "music", enabled: true },
                { name: "video", enabled: true },
                { name: "weather", enabled: true },
                { name: "maps", enabled: true },
                { name: "photoEditor", enabled: true }
            ]
        }; //also written in a migration file

        let createQueries = [
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT, 
                pass TEXT, 
                date_c TEXT, 
                ui_theme TEXT,
                settings TEXT DEFAULT '${JSON.stringify(settings)}'
            )`,
            `CREATE TABLE IF NOT EXISTS log_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                id_user INTEGER, 
                date_l TEXT
            )`
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
                    ipcRenderer.send('request-mainprocess-action', row.id);
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

exports.setUserName = name => {
    if (!name) return;
    try {
        let db = new sqlite3.Database('database.db');
        db.serialize(() => db.run(`
            UPDATE users
            SET name='${name}'
            WHERE id='${ipcRenderer ? Number(ipcRenderer.sendSync('user-request')) : null}';
        `));
        db.close();
    } catch (e) {
        ipcRenderer.send('request-failed-to-generate-action');
    }
}

exports.setConfiguration = config => {
    if (!config) return;
    try {
        let db = new sqlite3.Database('database.db');
        db.serialize(() => db.run(`
            UPDATE users
            SET settings='${JSON.stringify(config)}'
            WHERE id='${ipcRenderer ? Number(ipcRenderer.sendSync('user-request')) : null}';
        `));
        db.close();
    } catch (e) {
        ipcRenderer.send('request-failed-to-generate-action');
    }
}

exports.setTheme = theme => {
    theme = (theme != null) ? String(`'${theme}'`) : null;
    try {
        let db = new sqlite3.Database('database.db');
        db.serialize(() => db.run(`
            UPDATE users
            SET ui_theme=${theme}
            WHERE id='${ipcRenderer ? Number(ipcRenderer.sendSync('user-request')) : null}';
        `));
        db.close();
    } catch (e) {
        ipcRenderer.send('request-failed-to-generate-action');
    }
}

exports.user_setEverything = (_user_, _config_, _theme_) => {
    if (!_user_) return;
    try {
        let db = new sqlite3.Database('database.db');
        db.serialize(() => db.run(`
            UPDATE users
            SET name='${_user_}',
                settings='${JSON.stringify(_config_)}'
                ${(_theme_ != null) ? String(`,ui_theme='${_theme_}'`) : ''}
            WHERE id='${ipcRenderer ? Number(ipcRenderer.sendSync('user-request')) : null}';
        `));
        db.close();
    } catch (e) {
        ipcRenderer.send('request-failed-to-generate-action');
    }
}

exports.user_getEverything = new Promise((resolve, reject) => {
    let db = new sqlite3.Database('database.db');
    db.get((`
        SELECT DISTINCT users.*, log_history.date_l 
        FROM log_history 
        INNER JOIN users ON log_history.id_user = users.id
        WHERE users.id = ${ipcRenderer ? Number(ipcRenderer.sendSync('user-request')) : null}
        ORDER BY log_history.id DESC LIMIT 1`),
        [], (err, row) => !err && row ? resolve(row) : reject);
    db.close();
});

exports.getConfiguration = new Promise((resolve, reject) => {
    let db = new sqlite3.Database('database.db');
    db.get((`
            SELECT u.settings 
            FROM log_history AS l
            INNER JOIN users AS u ON l.id_user = u.id
            WHERE u.id = ${ipcRenderer ? Number(ipcRenderer.sendSync('user-request')) : null}
            ORDER BY l.id DESC 
            LIMIT 1`),
        [], (err, row) => !err && row ? resolve(row) : reject);
    db.close();
});

exports.getTheme = new Promise((resolve, reject) => {
    let db = new sqlite3.Database('database.db');
    db.get((`
        SELECT u.ui_theme
        FROM log_history AS l
        INNER JOIN users AS u ON l.id_user = u.id
        WHERE u.id = ${ipcRenderer ? Number(ipcRenderer.sendSync('user-request')) : null}
        ORDER BY l.id DESC 
        LIMIT 1`),
        [], (err, row) => !err && row ? resolve(row) : reject);
    db.close();
});