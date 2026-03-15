import PusherClient from "pusher-js";

declare global {
 
  var pusherClientInstance: PusherClient | undefined;
}

const pusherClient =
  globalThis.pusherClientInstance ??
  new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.pusherClientInstance = pusherClient;
}

export default pusherClient;
