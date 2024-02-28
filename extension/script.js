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
 * Repository: https://github.com/wo-r-professional/proview-for-echo
 * Documentation: https://github.com/wo-r-professional/proview-for-echo/wiki
 * 
 * Dependencies: jQuery (v3.7.1), helper.js, settings.js
 */
(async function () {
    // Enforces stricter parsing and error handling in JavaScript, preventing common mistakes like using undeclared variables.
    "use strict";

    // If the config key "proview_extension_first_use" does not exist,
    // then we show our welcome message, set the key to false, and then set our defaults.
    if (isEmpty(config("get", "proview_extension_first_use"))) {
        let check_session = setInterval(function () {
            if (get_details.token != undefined) {
                clearInterval(check_session);
                config("set", "proview_extension_first_use", true);

                // Get the users existing profile picture.
                imageValid(api(`/cmd/getprofilepicture?_token=${get_details.token}&entityid=${get_details.id}`), function (avatar_exists, url) {
                    if (avatar_exists) {
                        urlRedirects(url, function (newUrl) {
                            config("set", "proview_custom_profile_picture", newUrl);
                            debug_logger(`Set profile picture to ${newUrl}`, 1);
                        })
                    } else {
                        config("set", "proview_custom_profile_picture", "");
                        debug_logger("Could not find a profile picture!", 2);
                    }
                });

                // Set the rest to the default settings.
                config("set", "proview_allow_extension_updates", true);
                config("set", "proview_stay_logged_in", false);
                config("set", "proview_stylesheets", false);
                config("set", "proview_remove_thumbnails", false);
                config("set", "proview_replace_standards", true);
                config("set", "proview_quality_features", true);
                config("set", "proview_custom_background", "");
                config("set", "proview_hide_courses", JSON.stringify([""]));

                window.alert("Hey, thanks for using Proview.\n\nThis extension brings a lot of changes to Echo. We recommend that you view the documentation for this extension, the link is available on the settings page of Echo.");
            }
        });
    }

    // Reads the stylesheets either by href or by local, depending on the extensions state being
    // in debug mode or public mode.
    if (is_true_by_string(config("get", "proview_stylesheets"))) {
        $.ajax({
            url: "https://raw.githubusercontent.com/wo-r-professional/proview-for-echo/main/extension/resource/stylesheet/main.css",
            method: "get",
            dataType: "text",
            success: async function(text) {
                if (!$("head #proview-css").length)
                    await $("head").prepend("<style id=\"proview-css\"></style>");

                await $.each(text.match(/@import\s+(?!url\(\s*['"]?https:\/\/[^'"\)]+['"]?\)\s*;)\s*(?:url\()?\s*['"]?([^'"\)]+)['"]?\)?[^;]*;/g), (index, object) => {
                    $.ajax({
                        url: `https://raw.githubusercontent.com/wo-r-professional/proview-for-echo/main/extension/resource/stylesheet/${object.match(/@import\s+url\("([^"]+)"\);/, "")[1]}`,
                        method: 'get',
                        dataType: 'text',
                        success: (rooted_text) => {
                            text = text.replace(/@import\s+url\("((?!https?:\/\/).+)"\);/g, "");
                            text = text.replace(/\/\*[\s\S]*?\*\/|\/\*\*[\s\S]*?\*\//g, "");
                            rooted_text = rooted_text.replace(/@import\s+url\("((?!https?:\/\/).+)"\);/g, "");
                            rooted_text = rooted_text.replace(/\/\*[\s\S]*?\*\/|\/\*\*[\s\S]*?\*\//g, "");
                            text = `${text.trim()} ${rooted_text.trim()}`;

                            if (text == $("head #proview-css").text())
                                return;

                            $("head #proview-css").text(text);
                        }
                    });
                });

                debug_logger(`Wrote stylesheet content to \"#proview-css\"`, 1)
            }
        });

        if (config("get", "proview_custom_background") != "")
            $("body").css("--custom-background", `url("${config("get", "proview_custom_background")}")`);

        if (is_true_by_string(config("get", "proview_remove_thumbnails")))
            $("body").css("--remove-thumbnails", "none");
    }

    // Add custom background if stylesheets is not on
    if (!is_true_by_string(config("get", "proview_stylesheets")) && config("get", "proview_custom_background") != "") {
        $("head").append(`
            <style>
                :is(
                    app-settings .app-background,
                    app-login .app-primary-default-background, 
                    app-student-courses, 
                    app-student-to-do, 
                    app-student-stream, 
                    app-activity .mat-drawer-container, 
                    app-activity-item .mat-drawer-container,
                    app-order-courses .main,
                    app-student-grades .main,
                    app-badges
                ){                
                    background-image: url("${config("get", "proview_custom_background")}") !important;
                    background-size: 100% 100% !important;
                    background-repeat: no-repeat !important;
                }
            </style>
        `)
    }
    
    // Remove thumbnails if stylesheets is not on
    if (!is_true_by_string(config("get", "proview_stylesheets")) && is_true_by_string(config("get", "proview_remove_thumbnails"))) {
        $("head").append(`
            <style>
                app-student-courses mat-card .course-card-image {
                    margin: unset !important;
                    width: unset !important;
                    background-position: 50% 100% !important;
                    background-size: 100% 100%;
                    display: none;
                }       
            </style>
        `)
    }
    
    // Hides courses from the course page if the value from config matches it
    if (!isEmpty(JSON.parse(config("get", "proview_hide_courses"))[0])) {
        new MutationObserver(function (mutations) {mutations.forEach(function () {
            $.each(JSON.parse(config("get", "proview_hide_courses")), function () {
                $(`app-student-home-tabs app-student-courses .grid-ct mat-card:has(h2:contains(${this}))`).remove();
                $(`app-gradebook-home mat-row:has(mat-cell a:contains("${this}"))`).remove();
                $(`.cdk-overlay-container .cdk-overlay-pane mat-dialog-content .enrollment-list li:has(.course-title:contains(${this}))`).remove();
                $(`app-order-courses .cdk-drag:has(h3:contains(${this}))`).remove();
                $(`app-student-nav .course-menu .mat-mdc-list-item:has(.course-title:contains(${this}))`).remove();
                $(`body:has(lib-activity-stream) .cdk-overlay-container .cdk-overlay-pane mat-option:has(span:contains(${this}))`).remove();
                $(`app-calendar .calendar-ct mat-selection-list mat-list-option:has(.mat-mdc-list-item-title:contains(${this}))`).remove();
            })
        })}).observe($("body app-root")[0], { childList: true, subtree: true });
    }

    
    // Features that I don't think need its own options for.
    if (is_true_by_string(config("get", "proview_quality_features"))) {
        // Change <base> to have href="/" and target="_blank" to open links in new tabs.
        $(window).on("click keydown mousedown", function () {
            if ($("head #proview-base-change").length)
                return;

            $("head base").remove();
            $("head").append(`<base id="proview-base-change" href="/" target="_blank">`);
        })

        // Re-enable all disabled buttons, inputs, and checkboxes.
        new MutationObserver(function (mutations) {mutations.forEach(function () {
            $("button[disabled], input[disabled], div:has(input[disabled]).mdc-text-field--disabled").removeAttr("disabled").removeClass("mdc-text-field--disabled");
        })}).observe($("body app-root")[0], { childList: true });

        // Instantly go back to echo if you end up on the 404 page.
        if (window.location.href.includes("404"))
            window.location.href = "/";
    }

    // Finds any instance of scores and replaces them.
    if (is_true_by_string(config("get", "proview_replace_standards"))) {
        new MutationObserver((mutations) => {mutations.forEach(() => {
            $.ajax({
                url: api(`/cmd/listuserenrollments?_token=${get_details.token}&userid=${get_details.id}&privileges=1&select=data,course,course.data,course.teachers,metrics`),
                method: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(json) {
                    if (is_page("home/courses") || is_page("gradebook") || is_page("activity") || is_page("dashboard")) {
                        $.each(json.response.enrollments.enrollment, function () {
                            let true_score = Math.round((this.enrollmentmetrics.achieved / this.enrollmentmetrics.possible) * 100),
                                score_color;
                            
                            if (isNaN(true_score))
                                score_color = "no-color";
                            else if (true_score >= 80)
                                score_color = "pass-color";
                            else if (true_score < 80 && true_score > 60) {
                                $("body").css("--warn-color", "#ffd34d");
                                score_color = "warn-color";
                            }
                            else if (true_score < 60)
                                score_color = "fail-color";

                            true_score = isNaN(true_score) ? "--" : true_score;
                            
                            // Find every instance where this new score needs to be placed
                            $(`app-student-courses .grid-ct mat-card:has(h2:contains("${this.course.title}")) .score-ct div:contains("standards")`).css("color", `var(--${score_color})`).text(`${true_score}%`);
                            $(`app-student-courses .grid-ct mat-card:has(h2:contains("${this.course.title}")) .score-ct div:first-child`).text("Current score");
                            $(`app-student-courses .grid-ct mat-card:has(h2:contains("${this.course.title}")) .score span:contains("%")`).css("color", `var(--${score_color})`).text(`${true_score}%`);
                            $(`app-student-courses .grid-ct mat-card:has(h2:contains("${this.course.title}")) .fail-ada`).remove();
                            $(`app-course-home .card-ct mat-card .top-header:has(.title-teachers h2:contains("${this.course.title}")) .top-buttons .first-row span:contains("standards")`).css("color", `var(--${score_color})`).text(`${true_score}%`);
                            $(`app-course-home .card-ct mat-card .top-header:has(.title-teachers h2:contains("${this.course.title}")) .top-buttons .first-row .score span:contains("%")`).css("color", `var(--${score_color})`).text(`${true_score}%`);
                            $(`app-course-home .card-ct mat-card .top-header .fail-ada`).remove();
                            $(`app-gradebook-home mat-row:has(mat-cell a:contains("${this.course.title}")) mat-cell lib-score-proficiency span`).css("color", `var(--${score_color})`).text(`${true_score}%`);
                            $(`app-gradebook-home mat-row:has(mat-cell a:contains("${this.course.title}")) mat-cell lib-score .percent`).css("color", `var(--${score_color})`).text(`${true_score}%`);
                            $(`app-gradebook-home mat-row:has(mat-cell a:contains("${this.course.title}")) mat-cell .fail-ada`).remove();
                            $(`app-student-grades .main mat-card h4:has(span:contains(standards)) .field-label`).text("Score");
                            $(`app-student-grades .main mat-card h4:has(span:contains(standards)) span:contains(standards)`).remove();
                            if (is_page(this.id)) {
                                $(`app-gradebook-dashboard .main mat-card h4 .score .percent`).css("color", `var(--${score_color})`).text(` ${true_score}%`);
                                $(`app-gradebook-dashboard .main mat-card h4 lib-score-proficiency span`).css("color", `var(--${score_color})`).text(`${true_score}%`);
                                $(`app-student-grades .main mat-card h4 .score .percent`).css("color", `var(--${score_color})`).text(` ${true_score}%`);
                                $(`app-student-grades .main mat-card h4 lib-score-proficiency span`).css("color", `var(--${score_color})`).text(`${true_score}%`);                                
                                $(`app-student-grades .main mat-card .fail-ada`).remove();
                                $(`app-gradebook-dashboard .main mat-card .fail-ada`).remove();
                            }
                        });
                    }
                }
            });
        })}).observe($("body app-root")[0], { childList: true });
        debug_logger(`Actively looking for scores`, 4); // no spam plz
    }
    
    // Checks for login details, then it uses those details to create a login session that last forever.
    if (is_true_by_string(config("get", "proview_stay_logged_in"))) {
        new MutationObserver((mutations) => {mutations.forEach(() => {
            if ((window.location.href === window.location.origin + '/' || is_page("login")) && !isEmpty(config("get", "session"))) {
                window.location.href = config("get", "proview_last_set_url");
            } else {
                if (!(window.location.href === window.location.origin + '/' || is_page("login")))
                    config("set", "proview_last_set_url",  window.location.href);
                
                if (!isEmpty($("body:has(app-before-login)")) && !isEmpty(config("get", "proview_stay_logged_in_details"))) {
                    $.ajax({
                        url: api("/cmd"),
                        method: "POST",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({"request": {
                            cmd: "login3",
                            expireseconds: "-1",
                            password: JSON.parse(config("get", "proview_stay_logged_in_details"))[1],
                            username: `${window.location.href.split("//")[1].split(".")[0]}/${JSON.parse(config("get", "proview_stay_logged_in_details"))[0]}`,
                        }}),
                        success: function (json) {
                            if (json.response.code == "OK") {
                                let token = json.response.user.token;

                                json.response.token = token;
                                json.response.user.id = json.response.user.userid;
                                
                                delete json.response.user.token;
                                delete json.response.code;
                                delete json.response.user.userid;
                        
                                config("set", "session", JSON.stringify(json.response));

                                window.location.href = "/student/home/courses";
                            } 
                        }
                    })

                    debug_logger("Automatically logging in", 4);
                }
            
                // Get details (if they don't exist)
                if (is_page("login") && isEmpty(config("get", "proview_stay_logged_in_details"))) {
                    $("mat-toolbar button[type=\"submit\"]").on("mousedown", function () {
                        let details = [];
                        $.each($(".login-fields mat-form-field input"), function () {
                            if ($(this).val() != "" && details.length != 2)
                                details.push($(this).val());
                        })

                        // Check if valid
                        $.ajax({
                            url: api("/cmd"),
                            method: "POST",
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify({"request": {
                                cmd: "login3",
                                expireseconds: "-1",
                                password: details[1],
                                username: `${window.location.href.split("//")[1].split(".")[0]}/${details[0]}`,
                            }}),
                            success: (json) => {
                                if (json.response.code == "OK" && details.length == 2 && isEmpty(config("get", "proview_stay_logged_in_details"))) {
                                    config("set", "proview_stay_logged_in_details", JSON.stringify(details));
                                    debug_logger("Saved login details", 1);
                                }
                            }
                        })
                    });
                }
            }
        })}).observe($("body app-root")[0], { childList: true });
    } 
    else
        config("remove", "proview_stay_logged_in");
})();