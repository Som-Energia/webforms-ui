// hooks/useSyncLanguage.js
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import 'dayjs/locale/ca'
import 'dayjs/locale/eu'
import 'dayjs/locale/gl'

export function useSyncLanguage(language) {

    const { i18n } = useTranslation()

    useEffect(() => {
        if (language && i18n.language !== language) {
            i18n.changeLanguage(language);
        }
    }, [language, i18n]);
}

export function useSyncDayjsLanguage(language) {

    const { i18n } = useTranslation()

    useEffect(() => {
        if (language && i18n.language !== language) {
            dayjs.locale(language)
        } else {
            dayjs.locale('es')
        }
    }, [language, i18n])
}