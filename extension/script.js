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

    // Welcome message for first time users.
    if (localStorage.getItem("config") == undefined) {
        window.alert("Hey, thanks for using Proview.\n\nThis extension brings a lot of changes to ECHO. We recommend that you view the documentation for this extension, the link is available on the settings page of ECHO.");
    }

    // Checks main.css for imports with a PATH, then appends everything to a <style>
    // element that is prepended to the top of <head>.
    if (JSON.parse(localStorage.getItem("config")).$schema.preferences.stylesheet_preferences.enable_stylesheets.$value) {
        $.ajax({
            url: browser.extension.getURL("resource/stylesheet/main.css"),
            method: "get",
            dataType: "text",
            success: async function(text) {
                if ($("head #proview-css").length)
                    return;

                await $.each(text.match(/@import\s+(?!url\(\s*['"]?https:\/\/[^'"\)]+['"]?\)\s*;)\s*(?:url\()?\s*['"]?([^'"\)]+)['"]?\)?[^;]*;/g), async function () {
                    $.ajax({
                        url: browser.extension.getURL(`resource/stylesheet/${this.match(/@import\s+url\("([^"]+)"\);/, "")[1]}`),
                        method: 'get',
                        dataType: 'text',
                        success: function (text) {
                            $("head #proview-css").append(text.replace(/\/\*[\s\S]*?\*\/|\/\*\*[\s\S]*?\*\//g, ""));
                        }
                    });
                })

                text = text.replace(/@import\s+url\("((?!https?:\/\/).+)"\);/g, "");
                text = text.replace(/\/\*[\s\S]*?\*\/|\/\*\*[\s\S]*?\*\//g, "");

                $("head").prepend(`<style id="proview-css">${text}</style>`);
            }
        });

        // If the user also wanted a custom background, then apply it here.
        if (JSON.parse(localStorage.getItem("config")).$schema.preferences.stylesheet_preferences.custom_background.$value != "") {
            // TODO: once CSS is done implement the variable change here
        }

        // Remove the course thumbnails
        if (JSON.parse(localStorage.getItem("config")).$schema.preferences.stylesheet_preferences.remove_course_thumbnails.$value != "") {
            // TODO: once CSS is done implement the variable change here
        }
    }

    // Quality of life features that I thought didn't really need an option for.
    if (JSON.parse(localStorage.getItem("config")).$schema.settings.quality_of_life_features.$value) {
        // Change <base> to have href="/" and target="_blank" to open links in new tabs.
        $(window).on("click keydown mousedown", function () {
            if ($("head #proview-base-change").length)
                return;

            $("head base").remove();
            $("head").append(`<base id="proview-base-change" href="/" target="_blank">`);
        })

        // Instantly go back to echo if you end up on the 404 page.
        if (window.location.href.includes("404"))
            window.location.href = "/";
    }

    // Hides any courses that match to the text provided by $value.
    if (JSON.parse(localStorage.getItem("config")).$schema.settings.hide_courses.$value.length != 0) {
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function () {
                let index = 0;
                $.each(JSON.parse(localStorage.getItem("config")).$schema.settings.hide_courses.$value, function () {
                    // If index is greater than the list, then disconnect the observer.
                    if (index >= JSON.parse(localStorage.getItem("config")).$schema.settings.hide_courses.$value.length)
                        observer.disconnect();

                    // Bump index up.
                    index++;

                    if ($(`app-student-home-tabs app-student-courses .grid-ct mat-card:has(h2:contains(${this})) h2`).text().trim() == this)
                        $(`app-student-home-tabs app-student-courses .grid-ct mat-card:has(h2:contains(${this}))`).remove();

                    if ($(`app-gradebook-home mat-row:has(mat-cell a:contains("${this}")) mat-cell a:contains("${this}")`).text().trim() == this)
                        $(`app-gradebook-home mat-row:has(mat-cell a:contains("${this}"))`).remove();

                    if ($(`.cdk-overlay-container .cdk-overlay-pane mat-dialog-content .enrollment-list li:has(.course-title:contains(${this})) .course-title`).text().trim() == this)
                        $(`.cdk-overlay-container .cdk-overlay-pane mat-dialog-content .enrollment-list li:has(.course-title:contains(${this}))`).remove(
                    );
                })
            });
        })
        observer.observe($("body")[0], { childList: true, subtree: true });
    }

    // Fetchs all courses, matches the courses, determines the score, then changes all the courses scores to match.
    // TODO: this is a mess, and should be cleaned soon
    if (JSON.parse(localStorage.getItem("config")).$schema.settings.replace_standards_with_percents.$value) {
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

    // Removes all changes to see the "Please log back in" modal that pops up after not using
    // ECHO for a period of time.
    if (JSON.parse(localStorage.getItem("config")).$schema.settings.automatically_login.$value) {
        // If auto login does not get rid of the login modal, then remove it.
        setInterval(function () {
            if ($(".cdk-overlay-container .cdk-overlay-pane app-session-lost").length)
                $(".cdk-overlay-container").remove();
            else
                return;
        });

        // TODO: get the login modal to show up to get important elements for this to work
    }
})();