# 우만뜨락 새단장 영상 — 전체 패키지 (총 4분 55초)

복지관 1층 리모델링(우만뜨락) 새단장식 상영용 영상입니다.
**촬영 없이 전 구간을 일러스트 애니메이션으로 제작**했습니다. 초별 컷 시트(56컷) 전체를 다음으로 채웠습니다.

- 🎥 현장 영상 / 📷 사진  → **플랫 일러스트 모션**(같은 디자인 톤)
- 📊 인포그래픽 4종       → 데이터 모션그래픽
- 🎙️ 인터뷰              → **인용구 카드**(실제 발언으로 교체)
- ✍️ 타이틀/이름자막      → 투명 PNG 오버레이

> 일러스트 스타일이라 “우리 실제 공간”의 실사 영상은 아닙니다. 실사 컷이 있으면 해당 일러스트 자리에 끼워 넣으면 됩니다.

---

## 1. 지금 바로 보기
```
index.html  를 브라우저로 열기
```
56컷 전체가 섹션별로 **실시간 재생**됩니다. (폰트 포함, 인터넷 불필요)

---

## 2. CapCut 조립 순서 — 56컷 전체

순서대로 `out/`의 파일을 타임라인에 올리면 됩니다. **webm = 영상 클립**, **PNG = 그 위에 얹는 오버레이**.

### ① 문제 인식 (0:00–0:48)
| 컷 | 파일 | 자막 |
|--|--|--|
|1|`cut01-skyline.webm` + `11-tag-location.png`|수원시 팔달구, 우만동|
|2|`cut02-playground.webm`| |
|3|`cut03-elder-walk.webm`| |
|4|`01-timeline.webm`|입주 35년, 65세 이상 …|
|5|`cut05-daycare.webm`| |
|6|`02-population.webm`|아이들이 떠난 자리|
|7|`cut07-closed-door.webm`| |
|8|`cut08-elder-window.webm`|마을은 초고령 사회가 …|

### ② 변화의 필요성 (0:48–1:18)
|9|`cut09-old-space.webm`|지역이 변하면, 복지관도 …|
|10|`cut10-old-meeting.webm`| |
|11|`cut11-careworker.webm`| |
|12|`03-careworkers.webm`|지역 내 돌봄 종사자 …|
|13|`cut13-corridor.webm`|쉼과 연결의 공간이 …|

### ③ 함께 만든 과정 (1:18–1:48)
|14|`04-budget.webm`|특별조정교부금 + 수원시 매칭|
|15|`cut15-meeting.webm`| |
|16|`cut16-construction.webm`| |
|17|`cut17-finishing.webm`| |
|18|`cut18-reveal.webm`|그렇게, 1층이 다시 …|

### ④ 네 개의 공간 (1:48–3:28) — 각 공간 = 와이드+손+사람 3컷
| 공간 | 파일 | 오버레이 |
|--|--|--|
|어울청|`cut19-eoulcheong-wide` · `cut20-…-hands` · `cut22-…-people`|`05-title-eoulcheong.png`|
|느티나무|`cut25-neuti-wide` · `cut26-…-hands` · `cut28-…-people`|`06-title-neuti.png`|
|모두의부엌|`cut31-kitchen-wide` · `cut32-…-hands` · `cut34-…-people`|`07-title-kitchen.png`|
|우만꿈터|`cut37-kkumteo-wide` · `cut38-…-hands` · `cut41-…-people`|`08-title-kkumteo.png`|

> 타이틀 PNG는 각 공간 **첫(와이드) 컷** 위에 얹으세요. 시트의 5~6개 잔컷은 이 3컷으로 압축했습니다.

### ⑤ 인터뷰 — 인용구 카드 (3:28–4:10)
|43|`cut43-quote-resident1.webm` (+`09-lower-resident.png`)|주민 발언①|
|44|`cut44-broll-resident-use.webm`| |
|45|`cut45-quote-resident2.webm`|주민 발언②|
|46|`cut46-broll-smile.webm`| |
|47|`cut47-quote-careworker1.webm` (+`10-lower-careworker.png`)|요양보호사 발언①|
|48|`cut48-broll-lobby.webm`| |
|49|`cut49-quote-careworker2.webm`|요양보호사 발언②|
|50|`cut50-broll-lounge.webm`| |

### ⑥ 클로징 (4:10–4:55)
|51|`12-beforeafter.webm`|35년 된 마을에, 새로운 뜨락|
|52|`cut52-after-detail.webm`| |
|53|`cut53-group-smile.webm`| |
|54|`cut54-hall.webm`| |
|55|`14-closing-thanks.webm`|주민의 내일이 자랍니다|
|56|`15-closing-logo.webm`|함께해 주셔서 감사합니다|

---

## 3. 내용 교체 ⚠️ 필수 (모두 예시 플레이스홀더)
| 파일 | 바꿀 값 |
|--|--|
|`scenes/01-timeline.html`|`rateStart/rateEnd` (고령화율 %)|
|`scenes/02-population.html`|세 카드 `to` (어린이집/어르신/독거)|
|`scenes/03-careworkers.html`|`total` (돌봄 종사자 수)|
|`scenes/04-budget.html`|`amountA/amountB` (예산 억)|
|`scenes/cut43·45·47·49-quote-*.html`|`QUOTE.lines / name / role` (실제 인터뷰 발언·이름)|
|`scenes/09·10-lower-*.html`|인터뷰이 이름·소속|
|`scenes/15-closing-logo.html`|복지관/법인 이름·로고|

고친 뒤 다시 렌더 → 4번.

---

## 4. 다시 렌더
```bash
npm install          # 최초 1회
node render.mjs            # 전체
node render.mjs cut19      # 특정 씬만
node render.mjs quote      # 인용구 카드만
```
영상 → `out/*.webm`, 오버레이 → `out/*.png`.

## 5. CapCut에서 webm이 안 열릴 때 → MP4
CapCut 데스크톱은 대부분 webm을 임포트합니다. 안 되면 본인 PC의 ffmpeg로:
```bash
ffmpeg -i out/cut01-skyline.webm -c:v libx264 -pix_fmt yuv420p -crf 18 out/cut01-skyline.mp4
```
(이 저장소 ffmpeg는 코덱 제한으로 webm까지만 생성)

## 6. 실사 컷을 섞고 싶을 때
특정 일러스트 자리에 실제 촬영/사진이 생기면, 그 컷만 교체하면 됩니다.
Before/After(컷 51)는 `assets/before.jpg`·`assets/after.jpg`(같은 앵글)를 넣고 다시 렌더하면 자동 반영됩니다.

## 7. 제작 노트
- 1920×1080 / 30fps / 폰트 Pretendard(OFL, 포함).
- 팔레트: 뜨락 그린 `#2f9e6b` · 온기 amber `#f0a431` · 수원시 블루 `#3a7ca5`.
- 모든 모션은 시간 함수로 계산되어 프레임 정확도로 렌더됩니다(`assets/anim.js`).
- 일러스트 컴포넌트: `assets/illus.js` · 비네트: `assets/vign.js` · 인용구: `assets/quote.js`.
