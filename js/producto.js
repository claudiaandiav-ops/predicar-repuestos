async function cargarProducto() {

    // Obtener el ID de la URL
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    console.log("ID recibido:", id);

    // Validar ID
    if (!id) {
        document.getElementById("descripcion").textContent =
            "Producto no encontrado";
        return;
    }

    const { data, error } = await supabaseClient
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) {
        console.error(error);

        document.getElementById("descripcion").textContent =
            "Producto no encontrado";

        return;
    }

    console.log("Producto:", data);
    
    document.title = `${data.descripcion} | ${data.marca} | Predicar Repuestos`;
    // ==========================
// SEO DINÁMICO
// ==========================

const tituloSEO =
    `${data.descripcion} | ${data.marca} | Predicar Repuestos`;

const descripcionSEO =
    `Compra ${data.descripcion}, código ${data.codigo}, para ${data.marca} ${data.modelo}. Consulta precio y disponibilidad en Predicar Repuestos, Perú.`;

// Título de la pestaña
document.title = tituloSEO;

// Meta descripción
document
    .getElementById("meta-description")
    .setAttribute("content", descripcionSEO);

// URL actual del producto
const urlProducto = window.location.href;

// Canonical
document
    .getElementById("canonical")
    .setAttribute("href", urlProducto);

// Open Graph título
document
    .getElementById("og-title")
    .setAttribute("content", tituloSEO);

// Open Graph descripción
document
    .getElementById("og-description")
    .setAttribute("content", descripcionSEO);

// Open Graph URL
document
    .getElementById("og-url")
    .setAttribute("content", urlProducto);

// Imagen del producto
const imagenProducto = data.imagen
    ? data.imagen
    : "https://claudiaandiav-ops.github.io/predicar-repuestos/img/sinfoto.png";

// Open Graph imagen
document
    .getElementById("og-image")
    .setAttribute("content", imagenProducto);


// ==========================
// SCHEMA.ORG PRODUCT
// ==========================

const productoSchema = {
    "@context": "https://schema.org",
    "@type": "Product",

    "name": data.descripcion || "Repuesto automotriz",

    "description": descripcionSEO,

    "sku": data.codigo ? String(data.codigo) : "",

    "mpn": data.codigo ? String(data.codigo) : "",

    "category": data.categoria
        ? String(data.categoria)
        : "Repuestos automotrices",

    "url": urlProducto,

    "brand": {
        "@type": "Brand",
        "name": data.marca || "Predicar Repuestos"
    },

    "image": imagenProducto,

    "offers": {
        "@type": "Offer",

        "url": urlProducto,

        "priceCurrency": "PEN",

        "price": Number(data.precio || 0).toFixed(2),

        "availability":
            Number(data.stock) > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",

        "itemCondition":
            "https://schema.org/NewCondition",

        "seller": {
            "@type": "Organization",
            "name": "Predicar Repuestos"
        }
    }
};

document
    .getElementById("producto-schema")
    .textContent =
    JSON.stringify(productoSchema);


    // =========================
    // MOSTRAR PRODUCTO
    // =========================

    document.getElementById("descripcion").textContent =
        data.descripcion || "";

    document.getElementById("codigo").textContent =
        data.codigo || "";

    document.getElementById("marca").textContent =
        data.marca || "";

    document.getElementById("modelo").textContent =
        data.modelo || "";
const textoSEO = `Encuentra ${data.descripcion || "este repuesto automotriz"}, código ${data.codigo || "disponible por consulta"}, para vehículos ${data.marca || ""} ${data.modelo || ""}. Consulta precio y disponibilidad en Predicar Repuestos, especialistas en repuestos automotrices en Perú.`;

document.getElementById("texto-seo").textContent = textoSEO;

    // =========================
    // FOTO
    // =========================

    const foto = document.getElementById("foto");

    if (data.imagen) {

        foto.src = data.imagen;

    } else {

        foto.src =
            "https://placehold.co/500x400?text=Sin+Foto";

    }

    foto.alt =
        `${data.descripcion || "Repuesto"} ${data.marca || ""}`;


    // =========================
    // PRECIO
    // =========================

    document.getElementById("precio").textContent =
        Number(data.precio ?? 0).toFixed(2);


    // =========================
    // STOCK
    // =========================

    document.getElementById("stock").textContent =
        data.stock ?? "Consultar";


    const estado =
        document.getElementById("estado");

    if (Number(data.stock) > 0) {

        estado.innerHTML =
            "🟢 <strong>Disponible</strong>";

        estado.style.color = "green";

    } else {

        estado.innerHTML =
            "🔴 <strong>Agotado</strong>";

        estado.style.color = "red";

    }


    // =========================
    // WHATSAPP
    // =========================

    const telefono = "51972598538";

    const mensaje = `🔧 PREDICAR REPUESTOS

Hola 👋

Estoy interesado en el siguiente repuesto:

━━━━━━━━━━━━━━━━━━

🔧 Código:
${data.codigo || ""}

📦 Descripción:
${data.descripcion || ""}

🚗 Marca:
${data.marca || ""}

🚘 Modelo:
${data.modelo || ""}

💰 Precio:
S/ ${Number(data.precio ?? 0).toFixed(2)}

━━━━━━━━━━━━━━━━━━

¿Podrían indicarme disponibilidad?

Muchas gracias.`;

    document.getElementById("whatsapp").href =
        `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;


    // =========================
    // SEO DINÁMICO
    // =========================

    actualizarSEO(data);

}
function actualizarSEO(data) {

    const nombre =
        data.descripcion || "Repuesto automotriz";

    const marca =
        data.marca || "";

    const codigo =
        data.codigo || "";

    const precio =
        Number(data.precio ?? 0);
    // TÍTULO DE GOOGLE

    const titulo =
        `${nombre}${marca ? " " + marca : ""} | Predicar Repuestos`;
    document.title = titulo;
    // META DESCRIPCIÓN
    const descripcionSEO =
        `Compra o consulta ${nombre}` +
        `${marca ? " marca " + marca : ""}` +
        `${codigo ? ", código " + codigo : ""}` +
        `. Repuestos automotrices en Perú. Consulta precio y disponibilidad en Predicar Repuestos.`;
    const metaDescription =
        document.querySelector(
            'meta[name="description"]'
        );
    if (metaDescription) {
        metaDescription.setAttribute(
            "content",
            descripcionSEO
        );
    }


    // CANONICAL

    const urlActual =
        window.location.href;

    const canonical =
        document.querySelector(
            'link[rel="canonical"]'
        );

    if (canonical) {

        canonical.setAttribute(
            "href",
            urlActual
        );

    }


    // OPEN GRAPH TITLE

    const ogTitle =
        document.querySelector(
            'meta[property="og:title"]'
        );

    if (ogTitle) {

        ogTitle.setAttribute(
            "content",
            titulo
        );

    }


    // OPEN GRAPH DESCRIPTION

    const ogDescription =
        document.querySelector(
            'meta[property="og:description"]'
        );

    if (ogDescription) {

        ogDescription.setAttribute(
            "content",
            descripcionSEO
        );

    }


    // OPEN GRAPH URL

    const ogUrl =
        document.querySelector(
            'meta[property="og:url"]'
        );

    if (ogUrl) {

        ogUrl.setAttribute(
            "content",
            urlActual
        );

    }


    // OPEN GRAPH IMAGE

    const ogImage =
        document.querySelector(
            'meta[property="og:image"]'
        );

    if (ogImage) {

        ogImage.setAttribute(
            "content",
            data.imagen ||
            "https://claudiaandiav-ops.github.io/predicar-repuestos/img/sinfoto.png"
        );

    }


    // =========================
    // SCHEMA.ORG PRODUCT
    // =========================

    const productoSchema = {

        "@context": "https://schema.org",

        "@type": "Product",

        "name": nombre,

        "description": descripcionSEO,
         "image":
        data.imagen ||
        "https://claudiaandiav-ops.github.io/predicar-repuestos/img/sinfoto.png",

        "sku": codigo,

        "brand": {
            "@type": "Brand",
            "name":
                marca || "Predicar Repuestos"
        },

        "offers": {

            "@type": "Offer",

            "url": urlActual,

            "priceCurrency": "PEN",

            "price": precio,

            "availability":

                Number(data.stock ?? 0) > 0

                    ? "https://schema.org/InStock"

                    : "https://schema.org/OutOfStock"

        }

    };
        let schemaScript =
        document.getElementById("producto-schema");


    if (!schemaScript) {

        schemaScript =
            document.createElement("script");

        schemaScript.type =
            "application/ld+json";

        schemaScript.id =
            "producto-schema";

        document.head.appendChild(
            schemaScript
        );

    }


    schemaScript.textContent =
        JSON.stringify(productoSchema);

}


cargarProducto();