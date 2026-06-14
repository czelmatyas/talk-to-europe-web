export function h2r(h){h=h.replace('#','');return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
export function r2h(r){return '#'+r.map(x=>{x=Math.max(0,Math.min(255,Math.round(x)));const s=x.toString(16);return s.length<2?'0'+s:s;}).join('');}
function r2hsl(r){const R=r[0]/255,G=r[1]/255,B=r[2]/255,mx=Math.max(R,G,B),mn=Math.min(R,G,B),d=mx-mn;let h=0,s=0;const l=(mx+mn)/2;if(d){s=l>0.5?d/(2-mx-mn):d/(mx+mn);if(mx===R)h=((G-B)/d+(G<B?6:0));else if(mx===G)h=(B-R)/d+2;else h=(R-G)/d+4;h*=60;}return [h,s*100,l*100];}
function hsl2r(hs){const h=((hs[0]%360)+360)%360,s=hs[1]/100,l=hs[2]/100,c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;let o=[0,0,0];if(h<60)o=[c,x,0];else if(h<120)o=[x,c,0];else if(h<180)o=[0,c,x];else if(h<240)o=[0,x,c];else if(h<300)o=[x,0,c];else o=[c,0,x];return [(o[0]+m)*255,(o[1]+m)*255,(o[2]+m)*255];}
export function shift(hex,dh,dl){const q=r2hsl(h2r(hex));q[0]+=dh;q[2]=Math.max(0,Math.min(100,q[2]+(dl||0)));return r2h(hsl2r(q));}
export function mix(a,b,t){const A=h2r(a),B=h2r(b);return r2h([A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t]);}
export function rgba(hex,a){const r=h2r(hex);return `rgba(${r[0]},${r[1]},${r[2]},${a})`;}
