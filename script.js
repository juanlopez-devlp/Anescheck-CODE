document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".formulario-paciente");
    const guardarBtn = form.querySelector(".btn-guardar");
    const limpiarBtn = form.querySelector(".btn-limpiar");

    const logoAlert = "imglogo.jpg"; // ruta de tu logo
    const logoSize = 150; // tamaño grande del logo en la alerta

    // --- FUNCIONES FORMULARIO ---
    function guardarDatos() {
        const datos = {
            nombre: document.getElementById("nombre")?.value || "",
            apellido: document.getElementById("apellido")?.value || "",
            historiaClinica: document.getElementById("historiaClinica")?.value || "",
            observaciones: document.getElementById("observaciones")?.value || "",
            alergias: document.getElementById("alergias")?.value || ""
        };
        localStorage.setItem("datosPaciente", JSON.stringify(datos));
        Swal.fire({
            title: "AnestCheck",
            text: "✅ Datos guardados correctamente",
            imageUrl: logoAlert,
            imageWidth: logoSize,
            imageHeight: logoSize,
            customClass: { popup: 'custom-swal' }
        });
    }

    function cargarDatos() {
        const datosGuardados = localStorage.getItem("datosPaciente");
        if (datosGuardados) {
            const datos = JSON.parse(datosGuardados);
            document.getElementById("nombre").value = datos.nombre || "";
            document.getElementById("apellido").value = datos.apellido || "";
            document.getElementById("historiaClinica").value = datos.historiaClinica || "";
            document.getElementById("observaciones").value = datos.observaciones || "";
            document.getElementById("alergias").value = datos.alergias || "";
        }
    }

    function limpiarDatos() {
        localStorage.removeItem("datosPaciente");
        form.reset();
        Swal.fire({
            title: "AnestCheck",
            text: "🧹 Formulario limpio",
            imageUrl: logoAlert,
            imageWidth: logoSize,
            imageHeight: logoSize,
            customClass: { popup: 'custom-swal' }
        });
    }

    // --- EVENTOS ---
    if (guardarBtn) {
        guardarBtn.addEventListener("click", (e) => {
            e.preventDefault();
            guardarDatos();
        });
    }

    if (limpiarBtn) {
        limpiarBtn.addEventListener("click", limpiarDatos);
    }

    cargarDatos(); // cargar datos al iniciar

    // --- FUNCIONALIDAD TARJETAS ---
    const tarjetas = document.querySelectorAll(".card");

    tarjetas.forEach((tarjeta, index) => {
        if (index !== 0) {
            tarjeta.style.pointerEvents = "none";
            tarjeta.style.opacity = "0.5";
        }
    });

    tarjetas.forEach((tarjeta, index) => {
        const btns = tarjeta.querySelectorAll(".btn-success, .btn-danger");
        const cardTitle = tarjeta.querySelector(".card-title").textContent;
        let alertaInterval;

        btns.forEach(btn => {
            btn.addEventListener("click", () => {
                const tarjetaBody = tarjeta.querySelector(".card-body");

                if (tarjetaBody.classList.contains("verde") || tarjetaBody.classList.contains("rojo")) {
                    tarjetaBody.classList.remove("verde", "rojo");
                    clearInterval(alertaInterval);
                    actualizarSiguienteTarjeta(index, tarjetaBody);
                    return;
                }

                if (btn.classList.contains("btn-success")) {
                    tarjetaBody.classList.add("verde");
                    Swal.fire({
                        title: "AnestCheck",
                        text: `✔️ Seleccionado correctamente ${cardTitle}`,
                        imageUrl: logoAlert,
                        imageWidth: logoSize,
                        imageHeight: logoSize,
                        customClass: { popup: 'custom-swal' }
                    });
                } else {
                    tarjetaBody.classList.add("rojo");
                    alertaInterval = setInterval(() => {
                        if (!tarjetaBody.classList.contains("rojo")) {
                            clearInterval(alertaInterval);
                        } else {
                            Swal.fire({
                                title: "AnestCheck",
                                text: `❌ Verificar ${cardTitle}`,
                                imageUrl: logoAlert,
                                imageWidth: logoSize,
                                imageHeight: logoSize,
                                customClass: { popup: 'custom-swal' }
                            });
                            navigator.vibrate(200);
                        }
                    }, 60000);
                }

                actualizarSiguienteTarjeta(index, tarjetaBody);
                revisarChecklist();
            });
        });
    });

    function actualizarSiguienteTarjeta(index, tarjetaBody) {
        if (index < tarjetas.length - 1) {
            const siguienteTarjeta = tarjetas[index + 1];
            if (tarjetaBody.classList.contains("verde")) {
                siguienteTarjeta.style.pointerEvents = "auto";
                siguienteTarjeta.style.opacity = "1";
            } else {
                siguienteTarjeta.style.pointerEvents = "none";
                siguienteTarjeta.style.opacity = "0.5";
            }
        }
    }

    function revisarChecklist() {
        const todasMarcadas = Array.from(tarjetas).every(tarjeta => {
            const body = tarjeta.querySelector(".card-body");
            return body.classList.contains("verde") || body.classList.contains("rojo");
        });

        if (todasMarcadas) {
            Swal.fire({
                title: "AnestCheck",
                text: "🎉 Checklist completado!",
                imageUrl: logoAlert,
                imageWidth: logoSize,
                imageHeight: logoSize,
                customClass: { popup: 'custom-swal' }
            });
        }
    }

});
