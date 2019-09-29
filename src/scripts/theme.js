let Color = require('color');

exports.determineTheme = color => {
    color = Color(color.toString());
    return (`
        .box-window-top {
            background-color: ${color.hex().toString()};
            box-shadow: 0 8px 6px -6px black;
        }
        .box-window {
            background-image: linear-gradient(
                ${color.desaturate(0.4).hex().toString()}, 
                ${color.desaturate(0.7).hex().toString()}
            );
        }
        ::-webkit-scrollbar-thumb {
            background: ${color.desaturate(0.8).hex().toString()};
        }

        .box-window-top .exit,
        .box-window-top .box-window-toggle-fullScreen,
        .box-window-top h3 { color: ${color.lighten(0.2).isDark() ? "#f7efef" : "#222"} }
        .box-window-content ul li span {
            color: ${color.lighten(0.2).isDark() ? "#f7efef" : "#222"}
        }
        .box-window-content ul li:nth-child(odd) {
            background: linear-gradient(to right, ${color.desaturate(0.3).hex().toString()}, transparent);
        }

        .box-window-content ul li:hover span {
            text-shadow: 0px .1vw .5vw ${color.lighten(0.2).isDark() ? "#fff" : "#000"};
        }
    `);
}