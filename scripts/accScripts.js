$(document).ready(() => {
    let userData = null, locallyStoredColor = null;
    $('#ui_icons_set').html("");
    async function retriveUserPromise() {
        getUser.then(result => {
            userData = result;
            let date_created = moment(userData.date_c).format('L')
            $("#username").val(String(userData.name));
            $("#member_since").text(date_created);
            $("#last_seen").text(moment(userData.date_l).format('L'));
            $("#age").text(
                `${Math.floor(Math.abs(moment.duration(moment(new Date()).diff(date_created)).asDays()))} days`
            );
            JSON.parse(userData.settings).navigationMenu.forEach(row => $('#ui_icons_set').append(`
                    <div class="xBoxes">
                        <input 
                            type="checkbox" 
                            id="${row.name}"
                            class="ui_filter_checboxes"
                            name="${row.name}"
                            ${row.enabled ? "checked" : null}
                        ><label for="${row.name}">${row.name}</label>
                    </div>
                `));

            setTimeout(() => $('#account-info-div-content').fadeIn(100), 10);
        });
    } (retriveUserPromise)();

    const updateUser = key => {
        if ($("#username").val() != userData.name && $("#username").val().length > 4) {
            userData.name = $("#username").val();
        }
        if (key < 1) {
            if (setUserConfiguration(userData, null)) {
                $("#username").css({ background: "transparent" });
                null;
            }
            return;
        }
        let finalSqlArray = [];
        $('#ui_icons_set .xBoxes input[type=checkbox]').each(function () {
            finalSqlArray.push({
                name: $(this).attr('name'),
                enabled: $(this).is(":checked") ? true : false
            });
            console.log(finalSqlArray);
        });
        setUserConfiguration(userData, { navigationMenu: finalSqlArray });
    }

    $('#username').on('input', () =>
        $("#username").val() != userData.name ?
            $("#username").css({ background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(200,0,0, 0.4))" }) :
            $("#username").css({ background: "transparent" })
    );

    $('#toggleAccCfg').mousedown(() => {
        let toggleValue = !$('#ui_icons_set input[type=checkbox]').first().is(":checked");
        $('#ui_icons_set input[type=checkbox]').each(function () {
            $(this).prop('checked', toggleValue);
        });
    });

    $('#username').keypress(event => event.keyCode == 13 ? updateUser(0) : null);
    $('input#saveUserCfg').click(() => {
        updateUser(1);
        //window.Theme.actualCSS = determineTheme(locallyStoredColor);
        window.Theme.sqlSuccess = false;
        console.log(window.Theme.actualCSS);
        location.reload();
    });
    AColorPicker.from('div.picker').on('change', picker => locallyStoredColor = picker.color);
});