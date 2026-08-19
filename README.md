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

## D1 운영 데이터베이스 준비

`schema.sql`에는 카테고리와 게시글 테이블이 포함되어 있습니다. Cloudflare Pages 프로젝트에 D1 바인딩 이름을 `DB`로 추가한 뒤 마이그레이션을 실행하면 `/api/posts`에서 게시글을 읽고 등록할 수 있습니다. 현재 프론트엔드는 기존 데모 저장소를 사용하므로, D1 연결 후 API 전환을 별도 단계로 진행할 수 있습니다.

## Cloudflare Pages 배포 설정

- Build command: `npm run build`
- Build output directory: `dist`

Cloudflare Pages runtime binding: `DB` → `saju-portal-db`
Admin write protection: `ADMIN_TOKEN` secret configured in production.
R2 media binding: `MEDIA` → `saju-portal-media`.
Local Cloudflare resource configuration: `wrangler.toml`.
