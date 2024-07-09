import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";
import AppContainer from "./AppContainer";
// import { getToken, onMessage, messaging } from "./firebase";
// import { useEffect } from "react";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const container = document.getElementById("root")!;
const root = createRoot(container);

const App = () => {
  // useEffect(() => {
  //   const requestPermission = async () => {
  //     try {
  //       console.log("Requesting notification permission...");
  //       const permission = await Notification.requestPermission();
  //       console.log("Notification permission status:", permission);

  //       if (permission === "granted") {
  //         console.log("Permission granted. Getting FCM token...");
  //         const token = await getToken(messaging, {
  //           vapidKey:
  //             "BBplExDKjoCJf0OqPUHvz9-l2G3FKkQ9GRPF3rYX8vJQghUEY6_CnZUQ3p8FU7nEVAQ-zLC-BOaquD2oNg7vt6k",
  //         });
  //         if (token) {
  //           console.log("FCM Token:", token);
  //           const clientBaseUrl =
  //             process.env.NODE_ENV === "development"
  //               ? "https://localhost:5000"
  //               : "https://psychedevs.com";

  //           console.log("Sending token to server...");
  //           await fetch(`${clientBaseUrl}/save-token`, {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({ token }),
  //           });
  //           console.log("Token sent to server successfully.");
  //         } else {
  //           console.log(
  //             "No registration token available. Request permission to generate one."
  //           );
  //         }
  //       } else {
  //         console.log("Notification permission denied (no token).");
  //       }
  //     } catch (err) {
  //       console.log("An error occurred while retrieving token.", err);
  //     }
  //   };

  //   requestPermission();

  //   onMessage(messaging, (payload: any) => {
  //     console.log("Message received. ", payload);
  //     // Show notification
  //     new Notification(payload.notification.title, {
  //       body: payload.notification.body,
  //       icon: payload.notification.icon,
  //     });
  //   });
  // }, []);

  // const sendNotification = async () => {
  //   const clientBaseUrl =
  //     process.env.NODE_ENV === "development"
  //       ? "https://localhost:5000"
  //       : "https://psychedevs.com";

  //   try {
  //     const response = await fetch(
  //       `${clientBaseUrl}/notification/send-notification`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           title: "Test Notification",
  //           body: "This is a test notification from the UI",
  //         }),
  //       }
  //     );
  //     if (response.ok) {
  //       console.log("Notification sent successfully");
  //     } else {
  //       console.error("Failed to send notification");
  //     }
  //   } catch (error) {
  //     console.error("Error sending notification:", error);
  //   }
  // };

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContainer />
        {/*<button onClick={sendNotification}>Send Test Notification</button>*/}
      </BrowserRouter>
    </Provider>
  );
};

root.render(<App />);

reportWebVitals();

serviceWorkerRegistration.register();
