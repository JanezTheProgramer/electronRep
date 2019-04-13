let Color = require('color');

exports.determineTheme = color => {
    color = Color(color.toString());
    return (`
        .box-window-top {
            background-color: ${color.hex().toString()};
        }
        .box-window {
            background-image: linear-gradient(
                ${color.desaturate(0.6).hex().toString()}, 
                ${color.desaturate(0.9).hex().toString()}
            );
        }
        ::-webkit-scrollbar-thumb {
            background: ${color.desaturate(0.8).hex().toString()};
        }

        .box-window-top .exit,
        .box-window-top .box-window-toggle-fullScreen,
        .box-window-top h3 {
            color: ${color.lighten(0.2).isDark() ? "#f7efef" : "#222"};
        }
        .box-window-content {
            background-color: transparent;
        }
        #music-box-window .box-window-content ul li, 
        #notes-box-window .box-window-content ul li, 
        #weather-box-window .box-window-content ul li, 
        #games-box-window .box-window-content ul li, 
        #sysControl-box-window .box-window-content ul li {
            --c1: ${color.desaturate(0.5).hex().toString()};
            --c2: ${color.desaturate(0.9).hex().toString()};
            color: ${color.lighten(0.2).isDark() ? "#f7efef" : "#222"}
        }
    `);
}