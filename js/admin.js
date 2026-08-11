verificarSesion();
alert("ESTE ES MI ADMIN.JS");
console.log("ADMIN JS ACTUALIZADO");
let productosGlobal = [];
let productoEditando = null;
let ultimoProductoEditado = null;
let paginaActual = 1;
const productosPorPagina = 20;

function obtenerProductosPaginados(productos) {

    const inicio =
        (paginaActual - 1) * productosPorPagina;

    const fin =
        inicio + productosPorPagina;

    return productos.slice(inicio, fin);

}


async function verificarSesion() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {
        window.location.href = "login.html";
        return;
    }

    console.log("Usuario:", session.user.email);

    await cargarTablaProductos();

}
document.getElementById("guardar").addEventListener("click", guardarProducto);

async function guardarProducto() {
    console.log("productoEditando:", productoEditando);

    const codigo = document.getElementById("codigo").value;
    const descripcion = document.getElementById("descripcion").value;
    const marca = document.getElementById("marca").value;
    const modelo = document.getElementById("modelo").value;

    let error;

if(productoEditando){
    
    const resultado = await supabaseClient
        .from("productos")
        .update({
            codigo,
            descripcion,
            marca,
            modelo
        })
        .eq("id", productoEditando);

    error = resultado.error;

}else{

    const resultado = await supabaseClient
        .from("productos")
        .insert([
            {
                codigo,
                descripcion,
                marca,
                modelo
            }
        ]);

    error = resultado.error;

}

    if (error) {
        console.error(error);
        alert("Error al guardar el producto");
        return;
    }

    // Actualizar la tabla automáticamente
    if (productoEditando) {
    ultimoProductoEditado = productoEditando;
}
    await cargarTablaProductos();
    setTimeout(() => {

    ultimoProductoEditado = null;

    mostrarTabla(
        obtenerProductosPaginados(
            productosGlobal
        )
    );

}, 5000);

alert("✅ Producto guardado correctamente");

productoEditando = null;
    document.getElementById("guardar").textContent =
    "Guardar producto";

document.getElementById("cancelarEdicion").style.display =
    "none";

    document.getElementById("codigo").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("modelo").value = "";

}
document
.getElementById("importarExcel")
.addEventListener(
    "click",
    importarExcel
);
document
.getElementById("logout")
.addEventListener("click", cerrarSesion);
document
.getElementById("cancelarEdicion")
.addEventListener(
    "click",
    cancelarEdicion
);

document
    .getElementById("exportarExcel")
    .addEventListener(
        "click",
        exportarExcel
    );

async function cerrarSesion() {

    await supabaseClient.auth.signOut();

    window.location.href = "login.html";

}
async function cargarTablaProductos(){
    const { data, error, count } = await supabaseClient
    .from("productos")
    .select("*", { count: "exact" })
    .order("descripcion")
    .range(0, 5000);

    if(error){

        console.error(error);

        return;

    }
    
    productosGlobal = data;
    actualizarDashboard();
    document.getElementById(
    "contadorProductos"
).textContent =
    `Total productos: ${productosGlobal.length}`;
        
const totalPaginas =
    Math.ceil(
        productosGlobal.length /
        productosPorPagina
    );

if(paginaActual > totalPaginas){
    paginaActual = totalPaginas || 1;
}

mostrarTabla(
    obtenerProductosPaginados(productosGlobal)
);

renderizarPaginacion();

}
let campoOrden = "";
let direccionOrden = "asc";
function actualizarDashboard() {

    document.getElementById("dashProductos").textContent =
        productosGlobal.length;

    const stockTotal =
        productosGlobal.reduce(
            (suma, p) => suma + Number(p.stock || 0),
            0
        );

    document.getElementById("dashStock").textContent =
        stockTotal.toLocaleString();

    const valorInventario =
        productosGlobal.reduce(
            (suma, p) =>
                suma +
                (Number(p.stock || 0) *
                 Number(p.precio || 0)),
            0
        );

    document.getElementById("dashValor").textContent =
        "S/ " +
        valorInventario.toLocaleString(
            "es-PE",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    const sinStock =
        productosGlobal.filter(
            p => Number(p.stock) <= 0
        ).length;

    document.getElementById("dashSinStock").textContent =
        sinStock;

    const sinImagen =
        productosGlobal.filter(
            p =>
                !p.imagen ||
                p.imagen.trim() === ""
        ).length;

    document.getElementById("dashSinImagen").textContent =
        sinImagen;

    const categorias =
        new Set(
            productosGlobal.map(
                p => p.categoria
            )
        );

    document.getElementById("dashCategorias").textContent =
        categorias.size;

}
function mostrarTabla(productos){

    const contenedor = document.getElementById("tablaProductos");

    contenedor.innerHTML = "";

    let html = `

<table class="table table-striped table-hover">

<thead>

<tr>

<th onclick="ordenarPor('codigo')">
Código ↕
</th>

<th onclick="ordenarPor('descripcion')">
Descripción ↕
</th>

<th onclick="ordenarPor('marca')">
Marca ↕
</th>

<th onclick="ordenarPor('precio')">
Precio ↕
</th>

<th onclick="ordenarPor('stock')">
Stock ↕
</th>

<th>Acciones</th>

</tr>

</thead>

<tbody>

`;

    productos.forEach(producto=>{

    const claseResaltado =
    producto.id === ultimoProductoEditado
    ? "table-success"
    : "";

html += `

<tr class="${claseResaltado}">

<td>${producto.codigo}</td>

<td>${producto.descripcion}</td>

<td>${producto.marca}</td>

<td>S/ ${Number(producto.precio).toFixed(2)}</td>

<td>${producto.stock}</td>

<td>
<button
class="btn btn-warning btn-sm"
onclick="editarProducto(${producto.id})">
✏
</button>

<button
class="btn btn-danger btn-sm"
onclick="eliminarProducto(${producto.id})">
🗑
</button>

</td>
</tr>
`;


    });

    html += "</tbody></table>";

    contenedor.innerHTML = html;
    }

function editarProducto(id){
    productoEditando = id;

    const producto =
        productosGlobal.find(
            p => p.id === id
        );

    if(!producto) return;

    document.getElementById("codigo").value =
        producto.codigo || "";

    document.getElementById("descripcion").value =
        producto.descripcion || "";

    document.getElementById("marca").value =
        producto.marca || "";

    document.getElementById("modelo").value =
        producto.modelo || "";

    console.log("Editando:", producto);
    productoEditando = id;

document.getElementById("guardar").textContent =
    "Actualizar producto";

document.getElementById("cancelarEdicion").style.display =
    "block";
}
function cancelarEdicion(){

    productoEditando = null;

    document.getElementById("codigo").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("modelo").value = "";

    document.getElementById("guardar").textContent =
        "Guardar producto";

    document.getElementById("cancelarEdicion").style.display =
        "none";

}
async function eliminarProducto(id){

    const confirmar = confirm(
        "¿Deseas eliminar este producto?"
    );

    if(!confirmar) return;

    const { error } = await supabaseClient
        .from("productos")
        .delete()
        .eq("id", id);

    if(error){

        console.error(error);

        alert("Error al eliminar");

        return;

    }

    await cargarTablaProductos();

alert("Producto eliminado");

}

function renderizarPaginacion() {

    const totalPaginas =
        Math.ceil(
            productosGlobal.length /
            productosPorPagina
        );

    let html = "";

    for(let i = 1; i <= totalPaginas; i++){

        html += `
            <button
                class="btn btn-sm btn-primary m-1"
                onclick="cambiarPagina(${i})">

                ${i}

            </button>
        `;

    }

    document
        .getElementById("paginacion")
        .innerHTML = html;

}


function cambiarPagina(numero){

    paginaActual = numero;

    mostrarTabla(
        obtenerProductosPaginados(
            productosGlobal
        )
    );

}
function ordenarPor(campo){

    if(campoOrden === campo){

        direccionOrden =
            direccionOrden === "asc"
            ? "desc"
            : "asc";

    }else{

        campoOrden = campo;
        direccionOrden = "asc";

    }

    productosGlobal.sort((a,b)=>{

        let valorA = a[campo];
        let valorB = b[campo];

        if(typeof valorA === "string")
            valorA = valorA.toLowerCase();

        if(typeof valorB === "string")
            valorB = valorB.toLowerCase();

        if(valorA < valorB)
            return direccionOrden === "asc" ? -1 : 1;

        if(valorA > valorB)
            return direccionOrden === "asc" ? 1 : -1;

        return 0;

    });

    mostrarTabla(
        obtenerProductosPaginados(productosGlobal)
    );

}

window.addEventListener("DOMContentLoaded", () => {

    document
    .getElementById("buscarProducto")
    .addEventListener("input", filtrarProductos);

});

function filtrarProductos() {

    

    const texto = document
        .getElementById("buscarProducto")
        .value
        
        .toLowerCase();

     console.log("Buscando:", texto);

    const filtrados = productosGlobal.filter(producto =>

        (producto.codigo || "")
            .toLowerCase()
            .includes(texto)

        ||

        (producto.descripcion || "")
            .toLowerCase()
            .includes(texto)

        ||

        (producto.marca || "")
            .toLowerCase()
            .includes(texto)

        ||

        (producto.modelo || "")
            .toLowerCase()
            .includes(texto)

    );

    console.log("Resultados:", filtrados);

    mostrarTabla(filtrados);

}
function exportarExcel(){
    console.log("ProductosGlobal:", productosGlobal);
console.log("Cantidad:", productosGlobal.length);

    const datos = productosGlobal.map(producto => ({

    codigo: producto.codigo,

    descripcion: producto.descripcion,

    marca: producto.marca,

    modelo: producto.modelo,

    categoria: producto.categoria,

    anio_desde: producto.anio_desde,

    anio_hasta: producto.anio_hasta,

    precio: producto.precio,

    stock: producto.stock,

    imagen: producto.imagen

}));

    const hoja = XLSX.utils.json_to_sheet(datos);

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        libro,
        hoja,
        "Productos"
    );

    const fecha = new Date()
        .toISOString()
        .split("T")[0];

    XLSX.writeFile(
        libro,
        `productos_${fecha}.xlsx`
    );

}
async function importarExcel() {

    const archivo =
        document
        .getElementById("archivoExcel")
        .files[0];

    if (!archivo) {
        alert("Seleccione un archivo Excel");
        return;
    }

    const lector = new FileReader();

    lector.onload = async function (e) {

        const datos = new Uint8Array(e.target.result);

        const libro = XLSX.read(datos, {
            type: "array"
        });

        const hoja =
            libro.Sheets[
                libro.SheetNames[0]
            ];

        let productos =
            XLSX.utils.sheet_to_json(hoja);

        productos = productos.map(p => ({

            codigo: p.codigo || "",

            descripcion: p.descripcion || "",

            marca: p.marca || "",

            modelo: p.modelo || "",

            categoria: p.categoria || "",

            anio_desde: p.anio_desde || null,

            anio_hasta: p.anio_hasta || null,

            precio: Number(p.precio) || 0,

            stock: Number(p.stock) || 0,

            imagen: p.imagen || ""

        }));

        // Obtener productos actuales

        const { data: productosBD } =
            await supabaseClient
                .from("productos")
                .select("codigo, marca, modelo");

        const indice = new Set();

        productosBD.forEach(p => {

            indice.add(
                `${p.codigo}|${p.marca}|${p.modelo}`
            );

        });

        let nuevos = 0;
        let actualizados = 0;

        productos.forEach(producto => {

            const clave =
                `${producto.codigo}|${producto.marca}|${producto.modelo}`;

            if (indice.has(clave)) {

                actualizados++;

            } else {

                nuevos++;

            }

        });

        const { error } =
            await supabaseClient
                .from("productos")
                .upsert(productos, {
                    onConflict: "codigo,marca,modelo"
                });

        if (error) {

            console.error(error);

            alert("Error al importar");

            return;

        }

        await cargarTablaProductos();

        alert(
`✅ Importación finalizada

🆕 Productos nuevos: ${nuevos}

🔄 Productos actualizados: ${actualizados}

📦 Total procesados: ${productos.length}`
        );

    };

    lector.readAsArrayBuffer(archivo);

}
