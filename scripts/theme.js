let brightCSS = (`
    .box-window-top .exit,
    .box-window-top .box-window-toggle-fullScreen,
    .box-window-top h3 {
        color: black;
    }
`);

let darktCSS = (`
    .box-window-top .exit,
    .box-window-top .box-window-toggle-fullScreen,
    .box-window-top h3 {
        color: white;
    }
`);

exports.determineTheme = color => {
    color = Color(color.toString());
    let commonChanges = (`
        .box-window-top {
            background-color: ${color.hex().toString()};
        }
        .box-window {
            background-image: linear-gradient(${color.desaturate(0.6).hex().toString()}, ${color.desaturate(0.9).hex().toString()});
        }
    `);

    return commonChanges.concat(color.lighten(0.3).isDark() ? darktCSS : brightCSS);
}