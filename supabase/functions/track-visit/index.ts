const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { visitor_id } = await req.json();
    if (!visitor_id) {
      return new Response(JSON.stringify({ error: 'visitor_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const today = new Date().toISOString().split('T')[0];

    // Upsert visit (ignore conflict = already visited today)
    await supabase
      .from('daily_visits')
      .upsert(
        { visitor_id, visit_date: today },
        { onConflict: 'visitor_id,visit_date', ignoreDuplicates: true }
      );

    // Count today's unique visitors
    const { count, error } = await supabase
      .from('daily_visits')
      .select('*', { count: 'exact', head: true })
      .eq('visit_date', today);

    if (error) throw error;

    return new Response(JSON.stringify({ count: count ?? 0, date: today }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
