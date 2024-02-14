/**
 * This affects all sub domains of "echo-ntn.org", it adds features, and
 * modifications to ECHO.
 * 
 * Thirdparty resources
 *  -  Jquery v3.7.1
 *  -  UI-Jquery v1.12.1
 *  
 * Copright Wo-r 2024
 */
(async function () {
    "use strict";

    // Write the data to a config key, then easily get that key from it
    function config(type = "get", key, value = "") {
        if (type == "get") {
            return localStorage.getItem(key);
        } else {
            if (localStorage.getItem(key) == undefined)
                localStorage.setItem(key, value);

            localStorage.setItem(key, value);
        }
    }

    // Checks when elements load, get clicked, so we can easily append and add these
    // to the settings page.
    setInterval(async function () {
        $(this).off("click")
        if (!window.location.href.includes("setting") || $("#proview-settings").length)
            return;

        if ($("app-settings form .outer .grid .mdc-card:first-child()").length) {
            $("app-settings form .grid mat-card:first-child mat-card-content mat-form-field input[formcontrolname=\"firstname\"]").attr("id", "firstname");
            $("app-settings form .grid mat-card:first-child mat-card-content mat-form-field input[formcontrolname=\"lastname\"]").attr("id", "lastname");
            $("app-settings form .grid mat-card:first-child mat-card-content mat-form-field input[formcontrolname=\"username\"]").attr("id", "username");
            $("app-settings form .grid mat-card:first-child mat-card-content mat-form-field input[formcontrolname=\"email\"]").attr("id", "email");
        }
        
        // Warn before even attempting to type a word
        $("#firstname, #lastname, #username, #email").on("keydown input", function () {
            if (localStorage.getItem("config_has_warned_for_self") == undefined) {
                window.alert("I see you want to edit your account details. I must warn you that changing these details can get you in trouble, depending on what you change them to.\n\nFor example, changing your name to lowercase or altering your email may be okay. However, if you change your username or make your name unrecognizable to others, you may get in trouble.\n\nPlease take these options seriously. I mean it.");
                localStorage.setItem("config_has_warned_for_self", true);
            }
        })

        if ($("app-settings form .outer .grid .mdc-card:has(.profile-image)").length) {
            $("app-settings form .outer .grid .mdc-card:has(.profile-image) mat-card-content").append(`
                <span>Instead of uploading an image, simply link it here and it will use it instead (this allows the use of animated pfps).</span>
                <mat-form-field class="mat-mdc-form-field mat-mdc-form-field-type-mat-input mat-form-field-appearance-outline mat-primary ng-pristine ng-valid ng-star-inserted mat-form-field-hide-placeholder ng-touched">
                    <div class="mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined">
                        <div class="mat-mdc-form-field-flex">
                            <div class="mdc-notched-outline mdc-notched-outline--upgraded ng-star-inserted">
                                <div class="mdc-notched-outline__leading"></div>
                                <div class="mdc-notched-outline__notch" style=""></div>
                                <div class="mdc-notched-outline__trailing"></div>
                            </div>
                            <div class="mat-mdc-form-field-infix">
                                <input id="custom_pfp" type="text" autocomplete="on" class="mat-mdc-input-element ng-pristine ng-valid mat-mdc-form-field-input-control mdc-text-field__input cdk-text-field-autofill-monitored ng-touched">
                            </div>
                        </div>
                    </div>
                </mat-form-field>
                <style>
                    app-settings form .outer .grid .mdc-card:has(.profile-image) .side {
                        padding: 0 0 2rem !important;
                    }

                    app-settings form .outer .grid .mdc-card:has(.profile-image) mat-form-field {
                        width: 100%;
                    }
                </style>
            `)
        }
        
        if ($("app-settings form .outer .grid .mdc-card:last-child()").length) {
            await $("app-settings form .outer .grid .mdc-card:last-child() mat-card-content").append(`
                <div id="proview-settings">
                    <p>
                        <mat-divider class="mat-divider subsection-divider mat-divider-horizontal"></mat-divider>
                    </p>
                    <mat-card-subtitle class="mat-mdc-card-subtitle">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Proview settings</span>
                            <span>v${browser.runtime.getManifest().version}</span>
                        </div>
                    </mat-card-subtitle>
                    <!---->
                    <!---->
                    <mat-checkbox class="mat-mdc-checkbox mat-accent mat-mdc-checkbox-checked ng-untouched ng-pristine ng-valid">
                        <div class="mdc-form-field">
                            <div class="mdc-checkbox">
                                <div class="mat-mdc-checkbox-touch-target"></div>
                                <input id="update_extension" type="checkbox" class="mdc-checkbox__native-control mdc-checkbox--selected">
                                <div class="mdc-checkbox__ripple"></div>
                                <div class="mdc-checkbox__background">
                                    <svg focusable="false" viewBox="0 0 24 24" class="mdc-checkbox__checkmark">
                                        <path fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" class="mdc-checkbox__checkmark-path"></path>
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                </div>
                                <div class="mat-ripple mat-mdc-checkbox-ripple mat-mdc-focus-indicator"></div>
                            </div>
                            <label class="mdc-label">Automatically update extension</label>
                        </div>
                    </mat-checkbox>
                    <!---->
                    <!---->
                    <mat-checkbox class="mat-mdc-checkbox mat-accent mat-mdc-checkbox-checked ng-untouched ng-pristine ng-valid">
                        <div class="mdc-form-field">
                            <div class="mdc-checkbox">
                                <div class="mat-mdc-checkbox-touch-target"></div>
                                <input id="auto_login" type="checkbox" class="mdc-checkbox__native-control mdc-checkbox--selected">
                                <div class="mdc-checkbox__ripple"></div>
                                <div class="mdc-checkbox__background">
                                    <svg focusable="false" viewBox="0 0 24 24" class="mdc-checkbox__checkmark">
                                        <path fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" class="mdc-checkbox__checkmark-path"></path>
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                </div>
                                <div class="mat-ripple mat-mdc-checkbox-ripple mat-mdc-focus-indicator"></div>
                            </div>
                            <label class="mdc-label">Automatically login</label>
                        </div>
                    </mat-checkbox>
                    <!---->
                    <!---->
                    <mat-checkbox class="mat-mdc-checkbox mat-accent mat-mdc-checkbox-checked ng-untouched ng-pristine ng-valid">
                        <div class="mdc-form-field">
                            <div class="mdc-checkbox">
                                <div class="mat-mdc-checkbox-touch-target"></div>
                                <input id="custom_styles" type="checkbox" class="mdc-checkbox__native-control mdc-checkbox--selected">
                                <div class="mdc-checkbox__ripple"></div>
                                <div class="mdc-checkbox__background">
                                    <svg focusable="false" viewBox="0 0 24 24" class="mdc-checkbox__checkmark">
                                        <path fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" class="mdc-checkbox__checkmark-path"></path>
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                </div>
                                <div class="mat-ripple mat-mdc-checkbox-ripple mat-mdc-focus-indicator"></div>
                            </div>
                            <label class="mdc-label">Enable custom stylesheets</label>
                        </div>
                    </mat-checkbox>
                    <!---->
                    <!---->
                    <mat-checkbox class="mat-mdc-checkbox mat-accent mat-mdc-checkbox-checked ng-untouched ng-pristine ng-valid">
                        <div class="mdc-form-field">
                            <div class="mdc-checkbox">
                                <div class="mat-mdc-checkbox-touch-target"></div>
                                <input id="remove_thumbnails" type="checkbox" class="mdc-checkbox__native-control mdc-checkbox--selected">
                                <div class="mdc-checkbox__ripple"></div>
                                <div class="mdc-checkbox__background">
                                    <svg focusable="false" viewBox="0 0 24 24" class="mdc-checkbox__checkmark">
                                        <path fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" class="mdc-checkbox__checkmark-path"></path>
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                </div>
                                <div class="mat-ripple mat-mdc-checkbox-ripple mat-mdc-focus-indicator"></div>
                            </div>
                            <label class="mdc-label">Remove course thumbnails</label>
                        </div>
                    </mat-checkbox>
                    <!---->
                    <!---->
                    <mat-checkbox class="mat-mdc-checkbox mat-accent mat-mdc-checkbox-checked ng-untouched ng-pristine ng-valid">
                        <div class="mdc-form-field">
                            <div class="mdc-checkbox">
                                <div class="mat-mdc-checkbox-touch-target"></div>
                                <input id="replace_standards" type="checkbox" class="mdc-checkbox__native-control mdc-checkbox--selected">
                                <div class="mdc-checkbox__ripple"></div>
                                <div class="mdc-checkbox__background">
                                    <svg focusable="false" viewBox="0 0 24 24" class="mdc-checkbox__checkmark">
                                        <path fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" class="mdc-checkbox__checkmark-path"></path>
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                </div>
                                <div class="mat-ripple mat-mdc-checkbox-ripple mat-mdc-focus-indicator"></div>
                            </div>
                            <label class="mdc-label">Replace standards with percents</label>
                        </div>
                    </mat-checkbox>
                    <!---->
                    <!---->
                    <mat-checkbox class="mat-mdc-checkbox mat-accent mat-mdc-checkbox-checked ng-untouched ng-pristine ng-valid">
                        <div class="mdc-form-field">
                            <div class="mdc-checkbox">
                                <div class="mat-mdc-checkbox-touch-target"></div>
                                <input id="quality_features" type="checkbox" class="mdc-checkbox__native-control mdc-checkbox--selected">
                                <div class="mdc-checkbox__ripple"></div>
                                <div class="mdc-checkbox__background">
                                    <svg focusable="false" viewBox="0 0 24 24" class="mdc-checkbox__checkmark">
                                        <path fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" class="mdc-checkbox__checkmark-path"></path>
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                </div>
                                <div class="mat-ripple mat-mdc-checkbox-ripple mat-mdc-focus-indicator"></div>
                            </div>
                            <label class="mdc-label">Quality of life features</label>
                        </div>
                    </mat-checkbox>
                    <!---->
                    <!---->
                    <span>Changes the website's background (only works if <b>Custom Stylesheets</b> is enabled).</span>
                    <mat-form-field class="mat-mdc-form-field mat-mdc-form-field-type-mat-input mat-form-field-appearance-outline mat-primary ng-pristine ng-valid ng-star-inserted mat-form-field-hide-placeholder ng-touched">
                        <div class="mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined">
                            <div class="mat-mdc-form-field-flex">
                                <div class="mdc-notched-outline mdc-notched-outline--upgraded ng-star-inserted">
                                    <div class="mdc-notched-outline__leading"></div>
                                    <div class="mdc-notched-outline__notch" style=""></div>
                                    <div class="mdc-notched-outline__trailing"></div>
                                </div>
                                <div class="mat-mdc-form-field-infix">
                                    <input id="custom_background" type="text" autocomplete="on" class="mat-mdc-input-element ng-pristine ng-valid mat-mdc-form-field-input-control mdc-text-field__input cdk-text-field-autofill-monitored ng-touched">
                                </div>
                            </div>
                        </div>
                    </mat-form-field>
                    <!---->
                    <!---->
                    <span>Hides specific courses on the main page of Echo (add the course name and separate with a comma).</span>
                    <mat-form-field class="mat-mdc-form-field mat-mdc-form-field-type-mat-input mat-form-field-appearance-outline mat-primary ng-pristine ng-valid ng-star-inserted mat-form-field-hide-placeholder ng-touched">
                        <div class="mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined">
                            <div class="mat-mdc-form-field-flex">
                                <div class="mdc-notched-outline mdc-notched-outline--upgraded ng-star-inserted">
                                    <div class="mdc-notched-outline__leading"></div>
                                    <div class="mdc-notched-outline__notch" style=""></div>
                                    <div class="mdc-notched-outline__trailing"></div>
                                </div>
                                <div class="mat-mdc-form-field-infix">
                                    <input id="hide_courses" type="text" autocomplete="on" class="mat-mdc-input-element ng-pristine ng-valid mat-mdc-form-field-input-control mdc-text-field__input cdk-text-field-autofill-monitored ng-touched">
                                </div>
                            </div>
                        </div>
                    </mat-form-field>
                    <!---->
                    <!---->
                    <p>
                        <mat-divider class="mat-divider subsection-divider mat-divider-horizontal"></mat-divider>
                    </p>
                    <mat-card-subtitle class="mat-mdc-card-subtitle">
                        <span>Links</span>
                    </mat-card-subtitle>
                    <p>
                        <a href="https://github.com/wo-r/proview-for-echo" target="_blank" rel="noopener">Extension Project</a>
                        <span>·</span>
                        <a href="https://github.com/wo-r/proview-for-echo/wiki" target="_blank" rel="noopener">Documentation</a>
                        <span>·</span>
                        <a href="https://wo-r.github.io/proview/" target="_blank" rel="noopener">Proview Website</a>
                        <span>·</span>
                        <a href="https://github.com/wo-r" target="_blank" rel="noopener">Github</a>
                    </p>
                </div>
                <style>
                    #proview-settings {
                        display: flex;
                        flex-direction: column;
                    }

                    #proview-settings mat-form-field:has(#custom_background) {
                        padding: 0 0 1rem !important;
                    }

                    #proview-settings p mat-divider {
                        margin: 20px -16px;
                    }

                    #proview-settings mat-form-field {
                        width: 100%;
                    }

                    #proview-settings span:has(b) {
                        padding: 1rem 0 0 !important;
                    }

                    mat-checkbox label {
                        cursor: default;
                        pointer-events: none;
                    }

                    #proview-settings #custom_background {
                        width: 100%;
                        display: flex;
                        gap: .5rem .5rem;
                        flex-wrap: wrap;
                    }

                    #proview-settings p:last-child() {
                        display: flex;
                        gap: 0 0.5rem;
                        flex-wrap: wrap;
                    }
                </style>
            `)

            // Make that config data readable
            try {
            $("#custom_pfp").prop("value", config("get", "config_pfp"));
            $("#update_extension").prop("checked", config("get", "config_update") === "true");
            $("#auto_login").prop("checked", config("get", "config_auto_login") === "true");
            $("#custom_styles").prop("checked", config("get", "config_custom_styles") === "true");
            $("#remove_thumbnails").prop("checked", config("get", "config_remove_thumbnails") === "true");
            $("#replace_standards").prop("checked", config("get", "config_replace_standards") === "true");
            $("#quality_features").prop("checked", config("get", "config_quality_features")) === "true";
            $("#custom_background").prop("value", config("get", "config_custom_background"));
            $("#hide_courses").prop("value", JSON.parse(config("get", "config_hide_courses")).join(", "));
            } catch (e) {}

            // Save details by using the save button
            $("app-settings mat-toolbar button:last-child").on("mousedown", async function (event) {
                event.preventDefault();

                try {
                config("set", "config_pfp", $("#custom_pfp").val());
                config("set", "config_update", $("#update_extension").prop("checked"));
                config("set", "config_auto_login", $("#auto_login").prop("checked"));
                config("set", "config_custom_styles", $("#custom_styles").prop("checked"));
                config("set", "config_remove_thumbnails", $("#remove_thumbnails").prop("checked"));
                config("set", "config_replace_standards", $("#replace_standards").prop("checked"));
                config("set", "config_quality_features", $("#quality_features").prop("checked"));
                config("set", "config_custom_background", $("#custom_background").val());
                config("set", "config_hide_courses", JSON.stringify($("#hide_courses").val().split(",").map(item => item.trim())));
                } catch(e) {}

                // Change the account details
                // XXX: there is a chance this is gonna get me in trouble, but I'm gonna take the risk.
                if ($("#username").length && $("#firstname").length && $("#lastname").length && $("#email").length) {
                    var userData = {
                        "userid": JSON.parse(localStorage.getItem("session")).user.id,
                        "data": {}
                    };
                
                    // If localstorage and the value inside the input do not match then we should add them
                    if ($("#firstname").val() && JSON.parse(localStorage.getItem("session")).user.firstname !== $("#firstname").val()) 
                        userData.firstname = $("#firstname").val();
                    if ($("#lastname").val() && JSON.parse(localStorage.getItem("session")).user.lastname !== $("#lastname").val()) 
                        userData.lastname = $("#lastname").val();
                    if ($("#username").val() && JSON.parse(localStorage.getItem("session")).user.username !== $("#username").val()) 
                        userData.username = $("#username").val();
                    if ($("#email").val() && JSON.parse(localStorage.getItem("session")).user.email !== $("#email").val()) 
                        userData.email = $("#email").val();

                    // Set pfp to custom one
                    if ($("#custom_pfp").val()) {
                        userData.data.profilepicture = { "$value": $("#custom_pfp").val() };
                        config("set", "config_pfp", $("#custom_pfp").val())
                    }

                    await $.ajax({
                        url: `https://api.agilixbuzz.com/cmd/updateusers?_token=${JSON.parse(localStorage.getItem("session")).token}`,
                        type: "post",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({"requests": {
                            "user": [userData]
                        }})
                    });
                }

                window.location.href = "student/home/courses";
            })
        }
    });
})()