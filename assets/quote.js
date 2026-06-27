/* 인터뷰 인용구 카드 — window.QUOTE = {lines:[..], name, role, dur}
   실제 발언으로 lines/name/role 교체해 사용 */
(function(){
  const Q=window.QUOTE||{};
  const stage=document.querySelector('.stage');
  stage.insertAdjacentHTML('beforeend',`
    <div class="qwrap">
      <div class="qmark">“</div>
      <div class="qlines">${(Q.lines||[]).map(l=>`<div class="ql">${l}</div>`).join('')}</div>
      <div class="qattr"><span class="qdot"></span><b>${Q.name||'김○○'}</b><span class="qsep">·</span><span class="qrole">${Q.role||'우만동 주민'}</span></div>
    </div>`);
  const wrap=stage.querySelector('.qwrap'), lines=[...stage.querySelectorAll('.ql')], attr=stage.querySelector('.qattr'), mark=stage.querySelector('.qmark');
  Scene.define(Q.dur||6,(t,A)=>{
    const {E,span,lerp}=A;
    mark.style.opacity=span(t,.2,1.0,E.outCubic);
    mark.style.transform=`translateY(${lerp(20,0,span(t,.2,1.0,E.outCubic))}px) scale(${lerp(.8,1,span(t,.2,1.1,E.outBack))})`;
    lines.forEach((l,i)=>{const a=span(t,.7+i*0.5,1.5+i*0.5,E.outCubic);
      l.style.opacity=a; l.style.transform=`translateY(${lerp(22,0,a)}px)`;});
    const aa=span(t,.9+lines.length*0.5,1.7+lines.length*0.5,E.outCubic);
    attr.style.opacity=aa; attr.style.transform=`translateY(${lerp(16,0,aa)}px)`;
  });
})();
