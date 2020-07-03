
import { ApolloProvider } from '@apollo/client';
import { client } from '../client'

import { gql } from '@apollo/client';


export default class Home extends React.Component {
  state={
    value:"",
    arr:[]
  }
  handleChange(e){
    console.log(e.target)
    this.setState({
     value : e.target.value 
    })
  }
    handleSubmit() { 
    let value = this.state.value
    client
    .mutate({
      mutation: gql`mutation MyMutation {
        insert_todo(objects: {data: "${value}"}) {
          affected_rows
        }
      }`
    })
    .then(result => console.log(result))
    .catch(e=>console.log(e))
    this.setState({ value : "" })
  }
  
   handleDelete (id) {
    client
    .mutate({
      mutation: gql`mutation MyMutation {
        delete_todo(where: {id: {_eq: ${id}}}) {
          affected_rows
        }
      }`
    })
    .then(result => console.log(result))
    .catch(e=>console.log(e))
  }
  
  componentDidMount(){
    client.query({
      query: gql`query MyQuery {
        todo {
          data
          id
        }
      }`
    })
    .then(r=> this.setState({arr :r.data.todo}))
    .catch(e=> console.log(e))
  }
  render(){
    return (
      <ApolloProvider client={client}>
      <div>
        <div>
          <input type="text"  value={this.state.value} onChange={e=>this.handleChange(e)}/>
          <button onClick={e=>this.handleSubmit()}>Submit</button>
        </div>
        <div>
          {this.state.arr && this.state.arr.map(e => 
                                <div>
                                  <input disabled value = {e.data}/>
                                  <button id={e.id} onClick= {e=> this.handleDelete(e.target.id)}>X</button> 
                                </div>)}
        </div>
      </div>
      </ApolloProvider>
    )
  }
}