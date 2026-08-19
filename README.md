# 윤슬 운세 콘텐츠 포털

Cloudflare Pages에 배포할 수 있는 운세 콘텐츠 포털 MVP입니다.

## 실행

```bash
npm install
npm run dev
```

## 주요 화면

- 홈: 추천 콘텐츠, 최신 이야기, 상담 안내
- 카테고리: 카테고리 필터와 검색
- 게시글 상세: 콘텐츠 읽기 화면
- 관리자: 샘플 게시글 등록/삭제 데모

현재 관리자 데이터는 브라우저 `localStorage`에 저장됩니다. 운영 배포 전에는 Cloudflare Workers/Pages Functions와 D1/R2를 연결해야 합니다.

## Cloudflare Pages 배포 설정

- Build command: `npm run build`
- Build output directory: `dist`
