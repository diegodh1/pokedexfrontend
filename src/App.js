import logo from "./logo.svg";
import "./App.css";
import pokeball from "./images/pokeball.gif";
import pokelogo from "./images/pokemon.png";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  Button,
  Card,
  Row,
  Col,
  Collection,
  CollectionItem,
  CardTitle,
  Icon,
  Table,
  Checkbox,
  Preloader,
  Tabs,
  Tab,
  Pagination,
  Footer,
  Navbar,
  NavItem,
} from "react-materialize";

import M from "materialize-css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    height: "90%",
    background: "red",
    width:"90%",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function App() {
  Modal.setAppElement("#root");
  //urls
  const [actual, setActual] = useState(
    "https://pokemonservice.uc.r.appspot.com/api/pokemons?limit=20&offset=0"
  );
  const [next, setNext] = useState("");
  const [prev, setPrev] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingPokemon, setLoadingPokemon] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState({ results: [] });
  const [pokemonD, setPokemonD] = useState(null);
  const [message, setMessage] = useState("");
  const [evolutions, setEvolutions] = useState(null);
  const [stats, setStats] = useState(null);
  const [descriptions, setDescriptions] = useState(null);

  useEffect(() => {
    fetch(
      "https://pokemonservicev2.uc.r.appspot.com/api/pokemons?limit=20&offset=0",
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setResult(data);
        setNext(data.next);
        setPrev(data.previous);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const getAllPokemons = (url) => {
    setLoading(true);
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data);
        setNext(data.next);
        setPrev(data.previous);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getPokemonInfo = (pokemon) => {
    setLoadingPokemon(true);
    setShowModal(true);
    fetch(
      "https://pokemonservicev2.uc.r.appspot.com/api/pokemons/" + pokemon.name,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setEvolutions(data.evolutions);
        setStats(data.stats);
        setPokemonD(pokemon);
        setDescriptions(data.descriptions);
        setLoadingPokemon(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingPokemon(false);
      });
  };

  const Abilities = (props) => {
    const abilitiesList = props.abilities;
    if (abilitiesList != null && abilitiesList != undefined) {
      const body = abilitiesList.map((item, index) => (
        <tr key={"ability" + index}>
          <td>{item.ability.name}</td>
          <td>
            <Checkbox label="" checked={item.isHidden} value="" disabled />
          </td>
        </tr>
      ));
      return <tbody>{body}</tbody>;
    }
    return null;
  };

  const Stats = (props) => {
    const statsList = props.stats;
    if (statsList != null && statsList != undefined) {
      const body = statsList.map((item, index) => (
        <td key={"stat" + index}>{item.baseStat}</td>
      ));
      return <tr>{body}</tr>;
    }
    return null;
  };

  const Description = (props) => {
    const descriptions = props.descriptions;
    if (descriptions != null && descriptions != undefined) {
      const body = (
        <p style={{color:"yellow"}}>Pokemon's Description: {descriptions[2].description}</p>
      );
      return body;
    }
    return null;
  };

  const Evolutions = (props) => {
    const evolutions = props.evolutions;
    if (evolutions != null && evolutions != undefined) {
      const body = (
        <tr key={"evolutions"}>
          <td>
            {evolutions.chain.species.name}
          </td>
          <td>
            {evolutions.chain.evolvesTo[0]
              ? evolutions.chain.evolvesTo[0].species.name
              : "NOT APPLY"}
          </td>
          <td>
            {evolutions.chain.evolvesTo[0]
              ? evolutions.chain.evolvesTo[0].evolvesTo[0]
                ? evolutions.chain.evolvesTo[0].evolvesTo[0].species.name
                : "NOT APPLY"
              : "NOT APPLY"}
          </td>
        </tr>
      );
      return <tbody>{body}</tbody>;
    }
    return null;
  };

  const Types = (props) => {
    const typesList = props.types;
    if (typesList != null && typesList != undefined) {
      const body = typesList.map((item, index) => (
        <tr key={"type" + index}>
          <td>
            <p style={{ textAlign: "center" }}>{item.type.name}</p>
          </td>
        </tr>
      ));
      return <tbody>{body}</tbody>;
    }
    return null;
  };

  const PokemonList = (props) => {
    const pokemonList = props.pokemonList;

    if (pokemonList != undefined && pokemonList != null) {
      const listItems = pokemonList.map((pokemon, index) => (
        <CollectionItem key={"pokemon" + index}>
          <Card
            actions={[
              <Button
                style={{ background: "red", color: "white" }}
                onClick={() => {
                  getPokemonInfo(pokemon);
                }}
                node="button"
              >
                {pokemon.name + " DETAIL"}
              </Button>,
            ]}
            closeIcon={<Icon>close</Icon>}
            horizontal
            revealIcon={<Icon>more_vert</Icon>}
            key={"pokemonCard" + index}
          >
            <h4>
              This pokemon's weight is {pokemon.weight} and his height is{" "}
              {pokemon.height}
            </h4>
            <br />
            <Row>
              <Col s={4}>
                <img
                  style={{ width: "50%", height: "50%" }}
                  src={pokemon.photo}
                />
              </Col>
              <Col s={8}>
                <Row>
                  <Col s={6}>
                    <Table responsive={true} centered={true}>
                      <thead>
                        <tr>
                          <td
                            colSpan={2}
                            data-field="Abilities"
                            style={{ background: "red", color: "white" }}
                          >
                            <h6 style={{ textAlign: "center" }}>
                              POKEMON ABILITIES
                            </h6>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: "center" }}>NAME</td>
                          <td style={{ textAlign: "center" }}>IS HIDDEN</td>
                        </tr>
                      </thead>
                      <Abilities abilities={pokemon.abilities} />
                    </Table>
                  </Col>
                  <Col s={6}>
                    <Table responsive={true} centered={true}>
                      <thead>
                        <tr>
                          <td
                            data-field="Abilities"
                            style={{ background: "red", color: "white" }}
                          >
                            <h6 style={{ textAlign: "center" }}>
                              POKEMON TYPES
                            </h6>
                          </td>
                        </tr>
                      </thead>
                      <Types types={pokemon.type} />
                    </Table>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </CollectionItem>
      ));
      return <Collection>{listItems}</Collection>;
    }
    return null;
  };
  return (
    <div className="App">
      <div>
        <Navbar
          style={{ background: "black", padding: "0%" }}
          alignLinks="left"
          fixed={true}
          id="mobile-nav"
          menuIcon={<Icon>menu</Icon>}
          options={{
            draggable: true,
            edge: "left",
            preventScrolling: true,
          }}
        >
          <NavItem href="">
            <img style={{ width: "13%" }} src={pokelogo} />
          </NavItem>
        </Navbar>
        {loading ? (
          <img src={pokeball} alt="logo" />
        ) : (
          <div>
            {prev ? (
              !showModal ? (
                <Button
                  className="black"
                  fab={{
                    direction: "right",
                  }}
                  floating
                  large
                  node="button"
                  style={{
                    left: "75%",
                  }}
                  icon={<Icon>arrow_back</Icon>}
                  onClick={() => getAllPokemons(prev)}
                />
              ) : null
            ) : null}
            <Row>
              <Col s={12}>
                {next ? (
                  !showModal ? (
                    <Button
                      key="button_next"
                      className="black"
                      fab={{
                        direction: "left",
                      }}
                      floating
                      node="button"
                      large
                      icon={<Icon>arrow_forward</Icon>}
                      onClick={() => getAllPokemons(next)}
                    />
                  ) : null
                ) : null}
                <PokemonList pokemonList={result.results} />
              </Col>
            </Row>
          </div>
        )}
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          style={customStyles}
          contentLabel="Example Modal"
        >
          {!loadingPokemon && pokemonD != null && pokemonD != undefined ? (
            <div>
              <h4 style={{ textAlign: "center", color:'white' }}>
                This pokemon's weight is {pokemonD.weight} and his height is{" "}
                {pokemonD.height}
              </h4>

              <Button
                className="black"
                fab={{
                  direction: "bottom",
                }}
                floating
                onClick={() => setShowModal(false)}
                large
                icon={<Icon>close</Icon>}
                node="button"
                style={{
                  top: "5%",
                }}
              ></Button>
              <br />
              <Row>
                <Col s={4} style={{ textAlign: "center" }}>
                  <Description descriptions={descriptions}/>
                  <img
                    style={{ width: "200px", height: "200px" }}
                    src={pokemonD.photo}
                  />
                </Col>
                <Col s={8}>
                  <Row>
                    <Col s={6}>
                      <Table responsive={true} centered={true}>
                        <thead>
                          <tr>
                            <td
                              colSpan={2}
                              data-field="Abilities"
                              style={{ background: "red", color: "white" }}
                            >
                              <h6 style={{ textAlign: "center" }}>
                                POKEMON ABILITIES
                              </h6>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ textAlign: "center", color:"white"}}>NAME</td>
                            <td style={{ textAlign: "center", color:"white" }}>IS HIDDEN</td>
                          </tr>
                        </thead>
                        <Abilities abilities={pokemonD.abilities} />
                      </Table>
                    </Col>
                    <Col s={6}>
                      <Table responsive={true} centered={true}>
                        <thead>
                          <tr>
                            <td
                              data-field="Abilities"
                              style={{ background: "red", color: "white" }}
                            >
                              <h6 style={{ textAlign: "center" }}>
                                POKEMON TYPES
                              </h6>
                            </td>
                          </tr>
                        </thead>
                        <Types types={pokemonD.type} />
                      </Table>
                    </Col>
                  </Row>
                </Col>
                <Col s={6}>
                  <Table responsive={true}>
                    <thead>
                      <tr>
                        <td
                          colSpan={3}
                          style={{
                            background: "red",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          <h6>POKEMON'S EVOLUTIONS</h6>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ color: "white" }}>POKEMON</td>
                        <td style={{ color: "white" }}>FIRST EVOLUTION
                        </td>
                        <td style={{ color: "white" }}>SECOND EVOLUTION</td>
                      </tr>
                    </thead>
                    <Evolutions evolutions={evolutions} />
                  </Table>
                </Col>
                <Col s={6}>
                  <Table responsive={true} centered={true}>
                    <thead>
                      <tr>
                        <td
                          style={{ background: "red", color: "white" }}
                          colSpan={6}
                        >
                          <h6 style={{ textAlign: "center" }}>POKEMON STATS</h6>
                        </td>
                      </tr>
                      <tr>
                        <td style={{color: "white"}}>HP</td>
                        <td style={{color: "white"}}>ATTACK</td>
                        <td style={{color: "white"}}>DEFENSE</td>
                        <td style={{color: "white"}}>SPECIAL-ATTACK</td>
                        <td style={{color: "white"}}>SPECIAL-DEFENSE</td>
                        <td style={{color: "white"}}>SPEED</td>
                      </tr>
                    </thead>
                    <tbody>
                      <Stats stats={stats} />
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
          ) : (
            <div style={{textAlign:'center'}}>
            <img src={pokeball} alt="logo" />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default App;
