/* ============================================================
   우만뜨락 렌더러
   - video 씬: 프레임 캡처 → webm(VP8) 인코딩  (CapCut 데스크톱 임포트용)
   - png 씬  : 투명 배경 PNG 1장             (CapCut 오버레이용 / 타이틀·자막)
   사용: node render.mjs            (전체)
        node render.mjs 01-timeline (특정 씬만, 이름 일부 매칭)
   ============================================================ */
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FFMPEG = '/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux';
const FPS = 30;
const OUT = path.join(__dirname, 'out');
const FRAMES = path.join(OUT, 'frames');

// 씬 정의: png 씬은 seek 시각(초)에서 투명 캡처
const V = f => ({ file: f, type: 'video' });
const SCENES = [
  // ── ① 문제 인식 ──
  V('cut01-skyline.html'), V('cut02-playground.html'), V('cut03-elder-walk.html'),
  V('cut05-daycare.html'), V('cut07-closed-door.html'), V('cut08-elder-window.html'),
  // ── ② 변화의 필요성 ──
  V('cut09-old-space.html'), V('cut10-old-meeting.html'), V('cut11-careworker.html'), V('cut13-corridor.html'),
  // ── ③ 함께 만든 과정 ──
  V('cut15-meeting.html'), V('cut16-construction.html'), V('cut17-finishing.html'), V('cut18-reveal.html'),
  // ── ④ 네 개의 공간 ──
  V('cut19-eoulcheong-wide.html'), V('cut20-eoulcheong-hands.html'), V('cut22-eoulcheong-people.html'),
  V('cut25-neuti-wide.html'), V('cut26-neuti-hands.html'), V('cut28-neuti-people.html'),
  V('cut31-kitchen-wide.html'), V('cut32-kitchen-hands.html'), V('cut34-kitchen-people.html'),
  V('cut37-kkumteo-wide.html'), V('cut38-kkumteo-hands.html'), V('cut41-kkumteo-people.html'),
  // ── ⑤ 인터뷰(인용구 카드) + B컷 ──
  V('cut43-quote-resident1.html'), V('cut44-broll-resident-use.html'),
  V('cut45-quote-resident2.html'), V('cut46-broll-smile.html'),
  V('cut47-quote-careworker1.html'), V('cut48-broll-lobby.html'),
  V('cut49-quote-careworker2.html'), V('cut50-broll-lounge.html'),
  // ── ⑥ 클로징 B컷 ──
  V('cut52-after-detail.html'), V('cut53-group-smile.html'), V('cut54-hall.html'),
  // ── 데이터 인포그래픽 / 오버레이 / 클로징 ──
  { file: '01-timeline.html',        type: 'video' },
  { file: '02-population.html',       type: 'video' },
  { file: '03-careworkers.html',      type: 'video' },
  { file: '04-budget.html',           type: 'video' },
  { file: '12-beforeafter.html',      type: 'video' },
  { file: '14-closing-thanks.html',   type: 'video' },
  { file: '15-closing-logo.html',     type: 'video' },
  { file: '05-title-eoulcheong.html', type: 'png', t: 2.6 },
  { file: '06-title-neuti.html',      type: 'png', t: 2.6 },
  { file: '07-title-kitchen.html',    type: 'png', t: 2.6 },
  { file: '08-title-kkumteo.html',    type: 'png', t: 2.6 },
  { file: '09-lower-resident.html',   type: 'png', t: 2.2 },
  { file: '10-lower-careworker.html', type: 'png', t: 2.2 },
  { file: '11-tag-location.html',     type: 'png', t: 2.2 },
];

const filter = process.argv[2];
const list = filter ? SCENES.filter(s => s.file.includes(filter)) : SCENES;

const pad = (n) => String(n).padStart(6, '0');

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--force-color-profile=srgb', '--disable-lcd-text', '--no-sandbox'],
  });

  for (const scene of list) {
    const url = pathToFileURL(path.join(__dirname, 'scenes', scene.file)).href + '?capture=1';
    const name = scene.file.replace('.html', '');
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    page.on('pageerror', e => console.log(`\n  [JS error ${scene.file}] ${e.message}`));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('html[data-ready="1"]', { timeout: 15000 });
    await page.evaluate(() => document.fonts.ready);

    if (scene.type === 'png') {
      await page.evaluate((t) => window.__seek(t), scene.t);
      await page.waitForTimeout(60);
      const outPng = path.join(OUT, `${name}.png`);
      await page.screenshot({ path: outPng, omitBackground: true });
      console.log(`✓ PNG  ${name}.png`);
      await page.close();
      continue;
    }

    // video
    const dur = await page.evaluate(() => window.__duration);
    const total = Math.round(dur * FPS);
    const fdir = path.join(FRAMES, name);
    rmSync(fdir, { recursive: true, force: true });
    mkdirSync(fdir, { recursive: true });
    process.stdout.write(`… VIDEO ${name} (${dur}s, ${total}f) `);
    for (let i = 0; i <= total; i++) {
      const t = i / FPS;
      await page.evaluate((tt) => window.__seek(tt), t);
      await page.screenshot({ path: path.join(fdir, `${pad(i)}.jpg`), type: 'jpeg', quality: 97, animations: 'disabled' });
      if (i % 60 === 0) process.stdout.write('.');
    }
    await page.close();

    const outWebm = path.join(OUT, `${name}.webm`);
    // 이 환경의 ffmpeg는 image2(파일패턴) 데먹서가 없어 image2pipe(stdin)로 공급
    const cmd = `cat '${fdir}'/*.jpg | '${FFMPEG}' -y -hide_banner -loglevel error `
      + `-f image2pipe -c:v mjpeg -framerate ${FPS} -i pipe:0 `
      + `-c:v libvpx -b:v 8M -crf 8 -quality good -cpu-used 2 -auto-alt-ref 0 -pix_fmt yuv420p '${outWebm}'`;
    const r = spawnSync('bash', ['-c', cmd], { stdio: ['ignore', 'inherit', 'inherit'] });
    if (r.status !== 0) { console.log(` ✗ ffmpeg failed (${name})`); }
    else console.log(` ✓ ${name}.webm`);
    rmSync(fdir, { recursive: true, force: true });
  }

  await browser.close();
  console.log('\n완료 → out/');
}
main().catch(e => { console.error(e); process.exit(1); });
