"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "react-i18next"
import i18n from "@/lib/i18n"
import { useEffect, useMemo } from "react"

export default function LanguageSwitcher() {
  const { i18n: i18nextInstance } = useTranslation()

  const current = useMemo(() => {
    const lang = i18nextInstance.language || i18n.language || "en"
    if (lang.startsWith("zh")) return "zh"
    if (lang.startsWith("en")) return "en"
    return "en"
  }, [i18nextInstance.language])

  useEffect(() => {
    document.documentElement.lang = current
  }, [current])

  const onChange = async (value: string) => {
    await i18n.changeLanguage(value)
    try {
      if (window && window.localStorage) {
        window.localStorage.setItem("i18nextLng", value)
      }
    } catch {}
  }

  return (
    <Select value={current} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-[110px] rounded-md bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="w-[140px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <SelectItem value="en" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">EN</SelectItem>
        <SelectItem value="zh" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">中文</SelectItem>
      </SelectContent>
    </Select>
  )
}


