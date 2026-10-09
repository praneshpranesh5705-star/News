import { NextResponse } from "next/server";

type NewsItem={title:string;summary:string;url:string;published:string;source:string;category:string;district:string};

const FEEDS=[
 {url:"https://www.thehindu.com/news/national/tamil-nadu/feeder/default.rss",source:"The Hindu",category:"Tamil Nadu"},
 {url:"https://www.thehindu.com/news/cities/chennai/feeder/default.rss",source:"The Hindu",category:"Chennai"},
 {url:"https://www.thehindu.com/news/cities/Coimbatore/feeder/default.rss",source:"The Hindu",category:"Coimbatore"},
 {url:"https://www.thehindu.com/news/cities/Madurai/feeder/default.rss",source:"The Hindu",category:"Madurai"},
 {url:"https://www.thehindu.com/news/cities/Tiruchirapalli/feeder/default.rss",source:"The Hindu",category:"Trichy"},
 {url:"https://indianexpress.com/section/cities/chennai/feed/",source:"The Indian Express",category:"Chennai"},
];

const DISTRICTS=["Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kancheepuram","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupattur","Tiruppur","Tiruvallur","Tiruvannamalai","Vellore","Viluppuram","Virudhunagar","Ariyalur","Chengalpattu","Kanyakumari"];

function clean(value:string){return value.replace(/<[^>]*>/g," ").replace(/<!\[CDATA\[|\]\]>/g,"").replace(/&amp;/g,"&").replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&nbsp;/g," ").replace(/\s+/g," ").trim()}
function tag(xml:string,name:string){const m=xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`,`i`));return m?clean(m[1]):""}
function districtFrom(text:string,fallback:string){const lower=text.toLowerCase();return DISTRICTS.find(n=>lower.includes(n.toLowerCase()))||fallback||"Tamil Nadu"}

async function readFeed(feed:{url:string;source:string;category:string}):Promise<NewsItem[]>{
 try{
  const res=await fetch(feed.url,{next:{revalidate:60},headers:{"User-Agent":"TamilNadu-AI-News/1.0"}});if(!res.ok)return [];
  const xml=await res.text();
  return [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)].slice(0,20).map(block=>{const raw=block[0];const title=tag(raw,"title");const description=tag(raw,"description");const link=tag(raw,"link");const pub=tag(raw,"pubDate");return{title,summary:description.slice(0,280),url:link,published:pub,source:feed.source,category:feed.category,district:districtFrom(title+" "+description,feed.category)}}).filter(x=>x.title&&x.url);
 }catch{return []}
}

export async function GET(){
 try{
  const lists=await Promise.all(FEEDS.map(readFeed));const seen=new Set<string>();
  const items=lists.flat().filter(x=>{const key=x.title.toLowerCase().replace(/[^a-z0-9\u0b80-\u0bff]+/g,"");if(seen.has(key))return false;seen.add(key);return true}).sort((a,b)=>Date.parse(b.published||"")-Date.parse(a.published||""));
  return NextResponse.json({items,updatedAt:new Date().toISOString(),live:true,refreshSeconds:60,sources:[...new Set(items.map(x=>x.source))]},{headers:{"Cache-Control":"s-maxage=60, stale-while-revalidate=300"}});
 }catch{return NextResponse.json({items:[],updatedAt:new Date().toISOString(),live:false,error:"News feeds are temporarily unavailable."},{status:200})}
}
