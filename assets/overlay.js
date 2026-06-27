/* 오버레이 빌더 — window.OVERLAY 설정을 읽어 마크업+등장 모션 생성
   kind: 'title' | 'lower' | 'tag' */
(function(){
  const O = window.OVERLAY || {};
  const stage = document.querySelector('.stage');
  const scrim = document.createElement('div'); scrim.className='scrim'; stage.appendChild(scrim);
  let root, parts={};

  if(O.kind==='title'){
    root=document.createElement('div'); root.className='titleLow';
    root.innerHTML=`<div class="bar"></div><div class="txt">
      <div class="tag">${O.tag||''}</div>
      <div class="clip"><div class="name">${O.name||''}</div></div></div>`;
    stage.appendChild(root);
    parts.bar=root.querySelector('.bar'); parts.tag=root.querySelector('.tag');
    parts.name=root.querySelector('.name');
  } else if(O.kind==='lower'){
    root=document.createElement('div'); root.className='nameStrap';
    root.innerHTML=`<div class="accent"></div><div class="body">
      <div class="nm">${O.name||''}</div><div class="ro">${O.role||''}</div></div>`;
    stage.appendChild(root);
  } else if(O.kind==='tag'){
    root=document.createElement('div'); root.className='locChip';
    root.innerHTML=`<div class="pin"></div><div class="lt">${O.text||''}</div>`;
    stage.appendChild(root);
    scrim.style.display='none';
  }
  // 자기 배경이 있는 요소(이름 자막)는 전체 스크림 불필요
  if(O.kind==='lower') scrim.style.display='none';

  const D = O.duration || 4;
  Scene.define(D, (t,A)=>{
    const {E,span,lerp,clamp01}=A;
    scrim.style.opacity = span(t,.0,.6,E.outCubic);
    if(O.kind==='title'){
      parts.bar.style.height='auto';
      const bp=span(t,.25,1.0,E.outCubic);
      parts.bar.style.transform=`scaleY(${bp})`; parts.bar.style.transformOrigin='top';
      const tp=span(t,.55,1.2,E.outCubic);
      parts.tag.style.opacity=tp; parts.tag.style.transform=`translateY(${lerp(14,0,tp)}px)`;
      const np=span(t,.7,1.6,E.outCubic);
      parts.name.style.transform=`translateY(${lerp(140,0,np)}px)`;
      parts.name.parentElement.style.opacity=1;
    } else if(O.kind==='lower'){
      const p=span(t,.2,1.0,E.outBack);
      root.style.opacity=clamp01(span(t,.2,.7,E.outCubic));
      root.style.transform=`translateX(${lerp(-40,0,clamp01(p))}px)`;
    } else if(O.kind==='tag'){
      const p=span(t,.2,1.0,E.outBack);
      root.style.opacity=clamp01(span(t,.2,.7,E.outCubic));
      root.style.transform=`translateY(${lerp(-24,0,clamp01(p))}px)`;
    }
  });
})();
