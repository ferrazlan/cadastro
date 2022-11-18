import React, { useState, useEffect } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from './assets/cadastro.png';

function App() {

  const baseUrl = "https://localhost:44304/api/Card";

  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);

  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [cardSelecionado, setCardSelecionado] = useState({
    id: '',
    title: '',
    description: '',
    data_preview: ''
  })

  const selecionarCard = (card, opcao) => {
    setCardSelecionado(card);
    (opcao === "Editar") ?
      abrirFecharModalEditar() : abrirFecharModalExcluir();
  }

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setCardSelecionado({
      ...cardSelecionado, [name]: value
    });
    console.log(cardSelecionado);
  }

  const pedidoGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPost = async () => {
    delete cardSelecionado.id;
    //cardSelecionado.data_preview = parseInt(cardSelecionado.data_preview);
    await axios.post(baseUrl, cardSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        setUpdateData(true);
        abrirFecharModalIncluir();
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPut = async () => {
    //cardSelecionado.data_preview = parseInt(cardSelecionado.data_preview);
    await axios.put(baseUrl + "/" + cardSelecionado.id, cardSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map(card => {
          if (card.id === cardSelecionado.id) {
            card.title = resposta.title;
            card.description = resposta.delete;
            card.data_preview = resposta.data_preview;
          }
        });
        setUpdateData(true);
        abrirFecharModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoDelete = async () => {
    await axios.delete(baseUrl + "/" + cardSelecionado.id)
      .then(response => {
        setData(data.filter(card => card.id !== response.data));
        setUpdateData(true);
        abrirFecharModalExcluir();
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    if (updateData) {
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateData])

  return (
    <div className="card-container">
      <br />
      <h3>Cadastro de Tarefas</h3>
      <header>
        <img src={logoCadastro} alt='Cadastro' />
        <button className="btn btn-success" onClick={() => abrirFecharModalIncluir()}>Incluir Novo Card</button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Data_Preview</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(card => (
            <tr key={card.id}>
              <td>{card.id}</td>
              <td>{card.title}</td>
              <td>{card.description}</td>
              <td>{card.date_Preview}</td>
              <td>
                <button className="btn btn-primary" onClick={() => selecionarCard(card, "Editar")}>Editar</button> {"  "}
                <button className="btn btn-danger" onClick={() => selecionarCard(card, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Cards</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Title: </label>
            <br />
            <input type="text" className="form-control" name="title" onChange={handleChange} />
            <br />
            <label>Description: </label>
            <br />
            <input type="text" className="form-control" name="description" onChange={handleChange} />
            <br />
            <label>Data_Preview: </label>
            <br />
            <input type="text" className="form-control" name="data_preview" onChange={handleChange} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>Incluir</button>{"   "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalIncluir()} >Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Card</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <input type="text" className="form-control" readOnly
              value={cardSelecionado && cardSelecionado.id} />
            <br />
            <label>Title: </label><br />
            <input type="text" className="form-control" name="title" onChange={handleChange}
              value={cardSelecionado && cardSelecionado.title} /><br />
            <label>Description: </label><br />
            <input type="text" className="form-control" name="description" onChange={handleChange}
              value={cardSelecionado && cardSelecionado.description} /><br />
            <label>Data_Preview: </label><br />
            <input type="text" className="form-control" name="data_preview" onChange={handleChange}
              value={cardSelecionado && cardSelecionado.data_preview} /><br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPut()}>Editar</button>{"  "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()} >Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão deste card : {cardSelecionado && cardSelecionado.title} ?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => pedidoDelete()} > Sim </button>
          <button className="btn btn-secondary" onClick={() => abrirFecharModalExcluir()}> Não </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
