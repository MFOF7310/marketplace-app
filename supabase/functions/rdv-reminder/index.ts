import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
const SUPABASE_URL = "https://kqtqzzfcttzouttnfgug.supabase.co"

const sendEmail = async (to: string, subject: string, html: string) => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Woko <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  })
  return res.json()
}

serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY!)

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*, vendors(name, phone, user_id), products(title)')
      .eq('appointment_date', tomorrowStr)
      .eq('status', 'pending')

    if (error) throw error
    if (!appointments?.length) {
      return new Response(JSON.stringify({ message: "No appointments tomorrow", count: 0 }), { status: 200 })
    }

    let sent = 0
    for (const appt of appointments) {
      const date = new Date(appt.appointment_date).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })
      const time = appt.appointment_time?.slice(0,5) || ""
      const vendorName = appt.vendors?.name || "Vendeur"
      const service = appt.products?.title || "Service"

      if (appt.buyer_id) {
        const { data: buyerAuth } = await supabase.auth.admin.getUserById(appt.buyer_id)
        if (buyerAuth?.user?.email) {
          await sendEmail(buyerAuth.user.email, `⏰ Rappel RDV demain — ${vendorName}`,
            `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <div style="background:#E65100;padding:24px;border-radius:8px 8px 0 0"><h1 style="color:white;margin:0;font-size:20px">🛍 Woko — Rappel RDV</h1></div>
              <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px">
                <p>Bonjour <strong>${appt.buyer_name}</strong>, vous avez un RDV demain :</p>
                <div style="background:#FFF3E0;border-left:4px solid #E65100;padding:16px;border-radius:4px;margin:16px 0">
                  <p><strong>📋 Service :</strong> ${service}</p>
                  <p><strong>🏪 Vendeur :</strong> ${vendorName}</p>
                  <p><strong>📅 Date :</strong> ${date}</p>
                  <p><strong>🕐 Heure :</strong> ${time}</p>
                </div>
              </div>
            </div>`)
          sent++
        }
      }

      if (appt.vendors?.user_id) {
        const { data: vendorAuth } = await supabase.auth.admin.getUserById(appt.vendors.user_id)
        if (vendorAuth?.user?.email) {
          await sendEmail(vendorAuth.user.email, `📅 RDV demain — ${appt.buyer_name}`,
            `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <div style="background:#E65100;padding:24px;border-radius:8px 8px 0 0"><h1 style="color:white;margin:0;font-size:20px">🛍 Woko — Rappel vendeur</h1></div>
              <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px">
                <p>Bonjour <strong>${vendorName}</strong>, vous avez un RDV demain :</p>
                <div style="background:#E8F5E9;border-left:4px solid #2E7D32;padding:16px;border-radius:4px;margin:16px 0">
                  <p><strong>👤 Client :</strong> ${appt.buyer_name}</p>
                  <p><strong>📋 Service :</strong> ${service}</p>
                  <p><strong>📅 Date :</strong> ${date}</p>
                  <p><strong>🕐 Heure :</strong> ${time}</p>
                </div>
              </div>
            </div>`)
          sent++
        }
      }
    }

    return new Response(JSON.stringify({ appointments: appointments.length, emails: sent }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
