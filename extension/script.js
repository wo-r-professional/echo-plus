(async function () {
    "use strict";
    
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
})();