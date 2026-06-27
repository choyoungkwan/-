/* 공통 비네트 빌더 — 손 클로즈업 / 두 사람 / 식탁
   각 함수는 {art(html), draw(t,An)} 를 돌려줌. 씬은 이를 받아 Scene.define 호출. */
(function(g){
  const ILL=g.ILL;
  // 손 클로즈업: object(t)->{markup, dy} 를 받아 손 위에 물체 배치
  function handCloseup(opt){
    const sleeve=opt.sleeve||'#3f9e72', dir=opt.dir||-1;
    const art=`
      <rect x="-100" y="-100" width="2120" height="900" fill="${opt.bg||'#efe6d0'}"/>
      <rect x="-100" y="640" width="2120" height="520" fill="${opt.surface||'#d8c6a2'}"/>
      <rect x="-100" y="640" width="2120" height="10" fill="${opt.surfaceEdge||'#c6b187'}"/>
      ${opt.props||''}
      <g id="obj"></g>
      <g id="hand"></g>`;
    function draw(t,An){
      const {lerp,E}=An;const p=t/(opt.dur||8);
      g.__el('cam').style.transform=`scale(${lerp(1.06,1.0,p)})`;
      const o=opt.obj(t,An);
      const hx=opt.hx||1060, hy=(opt.hy||760)+(o.dy||0);
      g.__el('hand').innerHTML=ILL.place(hx,hy,opt.scale||2.1, ILL.forearm({sleeve,dir,rot:opt.rot||14}));
      g.__el('obj').innerHTML=ILL.place(hx+(opt.objdx||0), hy-(opt.objup||70)+(o.dy||0), opt.scale||2.1, o.markup);
      if(opt.extra) opt.extra(t,An);
    }
    return {art,draw};
  }
  g.VIGN={handCloseup};
  g.__el=id=>document.getElementById(id);
})(window);
