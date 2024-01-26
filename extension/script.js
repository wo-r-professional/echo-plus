(async function () {
    "use strict";

    // For now until we go public
    await browser.storage.local.remove("config");

    // Before doing anything lets do some base checks (if this is a first time install).
    if ((await browser.storage.local.get("config")).config == undefined) {
        await browser.storage.local.set({config: {
            "version": "0.0.1",
            "$schema": {
                "preferences": {
                    "automatically_update_extension": {
                        "$value": true,
                        "description": "Checks if the extension is out of date, and automatically updates it (if disabled, it will just never update)."
                    },
                    "stylesheet_preferences": {
                        "enable_stylesheets": {
                            "$value": true,
                            "description": "Styles the ECHO website with custom styling."
                        },
                        "custom_background": {
                            "$value": null,
                            "description": "Changes the websites background to anything you want."
                        }
                    }
                },
                "settings": {
                    "replace_standards_with_percents": {
                        "$value": true,
                        "description": "Replaces the Standard-base Grades (SBG) with the normal Percentage-base grades (PBG)."
                    },
                    "automatically_login": {
                        "$value": false,
                        "description": "Prevents you from being logged out by always logging you back in (requires account password)."
                    },
                    "change_base_target": {
                        "$value": true,
                        "description": "Replaces <base> with _self, allowing links to open in new tabs, instead of opening in the same tab."
                    },
                    "hide_courses": {
                        "$value": [],
                        "description": "Hides courses that you do not need/want in the course feed."
                    }
                },
                "detected_courses": []
            }
        }})
    }

    // Checks main.css for imports with a PATH, then appends everything to a <style>
    // element that is prepended to the top of <head>.
    if ((await browser.storage.local.get("config")).config.$schema.preferences.stylesheet_preferences.enable_stylesheets.$value == true) {
        $.ajax({
            url: browser.extension.getURL('resource/stylesheet/main.css'),
            method: 'get',
            dataType: 'text',
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
        if ((await browser.storage.local.get("config")).config.$schema.preferences.stylesheet_preferences.custom_background != "") {
            // TODO: once CSS is done implement the variable change here
        }
    }
})();