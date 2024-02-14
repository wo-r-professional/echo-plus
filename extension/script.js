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

    // First time use.
    if (localStorage.getItem("config_firstuse") == undefined) {
        window.alert("Hey, thanks for using Proview.\n\nThis extension brings a lot of changes to ECHO. We recommend that you view the documentation for this extension, the link is available on the settings page of ECHO.");
        config("set", "config_firstuse", true);
        
        // Set defaults
        config("set", "config_pfp", "");
        config("set", "config_update", true);
        config("set", "config_auto_login", false);
        config("set", "config_custom_styles", false);
        config("set", "config_remove_thumbnails", false);
        config("set", "config_replace_standards", true);
        config("set", "config_quality_features", true);
        config("set", "config_custom_background", "");
        config("set", "config_hide_courses", "");
    }

    // Checks main.css for imports with a PATH, then appends everything to a <style>
    // element that is prepended to the top of <head>.
    if (config("get", "config_custom_styles") === "true") {
        $.ajax({
            url: browser.extension.getURL("resource/stylesheet/main.css"),
            method: "get",
            dataType: "text",
            success: async function(text) {
                if (!$("head #proview-css").length)
                    await $("head").prepend("<style id=\"proview-css\"></style>");

                await $.each(text.match(/@import\s+(?!url\(\s*['"]?https:\/\/[^'"\)]+['"]?\)\s*;)\s*(?:url\()?\s*['"]?([^'"\)]+)['"]?\)?[^;]*;/g), (index, object) => {
                    $.ajax({
                        url: browser.extension.getURL(`resource/stylesheet/${object.match(/@import\s+url\("([^"]+)"\);/, "")[1]}`),
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
            }
        });
        
        // If the user also wanted a custom background, then apply it here.
        if (config("get", "config_custom_background") != "")
            $("body").css("--custom-background", `url("${config("get", "config_custom_background")}")`);

        // Remove the course thumbnails
        if (config("get", "config_remove_thumbnails") === "true")
            $("body").css("--remove-thumbnails", "none");
    }

    // Quality of life features that I thought didn't really need an option for.
    if (config("get", "config_quality_features") === "true") {
        // Change <base> to have href="/" and target="_blank" to open links in new tabs.
        $(window).on("click keydown mousedown", function () {
            if ($("head #proview-base-change").length)
                return;

            $("head base").remove();
            $("head").append(`<base id="proview-base-change" href="/" target="_blank">`);
        })

        // Re-enable all disabled buttons, inputs, and checkboxes.
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function () {
                $("button[disabled], input[disabled], div:has(input[disabled]).mdc-text-field--disabled").removeAttr("disabled").removeClass("mdc-text-field--disabled");
            })
        })
        observer.observe($("body app-root")[0], { childList: true });

        // Instantly go back to echo if you end up on the 404 page.
        if (window.location.href.includes("404"))
            window.location.href = "/";
    }

    // Hides any courses that match to the text provided by $value.
    if (JSON.parse(config("get", "config_hide_courses")).length != 0) {
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function () {
                let index = 0;
                $.each(JSON.parse(config("get", "config_hide_courses")), function () {
                    // If index is greater than the list, then disconnect the observer.
                    if (index >= JSON.parse(config("get", "config_hide_courses")).length)
                        observer.disconnect();

                    // Bump index up.
                    index++;

                    if ($(`app-student-home-tabs app-student-courses .grid-ct mat-card:has(h2:contains(${this})) h2`).text().trim() == this)
                        $(`app-student-home-tabs app-student-courses .grid-ct mat-card:has(h2:contains(${this}))`).remove();

                    if ($(`app-gradebook-home mat-row:has(mat-cell a:contains("${this}")) mat-cell a:contains("${this}")`).text().trim() == this)
                        $(`app-gradebook-home mat-row:has(mat-cell a:contains("${this}"))`).remove();

                    if ($(`.cdk-overlay-container .cdk-overlay-pane mat-dialog-content .enrollment-list li:has(.course-title:contains(${this})) .course-title`).text().trim() == this)
                        $(`.cdk-overlay-container .cdk-overlay-pane mat-dialog-content .enrollment-list li:has(.course-title:contains(${this}))`).remove();

                    if ($(`app-order-courses .cdk-drag:has(h3:contains(${this})) h3`).text().trim() == this)
                        $(`app-order-courses .cdk-drag:has(h3:contains(${this}))`).remove();

                    if ($(`app-student-nav .course-menu .mat-mdc-list-item:has(.course-title:contains(${this})) .course-title`).text().trim() == this)
                        $(`app-student-nav .course-menu .mat-mdc-list-item:has(.course-title:contains(${this}))`).remove();
                })
            });
        })
        observer.observe($("body")[0], { childList: true, subtree: true });
    }

    // Fetchs all courses, matches the courses, determines the score, then changes all the courses scores to match.
    // OPTIMIZE: this is a mess, and should be cleaned soon
    if (config("get", "config_replace_standards") === "true") {
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function () {
                if (window.location.href.includes("home/courses") || window.location.href.includes("gradebook") || window.location.href.includes("activity")) {
                    if ($("app-student-home-tabs app-student-courses #proview-replace-standards").length)
                        return;

                    $.ajax({
                        url: `https://api.agilixbuzz.com/cmd/listuserenrollments?_token=${JSON.parse(localStorage.getItem("session")).token}&userid=${JSON.parse(localStorage.getItem("session")).user.id}&privileges=1&select=data,course,course.data,course.teachers,metrics`,
                        type: 'get',
                        dataType: "json",
                        success: async function(json) {
                            await $.each(json.response.enrollments.enrollment, function () {
                                let actual_score = Math.round((this.enrollmentmetrics.achieved / this.enrollmentmetrics.possible) * 100);

                                $(`app-student-home-tabs app-student-courses .grid-ct mat-card:has(h2:contains("${this.course.title}")) .detail-ct .score-ct div:last-child`).attr("style", `color: var(--${isNaN(actual_score) == false  ? actual_score < 60 ? "fail-color" : "pass-color" : "no-color"});`).text(`${isNaN(actual_score) ? "--" : actual_score + "%"}`);
                                    
                                $(`app-gradebook-home mat-row:has(mat-cell a:contains("${this.course.title}")) mat-cell lib-score-proficiency span`).attr("style", `color: var(--${isNaN(actual_score) == false  ? actual_score < 60 ? "fail-color" : "pass-color" : "no-color"});`).text(`${isNaN(actual_score) ? "--" : actual_score + "%"}`);
                                                                        
                                $(`app-course-home .card-ct mat-card:has(.top-header .title-teachers h2:contains(${this.course.title})) .top-buttons .first-row>span`).attr("style", `color: var(--${isNaN(actual_score) == false  ? actual_score < 60 ? "fail-color" : "pass-color" : "no-color"});`).text(`${isNaN(actual_score) ? "--" : actual_score + "%"}`);

                                // Why do you make me do this echo...
                                $(`app-student-grades .main mat-card h4:has(span:contains(standards)) .field-label`).text("Score");
                                $(`app-student-grades .main mat-card h4:has(span:contains(standards)) span:contains(standards)`).remove();
                                if (window.location.href.includes(this.id))
                                    $(`app-student-grades .main mat-card h4 lib-score-proficiency span`).attr("style", `color: var(--${isNaN(actual_score) == false  ? actual_score < 60 ? "fail-color" : "pass-color" : "no-color"});`).text(`${isNaN(actual_score) ? "--" : actual_score + "%"}`);
                            });
                            $("app-student-home-tabs app-student-courses .grid-ct").attr("id", "proview-replace-standards");
                        }
                    });
                }
            });
        })
        observer.observe($("body app-root")[0], { childList: true });
    }

    // Removes all changes to see the "Unable to keep session alive" modal that pops up after not using
    // ECHO for a period of time.
    if (config("get", "config_auto_login") === "true") {
        // Thank you GPT-3.5, this would not have happened without you <3.  
        function keypress(element, text) {
            for (var i = 0; i < text.length; i++) {
                var keyCode = text.charCodeAt(i);
                element.trigger({ type: 'keypress', which: keyCode, keyCode: keyCode });
            }
        }
        
        // Get user details if auto login is enabled.
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function () {
                if (localStorage.getItem("auto_login") != undefined) {    
                    // Login page
                    // TODO: probably better to just check for the element
                    if (window.location.href.includes("login") || !window.location.href.includes("/student")) {
                        keypress($(".login-fields mat-form-field input[type=\"text\"]"), JSON.parse(localStorage.getItem("auto_login"))[0])
                        keypress($(".login-fields mat-form-field input[type=\"password\"]"), JSON.parse(localStorage.getItem("auto_login"))[1])
                        $("mat-toolbar button[type=\"submit\"] .mat-mdc-button-touch-target").trigger("click");
                    }
                }

                // Return after other stuff if we are not in login.
                if (!window.location.href.includes("login"))
                    return;

                $("mat-toolbar button[type=\"submit\"]").off();
                $("mat-toolbar button[type=\"submit\"]").on("mousedown", function () {
                    let details = [];
                    $.each($(".login-fields mat-form-field input"), function () {
                        if (details.length == 2)
                            return

                        if ($(this).val() != "")
                            details.push($(this).val());
                    })

                    if (details.length == 2 && localStorage.getItem("auto_login") == undefined)
                        localStorage.setItem("auto_login", JSON.stringify(details));
                });
            })
        })
        observer.observe($("body app-root")[0], { childList: true });

        // Login popup timeout (its trivial that they even have this)
        setInterval(function () {
            if ($(".cdk-overlay-container app-session-lost input[type=\"password\"]").length) {
                keypress($(".cdk-overlay-container app-session-lost input[type=\"password\"]"), JSON.parse(localStorage.getItem("auto_login"))[1]);
                $(".cdk-overlay-container app-session-lost mat-dialog-actions button:last-child .mat-mdc-button-touch-target").trigger("click")
            
                // If auto login does not get rid of the login modal, then remove it anyways b/c
                // Echo is werid, and doesn't actually require this to be used.
                if ($(".cdk-overlay-container .cdk-overlay-pane app-session-lost").length)
                    $(".cdk-overlay-container").remove();
                else
                    return;
            }
        });
    } else {
        // Saftey is first, so if it is disabled we remove the 
        // localstorage variable that keeps there password.
        localStorage.removeItem("auto_login");
    }
})();