import { useCallback, useEffect, useRef } from "react";

const EmailViewer = ({ email }: { email: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updateIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return () => {};

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      console.warn("Cannot access iframe document");
      return () => {};
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * {
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>${email}</body>
      </html>
    `);
    doc.close();

    const adjustHeight = () => {
      if (iframe.contentDocument?.body) {
        const height = iframe.contentDocument.body.scrollHeight;
        iframe.style.height = `${height + 20}px`; // Add padding
      }
    };

    iframe.addEventListener("load", adjustHeight);
    // Handle dynamic content (e.g., images)
    const observer = new MutationObserver(adjustHeight);
    observer.observe(doc.body, { childList: true, subtree: true });

    return () => {
      iframe.removeEventListener("load", adjustHeight);
      observer.disconnect();
    };
  }, [email]);

  useEffect(() => {
    const cleanup = updateIframe();
    return cleanup;
  }, [updateIframe]);

  return (
    <iframe
      ref={iframeRef}
      title="Email Content"
      sandbox="allow-same-origin allow-popups"
      style={{
        width: "100%",
        border: "none",
        display: "block",
        minHeight: "100px",
      }}
    />
  );
};

export default EmailViewer;
