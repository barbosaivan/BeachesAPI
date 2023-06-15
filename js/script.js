const $d = document;
const $table = $d.querySelector(".crud_table");
const $form = $d.querySelector(".crud_form");
const $title = $d.querySelector(".crud_title");
const $template = $d.getElementById("crud_template").content;
const $fragment = $d.createDocumentFragment();

const getAll = async () => {
    try {
        let res = await axios.get("http://localhost:4444/playas");
        let json = await res.data;
        json.forEach(el => {
            $template.querySelector(".name").textContent = el.nombre;
            $template.querySelector(".department").textContent = el.departamento;
            $template.querySelector(".edit").dataset.id = el.id;
            $template.querySelector(".edit").dataset.name = el.nombre;
            $template.querySelector(".edit").dataset.departamento = el.departamento;
            $template.querySelector(".delete").dataset.id = el.id;

            let $clone = $d.importNode($template, true);

            $fragment.appendChild($clone);

            $table.querySelector("tbody").appendChild($fragment)
        });
    } catch (error) {
        let message = error.statusText || "Ocurrio un error"
        $table.insertAdjacentHTML("afterend", `Error: ${error.status}: ${message}`)
    }
}

$d.addEventListener("DOMContentLoaded", getAll);

$d.addEventListener("submit", async e => {
    if (e.target == $form) {
        e.preventDefault();

        if (!e.target.id.value) {
            try {
                let options = {
                    method: "POST",
                    headers: { "Content-type": "application/json; charset=uft-8" },
                    data: JSON.stringify({
                        nombre: e.target.nombre.value,
                        departamento: e.target.departamento.value
                    })
                };

                let res = await axios("http://localhost:4444/playas", options);
                let json = await res.data;

                location.reload();
            } catch (error) {
                let message = error.statusText || "Ocurrio un error"
                $table.insertAdjacentHTML("afterend", `Error: ${error.status}: ${message}`)
            }
        } else {
            try {
                let options = {
                    method: "PUT",
                    headers: { "Content-type": "application/json; charset=uft-8" },
                    data: JSON.stringify({
                        nombre: e.target.nombre.value,
                        departamento: e.target.departamento.value
                    })
                };

                let res = await axios(`http://localhost:4444/playas/${e.target.id.value}`, options);
                let json = await res.data;

                location.reload();
            } catch (error) {
                let message = error.statusText || "Ocurrio un error";
                $table.insertAdjacentHTML("afterend", `Error: ${error.status}: ${message}`);
            }
        }
    }
})

$d.addEventListener("click", async e => {
    if (e.target.matches(".edit")) {
        $title.textContent = "Editar playa";
        $form.nombre.value = e.target.dataset.name;
        $form.departamento.value = e.target.dataset.departamento;
        $form.id.value = e.target.dataset.id;
    }

    if (e.target.matches(".delete")) {
        let confirmacion = confirm("¿Seguro que deses eliminar el elemento seleccionado?")

        if (confirmacion) {
            try {
                let options = {
                    method: "DELETE",
                    headers: { "Content-type": "application/json; charset=uft-8" }
                };

                let res = await axios(`http://localhost:4444/playas/${e.target.dataset.id}`, options);
                let json = await res.data;

                location.reload();
            } catch (error) {
                let message = error.statusText || "Ocurrio un error";
                $table.insertAdjacentHTML("afterend", `Error: ${error.status}: ${message}`);
            }
        }

    }
})