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
  window.pmt=function(){var t={version:"v2.0.4",log:function(e){t.output=t.output||[],t.output.push(e)},set:function(e,n){t[e]=n},getPubId:function(){return(document.cookie.match("(^|;) ?_PUB_ID=([^;]*)(;|$)")||[])[2]},drivePubId:function(e){const n=window.location.href,o="pub_id=";let c,a;if(n.match(o)){if(a=n.split(o).pop().split("&").shift(),c="_PUB_ID="+a+"; path=/",document.cookie=c,e){let t=n.replace(o+a,"");t=t.replace("?&","?"),t=t.replace("&&","&");t.split("?").pop()||(t=t.split("?").shift());const e=t.length-1;"&"===t.charAt(e)&&(t=t.substring(0,e)),window.location.replace(t)}return c}return t.getPubId()},driveCampaignId:function(t){let e;const n="dcid=",o=t&&t.dcid||window.location.search&&window.location.search.match(n)&&window.location.search.split(n).pop().split("&").shift()||(document.cookie.match("(^|;) ?dcid=([^;]*)(;|$)")||[])[2];let c,a;const i=t&&t.form,r=t&&t.url||window.location.href;return function(t){const e=t;let c;const a=o&&o.replace(n,"");t&&(e.tagName?o&&!e.driver_campaign_id&&(c=document.createElement("input"),c.type="hidden",c.name="driver_campaign_id",c.value=a,e.appendChild(c)):o&&(e.driver_campaign_id=a))}(i),r.match(n)?(c=r.split(n).pop().split("&").shift(),a=new Date,a.setDate(a.getDate()+30),e="dcid="+c+"; expires="+a.toUTCString()+"; path=/",document.cookie=e,e):t},enablePostmanAnalytics:function(e,n,o){if("function"!=typeof e||e.postmanAnalyticsEnabled||navigator.doNotTrack&&!n._disableDoNotTrack)return e;function c(t){return t.replace(/"/gi,'"')}function a(t){return"string"==typeof t&&t.split(window.location.host).pop()}return n||(n={}),e.postmanAnalyticsEnabled=!0,function(i,r,d,s){const l="load"!==r||window.location.href!==t.currentURL;if(!l)return!1;e.apply(this,arguments);const u="gtm.uniqueEventId";let p,m,f,h;const g=r||o;t.initCategory||(t.initCategory=i);const w={category:i,action:g,indexType:"client-events",property:n._property||document.location.host,traceId:t.traceId||n._traceId||"anonymous",timestamp:(new Date).toISOString()},y=a(t.currentURL)||document.referrer||t.externalURL||"";w.meta={url:a(y)},d&&(w.entityId=d),"load"===w.action&&w.entityId&&document.body&&document.body.id&&(w.entityId=w.entityId+"#"+document.body.id),s&&(p=parseInt(s,10),m=p&&!p.isNaN&&p||null,h="string"==typeof s,f=h&&s.match(":")&&s.split(":").pop()||h&&s||"object"==typeof s&&c(JSON.stringify(s))||"",m&&(w.value=m),f&&(d?w.entityId+=":"+f:w.entityId=f));const b=Object.keys(n)||[];function k(t){const e=new XMLHttpRequest;e.open("POST",n._url),e.setRequestHeader("Accept","application/json"),e.setRequestHeader("Content-type","text/plain"),e.send(t)}function I(t,e){const n=t&&t.split(",")||[],o=n.length;let c,a;for(c=0;c<o;c+=1){const t=n[c];if(a=-1!==e.indexOf(t),a)break}return a}b.forEach((function(t){"_"!==t.charAt(0)&&(w[t]=n[t])})),r||"object"!=typeof i||(w.action=i.action||i.event||i[Object.keys(i)[0]],i[u]&&(w.category=u+"-"+i[u])),"local"===w.env&&(w.env="beta"),"object"==typeof w.category&&w.category&&"string"==typeof w.category.category&&(w.category=w.category.category),["category","event","label"].forEach((function(t){"object"==typeof w[t]&&(w[t]=w[t]&&c(JSON.stringify(w[t])))})),w.userId=t.getPubId()||(document.cookie.match("(^|;) ?_pm=([^;]*)(;|$)")||[])[2]||w.userId,t.userId=w.userId;const v=t.traceId.split("|").pop();return t.traceId=t.traceId.split(v).shift()+t.userId,window.name=t.traceId,w.category&&w.action&&"function"==typeof n.fetch&&n.fetch(n._url,w)||w.entityId&&"object"==typeof document&&(()=>{const e=n._allow&&I(n._allow,document.location.pathname)||!n._allow&&!0,o=n._disallow&&I(n._disallow,document.location.pathname),c=btoa(JSON.stringify(w));if(e&&!o){if(fetch){if("load"===w.action){if(w.action&&!l)return t.trackIt(),!1;w.entityId=w.entityId.split("#").shift()}t.traceId&&(w.traceId=t.traceId),fetch(n._url,{method:"POST",headers:{Accept:"text/html","Content-Type":"text/html"},body:c,mode:"no-cors",keepalive:!0}).catch((function(e){t.log(e)})),t.event=w}else k(c);t.currentURL=window.location.href,-1===w.meta.url.indexOf(document.location.host)&&(t.externalURL=w.meta.url)}})(),!0}},ga:function(){"function"==typeof window.ga&&window.ga.apply(this,arguments)},getEnv:function(t){let e;e="production";const n=t||document.location.hostname;return["beta","local","stag"].forEach((function(t){n.match(t)&&(e=t)})),e},setScalp:function(e){if("object"==typeof window){const n=(document.location.search&&document.location.search.match("dcid=([^;]*)(;|$)")||[])[1],o=n&&n.split("&").shift()||(document.cookie.match("(^|;) ?dcid=([^;]*)(;|$)")||[])[2],c=document.location.search.substr(1).split("&"),a=[];c.forEach((t=>{const e=t.match("([UTM|utm].*)=([^;]*)(;|$)");e&&(-1!==e[0].indexOf("utm")||-1!==e[0].indexOf("UTM"))&&a.push(e[0])}));const i=document.location.host.split("."),r=i.pop(),d=i.pop(),s=a.length&&a.join(".")||"",l="PM.",u=l+btoa((new Date).toISOString()),p=window.name&&window.name.match("|PM.")&&window.name.split("|").pop()||(document.cookie.match("(^|;) ?_pm=([^;]*)(;|$)")||[])[2],m=function(t){const e=new Date;return e.setDate(e.getDate()+1080),"_pm="+t+"; expires="+e.toUTCString()+"; domain=."+d+"."+r+"; path=/"};(function(t){const e=-1!==document.cookie.indexOf("_pm"),n=-1===t.indexOf(l),o=-1!==document.cookie.indexOf(l);(!e||n||!window.location.hostname.match(/\.postman.com/)&&o)&&(document.cookie=m(t))})(p||u);const f="pm"+btoa((new Date).getTime());"string"==typeof window.name&&"pm"===window.name.substring(0,2)||(o&&-1===window.name.indexOf("DCID.")?window.name=f+"|DCID."+o+(s&&"|"+s||"")+"|"+(p||u):window.name=f+(s&&"|"+s||"")+"|"+(p||u));const h=window.parent&&window.parent.name||window.name,g=function(){t.scalpCount||(t.scalpCount=0),t.scalpCount+=1},w=t.getPubId()||p||window.name.split("|").pop(),y={env:"function"==typeof t.getEnv&&t.getEnv()||"production",type:"events-website",userId:w,_allow:!e.disallow&&e.allow,_disableDoNotTrack:void 0===e.disableDoNotTrack||e.disableDoNotTrack,_disallow:!e.allow&&e.disallow,_property:e.property||document.location.host,_traceId:h},b=y.env.match("prod")?"https://bi.pst.tech/events":"https://bi-beta.pst.tech/events";y._url=e.url||b,document.cookie="_pm.traceId="+h+"; domain=."+d+"."+r+"; path=/",t.scalp=t.enablePostmanAnalytics(g,y),t.traceId=h,t.userId=w}},getTraceUrl:function(e){const n=-1!==e.indexOf("?")?"&":"?";return e+n+"trace="+t.traceId},trace:function(e){document.location.href=t.getTraceUrl(e)},getUtmUrl:function(e){const n=-1!==e.indexOf("?")?"&":"?",o=t.traceId.split(".").pop(),c=t.traceId.split("."+o).shift().substr(1).split("."),a=[];return c.forEach((t=>{const e=t.match("([UTM|utm].*)=([^;]*)(;|$)");e&&(-1!==e[0].indexOf("utm")||-1!==e[0].indexOf("UTM"))&&a.push(e[0])})),e+n+(a.length&&a.join("&")||"utm="+document.location.host)},utm:function(e){let n=t.getUtmUrl(e);n.match("trace=")||(n=n+"&trace="+t.traceId),document.location.href=n},trackClicks:function(e,n){const o=function(o){const c=document.body&&document.body.id&&"#"+document.body.id||"";if(e){const a=o.target.getAttribute(e);a&&t.scalp(n||t.initCategory,"click","target",c+a)}else if(!e&&("string"==typeof o.target.className||"string"==typeof o.target.id)){const e=o.target.className||o.target.id||o.target.parentNode.className||-1;if("string"==typeof e){const a=document.location.pathname+c+":"+o.target.tagName+"."+e.split(" ").join("_");try{t.scalp(n||t.initCategory,"click",a)}catch(e){t.log(e.message)}}}};document.body.getAttribute("data-trackClicks")||document.body.addEventListener("mousedown",o,!0),document.body.setAttribute("data-trackClicks",e||"default")},driveTrack:function(e){let n;const o="_track=",c=e&&e._track||window.location.search&&window.location.search.match(o)&&window.location.search.split(o).pop().split("&").shift()||(document.cookie.match("(^|;) ?_track=([^;]*)(;|$)")||[])[2],a=e&&e.url||window.location.href,i=t.getEnv(),r=i.match("stag")?"stage":i;return t.tracking=!0,t.trackIt(),a.match(o)?(n="postman-"+r+".track="+c+"; path=/",document.cookie=n,n):e},trackIt:function(){const e=(document.cookie.match("(^|;) ?postman-[a-z]+.track=([^;]*)(;|$)")||[])[2];if(e&&t.tracking){let t=document.location.href;const n=-1===t.indexOf("?")?"?":"&";-1===t.indexOf("_track")&&"default"!==e&&(t=`${t}${n}_track=${e}`,document.location.replace(t))}},xhr:function(t,e){const n=new XMLHttpRequest,o="t="+(new Date).getTime(),c=-1===t.indexOf("?")?"?":"&",a=t+c+o;n.withCredentials=!0,n.addEventListener("readystatechange",(function(){4===this.readyState&&e(this.responseText)})),n.open("GET",a),n.send()},bff:function(e,n,o){const c=(o?"/mkapi/":"https://www.postman.com/mkapi/")+e+".json";t.xhr(c,n)},rt:function(e){t.bff("pmTech",(function(n){if(n){const o="pmTechSDK-runtime";if(!document.getElementById(o))try{const c=JSON.parse(n),a=atob(c.pmTech),i=c.config&&c.config[e];if(-1===a.indexOf(t.version)){const t=document.createElement("script");t.setAttribute("id",o),t.innerHTML=a,document.head.appendChild(t);const e=document.getElementById("pmTechConfig"),n=i||e&&e.innerText||document.getElementById("pmTechSDK").innerText.split("<pmTechConfig>").pop();if(n){const t=document.createElement("script");t.setAttribute("id","pmTechConfig-runtime"),t.innerText=n.split("</pmTechConfig>").shift(),document.head.appendChild(t)}}}catch(e){t.log(e)}}}),"localhost"===document.location.hostname||!!document.location.hostname.match(/\.postman(-beta)?\.com/))}};return t.universal&&t.rt(t.universal),setTimeout((function(){const t=document.getElementById("pmTechSDK"),e=t&&t.getAttribute("data-track-category")||"pm-analytics",n=t&&t.getAttribute("data-track-property"),o=t&&t.getAttribute("data-track-url"),c=t&&"false"!==t.getAttribute("data-track-disable-do-not-track"),a=t&&"true"===t.getAttribute("data-drive-track"),i=t&&"false"!==t.getAttribute("data-drive-campaign-id"),r=t&&"false"!==t.getAttribute("data-drive-pub-id"),d=t&&"false"!==t.getAttribute("data-track-load"),s=t&&"false"!==t.getAttribute("data-track-clicks"),l=s&&t.getAttribute("data-track-clicks-attribute")||null;if(n){const t={property:n};o&&(t.url=o),c&&(t.disableDoNotTrack=c),window.pmt("setScalp",[t]),d&&window.pmt("scalp",[e,"load",document.location.pathname]),s&&window.pmt("trackClicks",[l,e]),i&&window.pmt("driveCampaignId"),r&&window.pmt("drivePubId",[!0]),a&&window.pmt("driveTrack")}}),1e3),function(e,n){return t[e]?"function"==typeof t[e]?t[e].apply(t,n):t[e]:null}}();
  /* pmtConfig ******************************************************************************/
  window.pmt('setScalp', [{ property: 'quickstarts-postman' }]);
  window.pmt('scalp', ['pm-analytics', 'load', document.location.pathname]);
  window.pmt('trackClicks', []);
  
})(window, document);
