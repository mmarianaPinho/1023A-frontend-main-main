import { useEffect, useState } from 'react';
import './style.css';

interface Doce {
  id: number;
  nome: string;
  tipo: string;
  preco: number;
  quantidade: number;
}

function Inicio() {
  const [doces, setDoces] = useState<Doce[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [novoEstoque, setNovoEstoque] = useState("");

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
        setEditandoId(null);
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
    <main>
      {mensagem && <div className="mensagem"><p>{mensagem}</p></div>}

      <div className="container-listagem">
        <h2>Doces Cadastrados</h2>

        {doces.map(doce => (
          <div key={doce.id} className="doce-container">
            <div><strong>{doce.nome}</strong> ({doce.tipo})</div>
            <div>Preço: R$ {Number(doce.preco).toFixed(2)}</div>
            <div>Estoque: {doce.quantidade}</div>

            {editandoId === doce.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  atualizarEstoque(doce.id, parseInt(novoEstoque));
                }}
                className="form-edicao"
              >
                <input
                  type="number"
                  min="0"
                  value={novoEstoque}
                  onChange={e => setNovoEstoque(e.target.value)}
                  required
                />
                <button type="submit" className="btn-principal" style={{ marginRight: 8 }}>
                  Salvar
                </button>
                <button type="button" onClick={() => setEditandoId(null)}>
                  Cancelar
                </button>
              </form>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditandoId(doce.id);
                    setNovoEstoque(doce.quantidade.toString());
                  }}
                  className="btn-principal"
                  style={{ marginRight: 8 }}
                >
                  Editar Estoque
                </button>

                <button
                  onClick={() => excluirDoce(doce.id)}
                  className="btn-excluir"
                >
                   Excluir
                </button>

              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default Inicio;
