var app_options = {
    "scope": 'user_groups'
}

var acs = '/259914077434319/feed';

window.fbAsyncInit = function() {
    FB.init({
        appId      : '1517733728513665',
        xfbml      : false,
        version    : 'v2.1'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "http://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

window.onload = function () {
    var loggedIn = false;
    FB.login(function (response) {
        if (response.authResponse) {
            loggedIn = true;
            FB.api("/me", function (response) {
                console.log("Hi, " + response.name + ".");
            });

            // Loop through group feed
            FB.api(acs, function (response) {
                console.log(response);
                for (var i = 0; i < response.length; i += 1) {
                    console.log(JSON.stringify(response[i], null, "    "));
                }
            });
        }
    }, app_options);
};
