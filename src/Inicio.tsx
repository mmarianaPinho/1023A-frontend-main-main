import { useEffect, useState } from 'react';

interface Doce {
  id: number;
  nome: string;
  tipo: string;
  preco: number;
  quantidade: number;
  novoEstoque?: number; 
}

function Inicio() {
  const [doces, setDoces] = useState<Doce[]>([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    buscarDoces();
  }, []);

  const buscarDoces = async () => {
    try {
      const resposta = await fetch("http://localhost:8000/doces");
      if (resposta.ok) {
        const dados = await resposta.json();
        setDoces(dados);
      } else {
        const erro = await resposta.json();
        setMensagem(erro.mensagem || "Erro ao buscar doces.");
      }
    } catch {
      setMensagem("Erro na conexão com o backend.");
    }
  };

  const excluirDoce = async (id: number) => {
    const confirmar = confirm("Tem certeza que deseja excluir este doce?");
    if (!confirmar) return;

    try {
      const resposta = await fetch(`http://localhost:8000/doces/${id}`, {
        method: "DELETE"
      });

      if (resposta.ok) {
        setMensagem("Doce excluído com sucesso!");
        buscarDoces();
      } else {
        const erro = await resposta.json();
        setMensagem(erro.mensagem || "Erro ao excluir doce.");
      }
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  const atualizarEstoque = async (id: number, novaQuantidade: number) => {
    if (isNaN(novaQuantidade) || novaQuantidade < 0) {
      setMensagem("Informe uma quantidade válida.");
      return;
    }

    try {
      const resposta = await fetch(`http://localhost:8000/doces/${id}/estoque`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantidade: novaQuantidade })
      });

      if (resposta.ok) {
        setMensagem("Estoque atualizado com sucesso!");
        buscarDoces();
      } else {
        const erro = await resposta.json();
        setMensagem(erro.mensagem || "Erro ao atualizar estoque.");
      }
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="container-listagem">
      <h2>Doces Cadastrados</h2>
      {mensagem && <p>{mensagem}</p>}
      {doces.map(doce => (
        <div key={doce.id} className="doce-container">
          <div><strong>{doce.nome}</strong> ({doce.tipo})</div>
          <div> R$ {Number(doce.preco).toFixed(2)}</div>
          <div> Estoque: {doce.quantidade}</div>

          <input
            type="number"
            min="0"
            placeholder="Novo estoque"
            onChange={(e) => {
              const valor = parseInt(e.target.value);
              setDoces(prev =>
                prev.map(d => d.id === doce.id ? { ...d, novoEstoque: valor } : d)
              );
            }}
            style={{ width: "130px", marginRight: "8px" }}
          />

          <button
            onClick={() => atualizarEstoque(doce.id, doce.novoEstoque || 0)}
            style={{ marginRight: "8px" }}
          >
            Atualizar Estoque
          </button>

          <button onClick={() => excluirDoce(doce.id)}>🗑️ Excluir</button>
        </div>
      ))}
    </div>
  );
}


export default Inicio;
