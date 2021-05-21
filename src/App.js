import logo from "./logo.svg";
import "./App.css";
import pokeball from "./images/pokeball.gif";
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
} from "react-materialize";
import M from "materialize-css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function App() {
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
      const body = abilitiesList.map((item) => (
        <tr>
          <td>{item.ability.name}</td>
          <td>
            <Checkbox
              label=""
              checked={item.isHidden}
              value=""
              editable={false}
            />
          </td>
        </tr>
      ));
      return <tbody>{body}</tbody>;
    }
    return null;
  };

  const Description = (props) => {
    const descriptions = props.descriptions;
    if (descriptions != null && descriptions != undefined) {
      const body = (
        <tr>
          <td style={{ textAlign: "center" }}>{descriptions[2].description}</td>
        </tr>
      );
      return <tbody>{body}</tbody>;
    }
    return null;
  };

  const Evolutions = (props) => {
    const evolutions = props.evolutions;
    console.log(JSON.stringify(evolutions));
    if (evolutions != null && evolutions != undefined) {
      const body = (
        <tr>
          <td style={{ textAlign: "center" }}>
            {evolutions.chain.species.name}
          </td>
          <td style={{ textAlign: "center" }}>
            {evolutions.chain.evolvesTo[0]
              ? evolutions.chain.evolvesTo[0].species.name
              : "NOT APPLY"}
          </td>
          <td style={{ textAlign: "center" }}>
            {evolutions.chain.evolvesTo[0]?
            evolutions.chain.evolvesTo[0].evolvesTo[0]?
            evolutions.chain.evolvesTo[0].evolvesTo[0].species.name:"NOT APPLY": "NOT APPLY"}
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
      const body = typesList.map((item) => (
        <tr>
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
      const listItems = pokemonList.map((pokemon) => (
        <CollectionItem key={pokemon.name} id={pokemon.name}>
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
          >
            <h4>
              This pokemon's weight is {pokemon.weight} and his height is{" "}
              {pokemon.height}
            </h4>
            <br />
            <Row>
              <Col s={4}>
                <img
                  style={{ width: "200px", height: "200px" }}
                  src={pokemon.photo}
                />
              </Col>
              <Col s={8}>
                <Row>
                  <Col s={6}>
                    <table>
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
                          <td data-field="name">ABILITY NAME</td>
                          <td data-field="is_hidden">ABILITY IS HIDDEN</td>
                        </tr>
                      </thead>
                      <Abilities abilities={pokemon.abilities} />
                    </table>
                  </Col>
                  <Col s={6}>
                    <table>
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
                    </table>
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
      {loading ? (
        <img src={pokeball} alt="logo" />
      ) : (
        <div>
          {prev ? (
            !showModal ? (
              <Button
                className="red"
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
                    className="green"
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
            <h4 style={{ textAlign: "center" }}>
              This pokemon's weight is {pokemonD.weight} and his height is{" "}
              {pokemonD.height}
            </h4>

            <Button
              className="red"
              fab={{
                direction: "bottom",
              }}
              floating
              onClick={() => setShowModal(false)}
              large
              icon={<Icon>close</Icon>}
              node="button"
              style={{
                top: "20px",
              }}
            ></Button>
            <br />
            <Row>
              <Col s={4}>
                <img
                  style={{ width: "200px", height: "200px" }}
                  src={pokemonD.photo}
                />
              </Col>
              <Col s={8}>
                <Row>
                  <Col s={6}>
                    <table>
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
                          <td data-field="name">ABILITY NAME</td>
                          <td data-field="is_hidden">ABILITY IS HIDDEN</td>
                        </tr>
                      </thead>
                      <Abilities abilities={pokemonD.abilities} />
                    </table>
                  </Col>
                  <Col s={6}>
                    <table>
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
                    </table>
                  </Col>
                </Row>
              </Col>
              <Col s={6}>
                <table>
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
                      <td style={{ color: "red" }}>
                        <p style={{ textAlign: "center" }}>POKEMON BASE FORM</p>
                      </td>
                      <td style={{ color: "red" }}>
                        <p style={{ textAlign: "center" }}>
                          POKEMON FIRST EVOLUTION
                        </p>
                      </td>
                      <td style={{ color: "red" }}>
                        <p style={{ textAlign: "center" }}>
                          POKEMON SECOND EVOLUTION
                        </p>
                      </td>
                    </tr>
                  </thead>
                  <Evolutions evolutions={evolutions} />
                </table>
              </Col>
              <Col s={6}>
                <table>
                  <thead>
                    <tr>
                      <td style={{ background: "red", color: "white" }}>
                        <h6 style={{ textAlign: "center" }}>
                          POKEMON DESCRIPTION
                        </h6>
                      </td>
                    </tr>
                  </thead>
                  <Description descriptions={descriptions} />
                </table>
              </Col>
            </Row>
          </div>
        ) : (
          <img src={pokeball} alt="logo" />
        )}
      </Modal>
    </div>
  );
}

export default App;
