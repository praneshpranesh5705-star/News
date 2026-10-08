 "use client";
import {useMemo,useState} from "react";

const districts=["All Tamil Nadu","Chennai","Coimbatore","Madurai","Salem","Tiruppur","Trichy","Erode","Tirunelveli","Thanjavur","The Nilgiris","Vellore","Thoothukudi"];
const news=[
 {cat:"Tamil Nadu",district:"Chennai",title:"Tamil Nadu launches new digital services for citizens",summary:"A new wave of online public services aims to make everyday government interactions faster and simpler.",icon:"🏛️",time:"12 min ago"},
 {cat:"Education",district:"Coimbatore",title:"Coimbatore education and innovation ecosystem gets a fresh push",summary:"Colleges, startups and student innovators are collaborating on technology-led projects.",icon:"🎓",time:"28 min ago"},
 {cat:"Agriculture",district:"Erode",title:"Farm technology helps growers monitor crops more efficiently",summary:"Smart sensors and data-driven farming are becoming increasingly useful for Tamil Nadu agriculture.",icon:"🌾",time:"41 min ago"},
 {cat:"Business",district:"Tiruppur",title:"Textile businesses explore smarter production workflows",summary:"Manufacturers are adopting digital tools to improve design, production and customer communication.",icon:"🏭",time:"1 hr ago"},
 {cat:"Weather",district:"The Nilgiris",title:"Weather watch: hill districts prepare for changing conditions",summary:"Residents and travellers are advised to follow local weather updates before planning trips.",icon:"🌦️",time:"1 hr ago"},
 {cat:"Technology",district:"Madurai",title:"AI and software projects gain attention among young creators",summary:"Student developers are building practical applications for education, agriculture and local services.",icon:"🤖",time:"2 hrs ago"},
 {cat:"Sports",district:"Chennai",title:"Tamil Nadu sports talent gets new opportunities",summary:"Local competitions and training programs are creating more pathways for young athletes.",icon:"🏆",time:"2 hrs ago"},
 {cat:"Health",district:"Salem",title:"Community health awareness initiatives expand",summary:"Local organizations are focusing on preventive health education and accessible information.",icon:"🩺",time:"3 hrs ago"},
 {cat:"Culture",district:"Thanjavur",title:"Tamil heritage and culture take centre stage",summary:"Digital storytelling is helping younger audiences discover the state's rich cultural heritage.",icon:"🪷",time:"4 hrs ago"}
];

export default function Home(){
 const [district,setDistrict]=useState("All Tamil Nadu"); const [q,setQ]=useState(""); const [dark,setDark]=useState(false); const [saved,setSaved]=useState<number[]>([]);
 const filtered=useMemo(()=>news.filter(n=>(district==="All Tamil Nadu"||n.district===district)&&((n.title+n.summary+n.cat+n.district).toLowerCase().includes(q.toLowerCase()))),[district,q]);
 function speak(text:string){if("speechSynthesis" in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(text))}}
 return <div style={dark?{background:"#0b1220",color:"#f8fafc",minHeight:"100vh"}:{}}>
  <div className="top"><div className="container topin"><span>🇮🇳 Tamil Nadu • AI-powered local news</span><span>Updated continuously</span></div></div>
  <header className="nav"><div className="container navin">
   <div className="logo">TAMILNADU <span>AI NEWS</span></div>
   <nav className="links"><a href="#latest">Latest</a><a href="#trending">Trending</a><a href="#districts">Districts</a><a href="#ai">AI Assistant</a></nav>
   <div className="actions"><button className="btn" onClick={()=>setDark(!dark)}>{dark?"☀️":"🌙"}</button><button className="btn" onClick={()=>document.getElementById("search")?.focus()}>🔍</button></div>
  </div></header>
  <main className="container">
   <section className="hero"><div className="heroGrid">
    <article className="heroCard"><span className="badge">🔴 BREAKING NEWS</span><h1>Tamil Nadu news, explained by AI — in Tamil & English.</h1><p>One clean place for district news, technology, agriculture, education, business, weather and more.</p></article>
    <aside className="side"><h3>⚡ Quick Updates</h3><div className="breaking"><b>LIVE</b> District news feeds are ready</div><div className="breaking">🤖 AI summaries make long stories easier</div><div className="breaking">🔊 Listen to any story</div><div className="breaking">📍 Filter news by district</div></aside>
   </div></section>
   <section id="districts" className="section"><div className="sectionHead"><h2>📍 Explore by District</h2></div><div className="districts">{districts.map(d=><button key={d} className={"chip "+(district===d?"active":"")} onClick={()=>setDistrict(d)}>{d}</button>)}</div></section>
   <section id="trending" className="section"><div className="sectionHead"><h2>🔥 Trending Now</h2><span className="meta">AI-curated</span></div><div className="grid">{filtered.slice(0,3).map((n,i)=><article className="card" key={i}><div className="thumb">{n.icon}</div><div className="cardbody"><span className="tag">{n.cat} • {n.district}</span><h3>{n.title}</h3><p className="summary">{n.summary}</p><span className="meta">{n.time}</span></div></article>)}</div></section>
   <section id="latest" className="section"><div className="sectionHead"><h2>📰 Latest News</h2><input id="search" className="input" style={{maxWidth:260}} placeholder="Search news..." value={q} onChange={e=>setQ(e.target.value)}/></div><div className="grid">
    {filtered.map((n,i)=><article className="card" key={i}><div className="thumb">{n.icon}</div><div className="cardbody"><span className="tag">{n.cat} • {n.district}</span><h3>{n.title}</h3><p className="summary"><b>AI Summary:</b> {n.summary}</p><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span className="meta">{n.time}</span><div><button className="btn" onClick={()=>speak(n.title+". "+n.summary)}>🔊</button> <button className="btn" onClick={()=>setSaved(s=>s.includes(i)?s.filter(x=>x!==i):[...s,i])}>{saved.includes(i)?"★":"☆"}</button></div></div></div></article>)}
   </div></section>
   <section id="ai" className="section"><div className="ai"><h2>🤖 Ask TamilNadu AI</h2><p>Ask about Tamil Nadu news, districts, agriculture, education, technology or any story. Connect your Gemini API key to make this assistant fully AI-powered.</p><div className="aiRow"><input className="input" placeholder="உதாரணம்: கோவையில் இன்று என்ன முக்கிய செய்திகள்?"/><button className="btn" onClick={()=>alert("AI Assistant UI is ready. Add your Gemini API key to enable live answers.")}>Ask AI</button></div></div></section>
  </main>
  <footer className="footer"><div className="container"><strong>TamilNadu AI News</strong><p>Built as a modern Tamil Nadu news platform. Use licensed/permissioned feeds and link back to original publishers when integrating live news.</p></div></footer>
 </div>
}