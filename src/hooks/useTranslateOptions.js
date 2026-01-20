// hooks/useSyncLanguage.js
import { useEffect } from "react";
import { useTranslation } from "react-i18next";


export function useSyncLanguage(language) {

    const { i18n } = useTranslation()

    useEffect(() => {
        if (language && i18n.language !== language) {
            i18n.changeLanguage(language);
        }
    }, [language, i18n]);
}