var app_options = {
    "scope": "user_groups"
}

var acs = "/259914077434319/feed?limit=5000&since=1 week ago";

weights = {
    "like": 3,
    "post": 2,
    "comment": 1
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : "1517733728513665",
        xfbml      : false,
        version    : "v2.1"
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "http://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
 }(document, "script", "facebook-jssdk"));

function addToTotal(dict, user, field, amount) {
    if (! dict[user]) {
        dict[user][field] = amount;
    } else {
        dict[user][field] += amount;
    }
}

window.onload = function () {
    FB.login(function (response) {
        if (response.authResponse) {
            FB.api("/me", function (response) {
                console.log("Hi, " + response.name + ".");
            });

            var users = {};
            // Loop through posts
            FB.api(acs, function (response) {
                var posts = response.data;
                for (var i = 0; i < posts.length; i += 1) {
                    var post = posts[i];
                    var user = post.from.id;

                    addToTotal(users, user, "post", weights.post);
                    var l = post.likes.length * weights.like;
                    addToTotal(users, user, "like", l);

                    // Loop through comments
                    var comments = post.comments.data;
                    for (i = 0; i < comments.length; i += 1) {
                        var comment = comments[i];
                        var user = comment.from.id;

                        addToTotal(users, user, "comment", weights.comment);
                        var l = comment.likes.length * weights.like;
                        addToTotal(users, user, "like", l);
                    }
                }
            });

            console.log(JSON.stringify(users, null, "    "));
        }
    }, app_options);
};
