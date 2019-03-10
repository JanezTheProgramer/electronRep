window.$ = window.jQuery = require('jquery');
const electron = require('electron');
const { execFile, spawn } = require('child_process');
const { ipcRenderer } = electron;
const { getUser, resetValues, setUsername } = require('../scripts/query');
const sysInfo = require('systeminformation');
const screenInfo = electron.screen.getAllDisplays();
const weather = require('weather-js');
const path = require('path');
const moment = require('moment');
const fs = require('fs');

let drag = {
    isDown: false,
    iX: null,
    iY: null
}; // object for element dragging properties

$(document).ready(() => {
    $('#clock').text(`${moment().format('LT')}`)
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

    $('.dropbtn').click(() => {
        $('#mainDiv').children().hide();
        $('#platformDiv').fadeIn();
        $('#accInfoDiv').children().remove();
        $('#tutorialDiv').children().remove();
        $('#platformDiv #content').children().remove();
    });
    $('.data').click(e => {
        $('#mainDiv').children().hide();
        $('#platformDiv #content').children().remove();
        $('#accInfoDiv').children().remove();
        $('#tutorialDiv').children().remove();
        switch (Number(e.target.id[0])) {
            case 1:
                $('#accInfoDiv').fadeIn(100);
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

    (() => setInterval(() => $('#clock').text(`${moment().format('LT')}`), 60000))();


    $('body').keydown(e => {
        if ($('input[type=text]').is(':focus') || $('textarea').is(':focus')) return;
        if (e.which == 81) window.close(); //close application on 'q' pressed
        else if (e.which == 82) self.location.assign(location); //restart app on 'r' pressed
    });

    setTimeout(() => $('body').fadeIn(500), 1000);

    // the draggg functions
    $(document).on('mousedown', '.box-window-top-draggable', down => {
        if (drag.isDown === false && down.target.className === 'box-window-top-draggable') {
            drag.isDown = true;
            drag.iX = down.clientX - down.offsetX;
            drag.iY = down.clientY - down.offsetY;
        }
    });

    $(document).on('mousemove', '.box-window-top-draggable', move => {
        if (drag.isDown && move.currentTarget.className === 'box-window-top-draggable') {
            let oX = move.clientX - drag.iX;
            let oY = move.clientY - drag.iY;
            move.currentTarget.parentNode.parentNode.style.top = `${oY + (screen.height * 0.1) / 2}px`;
            move.currentTarget.parentNode.parentNode.style.left = `${oX + (screen.width * 0.025) / 2}px`;
            move.currentTarget.parentNode.parentNode.style.zIndex = '1';
        }
    });

    $(document).on('mouseleave', '.box-window-top-draggable', () => drag.isDown = false);
    $(document).mouseup(() => drag.isDown = false);

    $(document).on('click', '.exit', e => closeTargetWindow(e.currentTarget.parentNode.parentNode.id));

    $(document).on('mousedown', '.box-window', event => {
        $('#content .box-window').css({ zIndex: '0' });
        event.currentTarget.style.zIndex = '1';
    });

    const components = [
        { id: 'games-box-window', file: 'games.html', enabled: false },
        { id: 'calculator-box-window', file: 'calculator.html', enabled: true },
        { id: 'notes-box-window', file: 'notes.html', enabled: true },
        { id: 'music-box-window', file: 'music.html', enabled: false },
        { id: 'video-box-window', file: 'videoPlayer.html', enabled: true},
        { id: 'weather-box-window', file: 'weather.html', enabled: true },
        { id: 'maps-box-window', file: 'maps.html', enabled: true },
        { id: 'photoEditor-box-window', file: 'photoEditor.html', enabled: false },
        { id: 'sysInfo-box-window', file: 'sysInfo.html', enabled: true },
        { id: 'systemControl-box-window', file: 'systemControl.html', enabled: false},
        { id: 'brightness-box-window', file: 'brightness.html', enabled: false }
    ];

    (() => {
        if(navigator.platform.indexOf('Win') > -1){
            components[9].enabled = true;
        }
    })();

    const closeTargetWindow = (targetID, speed) => {
        speed = speed || 700;
        if (document.getElementById(targetID)) {
            $(`#${targetID}`).css({ minHeight: 0 });
            $(`#${targetID}`).animate({
                top: '0',
                height: '0', 
                opacity: '0'
            }, speed);
            setTimeout(() => $(`#${targetID}`).remove(), 800);
        }
    };

    const navRequest = (windowId, keyCode) => {
        if (!components[windowId].enabled) {
            $('#content .box-window').css({ zIndex: '0' });
            if(document.getElementById('notEnabled-box-window'))
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
            $('.box-window').each((key, window) => {
                (window.id !== components[windowId].id) ? closeTargetWindow(window.id, 400) : opened = true;
            });
            if (opened) return;
            setTimeout(() => {
                $.get(`../components/${components[windowId].file}`, data => $('#platformDiv #content').append(data));
            }, 200);
        } else if (keyCode === 2) {
            closeTargetWindow(components[windowId].id);
        }
    };

    $('#leftNav div').mousedown(e => {
        let winId = e.currentTarget.id;
        winId = winId.substr(0, /[a-z]/i.exec(winId.toLowerCase()).index);
        navRequest(Number(winId), e.button)
    });

});