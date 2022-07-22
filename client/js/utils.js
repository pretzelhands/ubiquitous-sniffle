function setElementText(parent, id, text) {
    const element = parent.querySelector('#' + id)
    element.innerText = text

    return element
}

/**
 * This ensures that events on elements that are added to the document
 * dynamically are also handled. It's fairly similar to what jQuery does
 * with its `$(document).on('click', element)` delegation.
 */
function addDynamicEventHandler(elementId, eventName, callback) {
    document.addEventListener(eventName, (event) => {
        if (!event.target || event.target.id !== elementId) {
            return;
        }

        callback(event)
    })
}

function sendPostRequest(url, body) {
    return fetch(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    )
}

function formToDictionary(form) {
    let formData = Array.from(form.elements)
        .filter(el => el.name)
        .map(el => ({ [el.name]: el.value }))

    return Object.assign({}, ...formData)
}

/**
 * This function is probably written in a way that is a bit too clever for production use.
 * It's heavily inspired by the idea behind the classnames npm library. In production it makes
 * sense to just pull in that.
 */
function classnames(classes) {
    return Object
        .entries(classes)
        .filter(([_, predicate]) => !!predicate)
        .map(([classNames]) => classNames)
        .join(' ')
}

const units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: 24 * 60 * 60 * 1000 * 365/12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000
}


function dateToRelativeTime(date) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const timeAgo = new Date(date.replace(" ", "T")) - new Date()

    for (const u in units) {
        if (Math.abs(timeAgo) > units[u] || u === 'second') {
            return rtf.format(Math.round(timeAgo / units[u]), u)
        }
    }
}

export {
    classnames,
    setElementText,
    addDynamicEventHandler,
    sendPostRequest,
    formToDictionary,
    dateToRelativeTime
}
