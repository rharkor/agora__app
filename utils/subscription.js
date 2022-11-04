import api from "./api";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  // eslint-disable-next-line
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function sendSubscription(subscription) {
  return api.fetch(`notifications/subscribe`, {
    method: "POST",
    body: JSON.stringify({
      subscription,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function subscribeUser(registration) {
  if (!registration.pushManager) {
    console.log("Push manager unavailable.");
    return;
  }

  const convertedVapidKey = urlBase64ToUint8Array(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  );

  registration.pushManager
    .getSubscription()
    .then(function (existedSubscription) {
      if (existedSubscription === null) {
        console.log("No subscription detected, make a request.");
        registration.pushManager
          .subscribe({
            applicationServerKey: convertedVapidKey,
            userVisibleOnly: true,
          })
          .then(function (newSubscription) {
            console.log("New subscription added.", newSubscription);
            sendSubscription(newSubscription);
          })
          .catch(function (e) {
            if (Notification.permission !== "granted") {
              console.log("Permission was not granted.");
            } else {
              console.error(
                "An error ocurred during the subscription process.",
                e
              );
              console.log(
                'If you use brave try to activate "Use Google services for push messaging" in brave://settings/privacy'
              );
            }
          });
      } else {
        sendSubscription(existedSubscription);
      }
    });
}
