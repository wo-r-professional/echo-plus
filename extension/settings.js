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

    // Set default config settings if the `config` key does not exist.
    if (localStorage.getItem("config") == undefined) {
        localStorage.setItem("config", JSON.stringify({
            "version": `${browser.runtime.getManifest().version}`,
            "$schema": {
                "preferences": {
                    "automatically_update_extension": {
                        "$value": true,
                        "description": "Checks if the extension is out of date and offers easy access to download the latest version. If disabled, it will never prompt for an update."
                    },
                    "stylesheet_preferences": {
                        "enable_stylesheets": {
                            "$value": true,
                            "description": "Injects stylesheets into the website to alter the look and feel of Echo. If disabled, the options 'Remove course thumbnails' and 'Custom background' will not function."
                        },
                        "remove_course_thumbnails": {
                            "$value": false,
                            "description": "Hides the course thumbnails displayed on the home page of Echo."
                        },
                        "custom_background": {
                            "$value": "",
                            "description": "Changes the website's background to anything you want."
                        }
                    }
                },
                "settings": {
                    "replace_standards_with_percents": {
                        "$value": true,
                        "description": "Replaces the Standard-Based Grades (SBG) with the conventional Percentage-Based Grades (PBG)."
                    },
                    "automatically_login": {
                        "$value": false,
                        "description": "Prevents you from being logged out by automatically logging you back in (requires your account password)."
                    },
                    "hide_courses": {
                        "$value": [],
                        "description": "Hides courses that you do not want in the course feed."
                    },
                    "quality_of_life_features": {
                        "$value": true,
                        "description": "Fixes minor problems that aren't significant enough to have their own setting option."
                    }
                }
            }
        }));
    }

    // Checks when elements load, get clicked, so we can easily append and add these
    // to the settings page.
    setInterval(async function () {
        $(this).off("click")
        if (!window.location.href.includes("setting") || $("#proview-settings").length)
            return;
        
        let config = JSON.parse(localStorage.getItem("config"));

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
                    <mat-checkbox class="mat-mdc-checkbox mat-accent mat-mdc-checkbox-checked ng-untouched ng-pristine ng-valid">
                        <div class="mdc-form-field">
                            <div class="mdc-checkbox">
                                <div class="mat-mdc-checkbox-touch-target"></div>
                                <input id="proview-pref-1" type="checkbox" class="mdc-checkbox__native-control mdc-checkbox--selected">
                                <div class="mdc-checkbox__ripple"></div>
                                <div class="mdc-checkbox__background">
                                    <svg focusable="false" viewBox="0 0 24 24" class="mdc-checkbox__checkmark">
                                        <path fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" class="mdc-checkbox__checkmark-path"></path>
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                </div>
                                <div class="mat-ripple mat-mdc-checkbox-ripple mat-mdc-focus-indicator"></div>
                            </div>
                            <label title="${config.$schema.preferences.automatically_update_extension.description}" class="mdc-label">Automatically update extension</label>
                        </div>
                    </mat-checkbox>
                    <!---->
                    <mat-checkbox class="mat-mdc-checkbox mat-accent mat-mdc-checkbox-checked ng-untouched ng-pristine ng-valid">
                        <div class="mdc-form-field">
                            <div class="mdc-checkbox">
                                <div class="mat-mdc-checkbox-touch-target"></div>
                                <input id="proview-setting-3" type="checkbox" class="mdc-checkbox__native-control mdc-checkbox--selected">
                                <div class="mdc-checkbox__ripple"></div>
                                <div class="mdc-checkbox__background">
                                    <svg focusable="false" viewBox="0 0 24 24" class="mdc-checkbox__checkmark">
                                        <path fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" class="mdc-checkbox__checkmark-path"></path>
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                </div>
                                <div class="mat-ripple mat-mdc-checkbox-ripple mat-mdc-focus-indicator"></div>
                            </div>
                            <label title="${config.$schema.settings.automatically_login.description}" class="mdc-label">Automatically login</label>
                        </div>
                    </mat-checkbox>
                    <!---->
                    <mat-checkbox class="mat-mdc-checkbox mat-accent mat-mdc-checkbox-checked ng-untouched ng-pristine ng-valid">
                        <div class="mdc-form-field">
                            <div class="mdc-checkbox">
                                <div class="mat-mdc-checkbox-touch-target"></div>
                                <input id="proview-pref-2" type="checkbox" class="mdc-checkbox__native-control mdc-checkbox--selected">
                                <div class="mdc-checkbox__ripple"></div>
                                <div class="mdc-checkbox__background">
                                    <svg focusable="false" viewBox="0 0 24 24" class="mdc-checkbox__checkmark">
                                        <path fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" class="mdc-checkbox__checkmark-path"></path>
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                </div>
                                <div class="mat-ripple mat-mdc-checkbox-ripple mat-mdc-focus-indicator"></div>
                            </div>
                            <label title="${config.$schema.preferences.stylesheet_preferences.enable_stylesheets.description}" class="mdc-label">Enable custom stylesheets</label>
                        </div>
                    </mat-checkbox>
                    <!---->
                    <mat-checkbox class="mat-mdc-checkbox mat-accent mat-mdc-checkbox-checked ng-untouched ng-pristine ng-valid">
                        <div class="mdc-form-field">
                            <div class="mdc-checkbox">
                                <div class="mat-mdc-checkbox-touch-target"></div>
                                <input id="proview-pref-3" type="checkbox" class="mdc-checkbox__native-control mdc-checkbox--selected">
                                <div class="mdc-checkbox__ripple"></div>
                                <div class="mdc-checkbox__background">
                                    <svg focusable="false" viewBox="0 0 24 24" class="mdc-checkbox__checkmark">
                                        <path fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" class="mdc-checkbox__checkmark-path"></path>
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                </div>
                                <div class="mat-ripple mat-mdc-checkbox-ripple mat-mdc-focus-indicator"></div>
                            </div>
                            <label title="${config.$schema.preferences.stylesheet_preferences.remove_course_thumbnails.description}" class="mdc-label">Remove course thumbnails</label>
                        </div>
                    </mat-checkbox>
                    <!---->
                    <mat-checkbox class="mat-mdc-checkbox mat-accent mat-mdc-checkbox-checked ng-untouched ng-pristine ng-valid">
                        <div class="mdc-form-field">
                            <div class="mdc-checkbox">
                                <div class="mat-mdc-checkbox-touch-target"></div>
                                <input id="proview-setting-1" type="checkbox" class="mdc-checkbox__native-control mdc-checkbox--selected">
                                <div class="mdc-checkbox__ripple"></div>
                                <div class="mdc-checkbox__background">
                                    <svg focusable="false" viewBox="0 0 24 24" class="mdc-checkbox__checkmark">
                                        <path fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" class="mdc-checkbox__checkmark-path"></path>
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                </div>
                                <div class="mat-ripple mat-mdc-checkbox-ripple mat-mdc-focus-indicator"></div>
                            </div>
                            <label title="${config.$schema.settings.replace_standards_with_percents.description}" class="mdc-label">Replace standards with percents</label>
                        </div>
                    </mat-checkbox>
                    <!---->
                    <mat-checkbox class="mat-mdc-checkbox mat-accent mat-mdc-checkbox-checked ng-untouched ng-pristine ng-valid">
                        <div class="mdc-form-field">
                            <div class="mdc-checkbox">
                                <div class="mat-mdc-checkbox-touch-target"></div>
                                <input id="proview-setting-4" type="checkbox" class="mdc-checkbox__native-control mdc-checkbox--selected">
                                <div class="mdc-checkbox__ripple"></div>
                                <div class="mdc-checkbox__background">
                                    <svg focusable="false" viewBox="0 0 24 24" class="mdc-checkbox__checkmark">
                                        <path fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" class="mdc-checkbox__checkmark-path"></path>
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                </div>
                                <div class="mat-ripple mat-mdc-checkbox-ripple mat-mdc-focus-indicator"></div>
                            </div>
                            <label title="${config.$schema.settings.quality_of_life_features.description}" class="mdc-label">Quality of life features</label>
                        </div>
                    </mat-checkbox>
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
                                    <input id="proview-pref-4" type="text" autocomplete="on" class="mat-mdc-input-element ng-pristine ng-valid mat-mdc-form-field-input-control mdc-text-field__input cdk-text-field-autofill-monitored ng-touched">
                                </div>
                            </div>
                        </div>
                    </mat-form-field>
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
                                    <input id="proview-setting-2" type="text" autocomplete="on" class="mat-mdc-input-element ng-pristine ng-valid mat-mdc-form-field-input-control mdc-text-field__input cdk-text-field-autofill-monitored ng-touched">
                                </div>
                            </div>
                        </div>
                    </mat-form-field>
                    <!---->
                    <button id="proview-save" color="accent" class="mdc-button mdc-button--raised mat-mdc-raised-button mat-accent mat-mdc-button-base">
                        <span class="mat-mdc-button-persistent-ripple mdc-button__ripple"></span>
                        <span class="mdc-button__label">Save</span>
                        <span class="mat-mdc-focus-indicator"></span>
                        <span class="mat-mdc-button-touch-target"></span>
                        <span class="mat-ripple mat-mdc-button-ripple"></span>
                    </button>
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
                    <style>
                        #proview-settings {
                            display: flex;
                            flex-direction: column;
                        }

                        #proview-settings mat-form-field:has(#proview-pref-4) {
                            padding: 0 0 1rem !important;
                        }

                        #proview-settings mat-form-field:has(#proview-setting-2) {
                            padding: 0 0 1.5rem !important;
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

                        #proview-settings #proview-setting-2 {
                            width: 100%;
                            display: flex;
                            gap: .5rem .5rem;
                            flex-wrap: wrap;
                        }

                        #proview-settings #proview-save {
                            width: 50px;
                        }

                        #proview-settings .detected-courses {
                            padding: 5px 0;
                            display: flex;
                            gap: .5rem .5rem;
                            width: 100%;
                            flex-wrap: wrap;
                        }
                    </style>
                </div>
            `);


            // Is this an efficient way to do this? no. Deal with it.

            // Set what the checkboxes are defaulted to by config.
            $("#proview-pref-1").prop("checked", config.$schema.preferences.automatically_update_extension.$value);
            $("#proview-pref-2").prop("checked", config.$schema.preferences.stylesheet_preferences.enable_stylesheets.$value);
            $("#proview-pref-3").prop("checked", config.$schema.preferences.stylesheet_preferences.remove_course_thumbnails.$value);
            $("#proview-pref-4").prop("value", config.$schema.preferences.stylesheet_preferences.custom_background.$value);
            $("#proview-setting-1").prop("checked", config.$schema.settings.replace_standards_with_percents.$value);
            $("#proview-setting-2").prop("value", config.$schema.settings.hide_courses.$value);
            $("#proview-setting-3").prop("checked", config.$schema.settings.automatically_login.$value);
            $("#proview-setting-4").prop("checked", config.$schema.settings.quality_of_life_features.$value);

            if ($("#proview-pref-2").is(":checked")) {
                $("#proview-pref-3").removeAttr("disabled");
                $("#proview-pref-4").removeAttr("disabled").parent().parent().parent().removeClass("mdc-text-field--disabled");
            } else {
                $("#proview-pref-3").attr("disabled", "");
                $("#proview-pref-4").attr("disabled", "").parent().parent().parent().addClass("mdc-text-field--disabled");
            }

            $("#proview-pref-2").on("click", function () {
                if ($("#proview-pref-2").is(":checked")) {
                    $("#proview-pref-3").removeAttr("disabled");
                    $("#proview-pref-4").removeAttr("disabled").parent().parent().parent().removeClass("mdc-text-field--disabled");
                } else {
                    $("#proview-pref-3").attr("disabled", "");
                    $("#proview-pref-4").attr("disabled", "").parent().parent().parent().addClass("mdc-text-field--disabled");
                }
            });

            $("#proview-settings #proview-save").on("click mousedown", function () {
                if ($("#proview-pref-1").is(":checked")) {
                    config.$schema.preferences.automatically_update_extension.$value = true;
                } else {
                    config.$schema.preferences.automatically_update_extension.$value = false;
                }

                if ($("#proview-pref-2").is(":checked")) {
                    config.$schema.preferences.stylesheet_preferences.enable_stylesheets.$value = true;
                } else {
                    config.$schema.preferences.stylesheet_preferences.enable_stylesheets.$value = false;
                }

                if ($("#proview-pref-3").is(":checked")) {
                    config.$schema.preferences.stylesheet_preferences.remove_course_thumbnails.$value = true;
                } else {
                    config.$schema.preferences.stylesheet_preferences.remove_course_thumbnails.$value = false;
                }

                if ($("#proview-pref-4").val() != "") {
                    config.$schema.preferences.stylesheet_preferences.custom_background.$value = $("#proview-pref-4").val();
                }
                        
                if ($("#proview-setting-1").is(":checked")) {
                    config.$schema.settings.replace_standards_with_percents.$value = true;
                } else {
                    config.$schema.settings.replace_standards_with_percents.$value = false;
                }

                if ($("#proview-setting-2").val() != "") {
                    config.$schema.settings.hide_courses.$value = $("#proview-setting-2").val().split(",").map(item => item.trim());
                } else {
                    config.$schema.settings.hide_courses.$value = [];
                }

                if ($("#proview-setting-3").is(":checked")) {
                    config.$schema.settings.automatically_login.$value = true;
                } else {
                    config.$schema.settings.automatically_login.$value = false;
                }

                if ($("#proview-setting-4").is(":checked")) {
                    config.$schema.settings.quality_of_life_features.$value = true;
                } else {
                    config.$schema.settings.quality_of_life_features.$value = false;
                }
            
                localStorage.setItem("config", JSON.stringify(config));
                window.location.reload();
            })
        }
    });
})()