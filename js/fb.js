var acs = '/259914077434319';

window.fbAsyncInit = function() {
    FB.init({
        appId      : '1517733728513665',
        xfbml      : false,
        version    : 'v2.2'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "http://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

function getGroup() {
    FB.api(acs, function (response) {
        console.log(response);
    });
}

window.onload = function () {
    FB.login(function (response) {
        if (response.authResponse) {
            console.log("Logged in.");
            FB.api("/me", function (response) {
                console.log("Hi, " + response.name + ".");
            });
        } else {
            console.log("Some error.");
        }
    });
    // getGroup();
};
