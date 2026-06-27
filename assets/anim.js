/* ============================================================
   우만뜨락 모션 프레임워크 (deterministic seek)
   - 브라우저에서 열면 자동 재생/반복
   - ?capture=1 이면 렌더러가 window.__seek(t) 로 프레임을 그림
   - 모든 애니메이션은 시간 t(초) 함수로 계산되어 프레임 정확도 보장
   ============================================================ */
(function (global) {
  // ---- easing ----
  const E = {
    linear: t => t,
    inQuad: t => t * t,
    outQuad: t => 1 - (1 - t) * (1 - t),
    inOutQuad: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    outCubic: t => 1 - Math.pow(1 - t, 3),
    inOutCubic: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    outExpo: t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
    outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    outElastic: t => { const c4 = (2 * Math.PI) / 3; return t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * c4) + 1; },
  };

  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const lerp = (a, b, t) => a + (b - a) * t;

  // 구간 [t0,t1] 안에서의 진행도(0..1), ease 적용
  function span(t, t0, t1, ease) {
    const p = clamp01((t - t0) / (t1 - t0));
    return (ease || E.linear)(p);
  }
  // 등장→유지→퇴장 (간단 fade/slide 용)
  function inOut(t, inAt, inDur, outAt, outDur, ease) {
    ease = ease || E.outCubic;
    const a = span(t, inAt, inAt + inDur, ease);
    const b = outDur ? 1 - span(t, outAt, outAt + outDur, E.inOutQuad) : 1;
    return clamp01(Math.min(a, b));
  }

  function fmt(n, digits) {
    const f = Number(n).toFixed(digits || 0);
    return f.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // ---- Scene runtime ----
  const Scene = {
    duration: 5,
    _draw: () => {},
    define(durationSec, drawFn) {
      this.duration = durationSec;
      this._draw = drawFn;
      global.__duration = durationSec;
      global.__seek = (t) => this._draw(Math.max(0, Math.min(durationSec, t)), { E, clamp01, lerp, span, inOut, fmt });
      const params = new URLSearchParams(location.search);
      if (params.get('capture') === '1') {
        // 렌더러가 직접 __seek 호출 → 자동재생 안 함
        this._draw(0, { E, clamp01, lerp, span, inOut, fmt });
        document.documentElement.setAttribute('data-ready', '1');
        return;
      }
      // 브라우저 미리보기: 실시간 반복 재생
      const loop = params.get('loop') !== '0';
      let start = null;
      const tick = (ts) => {
        if (start == null) start = ts;
        let t = (ts - start) / 1000;
        if (t > durationSec + 0.8) { if (loop) { start = ts; t = 0; } else t = durationSec; }
        global.__seek(t);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  };

  global.Anim = { E, clamp01, lerp, span, inOut, fmt };
  global.Scene = Scene;
})(window);
