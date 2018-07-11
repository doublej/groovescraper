window.fbAsyncInit = function () {
    FB.init({appId: '184055282306810', autoLogAppEvents: true, xfbml: true, version: 'v3.0'});
    init();
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

window.init = function () {

    FB.login(function (response) {

        if (response.authResponse) {
            console.log('Groove Syndicate Feed')
            console.dir(response.authResponse)

        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    });
};

window.offlineObj = {};

window.getPosts = function (page=0, limit=25, raw=false, silent=false, justYtId=false, writeOfflineObject=true) {

    offset = 0;

    if (page) {
        offset = page * limit;
        //console.log(offset)
    }

    if (!silent) {
        console.log('%c fetching ' + limit + ' posts on page ' + page + '. The offset from the most recent post is ' + offset + ' and posting raw data is ' + raw, 'background: #222; color: #fff')
    }

    if (justYtId) {
        console.log('[[ listing youtube IDs for page ' + page + ' ]]');
    }

    FB.api('/1020160978091715/feed', 'GET', {
        "fields": "link,name",
        "limit": limit.toString(),
        "offset": offset.toString(),
        "icon_size": "16"
    }, function (response) {

        window.offlineObj[page] = {};

        /*
         * Handle errors
         */

        if (response.error) {
            if (!silent) {
                console.dir(response);
            }
            if (response.error.message.includes('#4')) {
                console.error('Facebook API limit seems to be reached. Please come back in an hour and try again.');
            }
            return false;
        }

        obj = response.data;



        Object.keys(obj).forEach(function (key) {

            var currentrow = obj[key];

            if (raw) {
                console.dir(currentrow);
            } else {


                if (currentrow.link) {

                    var linkAttachedToPost = currentrow.link,
                        youtube = "youtube",
                        soundcloud = "soundcloud",
                        bandcamp = "bandcamp",
                        mediaFound = false,
                        mediaService = '',
                        mediaId = '';

                    if (writeOfflineObject) {

                        window.offlineObj[page][key] = linkAttachedToPost;

                    }

                    if (justYtId) {

                        youtubeId = getYoutubeIdFromUrl(linkAttachedToPost);

                        if (youtubeId) {
                            console.log(youtubeId);
                        }

                    } else {

                        if (!silent) {

                            if (linkAttachedToPost.includes(youtube)) {
                                mediaFound = true;
                                mediaService = 'yt';
                                mediaId = linkAttachedToPost;
                                message = 'weird url found, try yourself:';
                                if (mediaId.includes('v=')) {
                                    message = 'Found proper youtube url, url is:'
                                    mediaId = linkAttachedToPost.split('v=')[1];
                                    if (mediaId.includes('&')) {
                                        mediaId = mediaId.split('&')[0];
                                    }
                                } else {

                                }
                                console.log(message + linkAttachedToPost)
                            }

                            if (linkAttachedToPost.includes(soundcloud)) {
                                mediaFound = true;
                                mediaService = 'sc';
                                console.log('Soundcloud link found: ' + linkAttachedToPost)
                            }
                            if (linkAttachedToPost.includes(bandcamp)) {
                                mediaFound = true;
                                mediaService = 'bc';
                                console.log('Bandcamp link found: ' + linkAttachedToPost)
                            }
                        }

                        if (silent) {
                            console.log(linkAttachedToPost)
                        }

                    }


                }
            }
        });
    });

    return;
}

// window.getPostsFromTestObject = function (page=0, limit=25, raw=false, silent=false, justYtId=false) {
//
//     offset = 0;
//
//     if (page) {
//         offset = page * limit;
//     }
//
//     if (!silent) {
//         console.log('%c fetching ' + limit + ' posts on page ' + page + '. The offset from the most recent post is ' + offset + ' and posting raw data is ' + raw, 'background: #222; color: #fff')
//     }
//
//     if (justYtId) {
//         console.log('[[ listing youtube IDs for page ' + page + ' ]]');
//     }
//
//     obj = response.data;
//
//
//     Object.keys(obj).forEach(function (key) {
//
//         var currentrow = obj[key];
//
//         if (raw) {
//             console.dir(currentrow);
//         } else {
//
//
//             if (currentrow.link) {
//
//                 var linkAttachedToPost = currentrow.link,
//                     youtube = "youtube",
//                     soundcloud = "soundcloud",
//                     bandcamp = "bandcamp",
//                     mediaFound = false,
//                     mediaService = '',
//                     mediaId = '';
//
//                 if (writeOfflineObject) {
//
//                     window.offlineObj.push(linkAttachedToPost);
//
//                 }
//
//                 if (justYtId) {
//
//                     youtubeId = getYoutubeIdFromUrl(linkAttachedToPost);
//                     if (youtubeId) {
//                         console.log(youtubeId);
//                     }
//
//                 } else {
//
//                     if (!silent) {
//
//                         if (linkAttachedToPost.includes(youtube)) {
//                             mediaFound = true;
//                             mediaService = 'yt';
//                             mediaId = linkAttachedToPost;
//                             message = 'weird url found, try yourself:';
//                             if (mediaId.includes('v=')) {
//                                 message = 'Found proper youtube url, url is:'
//                                 mediaId = linkAttachedToPost.split('v=')[1];
//                                 if (mediaId.includes('&')) {
//                                     mediaId = mediaId.split('&')[0];
//                                 }
//                             } else {
//
//                             }
//                             console.log(message + linkAttachedToPost)
//                         }
//
//                         if (linkAttachedToPost.includes(soundcloud)) {
//                             mediaFound = true;
//                             mediaService = 'sc';
//                             console.log('Soundcloud link found: ' + linkAttachedToPost)
//                         }
//                         if (linkAttachedToPost.includes(bandcamp)) {
//                             mediaFound = true;
//                             mediaService = 'bc';
//                             console.log('Bandcamp link found: ' + linkAttachedToPost)
//                         }
//                     }
//
//                     if (silent) {
//                         console.log(linkAttachedToPost)
//                     }
//
//                 }
//
//
//             }
//         }
//     });
//
//
//     return;
//
// }

window.getYoutubeIdFromUrl = function (input) {


    var mediaFound = false;

    if (input.includes("youtube.com")) {

        if (input.includes('v=')) {

            mediaFound = true;
            input = input.split('v=')[1];

            if (input.includes('&')) {
                input = input.split('&')[0];

            }
        }

    } else if (input.includes("youtu.be")) {

        mediaFound = true;
        input = input;

        if (input.includes('be/')) {
            input = input.split('be/')[1];

        }

    }

    var output = input;

    if (mediaFound) {
        return output;
    } else {
        return false;
    }
}