import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const OWNER_EMAIL = "askami2k22@gmail.com"

serve(async (req) => {
  try {
    const { shop_name, phone, city, user_email } = await req.json()

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Woko <onboarding@resend.dev>",
        to: [OWNER_EMAIL],
        subject: `🏪 Nouvelle demande de certification — ${shop_name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #E65100; padding: 24px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 22px;">🛍 Woko — Nouvelle demande</h1>
            </div>
            <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #1A1A1A;">Demande de certification vendeur</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #757575;">Boutique</td><td style="font-weight: 700;">${shop_name}</td></tr>
                <tr><td style="padding: 8px 0; color: #757575;">Téléphone</td><td>${phone}</td></tr>
                <tr><td style="padding: 8px 0; color: #757575;">Ville</td><td>${city}</td></tr>
                <tr><td style="padding: 8px 0; color: #757575;">Email</td><td>${user_email || "Non renseigné"}</td></tr>
              </table>
              <div style="margin-top: 24px;">
                <a href="https://bamako-steel-dev.xyz/market/" style="background: #E65100; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700;">
                  Voir le panel admin →
                </a>
              </div>
            </div>
          </div>
        `,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
})
