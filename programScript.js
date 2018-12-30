var drag = {
    isDown: false,
    iX: null,
    iY: null
}; // object for element dragging properties
const { ipcRenderer } = require('electron'); 
const worldClock = () => {
    let time = new Date();
    const timeFix = x => parseInt(x) < 10 ?  `0${x}` : x;
    $("#clock").text(`${timeFix(time.getHours())}:${timeFix(time.getMinutes())}`);  
    setTimeout(worldClock, 60000);
}
$( document ).ready(() => {
    worldClock();
    $(".roundBtn").click(e => {
        switch(String(e.target.id)){
            case "exit":
                require('./query').resetValues();
                window.close();
                break;
            case "minimize":
                ipcRenderer.send('request-mainwindow-minimize');
                break;
            case "reset":
                require('./query').resetValues();
                getUserData();
                self.location.assign(location);
                break;
            default: 
                ipcRenderer.send('request-failed-to-generate-action');
                break;
        }
    });
    $( ".dropbtn" ).click(() => {
        $(".platformWindow").hide(); 
        $( "#mainDiv" ).children().hide();
        $( "#platformDiv" ).fadeIn();
    });
    $(".data").click(e => {
        $( "#mainDiv" ).children().hide();
        switch(Number(e.target.id[0])){
            case 1:
                $( "#accInfoDiv" ).fadeIn();
                break;
            case 2: 
                $( "#tutorialDiv" ).fadeIn();
                break;
            case 3:
                ipcRenderer.send('request-mainwindow-logOut');
                break;
            default:
                ipcRenderer.send('request-failed-to-generate-action');
                require('./query').resetValues(); 
                break;
        }
    });
    $("input#save").click(() => getUserData());
    $("body").keydown(e => {
        if ($("input[type=text]").is(":focus") || $("textarea").is(":focus")) return; 
        if (e.which == 81) window.close(); //close application on "q" pressed
        else if (e.which == 82) self.location.assign(location); //restart app on "r" pressed
    });

    setTimeout(() => $( "body" ).fadeIn(1500), 1000);

    var userData;
    const getUserData = () => {
        require('./query').resetValues();
        const callBack = () => {
            userData = require('./query').getUser();
            setTimeout(() => {
                if(!userData){
                    callBack();
                    console.log("callback");
                }else{
                    console.log(userData);
                }
            }, 300);
        }
        callBack();    
    }

    // the draggg functions
    $(document).on('mousedown', '.box-window-top-draggable', down => {
        if(drag.isDown === false && down.target.className === "box-window-top-draggable"){
            $('#content .box-window').css({'z-index': "0"});
            down.currentTarget.parentNode.parentNode.style.zIndex = '1';
            drag.isDown = true;
            drag.iX = down.clientX - down.offsetX;
            drag.iY = down.clientY - down.offsetY;
        }
    });

    $(document).on('mousemove', '.box-window-top-draggable', move => {
        if(drag.isDown && move.currentTarget.className === "box-window-top-draggable"){
            let oX = move.clientX - drag.iX;
            let oY = move.clientY - drag.iY;
            move.currentTarget.parentNode.parentNode.style.top = `${oY + (screen.height * 0.1)/2}px`;
            move.currentTarget.parentNode.parentNode.style.left = `${oX + (screen.width * 0.025)/2}px`;
            move.currentTarget.parentNode.parentNode.style.zIndex = '1';
        }
    });

    $(document).on('mouseleave', '.box-window-top-draggable', leave => drag.isDown = false);
    $(document).mouseup(() => drag.isDown = false);
    
    $(document).on('click', '.exit', e => e.currentTarget.parentNode.parentNode.remove());

    $('#leftNav div').click(e => {
        switch(Number(e.currentTarget.id[0])){
            case 0:

                if(!document.getElementById("games-box-window")){
                    $('#content .box-window').css({'z-index': "0"});
                    $.get("./components/games.html", data => $("#platformDiv #content").append(data));
                }
                break;

            case 1:

                if(!document.getElementById("calculator-box-window")){
                    $('#content .box-window').css({'z-index': "0"});
                    $.get("./components/calculator.html", data => $("#platformDiv #content").append(data));
                }
                break;

            case 2:

                if(!document.getElementById("notes-box-window")){
                    $('#content .box-window').css({'z-index': "0"});
                    $.get("./components/notes.html", data => $("#platformDiv #content").append(data));
                }
                break;

            case 3:

                if(!document.getElementById("music-box-window")){
                    $('#content .box-window').css({'z-index': "0"});
                    $.get("./components/music.html", data => $("#platformDiv #content").append(data));
                }
                break;

            case 4:

                if(!document.getElementById("brightness-box-window")){
                    $('#content .box-window').css({'z-index': "0"});
                    $.get("./components/brightness.html", data => $("#platformDiv #content").append(data))
                };
                break;

            case 5:

                if(!document.getElementById("weather-box-window")){
                    $('#content .box-window').css({'z-index': "0"});
                    $.get("./components/weather.html", data => $("#platformDiv #content").append(data));
                }
                break;

            case 6:

                if(!document.getElementById("maps-box-window")){
                    $('#content .box-window').css({'z-index': "0"});
                    $.get("./components/maps.html", data => $("#platformDiv #content").append(data));
                }
                break;

            case 7:

                if(!document.getElementById("photoEditor-box-window")){
                    $('#content .box-window').css({'z-index': "0"});
                    $.get("./components/photoEditor.html", data => $("#platformDiv #content").append(data));
                }
                break;

            default:
                break;
        }
    });
});