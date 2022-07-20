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

export {
    classnames,
    setElementText,
    addDynamicEventHandler,
    sendPostRequest,
    formToDictionary
}
