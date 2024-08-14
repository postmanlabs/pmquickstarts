((window, document) => {
  "use strict";

  const app = () => {
    // Grab a reference to our auto-binding template
    // and give it some initial binding values
    // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
    let app = document.querySelector("#app");

    app.categoryStartCards = {};
    // Tags which should always be kept for filtering,
    // no matter what.
    // Populated in the reconstructFromURL.
    app.kioskTags = [];

    // template is="dom-bind" has stamped its content.
    app.addEventListener("dom-change", function (e) {
      // Use element's protected _readied property to signal if a dom-change
      // has already happened.
      if (app._readied) {
        return;
      }

      // Calculate category offsets.
      var cards = document.querySelectorAll(".codelab-card");
      Array.prototype.forEach.call(cards, function (card, i) {
        var category = card.getAttribute("data-category");
        if (app.categoryStartCards[category] === undefined) {
          app.categoryStartCards[category] = card;
        }
      });
    });

    app.codelabUrl = function (view, codelab) {
      var codelabUrlParams = "index=" + encodeURIComponent("../.." + view.url);
      if (view.ga) {
        codelabUrlParams += "&viewga=" + view.ga;
      }
      return codelab.url + "?" + codelabUrlParams;
    };

    app.sortBy = function (e, detail) {
      var order = detail.item.textContent.trim().toLowerCase();
      this.$.cards.sort(order);
    };

    app.filterBy = function (e, detail) {
      if (detail.hasOwnProperty("selected")) {
        this.$.cards.filterByCategory(detail.selected);
        return;
      }
      detail.kioskTags = app.kioskTags;
      this.$.cards.filter(detail);
    };

    app.onCategoryActivate = function (e, detail) {
      var item = e.target.selectedItem;
      if (item && item.getAttribute("filter") === detail.selected) {
        detail.selected = null;
      }
      if (!detail.selected) {
        this.async(function () {
          e.target.selected = null;
        });
      }
      this.filterBy(e, { selected: detail.selected });

      // Update URL deep link to filter.
      var params = new URLSearchParams(window.location.search.slice(1));
      params.delete("cat"); // delete all cat params
      if (detail.selected) {
        params.set("cat", detail.selected);
      }

      // record in browser history to make the back button work
      var url = window.location.pathname;
      var search = "?" + params;
      if (search !== "?") {
        url += search;
      }
      window.history.pushState({}, "", url);

      updateLuckyLink();
    };

    function updateLuckyLink() {
      var luckyLink = document.querySelector(".js-lucky-link");
      if (!luckyLink) {
        return;
      }
      var cards = app.$.cards.querySelectorAll(".codelab-card");
      if (cards.length < 2) {
        luckyLink.href = "#";
        luckyLink.parentNode.style.display = "none";
        return;
      }
      var i = Math.floor(Math.random() * cards.length);
      luckyLink.href = cards[i].href;
      luckyLink.parentNode.style.display = null;
    }

    var chips = document.querySelector("#chips");

    /**
     * Highlights selected chips identified by tags.
     * @param {!string|Array<!string>}
     */
    function selectChip(tags) {
      if (!chips) {
        return;
      }
      tags = Array.isArray(tags) ? tags : [tags];
      var chipElems = chips.querySelectorAll(".js-chips__item");
      for (var i = 0; i < chipElems.length; i++) {
        var el = chipElems[i];
        if (tags.indexOf(el.getAttribute("filter")) != -1) {
          el.classList.add("selected");
        } else {
          el.classList.remove("selected");
        }
      }
    }

    if (chips) {
      chips.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Make sure the click was on a chip.
        var tag = e.target.getAttribute("filter");
        if (!tag) {
          return;
        }
        // Remove or add the selected class.
        e.target.classList.toggle("selected");
        // Collect all selected chips.
        var tags = [];
        var chipElems = chips.querySelectorAll(".js-chips__item.selected");
        for (var i = 0; i < chipElems.length; i++) {
          var t = chipElems[i].getAttribute("filter");
          if (t) {
            tags.push(t);
          }
        }
        // Re-run the filter and select a new random codelab
        // from the filtered subset.
        app.filterBy(null, { tags: tags });
        updateLuckyLink();
      });
    }

    app.reconstructFromURL = function () {
      var params = new URLSearchParams(window.location.search.slice(1));
      var cat = params.get("cat");
      var tags = params.getAll("tags");
      var filter = params.get("filter");
      var i = tags.length;
      while (i--) {
        if (tags[i] === "kiosk" || tags[i].substr(0, 6) === "kiosk-") {
          app.kioskTags.push(tags[i]);
          tags.splice(i, 1);
        }
      }

      if (this.$.categorylist) {
        this.$.categorylist.selected = cat;
      }
      if (this.$.sidelist) {
        this.$.sidelist.selected = cat;
      }
      if (tags) {
        selectChip(tags);
      }
      this.filterBy(null, { cat: cat, tags: tags });
      if (filter) {
        app.searchVal = filter;
        app.onSearchKeyDown();
      }
      updateLuckyLink();
    };

    // Prevent immediate link navigation.
    app.navigate = function (event) {
      event.preventDefault();

      var go = function (href) {
        window.location.href = href;
      };

      var target = event.currentTarget;
      var wait = target.hasAttribute("data-wait-for-ripple");
      if (wait) {
        target.addEventListener("transitionend", go.bind(target, target.href));
      } else {
        go(target.href);
      }
    };

    app.clearSearch = function (e, detail) {
      this.searchVal = null;
      this.$.cards.filterByText(null);
    };

    app.onSearchKeyDown = function (e, detail) {
      this.debounce(
        "search",
        function () {
          this.$.cards.filterByText(app.searchVal);
        },
        250
      );
    };

    return app;
  };

  // unregisterServiceWorker removes the service worker. We used to use SW, but
  // now we don't. This is for backwards-compatibility.
  const unregisterServiceWorker = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.unregister();
      });
    }
  };

  // loadWebComponents checks if web components are supported and loads them if
  // they are not present.
  const loadWebComponents = () => {
    let supported =
      "registerElement" in document &&
      "import" in document.createElement("link") &&
      "content" in document.createElement("template");

    // If web components are supported, we likely missed the event since it
    // fires before the DOM is ready. Re-fire that event.
    if (supported) {
      document.dispatchEvent(new Event("WebComponentsReady"));
    } else {
      let script = document.createElement("script");
      script.async = true;
      script.src =
        "/bower_components/webcomponentsjs/webcomponents-lite.min.js";
      document.head.appendChild(script);
    }
  };

  const init = () => {
    // Unload legacy service worker
    unregisterServiceWorker();

    // load the web components - this will emit WebComponentsReady when finished
    loadWebComponents();
  };

  // Wait for the app to be ready and initalized, and then remove the class
  // hiding the unrendered components on the body. This prevents the FOUC as
  // cards are shuffled into the correct order client-side.
  document.addEventListener("AppReady", () => {
    document.body.classList.remove("loading");
  });

  // Wait for web components to be ready and then load the app.
  document.addEventListener("WebComponentsReady", () => {
    const a = app();

    // TODO: handle forward/backward and filter cards
    window.addEventListener("popstate", () => {
      a.reconstructFromURL();
    });

    // debounce fails with "Cannot read property of undefined" without this
    if (a._setupDebouncers) {
      a._setupDebouncers();
    }

    // Rebuild and sort cards based on the URL
    a.reconstructFromURL();

    // Notify the app is ready
    document.dispatchEvent(new Event("AppReady"));
  });

  // This file is loaded asyncronously, so the document might already be fully
  // loaded, in which case we can drop right into initialization. Otherwise, we
  // need to wait for the document to be loaded.
  if (
    document.readyState === "complete" ||
    document.readyState === "loaded" ||
    document.readyState === "interactive"
  ) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }

  //javascript
  /* pmtSDK
  ******************************************************************************/
  window.pmt=function(){var t={version:"v2.0.32",log:function(e){t.output=t.output||[],t.output.push(e)},url:function(){return window.location.href.startsWith("http")&&window.location.href||""},set:function(e,o){t[e]=o},getPubId:function(){return(document.cookie.match("(^|;) ?_PUB_ID=([^;]*)(;|$)")||[])[2]},drivePubId:function(e){const o=t.url(),n="pub_id=";let a,i;if(o.match(n)){if(i=o.split(n).pop().split("&").shift(),a="_PUB_ID="+i+"; path=/",document.cookie=a,e){let t=o.replace(n+i,"");t=t.replace("?&","?"),t=t.replace("&&","&");t.split("?").pop()||(t=t.split("?").shift());const e=t.length-1;"&"===t.charAt(e)&&(t=t.substring(0,e)),window.location.replace(t)}return a}return t.getPubId()},driveCampaignId:function(e){let o;const n="dcid=",a=e&&e.dcid||window.location.search&&window.location.search.match(n)&&window.location.search.split(n).pop().split("&").shift()||(document.cookie.match("(^|;) ?dcid=([^;]*)(;|$)")||[])[2];let i,c;const r=e&&e.form,s=e&&e.url||t.url();return function(t){const e=t;let o;const i=a&&a.replace(n,"");t&&(e.tagName?a&&!e.driver_campaign_id&&(o=document.createElement("input"),o.type="hidden",o.name="driver_campaign_id",o.value=i,e.appendChild(o)):a&&(e.driver_campaign_id=i))}(r),s.match(n)?(i=s.split(n).pop().split("&").shift(),c=new Date,c.setDate(c.getDate()+30),o="dcid="+i+"; expires="+c.toUTCString()+"; path=/",document.cookie=o,o):e}};return t.enablePostmanAnalytics=function(e,o,n){if("function"!=typeof e||e.postmanAnalyticsEnabled||navigator.doNotTrack&&!o._disableDoNotTrack)return e;function a(t){return t.replace(/"/gi,'"')}function i(t){return"string"==typeof t&&t.split(window.location.host).pop()}return o||(o={}),e.postmanAnalyticsEnabled=!0,function(c,r,s,d,l){const u="load"!==r||t.url()!==t.currentURL;if(!u)return!1;e.apply(this,arguments);const p="gtm.uniqueEventId";let m,f,g,h;const w=r||n;t.initCategory||(t.initCategory=c);const y={category:c,action:w,indexType:"client-events",property:o._property||document.location.host,propertyId:document.location.host,traceId:t.getTraceId(null,o),timestamp:(new Date).toISOString()},I=i(t.currentURL)||document.referrer||t.externalURL||"",b=navigator.language||window.navigator.userLanguage||"?";function k(t,e){const o=t&&t.split(",")||[],n=o.length;let a,i;for(a=0;a<n;a+=1){const t=o[a];if(i=-1!==e.indexOf(t),i)break}return i}y.meta={url:i(I),language:b,user:t.user},s&&(y.entityId=s),l&&(y.meta.user=l),"load"===y.action&&y.entityId&&document.body&&document.body.id&&(y.entityId=y.entityId+"#"+document.body.id),d&&(m=parseInt(d,10),f=m&&!m.isNaN&&m||null,h="string"==typeof d,g=h&&d.match(":")&&d.split(":").pop()||h&&d||"object"==typeof d&&a(JSON.stringify(d))||"",f&&(y.value=f),g&&(s?y.entityId+=":"+g:y.entityId=g)),(Object.keys(o)||[]).forEach((function(t){"_"!==t.charAt(0)&&(y[t]=o[t])})),r||"object"!=typeof c||(y.action=c.action||c.event||c[Object.keys(c)[0]],c[p]&&(y.category=p+"-"+c[p])),"local"===y.env&&(y.env="beta"),"object"==typeof y.category&&y.category&&"string"==typeof y.category.category&&(y.category=y.category.category),["category","event","label"].forEach((function(t){"object"==typeof y[t]&&(y[t]=y[t]&&a(JSON.stringify(y[t])))})),y.userId=t.getPubId()||t.store()&&t.store().userId||y.userId,t.userId=y.userId;const v=t.getTraceId().split("|").pop();t.traceId=t.getTraceId().split(v).shift()+t.userId,-1===window.name.indexOf("PM.")&&(window.name=t.getTraceId()),t.api().store(),setTimeout((function(){t.api()}),1e3);const _=(new Date).getTime();if(t.store("time",t.store().time||_),t.store("elapsed",_-t.store().time),t.store().elapsed>36e5){t.store("time",_),t.store("elapsed",1);let e=t.getTraceId().split("|");e.shift(),e=e.join("|"),t.event&&window.pmt("setScalp",[{property:t.event.property,_traceId:"pm"+btoa((new Date).getTime())+"|"+e}])}return y.category&&y.action&&"function"==typeof o.fetch&&o.fetch(o._url,y)||y.entityId&&"object"==typeof document&&(()=>{const e=o._allow&&k(o._allow,document.location.pathname)||!o._allow&&!0,n=o._disallow&&k(o._disallow,document.location.pathname),a=btoa(JSON.stringify(y));if(e&&!n){if(fetch){if("load"===y.action){if(y.action&&!u)return t.trackIt(),!1;y.entityId=y.entityId.split("#").shift()}t.getTraceId(y),fetch(o._url,{method:"POST",headers:{Accept:"text/html","Content-Type":"text/html"},body:a,mode:"no-cors",keepalive:!0}).catch((function(e){t.log(e)})),t.event=y}else!function(t){const e=new XMLHttpRequest;e.open("POST",o._url),e.setRequestHeader("Accept","application/json"),e.setRequestHeader("Content-type","text/plain"),e.send(t)}(a);t.currentURL=t.url(),-1===y.meta.url.indexOf(document.location.host)&&(t.externalURL=y.meta.url)}})(),!0}},t.ga=function(){"function"==typeof window.ga&&window.ga.apply(this,arguments)},t.getEnv=function(t){let e;e="production";const o=t||document.location.hostname;return["beta","local","stag"].forEach((function(t){o.match(t)&&(e=t)})),e},t.setScalp=function(e){if("object"==typeof window){const o=(document.location.search&&document.location.search.match("dcid=([^;]*)(;|$)")||[])[1],n=o&&o.split("&").shift()||(document.cookie.match("(^|;) ?dcid=([^;]*)(;|$)")||[])[2],a=document.location.search.substr(1).split("&"),i=window.localStorage.getItem("utms"),c=i&&i.split(",")||[];a.forEach((t=>{const e=t.match("([UTM|utm].*)=([^;]*)(;|$)");e&&(-1!==e[0].indexOf("utm")||-1!==e[0].indexOf("UTM"))&&c.push(e[0])}));const r=c.length&&c.join(".")||"",s="PM."+btoa((new Date).toISOString()),d=t.getUserId()||window.name&&window.name.match("|PM.")&&window.name.split("|").pop()||t.store()&&t.store().userId;t.store("userId",d||s);const l="pm"+btoa((new Date).getTime());"string"==typeof window.name&&"pm"===window.name.substring(0,2)||(n&&-1===window.name.indexOf("DCID.")?window.name=l+"|DCID."+n+(r&&"|"+r||"")+"|"+(d||s):window.name=l+(r&&"|"+r||"")+"|"+(d||s));const u=e._traceId||window.parent&&window.parent.name||window.name,p=function(){t.scalpCount||(t.scalpCount=0),t.scalpCount+=1},m=t.getPubId()||d||window.name.split("|").pop(),f={env:"function"==typeof t.getEnv&&t.getEnv()||"production",type:"events-website",userId:m,_allow:!e.disallow&&e.allow,_disableDoNotTrack:void 0===e.disableDoNotTrack||e.disableDoNotTrack,_disallow:!e.allow&&e.disallow,_property:e.property||document.location.host,_traceId:u},g=f.env.match("prod")?"https://bi.pst.tech/events":"https://bi-beta.pst.tech/events";f._url=e.url||g,t.store("traceId",u),t.traceId=u,t.userId=m,t.scalp=t.enablePostmanAnalytics(p,f)}},t.getTraceUrl=function(e){const o=-1!==e.indexOf("?")?"&":"?";return e+o+"trace="+t.getTraceId()},t.trace=function(e){document.location.href=t.getTraceUrl(e)},t.getUtmUrl=function(e){const o=-1!==e.indexOf("?")?"&":"?",n=t.traceId.split(".").pop(),a=t.traceId.split("."+n).shift().substr(1).split("."),i=[];return a.forEach((t=>{const e=t.match("([UTM|utm].*)=([^;]*)(;|$)");e&&(-1!==e[0].indexOf("utm")||-1!==e[0].indexOf("UTM"))&&i.push(e[0])})),e+o+(i.length&&i.join("&")||"utm="+document.location.host)},t.utm=function(e){let o=t.getUtmUrl(e);o.match("trace=")||(o=o+"&trace="+t.traceId),document.location.href=o},t.trackClicks=function(e,o){const n=function(n){const a=document.body&&document.body.id&&"#"+document.body.id||"";if(e){const i=n.target.getAttribute(e);i&&t.scalp(o||t.initCategory,"click","target",a+i)}else if(!e&&("string"==typeof n.target.className||"string"==typeof n.target.id)){const e=n.target.className||n.target.id||n.target.parentNode.className||-1;if("string"==typeof e){const i=document.location.pathname+a+":"+n.target.tagName+"."+e.split(" ").join("_");try{t.scalp(o||t.initCategory,"click",i)}catch(e){t.log(e.message)}}}};document.body.getAttribute("data-trackClicks")||document.body.addEventListener("mousedown",n,!0),document.body.setAttribute("data-trackClicks",e||"default")},t.driveTrack=function(e){let o;const n="_track=",a=e&&e._track||window.location.search&&window.location.search.match(n)&&window.location.search.split(n).pop().split("&").shift()||(document.cookie.match("(^|;) ?"+n+"([^;]*)(;|$)")||[])[2],i=e&&e.url||t.url(),c=t.getEnv(),r=c.match("stag")?"stage":c;return t.tracking=!0,t.trackIt(),i.match(n)?(o="postman-"+r+".track="+a+"; path=/",document.cookie=o,o):e},t.trackIt=function(){const e=(document.cookie.match("(^|;) ?postman-[a-z]+.track=([^;]*)(;|$)")||[])[2];if(e&&t.tracking){let o=t.url();const n=-1===o.indexOf("?")?"?":"&";-1===o.indexOf("_track")&&"default"!==e&&(o=`${o}${n}_track=${e}`,document.location.replace(o))}},t.xhr=function(t,e){const o=new XMLHttpRequest,n="t="+(new Date).getTime(),a=-1===t.indexOf("?")?"?":"&",i=t+a+n;o.withCredentials=!0,o.addEventListener("readystatechange",(function(){4===this.readyState&&e(this.responseText)})),o.open("GET",i),o.send()},t.bff=function(e,o,n){const a=(n?"/mkapi/":"https://www.postman.com/mkapi/")+e+".json";t.xhr(a,o)},t.store=function(e,o){const n=(document.cookie.match("(^|;) ?_pm.store=([^;]*)(;|$)")||[])[2],a=n&&JSON.parse(n)||{};t.stored={...a},e&&o&&(t.stored[e]=o);const i=document.location.host.split("."),c=i.pop(),r=i.pop(),s=new Date;s.setDate(s.getDate()+1080);let d="_pm.store="+JSON.stringify(t.stored)+"; expires="+s.toUTCString()+"; domain=."+r+"."+c+"; path=/";if(!r){const t=d.split("domain=").pop().split(";").shift();d=d.replace(t,"localhost")}return document.cookie=d,t.stored},t.getTraceIdFromUrl=function(){const e="trace=",o=t.url(),n=o.match(e)&&o.split(e).pop().split("&").shift();return n&&t.store("traceId",n),n},t.getTraceId=function(e,o){const n=t.getTraceIdFromUrl()||t.store().traceId||t.traceId||o&&o._traceId||"";return n&&e&&(e.traceId=n),n},t.getUserId=function(e){const o=t.getTraceId().split("|").pop()||t.store().userId||t.userId||"";return o&&e&&(e.userId=o),o},t.api=function(e){"object"==typeof e&&Object.keys(e).forEach((function(t){window[t]=e[t]}));const o=window.pm,n=o&&o.billing,a=n&&n.plan,i=a&&a.features;if(i){const e=i&&i.is_paid_plan_growth,o=e&&e.value,n=i&&i.is_enterprise_plan_growth,a=(n&&n.value?"enterprise":o&&"paid")||"free";t.store("plan",a)}return t},setTimeout((function(){const t=document.getElementById("pmtSDK"),e=t&&t.getAttribute("data-track-category")||"pm-analytics",o=t&&t.getAttribute("data-track-property"),n=t&&t.getAttribute("data-track-url"),a=t&&"false"!==t.getAttribute("data-track-disable-do-not-track"),i=t&&"true"===t.getAttribute("data-drive-track"),c=t&&"false"!==t.getAttribute("data-drive-campaign-id"),r=t&&"false"!==t.getAttribute("data-drive-pub-id"),s=t&&"false"!==t.getAttribute("data-track-load"),d=t&&"false"!==t.getAttribute("data-track-clicks"),l=d&&t.getAttribute("data-track-clicks-attribute")||null;if(o){const t={property:o};n&&(t.url=n),a&&(t.disableDoNotTrack=a),window.pmt("setScalp",[t]),s&&window.pmt("scalp",[e,"load",document.location.pathname]),d&&window.pmt("trackClicks",[l,e]),c&&window.pmt("driveCampaignId"),r&&window.pmt("drivePubId",[!0]),i&&window.pmt("driveTrack")}}),1e3),function(e,o){return t[e]?"function"==typeof t[e]?t[e].apply(t,o):t[e]:null}}();
  /* pmtConfig ******************************************************************************/
  window.pmt('setScalp', [{ property: 'quickstarts-postman' }]);
  window.pmt('scalp', ['pm-analytics', 'load', document.location.pathname]);
  window.pmt('trackClicks', []);
  
})(window, document);
