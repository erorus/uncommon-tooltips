const cssRules = `
#uncommon-tooltip {all: initial}
#uncommon-tooltip * {all: unset}

#uncommon-tooltip {
    font-family: Verdana, "Open Sans", Arial, sans-serif;
    font-size: 9pt;
    line-height: 1.5;

    background-color: rgba(1,7,33,0.8);
    color: white;
    padding: 0.15em 0.4em 0.3em;

    z-index: 10000001;
    max-width: 25em;

    pointer-events: none;
    position: absolute;
    visibility: hidden;
}

#uncommon-tooltip div.icon {
    position: absolute;
    top: -1px;
    left: -4em;
    left: calc(-3.5em - 7px);
    width: 3.5em;
    height: 3.5em;
    background-repeat: no-repeat;
    background-size: cover;
}

#uncommon-tooltip, #uncommon-tooltip .icon {
    box-shadow: 0 0 1px 1px black;
    border: 1px solid;
    border-color: #cfcfcf #777 #7f7f7f;
    border-radius: 4px;
}

#uncommon-tooltip span { display: block }
#uncommon-tooltip span span { display: inline }
#uncommon-tooltip .name { font-size: 116.66667% }
#uncommon-tooltip .right { float: right; margin-left: 4em }
#uncommon-tooltip .nobr { white-space: nowrap }
#uncommon-tooltip .itemset-items { margin-left: 0.5em; display: block }
#uncommon-tooltip .socket.icon { width: 1em; height: 1em; border-radius: 2px; }

#uncommon-tooltip .q {color:#ffd100}
#uncommon-tooltip .q0 {color:#9d9d9d}
#uncommon-tooltip .q1 {color:#ffffff}
#uncommon-tooltip .q2 {color:#1eff00}
#uncommon-tooltip .q3 {color:#0070dd}
#uncommon-tooltip .q4 {color:#a335ee}
#uncommon-tooltip .q5 {color:#ff8000}
#uncommon-tooltip .q6 {color:#e5cc80}
#uncommon-tooltip .q7 {color:#00ccff}
#uncommon-tooltip .q8 {color:#00ccff}
#uncommon-tooltip .q9 {color:#71d5ff}
#uncommon-tooltip .blue {color:#66bbff}
#uncommon-tooltip .red {color:#ff4040}
#uncommon-tooltip .level {color: #ffd100}
#uncommon-tooltip .lit {color: #ffff98}

#uncommon-tooltip .c1 {color:#c69b6d}
#uncommon-tooltip .c2 {color:#f48cba}
#uncommon-tooltip .c3 {color:#aad372}
#uncommon-tooltip .c4 {color:#fff468}
#uncommon-tooltip .c5 {color:#ffffff}
#uncommon-tooltip .c6 {color:#c41e3b}
#uncommon-tooltip .c7 {color:#2359ff}
#uncommon-tooltip .c8 {color:#68ccef}
#uncommon-tooltip .c9 {color:#9382c9}
#uncommon-tooltip .c10 {color:#008467}
#uncommon-tooltip .c11 {color:#ff7c0a}
#uncommon-tooltip .c12 {color:#a330c9}

#uncommon-tooltip .socket {
    width: 0.9em; height: 0.9em;

    border: 1px solid #444;
    background-color: black;
    position: relative;
    display: inline-block;
    vertical-align: text-top;
    margin-right: 0.3em;
    background-image: linear-gradient(45deg, black, #333 45%, #444, #333 55%, black);
}
#uncommon-tooltip .socket .corner { width: 0; height: 0; position: absolute; border: 0 solid #aaa; }
#uncommon-tooltip .socket .corner.top { border-top-width: 0.3em; top: 0; }
#uncommon-tooltip .socket .corner.bottom { border-bottom-width: 0.3em; bottom: 0; }
#uncommon-tooltip .socket .corner.left { border-right-width: 0.3em; border-right-color: transparent !important; left: 0; }
#uncommon-tooltip .socket .corner.right { border-left-width: 0.3em; border-left-color: transparent !important; right: 0; }

#uncommon-tooltip .socket .middle { width: 0; height: 0; position: absolute; border: 0.25em solid transparent; }
#uncommon-tooltip .socket .middle.top { left: calc(50% - 0.25em); top: 0; border-top: 0.25em solid #666; }
#uncommon-tooltip .socket .middle.left { top: calc(50% - 0.25em); left: 0; border-left: 0.25em solid #666; }
#uncommon-tooltip .socket .middle.bottom { left: calc(50% - 0.25em); bottom: 0; border-bottom: 0.25em solid #666; }
#uncommon-tooltip .socket .middle.right { top: calc(50% - 0.25em); right: 0; border-right: 0.25em solid #666; }

#uncommon-tooltip .socket.prismatic:after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background-image: linear-gradient(135deg, rgba(192,0,0,0.25), rgba(0,192,0,0.25), rgba(192,0,192,0.25))}

`;

const SocketColors = {
    // outside border, gradient step, gradient middle, corners, middles
    'cogwheel': ['663','553','664','cca','776'],
};

const pointerOffset = 16; // px

var currentLink = null;
var linkResolver = () => { return Promise.resolve(document.createTextNode('error: no resolver')); };

var div = document.createElement('div');
div.id = 'uncommon-tooltip';

exports.init = function() {
    var c, rules = cssRules;
    var x, sides = ['top','left','bottom','right'];
    for (var color in SocketColors) {
        if (!SocketColors.hasOwnProperty(color)) {
            continue;
        }
        c = SocketColors[color];
        rules += '#uncommon-tooltip .socket.' + color + ' {border-color:#' + c[0] + ';background-image: linear-gradient(45deg, black, #' + c[1] + ' 45%, #' + c[2] + ', #' + c[1] + ' 55%, black)} ';
        rules += '#uncommon-tooltip .socket.' + color + ' .corner {border-color:#' + c[3] + '} ';
        for (x = 0; x < sides.length; x++) {
            rules += '#uncommon-tooltip .socket.' + color + ' .middle.' + sides[x] + ' {border-' + sides[x] + '-color: #' + c[4] + '} ';
        }
    }
    addCss(rules);

    document.body.appendChild(div);
    window.addEventListener('mouseover', mouseOver);
    window.addEventListener('mousemove', updatePosition);
};

function mouseOver(evt) {
    if (evt.target == div) {
        return;
    }

    var target = evt.target;
    var step, foundLink = null;

    while (!foundLink && target && target != window) {
        switch (target.tagName) {
            case 'A':
                foundLink = target;
                break;
        }
        if (foundLink) {
            if (foundLink == currentLink) {
                break;
            }
            step = linkResolver(foundLink);
            if (step) {
                currentLink = foundLink;

                populateDiv(foundLink, evt, document.createTextNode('Loading...'));

                step.then(populateDiv.bind(null, foundLink, evt));
            } else {
                foundLink = false;
            }
        }
        target = target.parentNode;
    }

    if (!foundLink && currentLink) {
        currentLink = null;
        emptyDiv();
    }
}

function populateDiv(origLink, evt, fragment) {
    if (currentLink != origLink) {
        return;
    }

    emptyDiv();
    div.appendChild(fragment);
    updatePosition(evt);
    div.style.visibility = 'visible';
}

function emptyDiv() {
    div.style.visibility = 'hidden';
    div.style.top = div.style.left = '-2000px';
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

function updatePosition(evt) {
    if (!currentLink) {
        return;
    }

    var rect = div.getBoundingClientRect();

    var moveUp = (document.documentElement.clientHeight < (evt.clientY + rect.height));
    var moveRight = (document.documentElement.clientWidth < (evt.clientX + rect.width));

    div.style.top = '' + (evt.clientY + window.scrollY + (moveUp ? -1 * rect.height - pointerOffset / 2 : pointerOffset)) + 'px';
    div.style.left = '' + (evt.clientX + window.scrollX + (moveRight ? -1 * rect.width - pointerOffset / 2 : pointerOffset / (moveUp ? 2 : 1))) + 'px';
}

exports.getCurrentLink = function() {
    return currentLink;
};

exports.setLinkResolver = function(f) {
    return linkResolver = f;
};

function makeDivWithClass(cls) {
    var d = document.createElement('div');
    d.className = cls;
    return d;
}

exports.createSocket = function(cls) {
    var d = makeDivWithClass('socket' + (cls ? ' ' + cls : ''));

    d.appendChild(makeDivWithClass('corner top left'));
    d.appendChild(makeDivWithClass('corner top right'));
    d.appendChild(makeDivWithClass('corner bottom left'));
    d.appendChild(makeDivWithClass('corner bottom right'));
    d.appendChild(makeDivWithClass('middle left'));
    d.appendChild(makeDivWithClass('middle right'));
    d.appendChild(makeDivWithClass('middle bottom'));
    d.appendChild(makeDivWithClass('middle top'));

    return d;
};

function addCss(css){
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) {   // IE
        s.styleSheet.cssText = css;
    } else {                // the world
        s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);
}
