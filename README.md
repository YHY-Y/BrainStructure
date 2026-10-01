# 오늘의 뇌구조 · Brain Diary

하루 동안 머릿속을 차지한 생각을 파스텔 톤의 뇌 그림으로 기록하는 로컬 우선 시각 일기입니다.

## 실행하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 사용합니다. 기록은 날짜별로 브라우저 `localStorage`에 자동 저장되며 서버로 전송되지 않습니다.

배포 전 `.env.example`을 참고해 `NEXT_PUBLIC_SITE_URL`에 실제 공개 URL을 설정하세요. 해당 값은 canonical URL, `robots.txt`, `sitemap.xml`, 구조화 데이터에 사용됩니다. Search Console과 네이버 서치어드바이저 소유권 확인 코드는 각각 `GOOGLE_SITE_VERIFICATION`, `NAVER_SITE_VERIFICATION`으로 설정할 수 있습니다.

## 주요 기능

- 사람 옆모습 안에 최대 8개의 생각과 비율, 색상, 이모지 입력
- 입력 내용을 즉시 반영하는 SVG 뇌구조
- 날짜별 기록 자동 저장 및 불러오기
- 오늘의 기분과 200자 메모
- 어제 기록 복사 및 전체 로컬 기록 삭제
- 1080 × 1350 PNG 이미지 내보내기
- 모바일부터 데스크톱까지 반응형 레이아웃
