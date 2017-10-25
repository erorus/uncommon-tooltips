const cssRules = `
#uncommon-tooltip {all: initial}
#uncommon-tooltip * {all: unset}

#uncommon-tooltip {background-color: white; padding: 10px; border: 1px solid black; pointer-events: none; position: absolute; display: none}
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
        emptyDiv(true);
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
