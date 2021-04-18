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

var precacheConfig = [["/404.html","589a3a3f4c94e4599f4a9772f679743d"],["/about/index.html","d6ac14cd7e267c6cec902aac1b631961"],["/assets/css/main.css","6937bf90b0a71bbf334ac762d64e33df"],["/assets/img/favicon.jpg","ffb9f5c8afdda7fa4f3fd697e5147182"],["/assets/img/icons/android-chrome-192x192.png","95f34a47382db8532bf888b5a3cd820b"],["/assets/img/icons/android-chrome-256x256.png","95f34a47382db8532bf888b5a3cd820b"],["/assets/img/icons/apple-touch-icon.png","95f34a47382db8532bf888b5a3cd820b"],["/assets/img/icons/favicon-16x16.png","95f34a47382db8532bf888b5a3cd820b"],["/assets/img/icons/favicon-32x32.png","95f34a47382db8532bf888b5a3cd820b"],["/assets/img/icons/icon-github.svg","7c168f795307b2055ca32145fd52a1f6"],["/assets/img/icons/icon-instagram.svg","7c168f795307b2055ca32145fd52a1f6"],["/assets/img/icons/icon-twitter.svg","7c168f795307b2055ca32145fd52a1f6"],["/assets/img/icons/mstile-150x150.png","95f34a47382db8532bf888b5a3cd820b"],["/assets/img/icons/safari-pinned-tab.svg","7c168f795307b2055ca32145fd52a1f6"],["/assets/img/posts/2020-05-14-11-06-50.png","55383cfecf21283b1b82a19bbeb71323"],["/assets/img/posts/2020-05-14-16-10-02.png","bee1aeaf564f19f648260729f324847b"],["/assets/img/posts/2020-05-14-18-27-25.png","67fe79901781a8b0df6b438cd86dec7f"],["/assets/img/posts/2020-09-12-01-01-01.png","96fd790b6e525df127aff77e5ed5eb06"],["/assets/img/posts/2020-10-11-01-01-01.png","603849fed72242d9ef935d704eac391a"],["/assets/img/posts/2020-10-11-01-01-02.jpg","08e4ae9cda3ab16417da8925b4bdd906"],["/assets/img/posts/2020-12-14-01-01-01.png","5d1868511346bf7b014a525e153e1333"],["/assets/img/posts/2020-12-14-01-01-02.png","57a43d34018a0aadd7b67659a329ccef"],["/assets/img/posts/2020-12-14-01-01-03.png","6799d6bb26cfd0a638b72a5a562fd12d"],["/assets/img/posts/2020-12-14-01-01-04.png","1f2dfb2dc66f97a69f30420c3e58dbac"],["/assets/img/posts/2020-12-14-01-01-05.png","26a51a64de21edaae74de2dbbe400400"],["/assets/img/posts/2020-12-14-01-01-06.png","bc6050a3cd43e238f7a4da950c08708b"],["/assets/img/posts/2020-12-14-01-01-07.png","bb59d671fbfb796482b2eb0143044dd7"],["/assets/img/posts/2020-12-14-01-01-08.png","258c870d5539f9604223a6023c08e015"],["/assets/img/posts/2020-12-14-01-01-09.png","e4f4920f76ce8147f28f6189afd024e6"],["/assets/img/posts/2021-01-15-01-01.png","c448c80a21362594cf400c600dadfcf5"],["/assets/img/posts/2021-01-15-01-02.png","51652e2c6a122d38db61fca9115609f3"],["/assets/img/posts/2021-01-15-01-03.png","09cfd79b40b1294594d4e1235476329e"],["/assets/img/posts/2021-01-15-01-05.png","44bd629ad6377af77f9de4ac16c05adb"],["/assets/img/posts/2021-02-07-01-01.png","3ffb0db6ac5cbb2f5a35bd5f29c5c2f5"],["/assets/img/posts/2021-02-07-01-02.png","f5e18994fde1d14fa503b2d9247b005a"],["/assets/img/posts/2021-02-07-01-03.png","2ee22c92a6f3f133dd1f4cea7c41537c"],["/assets/img/posts/2021-02-07-01-04.png","3d63c4a7d0dd2033a7cbf5902286be98"],["/assets/img/posts/MINIO_wordmark.jpg","1ce811def2b20f135b1200872c18649e"],["/assets/img/posts/MINIO_wordmark_lg.jpg","cfb24ec0b2afd22f1ed2a221d01fd5e4"],["/assets/img/posts/MINIO_wordmark_md.jpg","0b48b4dd1b0374d27780e978812bfc72"],["/assets/img/posts/MINIO_wordmark_placehold.jpg","6d80196705c6fb9ada07af933dd1fc9a"],["/assets/img/posts/MINIO_wordmark_sm.jpg","4b0d7986b614f11157a7e8bbd6da9b52"],["/assets/img/posts/MINIO_wordmark_thumb.jpg","942c2c9bbdf34ccd7c2e88526b798243"],["/assets/img/posts/MINIO_wordmark_thumb@2x.jpg","7b23768b5a54885ea897abe2f278c295"],["/assets/img/posts/MINIO_wordmark_xs.jpg","39da94ffb55041ff09a50769c7d111ed"],["/assets/img/posts/background_image.jpg","74e06f12410e2e202df1f01ac0784167"],["/assets/img/posts/cat.jpg","4976c435c93bf3e4810ab088a3a25274"],["/assets/img/posts/emile-perron-190221.jpg","4705474281b975b7a213b96e71f772e7"],["/assets/img/posts/emile-perron-190221_lg.jpg","aafe35b1dc6d9dc9293c8c2ef4121046"],["/assets/img/posts/emile-perron-190221_md.jpg","03ed35ed656429599daba312f0990a0f"],["/assets/img/posts/emile-perron-190221_placehold.jpg","67f40708f69ab671cee04d624258b85c"],["/assets/img/posts/emile-perron-190221_sm.jpg","4ce4178a62d5a456e90e7bc47bde50f5"],["/assets/img/posts/emile-perron-190221_thumb.jpg","f20085dfe2e36854f8a12f1fd6c50425"],["/assets/img/posts/emile-perron-190221_thumb@2x.jpg","b8fa22c3237de529316037f093b9cb4d"],["/assets/img/posts/emile-perron-190221_xs.jpg","ac32cbd525d72e932499668af5647d03"],["/assets/img/posts/github.jpg","c0f088795ad6088d2354f686dcc31934"],["/assets/img/posts/github_md.jpg","c0f088795ad6088d2354f686dcc31934"],["/assets/img/posts/github_placehold.jpg","c0f088795ad6088d2354f686dcc31934"],["/assets/img/posts/github_sm.jpg","c0f088795ad6088d2354f686dcc31934"],["/assets/img/posts/github_thumb.jpg","c0f088795ad6088d2354f686dcc31934"],["/assets/img/posts/github_thumb@2x.jpg","c0f088795ad6088d2354f686dcc31934"],["/assets/img/posts/github_xs.jpg","c0f088795ad6088d2354f686dcc31934"],["/assets/img/posts/gitlab.jpg","6d65bc46fe03a4ebee9e6626234708ac"],["/assets/img/posts/gitlab_lg.jpg","6d65bc46fe03a4ebee9e6626234708ac"],["/assets/img/posts/gitlab_md.jpg","6d65bc46fe03a4ebee9e6626234708ac"],["/assets/img/posts/gitlab_placehold.jpg","c7a691d9903c4fb1f35634fc0cbaa108"],["/assets/img/posts/gitlab_sm.jpg","6d65bc46fe03a4ebee9e6626234708ac"],["/assets/img/posts/gitlab_thumb.jpg","6d65bc46fe03a4ebee9e6626234708ac"],["/assets/img/posts/gitlab_thumb@2x.jpg","6d65bc46fe03a4ebee9e6626234708ac"],["/assets/img/posts/gitlab_xs.jpg","6d65bc46fe03a4ebee9e6626234708ac"],["/assets/img/posts/harbor_logo.jpg","2b7699d8e7cac01ad26ab6f34644fd61"],["/assets/img/posts/harbor_logo_lg.jpg","ae7ab0f867169d75ff8633501e7deeef"],["/assets/img/posts/harbor_logo_md.jpg","dd353f1a75fadeca60fe9575d90aac0a"],["/assets/img/posts/harbor_logo_placehold.jpg","14bdd2ed93f0316ebb394a01202a1725"],["/assets/img/posts/harbor_logo_sm.jpg","e84b3986beb56f6daf831a0c7c993f16"],["/assets/img/posts/harbor_logo_thumb.jpg","ee3b6647a8c03d04fe8a8879b35299b8"],["/assets/img/posts/harbor_logo_thumb@2x.jpg","ea3287706473c593bb0c841e08a88986"],["/assets/img/posts/harbor_logo_xs.jpg","092804ecbc50becd610965e3c180b521"],["/assets/img/posts/javascript.jpg","3f7d3b31bf8123750a76a0d0c597168b"],["/assets/img/posts/javascript_md.jpg","3f7d3b31bf8123750a76a0d0c597168b"],["/assets/img/posts/javascript_placehold.jpg","3f7d3b31bf8123750a76a0d0c597168b"],["/assets/img/posts/javascript_sm.jpg","3f7d3b31bf8123750a76a0d0c597168b"],["/assets/img/posts/javascript_thumb.jpg","3f7d3b31bf8123750a76a0d0c597168b"],["/assets/img/posts/javascript_thumb@2x.jpg","3f7d3b31bf8123750a76a0d0c597168b"],["/assets/img/posts/javascript_xs.jpg","3f7d3b31bf8123750a76a0d0c597168b"],["/assets/img/posts/keyboard-886462_1920.jpg","106810f156bd7b33c3c7c9e34c4b92db"],["/assets/img/posts/keyboard-886462_1920_lg.jpg","106810f156bd7b33c3c7c9e34c4b92db"],["/assets/img/posts/keyboard-886462_1920_md.jpg","06fa861b603d1d8f8307b166fbec53e3"],["/assets/img/posts/keyboard-886462_1920_placehold.jpg","362bfca3f2850d0dd504af03c9430270"],["/assets/img/posts/keyboard-886462_1920_sm.jpg","59606247a62c943a7aadb52224a59516"],["/assets/img/posts/keyboard-886462_1920_thumb.jpg","0cf9084473175094a60afb349538f224"],["/assets/img/posts/keyboard-886462_1920_thumb@2x.jpg","fc5b41bf1de4b28d0982269d81c2b9f4"],["/assets/img/posts/keyboard-886462_1920_xs.jpg","5ac7f30ffce8a6b70005634d9a6168b7"],["/assets/img/posts/microsoft.jpg","e9d7bfbdde1c1b539dd33bc898e7bb6f"],["/assets/img/posts/microsoftLogo.jpg","0adb3c6592c54682159ed4b51bc97469"],["/assets/img/posts/microsoftLogo_md.jpg","0adb3c6592c54682159ed4b51bc97469"],["/assets/img/posts/microsoftLogo_placehold.jpg","0adb3c6592c54682159ed4b51bc97469"],["/assets/img/posts/microsoftLogo_sm.jpg","0adb3c6592c54682159ed4b51bc97469"],["/assets/img/posts/microsoftLogo_thumb.jpg","0adb3c6592c54682159ed4b51bc97469"],["/assets/img/posts/microsoftLogo_thumb@2x.jpg","0adb3c6592c54682159ed4b51bc97469"],["/assets/img/posts/microsoftLogo_thumb_xs.jpg","0adb3c6592c54682159ed4b51bc97469"],["/assets/img/posts/microsoft_md.jpg","e9d7bfbdde1c1b539dd33bc898e7bb6f"],["/assets/img/posts/microsoft_placehold.jpg","e9d7bfbdde1c1b539dd33bc898e7bb6f"],["/assets/img/posts/microsoft_sm.jpg","e9d7bfbdde1c1b539dd33bc898e7bb6f"],["/assets/img/posts/microsoft_thumb.jpg","e9d7bfbdde1c1b539dd33bc898e7bb6f"],["/assets/img/posts/microsoft_thumb@2x.jpg","e9d7bfbdde1c1b539dd33bc898e7bb6f"],["/assets/img/posts/microsoft_xs.jpg","e9d7bfbdde1c1b539dd33bc898e7bb6f"],["/assets/img/posts/objects_1920.jpg","3717d3b2a500b35fb459b940d555dd11"],["/assets/img/posts/objects_1920_lg.jpg","3717d3b2a500b35fb459b940d555dd11"],["/assets/img/posts/objects_1920_md.jpg","44a38eaa2086802f7e248cd542155853"],["/assets/img/posts/objects_1920_placehold.jpg","d8729b856eea1225b1e65c406aa426a2"],["/assets/img/posts/objects_1920_sm.jpg","7381869402d55d58ac570697b32d0d94"],["/assets/img/posts/objects_1920_thumb.jpg","5d14bf5543ad030005540cb67247fc55"],["/assets/img/posts/objects_1920_thumb@2x.jpg","a44f7b15f049ae7836e5efc1efe9588a"],["/assets/img/posts/objects_1920_xs.jpg","cf677ccc55f0ab9cce22828fa0ace120"],["/assets/img/posts/office1.jpg","882e4507be605e2de91bde1ff896ab67"],["/assets/img/posts/office1_lg.jpg","882e4507be605e2de91bde1ff896ab67"],["/assets/img/posts/office1_md.jpg","201bea9e1d219dba6567bd7975e6b267"],["/assets/img/posts/office1_placehold.jpg","b38eaa013f258aa5c9ee54d846d55f5c"],["/assets/img/posts/office1_sm.jpg","fd39c3b7a04753f2669b7384f1972591"],["/assets/img/posts/office1_thumb.jpg","f7f310befc818a92767ae7748df9dd56"],["/assets/img/posts/office1_thumb@2x.jpg","c97ff87d607f15a61ae6600e12a6b7f7"],["/assets/img/posts/office1_xs.jpg","c12434370a115b25d9ea0b3cce55df88"],["/assets/img/posts/shane-rounce-205187.jpg","bb774d6e05b2b55ffdabe11a8aac7c56"],["/assets/img/posts/shane-rounce-205187_lg.jpg","83cd838024fff9c3faec59fa1da97872"],["/assets/img/posts/shane-rounce-205187_md.jpg","628cf27bf658cf6de9df79ab9bf2cb2d"],["/assets/img/posts/shane-rounce-205187_placehold.jpg","249fc4a09bcfcbd7d5764f14c14ae82e"],["/assets/img/posts/shane-rounce-205187_sm.jpg","a2400a468e10d7d64528ac9c6bc3b6f0"],["/assets/img/posts/shane-rounce-205187_thumb.jpg","c3b2dd0d95a6d3a44d7702f8c06b1e78"],["/assets/img/posts/shane-rounce-205187_thumb@2x.jpg","b0722b63a92c92a44cd92c0201fc92a4"],["/assets/img/posts/shane-rounce-205187_xs.jpg","cd58fd23f3b3c1de2183beb9ed08327b"],["/assets/img/posts/shell_script.jpg","aeabb0e8cb213c9c5509fe5288256714"],["/assets/img/posts/shell_script_lg.jpg","aeabb0e8cb213c9c5509fe5288256714"],["/assets/img/posts/shell_script_md.jpg","aeabb0e8cb213c9c5509fe5288256714"],["/assets/img/posts/shell_script_placehold.jpg","4afc8763e742f3fa9e11da9bdac9e576"],["/assets/img/posts/shell_script_sm.jpg","aeabb0e8cb213c9c5509fe5288256714"],["/assets/img/posts/shell_script_thumb.jpg","aeabb0e8cb213c9c5509fe5288256714"],["/assets/img/posts/shell_script_thumb@2x.jpg","aeabb0e8cb213c9c5509fe5288256714"],["/assets/img/posts/shell_script_xs.jpg","aeabb0e8cb213c9c5509fe5288256714"],["/assets/img/posts/sleek.jpg","a32252a618ffe8ae57c9ce9ab157a01b"],["/assets/img/posts/sleek_lg.jpg","894fb712fa7f728d4837c81e54672fb1"],["/assets/img/posts/sleek_md.jpg","4e35ceb2f5fffd3d758fade699b0b85a"],["/assets/img/posts/sleek_placehold.jpg","0f48050cd7776895b98c6ce21597ff39"],["/assets/img/posts/sleek_sm.jpg","f30af3d30b7df905d962e494750f5da0"],["/assets/img/posts/sleek_thumb.jpg","f7b8a94ac9da8e5ea36bb9e459872400"],["/assets/img/posts/sleek_thumb@2x.jpg","e67e2129dc58a100b98a5e027c964dbc"],["/assets/img/posts/sleek_xs.jpg","c8212cace6d446950556a3bf6efe4520"],["/assets/img/posts/typewriter-2653187_1280.jpg","83f60d39c7a36a828b3cc3aa43f709cd"],["/assets/img/posts/typewriter-2653187_1280_lg.jpg","83f60d39c7a36a828b3cc3aa43f709cd"],["/assets/img/posts/typewriter-2653187_1280_md.jpg","6be0183472183bb0e75c30a98892db3d"],["/assets/img/posts/typewriter-2653187_1280_placehold.jpg","45ef0a23e7b255165131c37d504dd6e5"],["/assets/img/posts/typewriter-2653187_1280_sm.jpg","0eba50790e002a660408864881ca27f7"],["/assets/img/posts/typewriter-2653187_1280_thumb.jpg","9d71acb87e708cdbb20c48a007fdbe61"],["/assets/img/posts/typewriter-2653187_1280_thumb@2x.jpg","a99432f41712ed121482f8c92c32af77"],["/assets/img/posts/typewriter-2653187_1280_xs.jpg","57514f52e5da2a28f75a9a89b93cc525"],["/assets/js/bundle.js","d4279d1ea0bfc40037df5c3520733c9e"],["/blog/index.html","6499cd6efa9dac0f38f35e5b6aa9d621"],["/categories/index.html","3fc9274f2f6d702d973da972c56c4c21"],["/cicd_gitlab_eks/index.html","bd1361cf01a1eeccec26fbc6e6f83371"],["/contact/index.html","ed4a23b3a9971aeb039e8d1983d751b8"],["/devlog/index.html","3b175044527e0e9e3d04f70424ad019a"],["/eks_kubeflow/index.html","aca28e1fca53b55dc072a8704819ffb1"],["/google550847096e1f8b00.html","9575e212998fbede697a924faaba5029"],["/gulpfile.babel.js","499ef2edde6e9b4fbafcb7c6f0cbc725"],["/harbor_minio_standalone/index.html","3fea2489cce706271136d7ccb667246c"],["/index.html","c84c5c483bf5d3f72b5cb6437a8a5b56"],["/kfserving_custum_inference/index.html","9e1be4f1eca657a5e0a70ea5f58bfa4a"],["/kfserving_custum_mobilenet/index.html","1c51ee72aac1e93f9fd53b585b810e10"],["/minio_distribuited_1/index.html","69d57f611ca8ac8f38c4e1b4ba5903c3"],["/nvidia_triton_server_1/index.html","21bb76f9e490bd74df10c1f849bee9c6"],["/shell_script_book_review/index.html","77840b81be6b5af0a1b33034e676196d"],["/sw.js","2e4dd1525e472b33b2bbf06ab365da8b"],["/tags/index.html","11b3cc21a5f24ed0d0057cd1418d64e2"]];
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







