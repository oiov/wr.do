const UMAMI_CONFIG = {
  websiteId: "e6f3625a-d2a2-48be-a00a-cc227c9355ea",
  endpoint: "https://umami.biuxin.com/api/send",
};

export async function trackUmamiEvent(
  req: Request,
  eventName: string,
  eventData: any,
) {
  try {
    const ua = req.headers.get("user-agent") || "";
    // console.log("Umami tracking event:", eventName, eventData);

    await fetch(UMAMI_CONFIG.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": ua,
      },
      body: JSON.stringify({
        type: "event",
        payload: {
          name: eventName,
          website: UMAMI_CONFIG.websiteId,
          url: new URL(req.url).pathname,
          data: eventData,
          referrer: `${eventData.referer}?tracker=umami`,
          hostname: new URL(req.url).hostname,
          language: eventData.language,
          screen: "1000x1000",
        },
      }),
    }).catch((err) => console.error("Umami tracking error:", err));
  } catch (error) {
    // 只记录错误，不影响主流程
    console.error("Failed to track Umami event:", error);
  }
}
