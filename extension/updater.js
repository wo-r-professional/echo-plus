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
 * Dependencies: jQuery (v3.7.1), helper.js
 */
(async function () {
    // Enforces stricter parsing and error handling in JavaScript, preventing common mistakes like using undeclared variables.
    "use strict";

    if (!isEmpty(config("get", "proview_allow_extension_updates"))) {
        $.ajax({
            url: "https://raw.githubusercontent.com/wo-r/proview-for-echo/main/extension/manifest.json",
            method: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (manifest) {
                if (browser.runtime.getManifest().version < manifest.version) {
                    debug_logger("Extension needs to update", 4)
                    if (confirm("Extension is out of date.\n\nPlease click OK to go to the download page to get the latest version.")) {
                        window.open(`https://github.com/wo-r/proview-for-echo/releases/tag/${manifest.version}`, "_blank").focus();
                    }
                }
                else
                    debug_logger("Extension is up to date", 4);
            }
        })
    }
})();