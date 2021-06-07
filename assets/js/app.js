var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};

document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();

    var fadings = $(".fading");
    $(window).scroll(function() {
        //the viewport's height
        var vpheight = document.documentElement.clientHeight;
        //loop through all interested elements
        fadings.each(function() {
            //get the rect of the current element
            var r = this.getBoundingClientRect();
            //the current element's height  
            var thisHeight = $(this).height();
            //check if the element is completely out of the viewport area
            //to just ignore it (save some computation)
            if (thisHeight + r.top < 0 || r.top > vpheight) return true;
            //calculate the opacity for partially visible/hidden element
            var opacity = Math.max(0, Math.min(1,
                (r.top >= 0 ? vpheight - r.top : thisHeight - Math.abs(r.top)) / vpheight));
            //set the opacity
            $(this).css("opacity", opacity);
        });
    });
});