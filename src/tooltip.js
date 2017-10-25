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
    display: none;
}

#uncommon-tooltip .icon {
    position: absolute;
    top: -1px;
    left: -5.166667em;
    left: calc(-4.66667em - 7px);
    width: 4.66667em;
    height: 4.66667em;
    background-repeat: no-repeat;
    background-size: cover;
}

#uncommon-tooltip, #uncommon-tooltip .icon {
    box-shadow: 0 0 1px 1px black;
    border: 1px solid;
    border-color: #cfcfcf #777 #7f7f7f;
    border-radius: 4px;
}

#uncommon-tooltip .line { display: block }
#uncommon-tooltip .name { font-size: 116.66667% }
#uncommon-tooltip .level { color: #ffd100 }

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
`;

const pointerOffset = 16; // px

var currentLink = null;
var linkResolver = () => { return Promise.resolve(document.createTextNode('error: no resolver')); };

var div = document.createElement('div');
div.id = 'uncommon-tooltip';

exports.init = function() {
    addCss(cssRules);
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

                updatePosition(evt);
                populateDiv(foundLink, document.createTextNode('Loading...'));

                step.then(populateDiv.bind(null, foundLink));
            } else {
                foundLink = false;
            }
        }
        target = target.parentNode;
    }

    if (!foundLink && currentLink) {
        currentLink = null;
        //emptyDiv(true);
    }
}

function populateDiv(origLink, fragment) {
    if (currentLink != origLink) {
        return;
    }

    emptyDiv();
    div.appendChild(fragment);
    div.style.display = 'block';
}

function emptyDiv(resetPosition) {
    div.style.display = 'none';
    if (resetPosition) {
        div.style.top = div.style.left = '-2000px';
    }
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

function updatePosition(evt) {
    if (!currentLink) {
        return;
    }

    div.style.top = '' + (evt.clientY + pointerOffset) + 'px';
    div.style.left = '' + (evt.clientX + pointerOffset) + 'px';
}

exports.getCurrentLink = function() {
    return currentLink;
};

exports.setLinkResolver = function(f) {
    return linkResolver = f;
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
