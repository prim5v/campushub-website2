// // src/utils/ErrorSocket.js

// const ERROR_EVENT = "app:error";

// export const ErrorSocket = {
//   emit(error) {
//     window.dispatchEvent(
//       new CustomEvent(ERROR_EVENT, {
//         detail: {
//           message: error.message || "Unknown error",
//           status: error.status || null,
//           data: error.data || null,
//           raw: error,
//         },
//       })
//     );
//   },

//   on(handler) {
//     const listener = (e) => handler(e.detail);
//     window.addEventListener(ERROR_EVENT, listener);
//     return () => window.removeEventListener(ERROR_EVENT, listener);
//   },
// };


// src/utils/ErrorSocket.js
import * as Sentry from "@sentry/react";

const ERROR_EVENT = "app:error";

export const ErrorSocket = {
  emit(error) {
    const payload = {
      message: error.message || "Unknown error",
      status: error.status || null,
      data: error.data || null,
      raw: error,
    };

    // Emit global event
    window.dispatchEvent(
      new CustomEvent(ERROR_EVENT, { detail: payload })
    );

    // 🔹 Report to Sentry
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      // fallback for non-Error objects
      Sentry.captureMessage(JSON.stringify(payload), "error");
    }
  },

  on(handler) {
    const listener = (e) => handler(e.detail);
    window.addEventListener(ERROR_EVENT, listener);
    return () => window.removeEventListener(ERROR_EVENT, listener);
  },
};