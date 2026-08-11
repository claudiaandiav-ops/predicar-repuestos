async function cargarProducto() {

    // Obtener el ID de la URL
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    console.log("ID recibido:", id);

    const { data, error } = await supabaseClient
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    console.log("Producto:", data);
    document.getElementById("descripcion").textContent = data.descripcion;

document.getElementById("codigo").textContent = data.codigo;

document.getElementById("marca").textContent = data.marca;

document.getElementById("modelo").textContent = data.modelo;
const foto = document.getElementById("foto");

if (data.imagen) {

    foto.src = data.imagen;

} else {

    foto.src = "https://placehold.co/500x400?text=Sin+Foto";

}

document.getElementById("precio").textContent = Number(data.precio).toFixed(2);

document.getElementById("stock").textContent = data.stock;

const estado = document.getElementById("estado");

if (data.stock > 0) {

    estado.innerHTML = "🟢 <strong>Disponible</strong>";

    estado.style.color = "green";

} else {

    estado.innerHTML = "🔴 <strong>Agotado</strong>";

    estado.style.color = "red";

}

const telefono = "51972598538";

const mensaje = `🔧 PREDICAR REPUESTOS

Hola 👋

Estoy interesado en el siguiente repuesto:

━━━━━━━━━━━━━━━━━━

🔧 Código:
${data.codigo}

📦 Descripción:
${data.descripcion}

🚗 Marca:
${data.marca}

🚘 Modelo:
${data.modelo}

💰 Precio:
S/ ${Number(data.precio).toFixed(2)}

━━━━━━━━━━━━━━━━━━

¿Podrían indicarme disponibilidad?

Muchas gracias.`;

document.getElementById("whatsapp").href =
`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

}

cargarProducto();