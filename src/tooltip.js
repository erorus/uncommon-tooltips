
var currentLink = null;
var linkResolver = () => { return Promise.resolve(document.createTextNode('error: no resolver')); };

var div = document.createElement('div');

div.style.backgroundColor = 'white';
div.style.padding = '10px';
div.style.border = '1px solid black';

div.style.pointerEvents = 'none';
div.style.position = 'absolute';
div.style.display = 'none';

var loaded = false;
window.addEventListener('load', function() { loaded = true; });

exports.init = function() {
    if (loaded) {
        setup();
    } else {
        window.addEventListener('load', setup);
    }
};

function setup() {
    document.body.appendChild(div);
    window.addEventListener('mouseover', mouseOver);
    window.addEventListener('mousemove', updatePosition);
}

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

    div.style.top = '' + (evt.clientY + 1) + 'px';
    div.style.left = '' + (evt.clientX + 1) + 'px';
}

exports.getCurrentLink = function() {
    return currentLink;
};

exports.setLinkResolver = function(f) {
    return linkResolver = f;
};