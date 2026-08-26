import { useEffect } from "react";

const SITE_NAME = "Tilcons";

export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const previousTitle = document.title;
    document.title = fullTitle;

    let descTag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDesc = descTag?.getAttribute("content") ?? null;
    if (description) {
      if (!descTag) {
        descTag = document.createElement("meta");
        descTag.setAttribute("name", "description");
        document.head.appendChild(descTag);
      }
      descTag.setAttribute("content", description);
    }

    let ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const previousOgTitle = ogTitle?.getAttribute("content") ?? null;
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);

    let ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    const previousOgDesc = ogDesc?.getAttribute("content") ?? null;
    if (ogDesc && description) ogDesc.setAttribute("content", description);

    return () => {
      document.title = previousTitle;
      if (descTag && previousDesc !== null) descTag.setAttribute("content", previousDesc);
      if (ogTitle && previousOgTitle !== null) ogTitle.setAttribute("content", previousOgTitle);
      if (ogDesc && previousOgDesc !== null) ogDesc.setAttribute("content", previousOgDesc);
    };
  }, [title, description]);
}
