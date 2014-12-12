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

function addToTotal(dict, id, field, amount) {
    if (! (id in dict)) {
        dict[id] = {};
    }

    if (! (field in dict[id])) {
        dict[id][field] = 0;
    }

    dict[id][field] += amount;
}

window.onload = function () {
    FB.login(function (response) {
        if (response.authResponse) {
            FB.api("/me", function (response) {
                console.log("Hi, " + response.name + ".");
            });

            // Loop through posts
            FB.api(acs, function (response) {
                var users = {};

                var posts = response.data;
                for (var i = 0; i < posts.length; i += 1) {
                    var post = posts[i];
                    var user = post.from.id;

                    addToTotal(users, user, "post", weights.post);
                    if (post.likes) {
                        var l = post.likes.length * weights.like;
                        addToTotal(users, user, "like", l);
                    }

                    // Loop through comments
                    if (post.comments) {
                        var comments = post.comments.data;
                        for (var j = 0; j < comments.length; j += 1) {
                            var comment = comments[j];
                            var user = comment.from.id;

                            addToTotal(users, user, "comment", weights.comment);
                            if (comment.likes) {
                                var l = comment.likes.length * weights.like;
                                addToTotal(users, user, "like", l);
                            }
                        }
                    }
                }

                console.log(JSON.stringify(users, null, "    "));
            });

        }
    }, app_options);
};
