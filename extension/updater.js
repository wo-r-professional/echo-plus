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
    if (localStorage.getItem("config") != undefined && JSON.parse(localStorage.getItem("config")).$schema.preferences.automatically_update_extension.$value) {
        $.ajax({
            url: "https://raw.githubusercontent.com/wo-r/proview-for-echo/main/extension/manifest.json",
            method: "get",
            dataType: "json",
            success: function (manifest) {
                if (browser.runtime.getManifest().version < manifest.version) {
                    if (confirm("Extension is out of date.\n\nPlease click OK to go to the download page to get the latest version.")) {
                        window.open(`https://github.com/wo-r/proview-for-echo/releases/tag/0.0.2`, "_blank").focus();
                    }
                }
            }
        })
    }
})();