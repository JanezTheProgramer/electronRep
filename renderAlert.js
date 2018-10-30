exports.loadView = ({ title }) => {
  return (`
    <!DOCTYPE html>
    <html>
      <head>
      <style>
        body {
          background: linear-gradient(to bottom right, #4D92A8, #0F9557);
          -webkit-background-size: cover;
          -moz-background-size: cover;
          -o-background-size: cover;
          background-size: cover;
          background-repeat:no-repeat;      
          overflow-x: hidden;
          overflow-y: hidden; 
          border: 3px solid #3a3a3a;          
        }
        .card {
          margin-top: 0px;
          vertical-align: middle;
          height: 80px;
          width: 400px;
          display: inline-block;
          position: relative;
          display: flex;
          padding: 10px;
          color: #3a3a3a;
          font-size: 18px;
          font-family: Open Sans;
        }
        p{
          font-size: 20px;
        }
      </style>
        <title>PopUp</title>
        <meta charset="UTF-8">
        <script>
          const { ipcRenderer } = require('electron');
          let Timer = setInterval(exitPopUp, 2500);
          function exitPopUp(){
            ipcRenderer.send('request-close-action');
          }
        </script>
      </head>
      <body>
        <div class="card" id="view"><p>${title}</p></div>
      </body>
    </html>
  `)
}
