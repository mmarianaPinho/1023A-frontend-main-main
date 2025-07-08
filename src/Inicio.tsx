import { useEffect, useState } from 'react';

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

  useEffect(() => {
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
    buscarDoces();
  }, []);

  async function excluirDoce(id: number) {
    const confirmar = confirm("Tem certeza que deseja excluir este doce?");
    if (!confirmar) return;

    try {
      const resposta = await fetch(`http://localhost:8000/doces/${id}`, {
        method: "DELETE"
      });

      if (resposta.ok) {
        setDoces(prev => prev.filter(doce => doce.id !== id));
        setMensagem("Doce excluído com sucesso!");
      } else {
        const erro = await resposta.json();
        setMensagem(erro.mensagem || "Erro ao excluir doce.");
      }
    } catch {
      setMensagem("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div className="container-listagem">
      <h2>Doces Cadastrados</h2>
      {mensagem && <p>{mensagem}</p>}
      {doces.map(doce => (
        <div key={doce.id} className="doce-container">
          <div><strong>{doce.nome}</strong> ({doce.tipo})</div>
          <div>💰 R$ {Number(doce.preco).toFixed(2)}</div>
          <div>📦 Quantidade em estoque: {doce.quantidade}</div>
          <button onClick={() => excluirDoce(doce.id)}>🗑️ Excluir</button>
        </div>
      ))}
    </div>
  );
}


export default Inicio;
