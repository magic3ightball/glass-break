# 유리 깨기 (glass-break)

브라우저에서 유리를 깨 보는 장난감. 빌드 없는 단일 `index.html`(Canvas 2D + WebGL 유리 굴절 레이어).

- 대상 5종: 창 / 전구 / 형광등 / 블록 / 병
- 유리 5종: 일반 / 강화 / 강화(이전) / 자동차(접합) / 두꺼운
- 도구 4종: 손가락 / 망치 / 공 / 커터 (멀티터치 지원)

## 실행
`index.html`을 브라우저로 열면 된다. 정적 호스팅(Vercel)으로 배포.

## 테스트
```
node test/regress.js [출력폴더]
```
Playwright + headless Chromium(`--use-gl=swiftshader`). 유리×대상×도구×뷰포트 3종 조합에서 pageerror 0건, 커터 1,200조각 fps 측정.
기존 브라우저를 쓰려면 `CHROME_PATH` 환경변수로 실행 파일을 지정.

## 배경 사진 출처
화면 왼쪽 아래에 표기. 각 사진의 라이선스(CC BY-SA / CC BY)를 따른다.
- Burano, Venice — kallerna (CC BY-SA 4.0)
- La Boqueria, Barcelona — Gveret Tered (CC BY-SA 3.0)
- Dotonbori, Osaka — Martin Falbisoner (CC BY-SA 4.0)
- Kuala Lumpur — Jorge Láscar (CC BY 2.0)
