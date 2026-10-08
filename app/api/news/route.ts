import { NextResponse } from "next/server";

type NewsItem={title:string;summary:string;url:string;published:string;source:string;category:string;district:string};
const FEEDS=[
 {url:"https://www.thehindu.com/news/national/tamil-nadu/feeder/default.rss",source:"The Hindu",category:"Tamil Nadu"},
 {url:"https://indianexpress.com/section/cities/chennai/feed/",source:"The Indian Express",category:"Chennai"},
];
function clean(value:string){return value.replace(/<[^>]*>/g," ").replace(/&amp;/g,"&").replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g," ").trim()}
function tag(xml:string,name:string){const m=xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`,`i`));return m?clean(m[1]):""}
function districtFrom(text:string){const names=["Chennai","Coimbatore","Madurai","Salem","Tiruppur","Trichy","Erode","Tirunelveli","Thanjavur","Vellore","Thoothukudi","Nilgiris","Kanyakumari","Dindigul","Namakkal","Karur","Cuddalore","Villupuram","Tenkasi","Pudukkottai","Dharmapuri","Krishnagiri","Theni","Sivaganga","Virudhunagar","Ramanathapuram","Nagapattinam","Mayiladuthurai","Tiruvallur","Kancheepuram","Chengalpattu","Tiruvannamalai","Ariyalur","Perambalur","Kallakurichi","Ranipet","Tirupattur"];return names.find(n=>text.toLowerCase().includes(n.toLowerCase()))||"Tamil Nadu"}
async function readFeed(feed:{url:string;source:string;category:string}):Promise<NewsItem[]>{
 const res=await fetch(feed.url,{next:{revalidate:300},headers:{"User-Agent":"TamilNadu-AI-News/1.0"}});if(!res.ok)return [];
 const xml=await res.text();
 return [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)].slice(0,12).map(block=>{const raw=block[0];const title=tag(raw,"title");const description=tag(raw,"description");const link=tag(raw,"link");const pub=tag(raw,"pubDate");return{title,summary:description.slice(0,240),url:link,published:pub,source:feed.source,category:feed.category,district:districtFrom(title+" "+description)}}).filter(x=>x.title&&x.url)
}
export async function GET(){try{const lists=await Promise.all(FEEDS.map(readFeed));const seen=new Set<string>();const items=lists.flat().filter(x=>{const key=x.title.toLowerCase();if(seen.has(key))return false;seen.add(key);return true}).sort((a,b)=>Date.parse(b.published)-Date.parse(a.published));return NextResponse.json({items,updatedAt:new Date().toISOString()})}catch{return NextResponse.json({items:[],error:"News feeds are temporarily unavailable."},{status:200})}}
