/** 
 * Adds new options to the settings section of echo
 */
(async function () {
    "use strict";
    
    var observer = new MutationObserver(function (mutations) {
        $.each(mutations, async function (index, mutation) {
            if (!window.location.href.includes("setting") || $("#proview-settings").length)
                return;

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
                                <label for="proview-pref-1" class="mdc-label">Automatically update extension</label>
                            </div>
                        </mat-checkbox>
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
                                <label for="proview-pref-2" class="mdc-label">Enable custom stylesheets</label>
                            </div>
                        </mat-checkbox>
                    </div>
                `)
            }
        })
    });
    observer.observe(document, {attributes: true, childList: true, subtree: true});
})()