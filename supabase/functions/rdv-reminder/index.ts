import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_KEY = Deno.env.get("SERVICE_ROLE_KEY")

const sendEmail = async (to: string, subject: string, html: string) => {
  await fetch("https://api.resend.com/emails", {
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
}

serve(async () => {
  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)

    // Get tomorrow's date
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    // Get all pending appointments for tomorrow
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        vendors (name, phone, user_id),
        products (title)
      `)
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

      // Email to buyer
      if (appt.buyer_id) {
        const { data: buyerAuth } = await supabase.auth.admin.getUserById(appt.buyer_id)
        if (buyerAuth?.user?.email) {
          await sendEmail(
            buyerAuth.user.email,
            `⏰ Rappel RDV demain — ${vendorName}`,
            `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <div style="background:#E65100;padding:24px;border-radius:8px 8px 0 0">
                <h1 style="color:white;margin:0;font-size:20px">🛍 Woko — Rappel de rendez-vous</h1>
              </div>
              <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px">
                <p style="font-size:16px;color:#1A1A1A">Bonjour <strong>${appt.buyer_name}</strong>,</p>
                <p>Vous avez un rendez-vous <strong>demain</strong> :</p>
                <div style="background:#FFF3E0;border-left:4px solid #E65100;padding:16px;border-radius:4px;margin:16px 0">
                  <p style="margin:0 0 8px"><strong>📋 Service :</strong> ${service}</p>
                  <p style="margin:0 0 8px"><strong>🏪 Vendeur :</strong> ${vendorName}</p>
                  <p style="margin:0 0 8px"><strong>📅 Date :</strong> ${date}</p>
                  <p style="margin:0"><strong>🕐 Heure :</strong> ${time}</p>
                </div>
                <p style="color:#757575;font-size:13px">En cas d'empêchement, contactez le vendeur directement via WhatsApp.</p>
              </div>
            </div>
            `
          )
          sent++
        }
      }

      // Email to vendor
      if (appt.vendors?.user_id) {
        const { data: vendorAuth } = await supabase.auth.admin.getUserById(appt.vendors.user_id)
        if (vendorAuth?.user?.email) {
          await sendEmail(
            vendorAuth.user.email,
            `📅 RDV demain — ${appt.buyer_name}`,
            `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <div style="background:#E65100;padding:24px;border-radius:8px 8px 0 0">
                <h1 style="color:white;margin:0;font-size:20px">🛍 Woko — Rappel vendeur</h1>
              </div>
              <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px">
                <p style="font-size:16px;color:#1A1A1A">Bonjour <strong>${vendorName}</strong>,</p>
                <p>Vous avez un rendez-vous <strong>demain</strong> :</p>
                <div style="background:#E8F5E9;border-left:4px solid #2E7D32;padding:16px;border-radius:4px;margin:16px 0">
                  <p style="margin:0 0 8px"><strong>👤 Client :</strong> ${appt.buyer_name}</p>
                  <p style="margin:0 0 8px"><strong>📋 Service :</strong> ${service}</p>
                  <p style="margin:0 0 8px"><strong>📅 Date :</strong> ${date}</p>
                  <p style="margin:0"><strong>🕐 Heure :</strong> ${time}</p>
                </div>
                <p style="color:#757575;font-size:13px">Pensez à confirmer le rendez-vous depuis votre espace vendeur.</p>
              </div>
            </div>
            `
          )
          sent++
        }
      }
    }

    return new Response(
      JSON.stringify({ message: "Reminders sent", appointments: appointments.length, emails: sent }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
