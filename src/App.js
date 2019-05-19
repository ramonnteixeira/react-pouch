import React, {Component} from 'react';
import './App.css';
import PouchDB from 'pouchdb-browser';

export default class App extends Component {
  db = new PouchDB('todo');

  constructor() {
    super();

    this.state = {
      todos: []
    }

    this.list()

    this.db.changes({live: true})
          .on('change', () => this.list());

    if (localStorage.remoteDB) {
        this.db.replicate.to(localStorage.remoteDB, { live: true });
    }
  }

  async list() {
    const find = await this.db.allDocs({include_docs: true});
    this.setState({ todos: find.rows.map(e => e.doc) });
  }

  async insert() {
    const rand = Math.floor(Math.random() * (999 - 100) + 100);
    await this.db.post({
      name: `teste ${rand}`
    });
  }

  async remove(item) {
    await this.db.remove(item);
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.insert.bind(this)}>
              Incluir
        </button>

        <ul className="board">
          {this.state.todos.map(
              (item) => { 
                  return (
                    <li className="item" key={item._id}>{item.name}
                      <button onClick={() => this.remove(item)}>x</button>
                    </li>
                  );
              }
          )}

        </ul>
      </div>
    );
  }
}
