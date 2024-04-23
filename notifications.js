chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (!request.message || !request.title) {
            console.error('No message or title provided in the request')
        }
        const notificationOptions = {
            type: 'basic',
            iconUrl: 'robot_farmer.png',
            title: request.title,
            message: request.message,
        };

        chrome.notifications.create('notificationId', notificationOptions);
        sendResponse({ ok: "ok" });
    }
);
