const api = "http://localhost:3000/pessoas";

async function carregar() {
  const busca = document.getElementById("buscaNome").value;
  // Desafio 2 e 3: A rota aceita query de busca e o back-end ordena
  const res = await fetch(`${api}?nome=${busca}`);
  const pessoas = await res.json();

  const lista = document.getElementById("lista");
  const contador = document.getElementById("contador");
  
  lista.innerHTML = "";
  contador.innerText = pessoas.length; // Desafio Extra: Contador

  pessoas.forEach(p => {
    lista.innerHTML += `
      <li>
        <div>
          <strong>${p.nome}</strong><br>
          <small>${p.email} | ${p.telefone || 'Sem telefone'}</small>
        </div>
        <div>
          <button class="btn-edit" onclick="editar('${p._id}', '${p.nome}', '${p.email}','${p.telefone}')">Editar</button>
          <button class="btn-delete" onclick="deletar('${p._id}')">Excluir</button>
        </div>
      </li>
    `;
  });
}

async function Salvar() {
  const id = document.getElementById("id").value;
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;

  const dados = { nome, email, telefone };

  try {
    console.log("Tentando enviar dados...", dados); // Log para teste

    const response = await fetch(id ? `${api}/${id}` : api, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    if (!response.ok) {
        throw new Error(`Erro no servidor: ${response.status}`);
    }

    alert("Salvo com sucesso!");
    limpar();
    carregar();
  } catch (erro) {
    console.error("Falha na conexão:", erro);
    alert("Não foi possível conectar ao servidor. Verifique se o Back-end está ligado.");
  }
}





/************************************************************ */
function editar(id, nome, email, telefone) {
  document.getElementById("id").value = id;
  document.getElementById("nome").value = nome;
  document.getElementById("email").value = email;
  document.getElementById("telefone").value = telefone;
  window.scrollTo(0,0);
}

async function deletar(id) {
  // Desafio Extra: Confirmação antes de excluir
  if (confirm("Deseja realmente excluir este registro?")) {
    await fetch(`${api}/${id}`, { method: "DELETE" });
    carregar();
  }
}

function limpar() {
  ["id", "nome", "email", "telefone"].forEach(i => document.getElementById(i).value = "");
}

carregar();