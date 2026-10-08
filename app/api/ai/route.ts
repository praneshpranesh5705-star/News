import {NextResponse} from "next/server";
export async function POST(req:Request){
 const key=process.env.GEMINI_API_KEY;
 if(!key)return NextResponse.json({answer:"Gemini is not configured yet. Add GEMINI_API_KEY to your Vercel Environment Variables."},{status:200});
 try{
  const {question,news}=await req.json();
  const context=(news||[]).map((n:any)=>`Title: ${n.title}\nSource: ${n.source}\nDistrict: ${n.district}\nSummary: ${n.summary}`).join("\n\n");
  const prompt=`You are TamilNadu AI News, a neutral Tamil Nadu news assistant. Answer the user's question using only the supplied news context. Do not invent facts. If the context is insufficient, say so. Reply in the user's language. Keep it concise.\n\nUSER: ${question}\n\nNEWS CONTEXT:\n${context}`;
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
  if(!r.ok)return NextResponse.json({answer:"Gemini could not answer right now."},{status:200});
  const data=await r.json();const answer=data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return NextResponse.json({answer:answer||"No answer was generated."});
 }catch{return NextResponse.json({answer:"AI service is temporarily unavailable."},{status:200})}
}
