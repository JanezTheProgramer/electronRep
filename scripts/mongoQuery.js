exports.connectToMongo = () => {
  let connectURL = 'mongodb+srv://root:<password>@exobase-u8tdg.mongodb.net/test?retryWrites=true';
  MongoClient.connect(connectURL, (err, db) => {
    if (err) return;
    console.log("Database created!");
    db.close();
  });
}

exports.connectToMongo = () => {
  let connectURL = 'mongodb+srv://root:<password>@exobase-u8tdg.mongodb.net/test?retryWrites=true';
  MongoClient.connect(connectURL, (err, db) => {
    if (err) return;
    db.createCollection('users', {
      capped: "<boolean>",
    });
    db.close();
  });
}
