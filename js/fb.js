/*jslint browser: true*/
/*global FB*/
window.fbAsyncInit = function() {
    try {
        FB.init({
            appId: "1517733728513665",
            xfbml: false,
            version: "v2.3"
        });

        FB.getLoginStatus(function (response) {
            if (response.status == "connected") {
                get_metrics();
            } else {
                document.getElementById("info_text").innerHTML = (
                    "<h3 class=\"buffer\">You're not logged in :(</h3>" +
                    "<button type=\"button\" onclick=\"javascript:login()\">" +
                    "Authorise with Facebook</button>"
                );
            }
        });
    } catch (err) {
        window.setTimeout(2000, function () {
            document.getElementById("status").innerHTML = (
                "Couldn't load Facebook API. :("
            );
        });
    }
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
 }(document, "script", "facebook-jssdk"));

// Calculate a 'score' based on likes/comments/posts
function get_score (comments, likes, posts) {
    var weights = {
        "like": 3,
        "post": 2,
        "comment": 1
    };

    var c = (comments || 0) * weights.comment;
    var l = (likes || 0) * weights.like;
    var p = (posts || 0) * weights.post;

    return (l - (c + p));
}

function make_user_list(metrics) {
    var users = [];
    for (var _id in metrics) {
        var u = metrics[_id];
        var s = get_score(u.comment, u.like, u.post);
        users.push([_id, s]);
    }

    users.sort(function (u, s) {
        return s[1] - u[1];
    });

    return users;
}

function add_to_count(dict, id, field, amount) {
    if (! (id in dict)) {
        dict[id] = {};
    }

    if (! (field in dict[id])) {
        dict[id][field] = 0;
    }

    dict[id][field] += amount;
}

function render_leaderboard(sorted_users) {
    // Add list items to main panel
    document.getElementById("posts").innerHTML = "";
    var ul = document.createElement("ul");
    ul.id = "score_list";
    document.getElementById("posts").appendChild(ul);

    // Append nodes
    for (var i = 0; i < sorted_users.length; i += 1) {
        var name = sorted_users[i][0];
        var score = sorted_users[i][1];

        var li = document.createElement("li");

        var na = document.createTextNode(name);
        li.appendChild(na);

        var s = document.createElement("b");
        s.style.cssFloat = "right";
        var sc = document.createTextNode(score);
        s.appendChild(sc);
        li.appendChild(s);

        document.getElementById("score_list").appendChild(li);
    }
}

function get_metrics () {
    // Aber Comp Sci: 259914077434319
    // ACOG: 121786034551902
    var acs = "/121786034551902/feed?limit=5000&since=3%20days%20ago&until=now";
    var app_options = {
        "scope": "user_groups"
    };

    // Loop through posts
    FB.api(acs, function (response) {
        var users = {};

        var l, user;
        var posts = response.data;
        for (var i = 0; i < posts.length; i += 1) {
            var post = posts[i];
            user = post.from.name;

            add_to_count(users, user, "post", 1);
            if (post.likes) {
                l = post.likes.data.length;
                add_to_count(users, user, "like", l);
            }

            // Loop through comments
            if (post.comments) {
                var comments = post.comments.data;
                for (var j = 0; j < comments.length; j += 1) {
                    var comment = comments[j];

                    user = comment.from.name;
                    add_to_count(users, user, "comment", 1);
                    if (comment.like_count) {
                        l = comment.like_count;
                        add_to_count(users, user, "like", l);
                    }
                }
            }
        }

        var users_sorted = make_user_list(users);
        render_leaderboard(users_sorted);
    });
}

function login() {
    FB.login(function (response) {
        if (response.authResponse) {
            get_metrics();
        }
    });
}
