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
 * Repository: https://github.com/wo-r/proview-for-echo/
 * Documentation: https://github.com/wo-r/proview-for-echo/wiki
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
                window.alert("Hey, thanks for using Proview.\n\nThis extension brings a lot of changes to Echo. We recommend that you view the documentation for this extension, the link is available on the settings page of Echo.");
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
                config("set", "proview_automatic_logins", false);
                config("set", "proview_stylesheets", false);
                config("set", "proview_remove_thumbnails", false);
                config("set", "proview_replace_standards", true);
                config("set", "proview_quality_features", true);
                config("set", "proview_custom_background", "");
                config("set", "proview_hide_courses", "");
            }
        });
    }

    // TODO: do settings before doing these


})();