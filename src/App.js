import React from "react";
import "./App.css";
import { arrow_left } from "./assets/index";
import { arrow_right } from "./assets/index";
import { arrow_up } from "./assets/index";
import { arrow_down } from "./assets/index";
import { pen } from "./assets/index";
import { sort } from "./assets/index";
import { check } from "./assets/index";

const solicitarClassificacao = (setClassificando) => {
  fetch(`${process.env.REACT_APP_API_URL}/classificacao`)
    .then((res) => res.json())
    .then((dados) => {
      const newPosition = dados.dados.map((l, p) => {
        l.posicao = p + 1;
        return l;
      });
      setClassificando(newPosition);
    })
    .catch((err) => {
      console.error(err);
    });
};

export default function App() {
  const editarRodada = (token, id, golsCasa, golsVisitante) => {
    return fetch(`${process.env.REACT_APP_API_URL}/jogos`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token && `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: id,
        golsCasa: golsCasa,
        golsVisitante: golsVisitante,
      }),
    })
      .then(() => {
        solicitarRodada(setRodada, rodada);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  function TabelaClassificacao() {
    const legenda = {
      posicao: "Posição",
      time: "Time",
      pontos: "PTS",
      empates: "E",
      vitorias: "V",
      derrotas: "D",
      golsFeitos: "GF",
      golsSofridos: "GS",
      saldoGols: "SG",
    };

    const colunas = [
      "posicao",
      "time",
      "pontos",
      "empates",
      "vitorias",
      "derrotas",
      "golsFeitos",
      "golsSofridos",
      "saldoGols",
    ];

    const [colunaOrdenada, setColunaOrdenada] = React.useState("pontos");
    const [ordem, setOrdem] = React.useState("descendente");

    const dadosAscendentes = classificando.sort((t1, t2) => {
      if (
        typeof t1[colunaOrdenada] === "number" &&
        typeof t2[colunaOrdenada] === "number"
      ) {
        return (
          parseInt(t2[colunaOrdenada], 10) - parseInt(t1[colunaOrdenada], 10)
        );
      } else {
        return t1[colunaOrdenada].localeCompare(t2[colunaOrdenada]);
      }
    });
    const dadosOrdenados =
      ordem === "descendente" ? dadosAscendentes : dadosAscendentes.reverse();
    return (
      <div className="tabela">
        <table>
          <thead className="headerTabela">
            {colunas.map((coluna) => (
              <th>
                {legenda[coluna]}{" "}
                <img
                  alt=""
                  src={
                    colunaOrdenada !== coluna
                      ? sort
                      : ordem === "descendente"
                      ? arrow_down
                      : arrow_up
                  }
                  onClick={() => {
                    if (colunaOrdenada === coluna) {
                      setOrdem((ordem) =>
                        ordem === "descendente" ? "ascendente" : "descendente"
                      );
                    } else {
                      setColunaOrdenada(coluna);
                      setOrdem("descendente");
                    }
                  }}
                />
              </th>
            ))}
          </thead>
          <tbody>
            {dadosOrdenados.map((time, i) => (
              <tr className="bodyTabela">
                {colunas.map((coluna) =>
                  coluna === "saldoGols" ? (
                    <td>
                      {dadosOrdenados[i].golsFeitos -
                        dadosOrdenados[i].golsSofridos}
                    </td>
                  ) : (
                    <td>{time[coluna]}</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  function Rodadas(props) {
    const [editando, setEditando] = React.useState();
    return (
      <div className="jogosRod">
        <table>
          <thead className="escolherRodada">
            <tr>
              <img
                src={arrow_left}
                alt="seta esqueda"
                title="Ir para rodada anterior"
                onClick={() => {
                  if (rodada > 1) {
                    setRodada(rodada - 1);
                  }
                }}
              />
            </tr>
            <tr className="titleRodada" colSpan={3}>
              <div>{rodada}ª Rodada </div>
            </tr>
            <tr>
              <img
                className="right"
                src={arrow_right}
                alt="seta direita"
                title="Ir para a proxima rodada"
                onClick={() => {
                  if (rodada < 38) {
                    setRodada(rodada + 1);
                  }
                }}
              />
            </tr>
          </thead>
          <div className="tabelaRodada">
            <tbody>
              {dadosRodada.map((x) => {
                return (
                  <tr>
                    <td className="casa">{x.time_casa}</td>
                    <div>
                      {id !== x.id ? (
                        <td className="score">{x.gols_casa}</td>
                      ) : (
                        <input
                          type="number"
                          className="inputGol"
                          value={golsCasa}
                          onInput={(event) => setGolsCasa(event.target.value)}
                        />
                      )}
                      {rodada === null ? null : <td>&times;</td>}
                      {id !== x.id ? (
                        <td className="score">{x.gols_visitante}</td>
                      ) : (
                        <input
                          type="number"
                          className="inputGol"
                          value={golsVisitante}
                          onInput={(event) =>
                            setGolsVisitante(event.target.value)
                          }
                        />
                      )}
                    </div>
                    <td className="visitante">{x.time_visitante} </td>
                    {token && (
                      <td>
                        <button
                          className="editando"
                          onClick={() => {
                            if (id === x.id) {
                              setId(null);

                              editarRodada(
                                token,
                                id,
                                golsCasa,
                                golsVisitante
                              ).then(() => {
                                solicitarClassificacao(setClassificando);
                                solicitarRodada(rodada);
                              });
                            } else {
                              setId(x.id);
                              setGolsCasa(x.gols_casa);
                              setGolsVisitante(x.gols_visitante);
                            }
                          }}
                        >
                          <img
                            src={id === x.id ? check : pen}
                            alt={id === x.id ? "Salvar" : "Editar"}
                          />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </div>
        </table>
      </div>
    );
  }
  function fazerRequisicaoComBody(url, metodo, conteudo, token) {
    return fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: token && `Bearer ${token}`,
      },
      body: JSON.stringify(conteudo),
    });
  }
  function Login(props) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const { token, setToken } = props;

    return (
      <div>
        {token ? (
          <button onClick={() => setToken(null)} className="btnLogin">
            {" "}
            Deslogar{" "}
          </button>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              fazerRequisicaoComBody(
                "${process.env.REACT_APP_API_URL}/auth",
                "POST",
                {
                  email,
                  password,
                }
              )
                .then((res) => res.json())
                .then((respostaJson) => {
                  const novoToken = respostaJson.dados.token;
                  setToken(novoToken);
                  setEmail("");
                  setPassword("");
                });
            }}
          >
            <label>
              {"Email"}{" "}
              <input
                type="email"
                className="iptLogin"
                value={email}
                onInput={(event) => setEmail(event.target.value)}
              />
            </label>
            <label>
              {"Senha"}{" "}
              <input
                className="iptLogin"
                type="password"
                value={password}
                onInput={(event) => setPassword(event.target.value)}
              />
            </label>

            <button className="btnLogin">Logar</button>
          </form>
        )}
      </div>
    );
  }
  const [rodada, setRodada] = React.useState(1);
  const [dadosRodada, setDadosRodada] = React.useState([]);
  const [token, setToken] = React.useState(null);
  const [classificando, setClassificando] = React.useState([]);
  const [id, setId] = React.useState(null);
  const [golsCasa, setGolsCasa] = React.useState();
  const [golsVisitante, setGolsVisitante] = React.useState();

  const solicitarRodada = (rodada) => {
    fetch(`${process.env.REACT_APP_API_URL}/jogos/${rodada}`)
      .then((res) => res.json())
      .then((dados) => {
        if (dados.status === "sucesso") {
          setDadosRodada(dados.dados);
        }
      });
  };

  React.useEffect(() => {
    solicitarClassificacao(setClassificando);
  }, []);
  React.useEffect(() => {
    solicitarRodada(rodada);
  }, [rodada]);

  return (
    <div className="App">
      <div className="header">
        <div className="center">
          <h1>Brasileirão</h1>
          <Login token={token} setToken={setToken} />
        </div>
      </div>
      <div className="content">
        <div className="center">
          <Rodadas />
          <TabelaClassificacao />
        </div>
      </div>
    </div>
  );
}
