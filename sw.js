/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/404.html","da78903b647aa39685351edc02f3f897"],["/about/index.html","b2a1f8bded6f17320500899c12bc14a6"],["/assets/css/main.css","6937bf90b0a71bbf334ac762d64e33df"],["/assets/img/favicon.jpg","ffb9f5c8afdda7fa4f3fd697e5147182"],["/assets/img/icons/android-chrome-192x192.png","95f34a47382db8532bf888b5a3cd820b"],["/assets/img/icons/android-chrome-256x256.png","95f34a47382db8532bf888b5a3cd820b"],["/assets/img/icons/apple-touch-icon.png","95f34a47382db8532bf888b5a3cd820b"],["/assets/img/icons/favicon-16x16.png","95f34a47382db8532bf888b5a3cd820b"],["/assets/img/icons/favicon-32x32.png","95f34a47382db8532bf888b5a3cd820b"],["/assets/img/icons/icon-github.svg","7c168f795307b2055ca32145fd52a1f6"],["/assets/img/icons/icon-instagram.svg","7c168f795307b2055ca32145fd52a1f6"],["/assets/img/icons/icon-twitter.svg","7c168f795307b2055ca32145fd52a1f6"],["/assets/img/icons/mstile-150x150.png","95f34a47382db8532bf888b5a3cd820b"],["/assets/img/icons/safari-pinned-tab.svg","7c168f795307b2055ca32145fd52a1f6"],["/assets/img/posts/2020-05-10-22-06-52.png","772b783eae2d1f6343283eb2a2ca47de"],["/assets/img/posts/2020-05-10-22-07-36.png","4a0629e58c0f16c9ea8eea9aa2e65274"],["/assets/img/posts/2020-05-10-23-26-11.png","e696c5b26dd633b175bafbebc82f9201"],["/assets/img/posts/2020-05-14-11-04-06.png","9938693a618ed981e639798c4518291a"],["/assets/img/posts/2020-05-14-11-04-55.png","d8bd4c85fe234d69013ed5248020c890"],["/assets/img/posts/2020-05-14-11-05-25.png","29c219c04a5304bb03e7089144c6e25a"],["/assets/img/posts/2020-05-14-11-05-45.png","6522e7e1d8bbc1869452b93eb2eef2e2"],["/assets/img/posts/2020-05-14-11-06-03.png","3f82f275302c8f9715b32f82bfeceeb1"],["/assets/img/posts/2020-05-14-11-06-19.png","35a2bf07d278fa9ca4417b1ff8a7a3db"],["/assets/img/posts/2020-05-14-11-06-36.png","27907ffd199b8812a30a4104db9502bf"],["/assets/img/posts/2020-05-14-11-06-50.png","55383cfecf21283b1b82a19bbeb71323"],["/assets/img/posts/2020-05-14-16-10-02.png","bee1aeaf564f19f648260729f324847b"],["/assets/img/posts/2020-05-14-18-27-25.png","67fe79901781a8b0df6b438cd86dec7f"],["/assets/img/posts/background_image.jpg","74e06f12410e2e202df1f01ac0784167"],["/assets/img/posts/emile-perron-190221.jpg","4705474281b975b7a213b96e71f772e7"],["/assets/img/posts/emile-perron-190221_lg.jpg","aafe35b1dc6d9dc9293c8c2ef4121046"],["/assets/img/posts/emile-perron-190221_md.jpg","03ed35ed656429599daba312f0990a0f"],["/assets/img/posts/emile-perron-190221_placehold.jpg","67f40708f69ab671cee04d624258b85c"],["/assets/img/posts/emile-perron-190221_sm.jpg","4ce4178a62d5a456e90e7bc47bde50f5"],["/assets/img/posts/emile-perron-190221_thumb.jpg","f20085dfe2e36854f8a12f1fd6c50425"],["/assets/img/posts/emile-perron-190221_thumb@2x.jpg","b8fa22c3237de529316037f093b9cb4d"],["/assets/img/posts/emile-perron-190221_xs.jpg","ac32cbd525d72e932499668af5647d03"],["/assets/img/posts/github.jpg","c0f088795ad6088d2354f686dcc31934"],["/assets/img/posts/github_md.jpg","c0f088795ad6088d2354f686dcc31934"],["/assets/img/posts/github_placehold.jpg","c0f088795ad6088d2354f686dcc31934"],["/assets/img/posts/github_sm.jpg","c0f088795ad6088d2354f686dcc31934"],["/assets/img/posts/github_thumb.jpg","c0f088795ad6088d2354f686dcc31934"],["/assets/img/posts/github_thumb@2x.jpg","c0f088795ad6088d2354f686dcc31934"],["/assets/img/posts/github_xs.jpg","c0f088795ad6088d2354f686dcc31934"],["/assets/img/posts/javascript.jpg","3f7d3b31bf8123750a76a0d0c597168b"],["/assets/img/posts/javascript_md.jpg","3f7d3b31bf8123750a76a0d0c597168b"],["/assets/img/posts/javascript_placehold.jpg","3f7d3b31bf8123750a76a0d0c597168b"],["/assets/img/posts/javascript_sm.jpg","3f7d3b31bf8123750a76a0d0c597168b"],["/assets/img/posts/javascript_thumb.jpg","3f7d3b31bf8123750a76a0d0c597168b"],["/assets/img/posts/javascript_thumb@2x.jpg","3f7d3b31bf8123750a76a0d0c597168b"],["/assets/img/posts/javascript_xs.jpg","3f7d3b31bf8123750a76a0d0c597168b"],["/assets/img/posts/microsoft.jpg","e9d7bfbdde1c1b539dd33bc898e7bb6f"],["/assets/img/posts/microsoftLogo.jpg","0adb3c6592c54682159ed4b51bc97469"],["/assets/img/posts/microsoftLogo_md.jpg","0adb3c6592c54682159ed4b51bc97469"],["/assets/img/posts/microsoftLogo_placehold.jpg","0adb3c6592c54682159ed4b51bc97469"],["/assets/img/posts/microsoftLogo_sm.jpg","0adb3c6592c54682159ed4b51bc97469"],["/assets/img/posts/microsoftLogo_thumb.jpg","0adb3c6592c54682159ed4b51bc97469"],["/assets/img/posts/microsoftLogo_thumb@2x.jpg","0adb3c6592c54682159ed4b51bc97469"],["/assets/img/posts/microsoftLogo_thumb_xs.jpg","0adb3c6592c54682159ed4b51bc97469"],["/assets/img/posts/microsoft_md.jpg","e9d7bfbdde1c1b539dd33bc898e7bb6f"],["/assets/img/posts/microsoft_placehold.jpg","e9d7bfbdde1c1b539dd33bc898e7bb6f"],["/assets/img/posts/microsoft_sm.jpg","e9d7bfbdde1c1b539dd33bc898e7bb6f"],["/assets/img/posts/microsoft_thumb.jpg","e9d7bfbdde1c1b539dd33bc898e7bb6f"],["/assets/img/posts/microsoft_thumb@2x.jpg","e9d7bfbdde1c1b539dd33bc898e7bb6f"],["/assets/img/posts/microsoft_xs.jpg","e9d7bfbdde1c1b539dd33bc898e7bb6f"],["/assets/img/posts/office1.jpg","882e4507be605e2de91bde1ff896ab67"],["/assets/img/posts/office1_lg.jpg","882e4507be605e2de91bde1ff896ab67"],["/assets/img/posts/office1_md.jpg","201bea9e1d219dba6567bd7975e6b267"],["/assets/img/posts/office1_placehold.jpg","b38eaa013f258aa5c9ee54d846d55f5c"],["/assets/img/posts/office1_sm.jpg","fd39c3b7a04753f2669b7384f1972591"],["/assets/img/posts/office1_thumb.jpg","f7f310befc818a92767ae7748df9dd56"],["/assets/img/posts/office1_thumb@2x.jpg","c97ff87d607f15a61ae6600e12a6b7f7"],["/assets/img/posts/office1_xs.jpg","c12434370a115b25d9ea0b3cce55df88"],["/assets/img/posts/shane-rounce-205187.jpg","bb774d6e05b2b55ffdabe11a8aac7c56"],["/assets/img/posts/shane-rounce-205187_lg.jpg","83cd838024fff9c3faec59fa1da97872"],["/assets/img/posts/shane-rounce-205187_md.jpg","628cf27bf658cf6de9df79ab9bf2cb2d"],["/assets/img/posts/shane-rounce-205187_placehold.jpg","249fc4a09bcfcbd7d5764f14c14ae82e"],["/assets/img/posts/shane-rounce-205187_sm.jpg","a2400a468e10d7d64528ac9c6bc3b6f0"],["/assets/img/posts/shane-rounce-205187_thumb.jpg","c3b2dd0d95a6d3a44d7702f8c06b1e78"],["/assets/img/posts/shane-rounce-205187_thumb@2x.jpg","b0722b63a92c92a44cd92c0201fc92a4"],["/assets/img/posts/shane-rounce-205187_xs.jpg","cd58fd23f3b3c1de2183beb9ed08327b"],["/assets/img/posts/sleek.jpg","e1064c5b04bc852054092e02369107e5"],["/assets/img/posts/sleek_lg.jpg","894fb712fa7f728d4837c81e54672fb1"],["/assets/img/posts/sleek_md.jpg","4e35ceb2f5fffd3d758fade699b0b85a"],["/assets/img/posts/sleek_placehold.jpg","0f48050cd7776895b98c6ce21597ff39"],["/assets/img/posts/sleek_sm.jpg","f30af3d30b7df905d962e494750f5da0"],["/assets/img/posts/sleek_thumb.jpg","f7b8a94ac9da8e5ea36bb9e459872400"],["/assets/img/posts/sleek_thumb@2x.jpg","e67e2129dc58a100b98a5e027c964dbc"],["/assets/img/posts/sleek_xs.jpg","c8212cace6d446950556a3bf6efe4520"],["/assets/js/bundle.js","d4279d1ea0bfc40037df5c3520733c9e"],["/blog/index.html","ea1649191370e8ea950e93fd2352554d"],["/categories/index.html","970af3a433446b3ce42f4cde5cded46e"],["/contact/index.html","b08b1395762b861c499b3ecfeffd4db9"],["/deleted_posts/2017-10-15-markdown-cheatsheet/index.html","a52a2cab874ceac5e0881f9194c815b9"],["/deleted_posts/2017-11-26-getting-started/index.html","bb835c434f3de96f6be27b05dbfcc7e8"],["/deleted_posts/2020-05-10-git-basic/index.html","1c9d9bc93c0c08daf541f5ac3f899bad"],["/deleted_posts/2020-05-11-git-basic-commands/index.html","7776653a5a155db260d872d49a651576"],["/deleted_posts/2020-05-13-az204-make-account/index.html","050f138fac5a7374e77a0bc524cac48e"],["/deleted_posts/2020-05-18-git-check-config/index.html","7d20f2284555a1c4302c3b592e040931"],["/deleted_posts/2020-05-27-js-Destructuring-assignment/index.html","2c88c0ada591bc0eae2ccee501ee0d2e"],["/devlog/index.html","7dd41c9a202bfa91e2210b9797a01ed8"],["/googlee672a59e6e692c4e.html","a1e17a6cc9b4f9130e98fd855ef2300f"],["/gulpfile.babel.js","499ef2edde6e9b4fbafcb7c6f0cbc725"],["/index.html","5decaf894459f91f00fc6bf6d5a1e083"],["/kfserving/index.html","54c76e0f4193c046920a95714c5436df"],["/sw.js","1740338e45a74f46b87d25f6dbcc2f7c"],["/tags/index.html","ca7ea9ebef870208a3d6b58df4709ff2"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







