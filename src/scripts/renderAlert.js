exports.generate = ({ content }) => {
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
                        border: .7vw solid #3a3a3a;
                    }
                    .card {
                        position: absolute;
                        left: 5%;
                        top: 5%;
                        vertical-align: middle;
                        height: 90%;
                        width: 90%;
                        display: inline-block;
                        position: relative;
                        display: flex;
                        color: #3a3a3a;
                        font-family: Open Sans;
                    }
                    p {
                        padding: 0;
                        margin: 5%;
                        font-size: 120%;
                    }
                </style>
                <title>PopUp</title>
                <meta charset="UTF-8">
                <script>
                    const { ipcRenderer } = require('electron');
                    const exitPopUp = () => ipcRenderer.send('request-close-action');
                    setInterval(exitPopUp, 2500);
                </script>
            </head>
            <body>
                <div class="card"><p>${content}</p></div>
            </body>
        </html>
    `)
}
