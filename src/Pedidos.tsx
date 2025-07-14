import { useEffect, useState } from "react";
import "./style.css";

interface Pedido {
  id: number;
  cliente: string;
  doce: string;
  quantidade: number;
  data_pedido: string;
}

function Pedidos() {
  const [cliente, setCliente] = useState("");
  const [doce, setDoce] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    buscarPedidos();
  }, []);

  async function buscarPedidos() {
    try {
      const resposta = await fetch("http://localhost:8000/pedidos");
      if (resposta.ok) {
        const dados = await resposta.json();
        setPedidos(dados);
      } else {
        const erro = await resposta.json();
        setMensagem(erro.mensagem || "Erro ao buscar pedidos.");
      }
    } catch {
      setMensagem("Erro na conexão com o backend.");
    }
  }

  async function trataCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId
      ? `http://localhost:8000/pedidos/${editandoId}`
      : "http://localhost:8000/pedidos";

    try {
      const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente, doce, quantidade: parseInt(quantidade) }),
      });

      if (resposta.ok) {
        setMensagem(editandoId ? "Pedido atualizado." : "Pedido cadastrado com sucesso!");
        setCliente("");
        setDoce("");
        setQuantidade("");
        setEditandoId(null);
        buscarPedidos();
      } else {
        const erro = await resposta.json();
        setMensagem(erro.mensagem || "Erro ao salvar pedido.");
      }
    } catch {
      setMensagem("Erro ao comunicar com o backend.");
    }
  }

  async function excluirPedido(id: number) {
    if (!confirm("Deseja realmente excluir este pedido?")) return;
    try {
      const resposta = await fetch(`http://localhost:8000/pedidos/${id}`, {
        method: "DELETE",
      });
      if (resposta.ok) {
        setMensagem("Pedido excluído com sucesso.");
        buscarPedidos();
      } else {
        setMensagem("Erro ao excluir pedido.");
      }
    } catch {
      setMensagem("Erro ao comunicar com o backend.");
    }
  }

  function editarPedido(p: Pedido) {
    setCliente(p.cliente);
    setDoce(p.doce);
    setQuantidade(p.quantidade.toString());
    setEditandoId(p.id);
  }

  return (
    <>
      <main>
        {mensagem && <div className="mensagem"><p>{mensagem}</p></div>}

        <div className="container-cadastro">
          <form onSubmit={trataCadastro}>
            <input type="text" placeholder="Nome do Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
            <input type="text" placeholder="Nome do Doce" value={doce} onChange={(e) => setDoce(e.target.value)} required />
            <input type="number" placeholder="Quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
            <input type="submit" value={editandoId ? "Atualizar Pedido" : "Fazer Pedido"} />
          </form>
        </div>

        <div className="container-listagem">
          {pedidos.length === 0 ? (
            <div className="doce-container">
              <p>Nenhum pedido cadastrado.</p>
            </div>
          ) : (
            pedidos.map((pedido) => (
              <div key={pedido.id} className="doce-container">
                <div><strong>Cliente:</strong> {pedido.cliente}</div>
                <div><strong>Doce:</strong> {pedido.doce}</div>
                <div><strong>Quantidade:</strong> {pedido.quantidade}</div>
                <div><strong>Data:</strong> {new Date(pedido.data_pedido).toLocaleDateString()}</div>
                <button onClick={() => editarPedido(pedido)}>Editar</button>
                <button onClick={() => excluirPedido(pedido.id)} className="btn-excluir"> Excluir</button>

              </div>
            ))
          )}
        </div>
      </main>

      <footer></footer>
    </>
  );
}

export default Pedidos;
