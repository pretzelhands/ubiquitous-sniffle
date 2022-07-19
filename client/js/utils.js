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
