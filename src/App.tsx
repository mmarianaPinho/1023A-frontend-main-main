import { useState } from 'react';
import Inicio from './Inicio';
import Doces from './Doces';
import Clientes from './Clientes';
import Pedidos from './Pedidos';
import './style.css';

function App() {
  const [paginaAtual, setPaginaAtual] = useState('inicio');

  function renderizarPagina() {
    if (paginaAtual === 'inicio') return <Inicio />;
    if (paginaAtual === 'doces') return <Doces />;
    if (paginaAtual === 'clientes') return <Clientes />;
    if (paginaAtual === 'pedidos') return <Pedidos />;
  }

  return (
    <>
      <header>
        <div className="logo-titulo">
          <img src="/logo.png" alt="Logo" className="logo" />
          <h1>Doces Delícia</h1>
        </div>
        <nav>
          <ul>
            <li><button onClick={() => setPaginaAtual('inicio')}>Início</button></li>
            <li><button onClick={() => setPaginaAtual('doces')}>Doces</button></li>
            <li><button onClick={() => setPaginaAtual('clientes')}>Clientes</button></li>
            <li><button onClick={() => setPaginaAtual('pedidos')}>Pedidos</button></li>
          </ul>
        </nav>
      </header>

      <main>
        {renderizarPagina()}
      </main>

      <footer></footer>
    </>
  );
}

export default App;
