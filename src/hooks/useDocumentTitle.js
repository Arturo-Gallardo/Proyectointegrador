import { useEffect } from "react";
import { APP_NAME } from "lib/app";

export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · ${APP_NAME}`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
