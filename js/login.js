document
.getElementById("login")
.addEventListener("click", iniciarSesion);

async function iniciarSesion() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabaseClient.auth.signInWithPassword({

        email,
        password

    });

    if (error) {

        alert(error.message);
        return;

    }

    window.location.href = "admin.html";

}