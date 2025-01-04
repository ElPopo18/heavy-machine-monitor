import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  operatorName: string;
  equipmentName: string;
  scheduledDate: string;
  observations?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();
    
    const formattedDate = new Date(emailRequest.scheduledDate).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const html = `
      <h2>Nuevo Mantenimiento Asignado</h2>
      <p>Hola ${emailRequest.operatorName},</p>
      <p>Se te ha asignado un nuevo mantenimiento:</p>
      <ul>
        <li><strong>Equipo:</strong> ${emailRequest.equipmentName}</li>
        <li><strong>Fecha programada:</strong> ${formattedDate}</li>
        ${emailRequest.observations ? `<li><strong>Observaciones:</strong> ${emailRequest.observations}</li>` : ''}
      </ul>
      <p>Por favor, asegúrate de realizar el mantenimiento en la fecha indicada.</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Mantenimientos <onboarding@resend.dev>",
        to: emailRequest.to,
        subject: "Nuevo Mantenimiento Asignado",
        html: html,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const error = await res.text();
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);