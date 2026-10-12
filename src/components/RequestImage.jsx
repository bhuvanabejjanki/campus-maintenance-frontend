import { useEffect, useState } from "react";
import api from "../api";

export default function RequestImage({ requestId }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let url;
    let cancelled = false;
    api.get(`/requests/${requestId}/image`, { responseType: "blob" })
      .then(({ data }) => {
        if (cancelled) return;
        url = URL.createObjectURL(data);
        setSrc(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [requestId]);

  if (!src) return null;
  return (
    <a href={src} target="_blank" rel="noreferrer">
      <img className="thumb" src={src} alt="Issue" />
    </a>
  );
}