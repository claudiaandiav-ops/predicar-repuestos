let productosGlobal = [];
let marcaSeleccionada = "Todas";
let categoriaSeleccionada = "Todas";
async function iniciarAplicacion() {

    console.log("🚀 Iniciando aplicación");

    const { data, error } = await supabaseClient
    .from("productos")
    .select("*")
    .order("descripcion")
    .range(0, 5000);

    if (error) {
        console.error(error);
        return;
    }

    productosGlobal = data;
mostrarProductos(data);
crearFiltrosMarcas();


}
function aplicarFiltros() {

    let resultado = productosGlobal;

    if (marcaSeleccionada !== "Todas") {

        resultado = resultado.filter(
            p => p.marca === marcaSeleccionada
        );

    }

    mostrarProductos(resultado);

}
function mostrarProductos(productos) {

    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    productos.forEach(producto => {

        const tarjeta = document.createElement("div");

        tarjeta.className = "card";
const descripcion = String(producto.descripcion || producto.codigo || "");

const slug = descripcion
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
    tarjeta.innerHTML = `
<div class="imagen-producto">
    <img src="img/sinfoto.png" alt="Sin Foto">
</div>

<div class="contenido-card">
    <h2>${producto.descripcion}</h2>

    <hr>

    <p>🏷️ <strong>Código:</strong> ${producto.codigo}</p>

    <p>🚗 <strong>Marca:</strong> ${producto.marca}</p>

    <p>🚘 <strong>Modelo:</strong> ${producto.modelo}</p>

    <div class="stock">
        Disponible
    </div>

    <div class="precio">
        S/ ${Number(producto.precio ?? 0).toLocaleString("es-PE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}
    </div>

    <a href="producto.html?id=${producto.id}&producto=${slug}" class="btn-producto">
        Ver producto
    </a>

</div>

`;    

        contenedor.appendChild(tarjeta);

    });

}
function mostrarSugerencias(texto){

    const contenedor =
        document.getElementById("sugerencias");

    contenedor.innerHTML = "";

    if(texto.length < 2){

        contenedor.style.display = "none";
        return;

    }

    const textoBusqueda =
        texto.toLowerCase();

    const sugerencias =
        productosGlobal.filter(producto =>

            (producto.descripcion || "")
            .toLowerCase()
            .includes(textoBusqueda)

            ||

            (producto.codigo || "")
            .toLowerCase()
            .includes(textoBusqueda)

            ||

            (producto.marca || "")
            .toLowerCase()
            .includes(textoBusqueda)

        ).slice(0,8);

    if(sugerencias.length===0){

        contenedor.style.display="none";
        return;

    }

    sugerencias.forEach(producto=>{

        const item =
            document.createElement("div");

        item.className="sugerencia";

        const texto = textoBusqueda;

const codigo = (producto.codigo || "").replace(
    new RegExp(texto, "ig"),
    m => `<mark>${m}</mark>`
);

const descripcion = (producto.descripcion || "").replace(
    new RegExp(texto, "ig"),
    m => `<mark>${m}</mark>`
);

item.innerHTML = `
<div class="sugerencia-codigo">
🔧 ${codigo}
</div>

<div class="sugerencia-descripcion">
${descripcion}
</div>

<div class="sugerencia-extra">
🚗 ${producto.marca || "Sin marca"}
&nbsp;&nbsp;•&nbsp;&nbsp;
💰 S/ ${Number(producto.precio ?? 0).toLocaleString("es-PE",{
    minimumFractionDigits:2,
    maximumFractionDigits:2
})}
</div>
`;

        item.onclick=()=>{

            document.getElementById("buscador").value=
                producto.codigo;

            contenedor.style.display="none";

            buscarProductos(producto.codigo);

        };

        contenedor.appendChild(item);

    });

    contenedor.style.display="block";

}
function crearFiltrosMarcas() {

    const select = document.getElementById("marca");

    select.innerHTML = `
        <option value="">Todas las marcas</option>
    `;

    const marcas = [
        ...new Set(
            productosGlobal
                .map(p => p.marca)
                .filter(m => m)
                .sort()
        )
    ];

    marcas.forEach(marca => {

        const option = document.createElement("option");

        option.value = marca;

        option.textContent = marca;

        select.appendChild(option);

    });

}
async function buscarProductos(texto) {

    texto = texto.trim();

    let consulta = supabaseClient
        .from("productos")
        .select("*");

    // Filtrar por categoría
    if (categoria.value !== "") {
        consulta = consulta.eq("categoria", categoria.value);
    }
    // Filtrar por marca
if (marca.value !== "") {
    consulta = consulta.eq("marca", marca.value);
}

    // Filtrar por texto
    if (texto !== "") {
        consulta = consulta.or(
            `codigo.ilike.%${texto}%,
             descripcion.ilike.%${texto}%,
             marca.ilike.%${texto}%,
             modelo.ilike.%${texto}%`
            .replace(/\s/g, "")
        );
    }

    const { data, error } = await consulta
    .order("descripcion")
    .range(0, 5000);

    if (error) {
        console.error(error);
        return;
    }

    mostrarProductos(data);
    }

async function cargarCategorias() {
    const { data, error } = await supabaseClient
        .from("productos")
        .select("categoria");
    console.log("DATA:", data);
    if (error) {
        console.error(error);
        return;
    }
    const categorias = [...new Set(
        data
            .map(p => p.categoria)
            .filter(c => c && c.trim() !== "")
    )].sort();

    const select = document.getElementById("categoria");
    categorias.forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.value = categoria;
        opcion.textContent = categoria;
        select.appendChild(opcion);
    });
}
const buscador = document.getElementById("buscador");
const categoria = document.getElementById("categoria");
const marca = document.getElementById("marca");
buscador.addEventListener("input", () => {

    buscarProductos(
        buscador.value
    );

    mostrarSugerencias(
        buscador.value
    );

});
document.addEventListener("click",(e)=>{

    if(!e.target.closest(".search-box")){

        document.getElementById("sugerencias")
            .style.display="none";

    }

});
    
categoria.addEventListener("change", () => {
    buscarProductos(buscador.value);
});
marca.addEventListener("change", () => {
    buscarProductos(buscador.value);
});

iniciarAplicacion();

cargarCategorias();


