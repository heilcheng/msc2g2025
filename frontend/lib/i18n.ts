"use client"

import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import enCommon from "@/locales/en/common.json"
import zhCommon from "@/locales/zh/common.json"

const resources = {
  en: {
    common: enCommon,
  },
  zh: {
    common: zhCommon,
  },
} as const

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: ["en", "zh"],
      defaultNS: "common",
      ns: ["common"],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["querystring", "localStorage", "navigator", "htmlTag"],
        caches: ["localStorage"],
      },
    })
}

export default i18n


