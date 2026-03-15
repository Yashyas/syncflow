import Pusher from "pusher";

declare global {
  var pusherServerInstance: Pusher | undefined;
}

const pusherServer =
  globalThis.pusherServerInstance ??
  new Pusher({
    appId:   process.env.PUSHER_APP_ID!,   
    key:     process.env.PUSHER_KEY!,
    secret:  process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS:  true,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.pusherServerInstance = pusherServer;
}

export default pusherServer;
