/*window.onerror = function() {
    ipcRenderer.send('request-failed-to-generate-action');
} // global error handling (if error exsists app closes!)*/

window.$ = window.jQuery = require('jquery');
const electron = require('electron');
const { ipcRenderer } = electron;
const {
    getUser,
    resetValues,
    setUserConfiguration,
    getUserConfig
} = require('../scripts/sqliteQuery');
const sysInfo = require('systeminformation');
const screenInfo = electron.screen.getAllDisplays();
const weather = require('weather-js');
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const Shell = require('node-powershell');
const Chart = require('chart.js');
const htmlToImage = require('html-to-image');

window.drag = {
    isDown: false,
    iX: null,
    iY: null
}; // object for element dragging properties

window.components = {
    games: {
        id: 'games-box-window', file: 'games.html', enabled: true,
        tooltip: 'eXo-games', defHeight: '50vh'
    }, calculator: {
        id: 'calculator-box-window', file: 'calculator.html', enabled: true,
        tooltip: 'eXo-calculator', defHeight: '50vh'
    }, notes: {
        id: 'notes-box-window', file: 'notes.html', enabled: true,
        tooltip: 'eXo-notes', defHeight: '50vh'
    }, music: {
        id: 'music-box-window', file: 'music.html', enabled: true,
        tooltip: 'eXo-music', defHeight: '50vh'
    }, video: {
        id: 'video-box-window', file: 'videoPlayer.html', enabled: true,
        tooltip: 'eXo-video', defHeight: '50vh'
    }, weather: {
        id: 'weather-box-window', file: 'weather.html', enabled: true,
        tooltip: 'eXo-weather', defHeight: '50vh'
    }, maps: {
        id: 'maps-box-window', file: 'maps.html', enabled: true,
        tooltip: 'eXo-maps', defHeight: '50vh'
    }, photoEditor: {
        id: 'photoEditor-box-window', file: 'photoEditor.html', enabled: true,
        tooltip: 'eXo-photoEditor', defHeight: '50vh'
    }, sysInfo: {
        id: 'sysInfo-box-window', file: 'sysInfo.html', enabled: true,
        tooltip: 'eXo-sysInfo', defHeight: '50vh'
    }, sysControl: {
        id: 'sysControl-box-window', file: 'sysControl.html', enabled: true,
        tooltip: 'exo-sysControl', defHeight: '35vh'
    }
};

$(document).ready(() => {
    //automated functions 
    setTimeout(() => $('body').fadeIn(500), 1000);
    (() => setInterval(() => $('#clock').text(`${moment().format('LT')}`), 60000))();
    (() => {
        if (!navigator.onLine) 
            for (let key in ['sysControl', 'maps', 'weather'])
                components[key].enabled = false;         

    })();

    $('#clock').text(moment().format('LT'));
    $('.roundBtn').click(element => {
        switch (String(element.target.id)) {
            case 'exit':
                resetValues();
                window.close();
                break;
            case 'minimize':
                ipcRenderer.send('request-mainwindow-minimize');
                break;
            case 'reset':
                self.location.assign(location);
                break;
            default:
                ipcRenderer.send('request-failed-to-generate-action');
                break;
        }
    });

    $('.dropbtn').click(() => generatePlatform());

    $('.data').click(e => {
        $('#mainDiv').children().hide();
        $('#platformDiv #content').children().remove();
        $('#accInfoDiv').children().remove();
        $('#tutorialDiv').children().remove();
        switch (Number(e.target.id[0])) {
            case 1:
                $('#accInfoDiv').fadeIn("fast");
                if (!document.getElementById('account-info-div-content'))
                    $.get('../components/account.html', data => $('#accInfoDiv').append(data));
                break;
            case 2:
                $('#tutorialDiv').fadeIn(100);
                $.get('../components/tutorial.html', data => $('#tutorialDiv').append(data));
                break;
            case 3:
                ipcRenderer.send('request-mainwindow-logOut');
                break;
            default:
                resetValues();
                ipcRenderer.send('request-failed-to-generate-action');
                break;
        }
    });

    $('body').keydown(e => {
        if ($('input[type=text]').is(':focus') || $('textarea').is(':focus')) return;
        if (e.which == 81) window.close(); //close application on 'q' pressed
        else if (e.which == 116) e.preventDefault(); //dont refresh with F5
        else if (e.which == 82) self.location.assign(location); //restart app on 'r' pressed
    });

    // the draggg functions
    $(document).on('mousedown', '.box-window-top-draggable', down => {
        !drag.isDown ? drag.isDown = true : null;
        drag.iX = down.clientX - down.offsetX;
        drag.iY = down.clientY - down.offsetY;
    });

    $(document).on('mousemove', '.box-window-top-draggable', move => {
        if (!drag.isDown) return;
        move.currentTarget.parentNode.parentNode.style.top = `${move.clientY - drag.iY}px`;
        move.currentTarget.parentNode.parentNode.style.left = `${move.clientX - drag.iX}px`;
        move.currentTarget.parentNode.parentNode.style.zIndex = '1';
    });

    $(document).on('mouseleave', '.box-window-top-draggable', () => drag.isDown = false);
    $(document).mouseup(() => drag.isDown = false);

    //end of draggggg functions

    $(document).on('click', '.exit', e => closeTargetWindow(e.currentTarget.parentNode.parentNode.id));

    $(document).on('mousedown', '.box-window', event => {
        $('#content .box-window').css({ zIndex: '0' });
        event.currentTarget.style.zIndex = '1';
    });

    const generatePlatform = () => {
        try {
            let config = getUserConfig();
            $('#leftNav').html("");
            setTimeout(() => {
                if (!config)
                    generatePlatform();
                else {
                    JSON.parse(config.settings).navigationMenu.forEach(obj => {
                        if (obj.enabled) {
                            $('#leftNav').append(`
                                <div id="${obj.name}_nav" custom_title="${components[obj.name].tooltip}">
                                    <img src="../util/icons/${obj.name}.png" alt="/" />
                                </div>
                            `);
                        }
                    });
                }
            }, 300);
        } catch (err) {
            console.log("error");
        } finally {
            $('#mainDiv').children().hide();
            $('#accInfoDiv').children().remove();
            $('#tutorialDiv').children().remove();
            $('#platformDiv #content').children().remove();
            setTimeout(() => $('#platformDiv').fadeIn(200), 300);
            setTimeout(() => {
                if ($('#leftNav').is(':visible')) return;
                $('#leftNav').show();
            }, 2000);
        }
    }

    $(document).on('mousedown', '.box-window-top .box-window-toggle-fullScreen', e => {
        let targetID = e.currentTarget.parentNode.parentNode.id;
        const find = object => {
            for (let component in object)
                if (object[component].id == targetID) return component;
        }
        if (!document.getElementById(targetID)) return;
        //console.log(e.currentTarget.parentNode.parentNode);
        if (['▢', '&#9634;'].includes(e.target.innerHTML)) {
            goFullScreen(targetID);
        } else if (['−', '&minus;'].includes(e.target.innerHTML)) {
            $('#leftNav').animate({
                width: '7vw',
                opacity: '1'
            });
            $(`#${targetID}`).animate({
                top: '8vh',
                left: '15vw',
                width: '50vw',
                height: components[find(components)].defHeight
            }, 800);
            document.getElementById('leftNav').setAttribute('toggle', '1');
            e.target.innerHTML = '&#9634;';
        }
    });

    const goFullScreen = targetID => {
        $(`#${targetID}`).css({
            maxHeight: '100vh',
            maxWidth: '100vw'
        });
        $('#leftNav').animate({
            width: '0',
            opacity: '0'
        });
        document.getElementById('leftNav').setAttribute('toggle', '0');
        $(`#${targetID}`).animate({
            top: '0',
            left: '0',
            width: '100%',
            height: '100%'
        }, 800);
        $(`#${targetID} .box-window-top .box-window-toggle-fullScreen`).html('&minus;');
    }

    const closeTargetWindow = (targetID, speed) => {
        speed = speed || 700;
        if (document.getElementById(targetID)) {
            $('#leftNav').attr('toggle') == '0' ? $('#leftNav').animate({
                width: '7vw',
                opacity: '1'
            }) : null;

            $(`#${targetID}`).css({ minHeight: 0 });
            $(`#${targetID}`).animate({
                top: '-1vh',
                height: '0',
                opacity: '0'
            }, speed);
            setTimeout(() => $(`#${targetID}`).remove(), 800);
        }
    };

    const navRequest = (windowId, keyCode) => {
        //console.log(windowId);
        if (!components[windowId].enabled) {
            $('#content .box-window').css({ zIndex: '0' });
            if (document.getElementById('notEnabled-box-window'))
                $('#notEnabled-box-window').remove();
            $('.box-window').css({ minHeight: 0 });
            $.get(`../components/notEnabled.html`, data => $('#platformDiv #content').append(data));
            return;
        }

        if (keyCode === 0) {
            $('#content .box-window').css({ zIndex: '0' });
            if (!document.getElementById(components[windowId].id)) {
                $.get(`../components/${components[windowId].file}`, data => $('#platformDiv #content').append(data));
            } else {
                $(`#${components[windowId].id}`).css({ zIndex: '1' });
            }
        } else if (keyCode === 1) {
            let opened = false;
            $('.box-window').each((key, window) => window.id !== components[windowId].id ?
                closeTargetWindow(window.id, 400) : opened = true
            );
            if (opened) return;
            setTimeout(() => {
                $.get(`../components/${components[windowId].file}`, data => $('#platformDiv #content').append(data));
            }, 200);
        } else if (keyCode === 2) {
            closeTargetWindow(components[windowId].id);
        }
    };

    $(document).on('mousedown', '#leftNav div', e => {
        let winId = e.currentTarget.id;
        winId = winId.substr(0, winId.indexOf('_'));
        navRequest(String(winId), e.button)
    });

});