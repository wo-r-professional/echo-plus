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
    function config(key, value = "") {
        if (localStorage.getItem(key) == undefined)
            localStorage.setItem(key, "");
        if (localStorage.getItem(key) != undefined && value != "")
            localStorage.setItem(key, value)
        if (value == "")
            return localStorage.getItem(key);
    }

    // Checks when elements load, get clicked, so we can easily append and add these
    // to the settings page.
    setInterval(async function () {
        $(this).off("click")
        if (!window.location.href.includes("setting") || $("#proview-settings").length)
            return;

        // Find first card, replace all input ids to our since they tend to be disabled
        // so we will just use the api to handle these
        if ($("app-settings form .outer .grid .mdc-card:first-child()").length) {
            $("app-settings form .grid mat-card:first-child mat-card-content mat-form-field:nth-child(1) input").attr("id", "firstname");
            $("app-settings form .grid mat-card:first-child mat-card-content mat-form-field:nth-child(2) input").attr("id", "lastname");
            $("app-settings form .grid mat-card:first-child mat-card-content mat-form-field:nth-child(3) input").attr("id", "username");
            $("app-settings form .grid mat-card:first-child mat-card-content mat-form-field:nth-child(4) input").attr("id", "email");
        }

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

                    #proview-settings mat-form-field input {
                        caret-color: inherit;
                    }

                    #proview-settings mat-checkbox label {
                        cursor: help;
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

            // Defaults (only runs once). Also since config writes if a thing never existed, it means
            // even if a new version is downloaded it will add it; the only downside is the default setting
            // for it will not carry over.
            if (config("config_firstname") == "") {
                config("config_firstname", JSON.parse(config("session")).user.firstname);
                config("config_lastname", JSON.parse(config("session")).user.lastname);
                config("config_username", JSON.parse(config("session")).user.username);
                config("config_email", JSON.parse(config("session")).user.email);
                config("config_update", true);
                config("config_auto_login", false);
                config("config_custom_styles", false);
                config("config_remove_thumbnails", false);
                config("config_replace_standards", true);
                config("config_quality_features", true);
            }

            // Heavily inefficient but who cares, it still does the thing I want
            $("#firstname").prop("value", config("config_firstname"));
            $("#lastname").prop("value", config("config_lastname"));
            $("#username").prop("value", config("config_username"));
            $("#email").prop("value", config("config_email"));
            $("#custom_pfp").prop("value", config("config_pfp"));
            $("#update_extension").prop("checked", config("config_update"));
            $("#auto_login").prop("checked", config("config_auto_login"));
            $("#custom_styles").prop("checked", config("config_custom_styles"));
            $("#remove_thumbnails").prop("checked", config("config_remove_thumbnails"));
            $("#replace_standards").prop("checked", config("config_replace_standards"));
            $("#quality_features").prop("checked", config("config_quality_features"));
            $("#custom_background").prop("value", config("config_custom_background"));
            $("#hide_courses").prop("value", config("config_hide_courses"));
            
            // Save details by using the save button
            $("app-settings mat-toolbar button:has(.mdc-button__label:contains(Save))").on("click", function (event) {
                event.preventDefault();

                config("config_firstname", $("#firstname").val());
                config("config_lastname", $("#lastname").val());
                config("config_username", $("#username").val());
                config("config_email", $("#email").val());
                config("config_pfp", $("#custom_pfp").val());
                config("config_update", $("#update_extension").prop("checked"));
                config("config_auto_login", $("#auto_login").prop("checked"));
                config("config_custom_styles", $("#custom_styles").prop("checked"));
                config("config_remove_thumbnails", $("#remove_thumbnails").prop("checked"));
                config("config_replace_standards", $("#replace_standards").prop("checked"));
                config("config_quality_features", $("#quality_features").prop("checked"));
                config("config_custom_background", $("#custom_background").val());
                config("config_hide_courses", $("#hide_courses").val());

                $("app-settings mat-toolbar button:has(.mdc-button__label:contains(Save))").off("click");
                $("app-settings mat-toolbar button:has(.mdc-button__label:contains(Save))").trigger("click");
            })
        }
    });
})()