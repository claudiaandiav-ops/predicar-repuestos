const supabaseUrl = "https://oquhrxldiibkbjgcprxj.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdWhyeGxkaWlia2JqZ2NwcnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NTEzMjgsImV4cCI6MjEwMTUyNzMyOH0.UAlofN9sDu8iSzzVwLKmAWA7KZpxSP8kWLb7gGofed8";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

console.log("✅ Conexión con Supabase creada correctamente");