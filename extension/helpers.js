/**
 * Used when debugging things
 */
let debugging = false;

/**
 * Debugging logger
 */
function debug_logger(message, type, using = "") {
    if (debugging) {
        const prefix = '%c[PROVIEW]';

        switch(type) {
            case 2:
                console.log(prefix + ' %c[WARNING]', 'color: #d056fc;', 'color: #fcef56;', message);
                break;
            case 3:
                console.log(prefix + ' %c[ERROR]', 'color: #d056fc;', 'color: #fc5656;', message);
                break;
            case 4:
                console.log(prefix + ' %c[INFO]', 'color: #d056fc;', 'color: #5672fc;', message);
                break;
            case 1:
                console.log(prefix + ' %c[SUCCESS]', 'color: #d056fc;', 'color: #72fc56;', message);
                break;
            default:
                console.log(prefix, 'color: #d056fc;', message);
        }
    }
}

/**
 * Returns a string form the api 
 */
let api = (path) => {
    return `https://api.agilixbuzz.com${path}`;
}

/**
 * Writes data to a key, and fetches keys
 */
function config(type = "get", key, value = "") {
    switch(type.toLocaleLowerCase()) {
        case "get":
            return localStorage.getItem(key);
            break;
        case "set":
            if (localStorage.getItem(key) == undefined)
                localStorage.setItem(key, value);

            localStorage.setItem(key, value);
            break;
        case "remove":
            if (localStorage.getItem(key) != undefined)
                localStorage.removeItem(key);
            break;
    }
}

/**
 * Does the current page match the string?
 */
function is_page(page) {
    if (window.location.href.toLocaleLowerCase().includes(page))
        return true;
    return false;
}

/**
 * Is the item provided empty?
 */
function isEmpty(value) {
    // Check for null or undefined
    if (value === null || value === undefined) {
        return true;
    }
  
    // Check for empty string
    if (typeof value === 'string' && value.trim().length === 0) {
        return true;
    }
  
    // Check for arrays or any object-like with a length property (e.g., Array, String under certain conditions)
    if (typeof value === 'object' && value.hasOwnProperty('length') && value.length === 0) {
        return true;
    }
  
    // Check for objects with no own enumerable properties
    if (typeof value === 'object' && Object.keys(value).length === 0) {
        return true;
    }
  
    // If none of the conditions above, then value is not considered empty
    return false;
}

/**
 * Config() returns "true" instead of true, so this was made for that.
 */
function is_true_by_string(value) {
    if (value === "true")
        return true;
    return false;
}

/**
 * Simulates a stroke of keypresses
 * HACK: Thank you GPT-3.5, this would not have happened without you <3.  
 */
function simulateKeypress(element, text) {
    for (var i = 0; i < text.length; i++) {
        var keyCode = text.charCodeAt(i);
        element.trigger({ type: 'keypress', which: keyCode, keyCode: keyCode });
    }
}

/**
 * Get details from echos localstorage & extension
 */
const get_details = {
    get token() {
        const session = JSON.parse(config("get", "session"));
        return session ? session.token : undefined;
    },
    get id() {
        const session = JSON.parse(config("get", "session"));
        return session && session.user ? session.user.id : undefined;
    },
    /**
     * needs feature **auto_login** enabled to work 
     */
    get password() {
        const session = JSON.parse(config("get", "session"));
        return session && session.user ? session.user.password : undefined;
    },
    get username() {
        const session = JSON.parse(config("get", "session"));
        return session && session.user ? session.user.username : undefined;
    },
    get firstname() {
        const session = JSON.parse(config("get", "session"));
        return session && session.user ? session.user.firstname : undefined;
    },
    get lastname() {
        const session = JSON.parse(config("get", "session"));
        return session && session.user ? session.user.lastname : undefined;
    },
    get email() {
        const session = JSON.parse(config("get", "session"));
        return session && session.user ? session.user.email : undefined;
    }
};

/**
 * Checks if an image exists or not
 */
function imageValid(url, callback) {
    var img = new Image();
    img.onload = function() {callback(true, url);};
    img.onerror = function() {callback(false, url);};
    img.src = url;
}

/**
 * Checks if a url redirects to somewhere else
 */
function urlRedirects(url, callback) {
    fetch(url, {
        method: 'get',
        redirect: 'follow', // This instructs fetch to follow redirects
    })
    .then(response => {
        callback(response.url)
    })
}

