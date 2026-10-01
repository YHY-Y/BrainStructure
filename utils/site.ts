const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = configuredUrl
  ? new URL(configuredUrl.startsWith("http") ? configuredUrl : `https://${configuredUrl}`)
  : new URL("http://localhost:3000");

export const SITE_NAME = "오늘의 뇌구조 | Brain Diary";
export const SITE_DESCRIPTION = "오늘 머릿속을 차지한 생각과 감정을 뇌구조로 시각화하고, 날짜별로 기록해 PNG 이미지로 저장하는 무료 비주얼 다이어리입니다.";
