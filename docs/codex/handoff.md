# glass-break 인수인계

## 현재 상태 (2026-10-08)
- 저장소: github.com/magic3ightball/glass-break (main). Vercel 프로젝트 `glass-break`(팀 magic3ightballs-projects), main push 시 자동 배포.
- 공개 주소: https://glass-break-three.vercel.app (`glass-break.vercel.app`은 남의 사이트라 못 씀)
- 단일 `index.html`(빌드 없음). 구조 설명은 index.html 상단 주석과 아래 참고.

## 이번 세션 변경: 균열 전파 애니메이션
- 조각마다 균열 앞머리 정보(`fx, fy, ft, fk, relAt`)를 둔다. `crackAt()`가 타격 때 설정하고, 앞머리가 조각에 처음 닿는 시각을 pending 시각으로 돌려준다.
- 셰이더(GL_FS)가 픽셀마다 앞머리 반지름 `(gt - ft)/fk`과 비교해 금(revL)과 조각 면(revB)을 드러낸다.
  - 방사형 금은 빨리, 고리 금은 `dist*(1+0.5*an)`로 늦게, 조각 면은 `dist*1.6`로 더 늦게 드러난다. 금 끝은 `tip`으로 밝게 빛난다.
- 조각 낙하는 앞머리가 조각을 다 지난 뒤(`relAt`)로 미룬다 (update의 pending 재등록).
- 게임 시간(gt) 기준이라 멈춤·슬로 연출을 켜면 금도 같이 느려진다.
- 2D 경로(굴절 끔)에는 적용하지 않았다. 그 경로에서는 조각 단위로 나타난다.

## 테스트
```
CHROME_PATH=".../Google Chrome for Testing" NODE_PATH=<playwright 있는 node_modules> node test/regress.js out
node test/frames.js out normal,thick     # 타격 직후 40~800ms 프레임
```
- 2026-10-08 기준: 300개 조합에서 오류 0건. 커터 약 1,400조각에서 swiftshader 기준 28~53fps (실행마다 편차가 커서 실제 GPU 수치로 볼 수 없음).
- 소리와 손맛은 사람이 직접 확인해야 한다.

## 다음 후보 (손맛)
누르는 순간 반응(휘는 왜곡·충격파), 누르는 동안 저항감, 소리 레이어링, 망치 스윙, 튕기고 쌓이는 물리, 드문 큰 한 방.
