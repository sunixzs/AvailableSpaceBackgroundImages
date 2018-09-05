/**
 *
 */

(function(window) {
    "use strict";

    function AvailableSpaceBackgroundImages(selector) {
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.querySelector = selector || '[data-background-image="enabled"]';
        this.loadingImages = [];
        this.elements = document.querySelectorAll(this.querySelector);
        this.observer = null;
        this.init();
    }

    AvailableSpaceBackgroundImages.prototype = {
        init: function() {
            var self = this;

            // build images data
            var iNum = 0;
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].setAttribute("data-background-image-src", "");
                this.elements[i].setAttribute("data-background-image-num", iNum);
                iNum++;
            }

            // Without observers load everything all
            if (!window.IntersectionObserver) {
                for (var i = 0; i < this.elements.length; i++) {
                    this.loadImage(this.elements[i]);
                }
                return;
            }

            this.observer = new IntersectionObserver(
                function(entries) {
                    for (var i = 0; i < entries.length; i++) {
                        if (entries[i].intersectionRatio > 0) {
                            self.loadImage(entries[i].target);
                        }
                    }
                },
                {
                    root: null,
                    rootMargin: "0px",
                    threshold: [0]
                }
            );

            for (var i = 0; i < this.elements.length; i++) {
                this.observer.observe(this.elements[i]);
            }
        },

        getBestImageSrc: function(element) {
            var targetWidth = element.clientWidth * this.devicePixelRatio;

            if (element.getAttribute("data-background-image-2000") && targetWidth > 1500) {
                return element.getAttribute("data-background-image-2000");
            } else if (element.getAttribute("data-background-image-1500") && targetWidth > 1000) {
                return element.getAttribute("data-background-image-1500");
            } else if (element.getAttribute("data-background-image-1000") && targetWidth > 500) {
                return element.getAttribute("data-background-image-1000");
            } else if (element.getAttribute("data-background-image-500")) {
                return element.getAttribute("data-background-image-500");
            }

            return "";
        },

        loadImage: function(element) {
            var newSrc = this.getBestImageSrc(element),
                self = this;
            if (!newSrc) {
                return;
            }

            if (newSrc !== element.getAttribute("data-background-image-src")) {
                var n = parseInt(element.getAttribute("data-background-image-num"));
                this.loadingImages[n] = new Image();
                this.loadingImages[n].setAttribute("src", newSrc);
                this.loadingImages[n].setAttribute("data-src-num", n);
                this.loadingImages[n].addEventListener("load", function(evt) {
                    var m = parseInt(evt.target.getAttribute("data-src-num"));
                    if (self.elements[m]) {
                        self.elements[m].style.backgroundImage = 'url("' + evt.target.getAttribute("src") + '")';
                    }
                });
            }
        }
    };

    if (typeof define === "function" && define.amd) {
        define(function() {
            return AvailableSpaceBackgroundImages;
        });
    } else {
        window.AvailableSpaceBackgroundImages = AvailableSpaceBackgroundImages;
    }
})(window);
