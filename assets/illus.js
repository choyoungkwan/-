/* ============================================================
   우만뜨락 일러스트 컴포넌트 (플랫/스타일라이즈)
   좌표 규약: 각 헬퍼는 '발 중심(0,0) 기준' 내부 마크업을 반환.
   place(x,y,s,inner) 로 무대 위에 배치. 단위 px(1920x1080 좌표계).
   ============================================================ */
(function(g){
  const P = {
    skin:'#ecc4a3', skinD:'#d9a982', hair:'#544234', gray:'#c3bcae',
    pants:'#6b5d4a', shadow:'rgba(60,45,20,.13)'
  };
  const place=(x,y,s,inner,extra='')=>`<g transform="translate(${x} ${y}) scale(${s})" ${extra}>${inner}</g>`;
  const shadow=(rx=70)=>`<ellipse cx="0" cy="8" rx="${rx}" ry="${rx*0.22}" fill="${P.shadow}"/>`;

  // 서 있는 사람 — o:{cloth,pants,skin,hair,back,bald,gray,armL,armR}
  function figure(o={}){
    const c=o.cloth||'#3f9e72', pa=o.pants||P.pants, sk=o.skin||P.skin,
          hr=o.gray? P.gray : (o.hair||P.hair);
    const armL=o.armL!=null?o.armL:0, armR=o.armR!=null?o.armR:0; // 어깨 기준 각도(도)
    return `${shadow(64)}
      <rect x="-34" y="-150" width="30" height="158" rx="15" fill="${pa}"/>
      <rect x="6"  y="-150" width="30" height="158" rx="15" fill="${pa}"/>
      <g transform="rotate(${armL} -44 -300)"><rect x="-60" y="-300" width="26" height="150" rx="13" fill="${c}"/><circle cx="-47" cy="-152" r="15" fill="${sk}"/></g>
      <g transform="rotate(${armR} 44 -300)"><rect x="34" y="-300" width="26" height="150" rx="13" fill="${c}"/><circle cx="47" cy="-152" r="15" fill="${sk}"/></g>
      <path d="M-46 -302 q46 -28 92 0 l9 128 q-55 22 -110 0 z" fill="${c}"/>
      <rect x="-12" y="-332" width="24" height="40" rx="11" fill="${sk}"/>
      <circle cx="0" cy="-362" r="40" fill="${sk}"/>
      ${o.bald? `<path d="M-40 -366 a40 40 0 0 1 80 4 q-40 -26 -80 -4z" fill="${hr}" opacity=".5"/>`
              : `<path d="M-41 -360 a41 41 0 0 1 82 0 q-10 -22 -41 -22 q-31 0 -41 22z" fill="${hr}"/>`}
      ${o.back? '' : `<circle cx="-14" cy="-360" r="3.6" fill="#3a2e25"/><circle cx="14" cy="-360" r="3.6" fill="#3a2e25"/>
                      <path d="M-10 -344 q10 8 20 0" stroke="#b98668" stroke-width="3" fill="none" stroke-linecap="round"/>`}`;
  }

  // 어르신(굽은 등 + 지팡이 옵션) — o:{back,cane,cloth,gray}
  function elder(o={}){
    const c=o.cloth||'#8a8f96', sk=o.skin||P.skin, hr=P.gray;
    const cane=o.cane? `<line x1="58" y1="-150" x2="70" y2="6" stroke="#8a6a44" stroke-width="9" stroke-linecap="round"/><circle cx="58" cy="-150" r="12" fill="${sk}"/>`:'';
    return `${shadow(60)}
      <rect x="-30" y="-140" width="28" height="148" rx="14" fill="${o.pants||'#6f6a60'}"/>
      <rect x="6" y="-140" width="28" height="148" rx="14" fill="${o.pants||'#6f6a60'}"/>
      <path d="M-44 -286 q40 -22 86 -4 q14 70 6 150 q-52 20 -100 0 q-6 -78 8 -146z" fill="${c}"/>
      <rect x="-58" y="-280" width="24" height="140" rx="12" fill="${c}"/>${cane?'':`<circle cx="-46" cy="-146" r="14" fill="${sk}"/>`}
      <rect x="-14" y="-312" width="24" height="40" rx="11" fill="${sk}" transform="rotate(-8 0 -300)"/>
      <circle cx="-8" cy="-344" r="38" fill="${sk}"/>
      <path d="M-46 -344 a38 38 0 0 1 76 0 q-8 -18 -38 -18 q-30 0 -38 18z" fill="${hr}"/>
      ${o.back? '' : `<circle cx="-22" cy="-344" r="3.4" fill="#4a3e34"/><circle cx="6" cy="-344" r="3.4" fill="#4a3e34"/>`}
      ${cane}`;
  }

  // 팔뚝+손(클로즈업) — 물체를 든 손. dir:1(오른쪽에서) / -1
  // origin: 손목 위치(0,0). inner object 는 손 위(0,-10 근처)에 배치
  function forearm(o={}){
    const sk=o.skin||P.skin, c=o.sleeve||'#3f9e72', dir=o.dir||1;
    return `<g transform="scale(${dir} 1)">
      <rect x="-40" y="0" width="80" height="240" rx="40" fill="${c}" transform="rotate(${o.rot||18} 0 0)"/>
      <g transform="rotate(${o.rot||18} 0 0)">
        <ellipse cx="0" cy="-6" rx="46" ry="40" fill="${sk}"/>
        <rect x="-40" y="-40" width="20" height="46" rx="10" fill="${sk}"/>
        <rect x="-16" y="-48" width="18" height="52" rx="9" fill="${sk}"/>
        <rect x="8" y="-46" width="18" height="50" rx="9" fill="${sk}"/>
        <rect x="30" y="-38" width="17" height="44" rx="8.5" fill="${sk}"/>
      </g></g>`;
  }

  // 아파트 동
  function building(o={}){
    const w=o.w||220,h=o.h||620,c=o.color||'#cdbfa6',c2=o.roof||'#b6a585';
    let win='';const cols=Math.floor((w-40)/56), rows=Math.floor((h-60)/70);
    for(let r=0;r<rows;r++)for(let cc=0;cc<cols;cc++){
      const lit=o.lit && ((r*7+cc*3)%5===0);
      win+=`<rect x="${24+cc*56}" y="${44+r*70}" width="36" height="46" rx="5" fill="${lit?'#f4cf7e':'#aeb0a6'}" opacity="${lit?1:.85}"/>`;
    }
    return `<rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="${c}"/>
      <rect x="-6" y="0" width="${w+12}" height="22" rx="6" fill="${c2}"/>${win}`;
  }

  // 창문(빛)
  function window2(o={}){
    const w=o.w||300,h=o.h||360;
    return `<rect x="0" y="0" width="${w}" height="${h}" rx="8" fill="#cdbfa6"/>
      <rect x="14" y="14" width="${w-28}" height="${h-28}" rx="4" fill="url(#winsky)"/>
      <line x1="${w/2}" y1="14" x2="${w/2}" y2="${h-14}" stroke="#cdbfa6" stroke-width="12"/>
      <line x1="14" y1="${h/2}" x2="${w-14}" y2="${h/2}" stroke="#cdbfa6" stroke-width="12"/>`;
  }

  // 책장
  function bookshelf(o={}){
    const w=o.w||360,h=o.h||440,palette=['#cf6b5a','#e7a23c','#3f9e72','#4a86ad','#c88a5e','#8a8f96'];
    let books='';const shelves=Math.floor(h/110);
    for(let s=0;s<shelves;s++){let x=18;while(x<w-40){const bw=18+((s*7+x)%4)*8;const bh=70+((x)%3)*14;
      books+=`<rect x="${x}" y="${30+s*110+(96-bh)}" width="${bw}" height="${bh}" rx="3" fill="${palette[(s+x)%palette.length]}"/>`;x+=bw+6;}}
    return `<rect x="0" y="0" width="${w}" height="${h}" rx="8" fill="${o.wood||'#b78a55'}"/>
      ${[...Array(Math.floor(h/110)+1)].map((_,i)=>`<rect x="6" y="${22+i*110}" width="${w-12}" height="10" fill="#9c7344"/>`).join('')}
      ${books}`;
  }

  // 화분/식물(뜨락 모티프)
  function plant(o={}){
    const s=o.s||1;return `<g transform="scale(${s})">
      <path d="M-34 0 h68 l-8 54 h-52 z" fill="#c88a5e"/>
      <path d="M0 -6 C 0 -50 -6 -86 -2 -120" stroke="#3f9e72" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M-2 -70 C -40 -74 -56 -100 -50 -128 C -22 -120 -6 -98 -2 -70Z" fill="#5cb487"/>
      <path d="M0 -92 C 36 -96 52 -120 46 -148 C 20 -140 4 -118 0 -92Z" fill="#3f9e72"/></g>`;
  }

  g.ILL = { place, shadow, figure, elder, forearm, building, window2, bookshelf, plant, P };
})(window);
