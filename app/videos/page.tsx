"use client";

const videos=[
 {title:"Tamil Nadu News: Latest Videos",source:"NDTV",url:"https://www.ndtv.com/topic/tamil-nadu"},
 {title:"Tamil News Videos",source:"Hindu Tamil",url:"https://www.hindutamil.in/videos"},
];

export default function VideosPage(){
 return <main style={{maxWidth:1100,margin:"0 auto",padding:24}}>
  <h1>🎥 Tamil Nadu Live Videos</h1>
  <p>Latest Tamil Nadu video news from publisher video pages. Select a source to watch the current videos.</p>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18,marginTop:24}}>
   {videos.map(v=><article key={v.url} style={{border:"1px solid #ddd",borderRadius:18,padding:20}}>
    <div style={{fontSize:42}}>▶️</div><h2>{v.title}</h2><p>{v.source}</p>
    <a href={v.url} target="_blank" rel="noreferrer" style={{display:"inline-block",padding:"10px 16px",borderRadius:10,background:"#111",color:"white",textDecoration:"none"}}>Watch latest videos ↗</a>
   </article>)}
  </div>
 </main>
}
