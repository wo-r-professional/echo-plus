/**
 * Proview for Echo by Wo-r
 * A simple yet helpful extension that changes many features and adds new ones to make
 * your experience using Echo the best it could possibly be.
 *
 * Copyright (c) 2024. All rights reserved.
 * 
 * License: This code is licensed under the MIT License. The MIT License is a permissive free software license 
 * originating at the Massachusetts Institute of Technology (MIT). It allows users to do anything they want with 
 * the code as long as they provide attribution back to the author and don’t hold the author liable. This encourages 
 * use and reuse in both commercial and open-source software.
 *
 * Repository: https://github.com/wo-r-professional/proview-for-echo/
 * Documentation: https://github.com/wo-r-professional/proview-for-echo/wiki
 * 
 * Dependencies: jQuery (v3.7.1), helper.js
 */
(async function () {
    // Enforces stricter parsing and error handling in JavaScript, preventing common mistakes like using undeclared variables.
    "use strict";

    setInterval(async function () {
        if (!is_page("setting") || !isEmpty($("#proview-settings")))
            return;

        // Change the ids of the inputs that exist in the first card.
        if (!isEmpty($("app-settings form .outer .grid .mdc-card:first-child()"))) {
            await $("app-settings form .grid mat-card:first-child mat-card-content mat-form-field input").removeAttr("disabled");
            await $("app-settings form .grid mat-card:first-child mat-card-content mat-form-field .mdc-text-field--disabled").removeClass("mdc-text-field--disabled");

            await $("app-settings form .grid mat-card:first-child mat-card-content mat-form-field input[formcontrolname=\"firstname\"]").attr("id", "firstname");
            await $("app-settings form .grid mat-card:first-child mat-card-content mat-form-field input[formcontrolname=\"lastname\"]").attr("id", "lastname");
            await $("app-settings form .grid mat-card:first-child mat-card-content mat-form-field input[formcontrolname=\"username\"]").attr("id", "username");
            await $("app-settings form .grid mat-card:first-child mat-card-content mat-form-field input[formcontrolname=\"email\"]").attr("id", "email");

            debug_logger("Changed input ids to our ids", 1);

            // XXX: This is a scary part of the extension, which is why I am warning that I'm not at fault for
            //      someone elses foolish mistakes of using this incorrectly.
            $("#firstname, #lastname, #username, #email").on("keydown input", function () {
                if (isEmpty(config("get", "proview_has_warned_for_self"))) {
                    window.alert("I see you want to edit your account details. I must warn you that changing these details can get you in trouble, depending on what you change them to.\n\nFor example, changing your name to lowercase or altering your email may be okay. However, if you change your username or make your name unrecognizable to others, you may get in trouble.\n\nPlease take these options seriously. I mean it.");
                    config("set", "proview_has_warned_for_self", true);
                }
            })
        }

        // Append custom profile input to the profile card.
        if (!isEmpty($("app-settings form .outer .grid .mdc-card:has(.profile-image)"))) {
            await $("app-settings form .outer .grid .mdc-card:has(.profile-image) mat-card-content").append(`
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
            `);

            debug_logger("Appended profile input to profile card", 1)
        }

        // Append the rest of the settings to the last card.
        if (!isEmpty($("app-settings form .outer .grid .mdc-card:last-child()"))) {
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
                        <a href="https://github.com/wo-r-professional/proview-for-echo" target="_blank" rel="noopener">Extension Project</a>
                        <span>·</span>
                        <a href="https://github.com/wo-r-professional/proview-for-echo/wiki" target="_blank" rel="noopener">Documentation</a>
                        <span>·</span>
                        <a href="https://wo-r-professional.github.io/proview/" target="_blank" rel="noopener">Proview Website</a>
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
            `);

            debug_logger("Appended settings to the last card", 1);
                  
            // Prop the settings, so they match what has been set in config.
            $("#custom_pfp").prop("value", config("get", "proview_custom_profile_picture"));
            $("#auto_login").prop("checked", config("get", "proview_automatic_logins") === "true");
            $("#custom_styles").prop("checked", config("get", "proview_stylesheets") === "true");
            $("#remove_thumbnails").prop("checked", config("get", "proview_remove_thumbnails") === "true");
            $("#replace_standards").prop("checked", config("get", "proview_replace_standards") === "true");
            $("#quality_features").prop("checked", config("get", "proview_quality_features")) === "true";
            $("#custom_background").prop("value", config("get", "proview_custom_background"));
            if (!isEmpty(config("get", "proview_hide_courses")))
                $("#hide_courses").prop("value", JSON.parse(config("get", "proview_hide_courses")).join(", "));

            debug_logger("Propped inputs/checkboxes to current configuration", 1);

            // Once "Save" is clicked, save all changes done to settings.
            $("app-settings mat-toolbar button:last-child").on("mousedown", async function (event) {
                config("set", "proview_allow_extension_updates", $("#update_extension").prop("checked"));
                config("set", "proview_automatic_logins", $("#auto_login").prop("checked"));
                config("set", "proview_stylesheets", $("#custom_styles").prop("checked"));
                config("set", "proview_remove_thumbnails", $("#remove_thumbnails").prop("checked"));
                config("set", "proview_replace_standards", $("#replace_standards").prop("checked"));
                config("set", "proview_quality_features", $("#quality_features").prop("checked"));
                config("set", "proview_custom_background", $("#custom_background").val());
                config("set", "proview_hide_courses", JSON.stringify($("#hide_courses").val().split(",").map(item => item.trim())));

                var self = {
                    "userid": get_details.id,
                    "data": {}
                }

                if (!isEmpty($("#custom_pfp").val())) {
                    if (config("get", "proview_custom_profile_picture") != $("#custom_pfp").val()) {
                        self.data.profilepicture = {"$value": $("#custom_pfp").val()};
                        config("set", "proview_custom_profile_picture", $("#custom_pfp").val());
                    }
                }

                if (!isEmpty($("#firstname")) && !isEmpty($("#lastname")) && !isEmpty($("#username")) && !isEmpty($("#email"))) {
                    // What items are the same and what are different?
                    if (!isEmpty($("#firstname").val()) && get_details.firstname !== $("#firstname").val())
                        self.firstname = $("#firstname").val();
                    if (!isEmpty($("#lastname").val()) && get_details.lastname !== $("#lastname").val())
                        self.lastname = $("#lastname").val();
                    if (!isEmpty($("#username").val()) && get_details.username !== $("#username").val())
                        self.username = $("#username").val();
                    if (!isEmpty($("#email").val()) && get_details.email !== $("#email").val())
                        self.email = $("#email").val();
                }

                if (!isEmpty(self.data) || !isEmpty(self.firstname) || !isEmpty(self.lastname) || !isEmpty(self.username) || !isEmpty(self.email)) {
                    await $.ajax({
                        url: api(`/cmd/updateusers?_token=${get_details.token}`),
                        method: "POST",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({"requests": {
                            "user": [self]
                        }}),
                        success: function () {
                            debug_logger("Applied user settings", 1);
                        }
                    });
                }
                else
                    debug_logger("No changes were found for user settings", 2);

                debug_logger("Applied changes to settings", 1);
                window.location.href = "student/home/courses";
            })
        }
    })
})();