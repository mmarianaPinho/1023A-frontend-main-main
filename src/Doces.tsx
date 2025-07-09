import { useEffect, useState } from "react";
import './style.css';

interface Doce {
  id: number;
  nome: string;
  tipo: string;
  preco: number;
  quantidade: number;
}

function Doces() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [doces, setDoces] = useState<Doce[]>([]);

  const buscaDoces = async () => {
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

  useEffect(() => {
    buscaDoces();
  }, []);

  async function trataCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/doces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          tipo,
          preco: parseFloat(preco),
          quantidade: parseInt(quantidade),
        }),
      });

      if (response.ok) {
        const resultado = await response.json();
        setMensagem(resultado.mensagem || "Doce cadastrado com sucesso!");
        setNome("");
        setTipo("");
        setPreco("");
        setQuantidade("");
        buscaDoces();
      } else {
        const erro = await response.json();
        setMensagem(erro.mensagem || "Erro ao cadastrar doce.");
      }
    } catch {
      setMensagem("Erro na comunicação com o backend.");
    }
  }


  return (
    <>
      <main>
        {mensagem && <div className="mensagem"><p>{mensagem}</p></div>}

        <div className="container-cadastro">
          <form onSubmit={trataCadastro}>
            <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
            <input type="text" placeholder="Tipo (ex: Bolo, Brigadeiro)" value={tipo} onChange={e => setTipo(e.target.value)} required />
            <input type="number" placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} required />
            <input type="number" placeholder="Quantidade em estoque" value={quantidade} onChange={e => setQuantidade(e.target.value)} required />
            <input type="submit" value="Adicionar Doce" />
          </form>
        </div>

        <div className="container-listagem">
          {doces.map(doce => (
            <div key={doce.id} className="doce-container">
              <div><strong>{doce.nome}</strong> ({doce.tipo})</div>
              <div> R$ {Number(doce.preco).toFixed(2)}</div>
              <div> Quantidade em estoque: {doce.quantidade}</div>
              
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default Doces;
