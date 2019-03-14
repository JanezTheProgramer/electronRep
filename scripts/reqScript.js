window.onerror = function() {
    ipcRenderer.send('request-failed-to-generate-action');
} // global error handling (if error exsists app closes!)

window.$ = window.jQuery = require("jquery");
const { ipcRenderer } = require('electron');
const { reqFunc } = require('../scripts/query');
$(document).ready(() => {

    $("#usernameId").focus();

    const isLengthOk = element => {
        if($(`#${element}`).val().length > 4){
            $(`#${element}`).css({color: 'white'});
        }else{
            $(`#${element}`).css({color: '#ff471a'});
        }
    }

    $(document).on("input", "#usernameId", () => isLengthOk("usernameId"));
    $(document).on("input", "#passwordId", () => isLengthOk("passwordId"));
    $(document).on("input", "#reEnterPasw", () => isLengthOk("reEnterPasw"));

    $("#minimize").click(() => ipcRenderer.send('request-register-minimize'));
    $("#exit").click(() => window.close());

    const CreateAccount = () => {

        if ($("#usernameId").val().toString().length > 4
            && $("#passwordId").val().toString().length > 4
            && $("#reEnterPasw").val().toString().length > 4) {

            if ($("#passwordId").val().toString() == $("#reEnterPasw").val().toString())
                reqFunc($("#usernameId").val(), $("#passwordId").val());

            else
                ipcRenderer.send('request-pasw-dont-match-action');
        }
        else
            ipcRenderer.send('request-req-not-met-action');

        $("#usernameId").val("");
    }
    $("#registerButton").click(() => CreateAccount());
    $("#reEnterPasw").keypress(event => event.keyCode == 13 ? CreateAccount() : null);
});