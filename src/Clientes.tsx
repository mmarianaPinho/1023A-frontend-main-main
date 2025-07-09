import React, { useEffect, useState } from "react";
import style from "./style"; // Corrigido: importando o tipo certo


interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  cpf: string;
}

interface Doce {
  id: number;
  nome: string;
  tipo: string;
  preco: number;
}

interface ClientesProps {
  DocesSelecionado?: Doce | null;
  aoCadastrar?: () => void;
}

function Clientes({ DocesSelecionado, aoCadastrar }: ClientesProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cpf, setCpf] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editEndereco, setEditEndereco] = useState("");
  const [editCpf, setEditCpf] = useState("");

  useEffect(() => {
    buscaClientes();
    // eslint-disable-next-line
  }, []);

  async function buscaClientes() {
    try {
      const resposta = await fetch("http://localhost:8000/clientes");
      if (resposta.ok) {
        const dados = await resposta.json();
        setClientes(dados);
      } else {
        const erro = await resposta.json();
        setMensagem(erro.mensagem || "Erro ao buscar clientes.");
      }
    } catch {
      setMensagem("Erro na conexão com o backend.");
    }
  }

  async function trataCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          telefone,
          endereco,
          cpf,
        }),
      });

      if (response.ok) {
        const resultado = await response.json();
        setMensagem(resultado.mensagem || "Cliente cadastrado com sucesso!");
        setNome("");
        setTelefone("");
        setEndereco("");
        setCpf("");
        buscaClientes();
        if (aoCadastrar) aoCadastrar();
      } else {
        const erro = await response.json();
        setMensagem(erro.mensagem || "Erro ao cadastrar cliente.");
      }
    } catch {
      setMensagem("Erro na comunicação com o backend.");
    }
  }

  // Iniciar edição
  function iniciarEdicao(cliente: Cliente) {
    setEditandoId(cliente.id);
    setEditNome(cliente.nome);
    setEditTelefone(cliente.telefone);
    setEditEndereco(cliente.endereco);
    setEditCpf(cliente.cpf);
  }

  // Cancelar edição
  function cancelarEdicao() {
    setEditandoId(null);
    setEditNome("");
    setEditTelefone("");
    setEditEndereco("");
    setEditCpf("");
  }

  // Salvar edição
  async function salvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/clientes/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editNome,
          telefone: editTelefone,
          endereco: editEndereco,
          cpf: editCpf,
        }),
      });
      if (response.ok) {
        setMensagem("Cliente atualizado com sucesso!");
        setEditandoId(null);
        buscaClientes();
      } else {
        setMensagem("Erro ao atualizar cliente.");
      }
    } catch {
      setMensagem("Erro na comunicação com o backend.");
    }
  }

  // Excluir cliente
  async function deletarCliente(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;
    try {
      const response = await fetch(`http://localhost:8000/clientes/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMensagem("Cliente removido com sucesso!");
        buscaClientes();
      } else {
        setMensagem("Erro ao remover cliente.");
      }
    } catch {
      setMensagem("Erro na comunicação com o backend.");
    }
  }

  return (
    <>
      <main>
        <div className="cadastro-header">
          <span role="img" aria-label="cliente" style={{ fontSize: '2.5rem', marginRight: 10 }}>👤</span>
          <h1>Cadastro de Clientes</h1>
        </div>
        {DocesSelecionado && (
          <div className="mensagem destaque">
            <p>Você está comprando: <strong>{DocesSelecionado.nome}</strong> ({DocesSelecionado.tipo}) - R$ {DocesSelecionado.preco?.toFixed(2)}</p>
          </div>
        )}
        {mensagem && (
          <div className="mensagem destaque">
            {mensagem}
          </div>
        )}
        <div className="container-cadastro">
          <form onSubmit={trataCadastro}>
            <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
            <input type="text" placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} required />
            <input type="text" placeholder="Endereço" value={endereco} onChange={e => setEndereco(e.target.value)} required />
            <input type="text" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} required />
            <input type="submit" className="btn-principal" value={DocesSelecionado ? "Finalizar Pedido" : "Me cadastrar"} />
          </form>
        </div>
        <div className="container-listagem">
          {clientes.map(cliente => (
            <div key={cliente.id} className="cliente-container">
              {editandoId === cliente.id ? (
                <form onSubmit={salvarEdicao} className="form-edicao">
                  <input value={editNome} onChange={e => setEditNome(e.target.value)} required />
                  <input value={editTelefone} onChange={e => setEditTelefone(e.target.value)} required />
                  <input value={editEndereco} onChange={e => setEditEndereco(e.target.value)} required />
                  <input value={editCpf} onChange={e => setEditCpf(e.target.value)} required />
                  <button type="submit" className="btn-principal">Salvar</button>
                  <button type="button" onClick={cancelarEdicao}>Cancelar</button>
                </form>
              ) : (
                <>
                  <div><strong>{cliente.nome}</strong></div>
                  <div>Telefone: {cliente.telefone}</div>
                  <div>Endereço: {cliente.endereco}</div>
                  <div>CPF: {cliente.cpf}</div>
                  <button onClick={() => iniciarEdicao(cliente)} className="btn-principal" style={{marginRight: 8}}>Editar</button>
                  <button onClick={() => deletarCliente(cliente.id)} style={{background: "#ff4d4d", color: "#fff", border: "none", borderRadius: 6, padding: "6px 16px", cursor: "pointer"}}>Excluir</button>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default Clientes;