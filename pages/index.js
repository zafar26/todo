import { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from '../client'
import { gql } from '@apollo/client';

export default function Home () {
  const [value, setValue] = useState('');
  const [arr, setArr] = useState([]);

  const handleChange = (e) =>{ setValue(e.target.value) }
  const handleSubmit = () =>{ 
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
    setValue("") 
  }
  const handleDelete =(id) =>{
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
  
  client.query({
    query: gql`query MyQuery {
      todo {
        data
        id
      }
    }`
  })
  .then(r=> setArr(r.data.todo))
  .catch(e=> console.log(e))
  
  return (
    <ApolloProvider client={client}>
    <div>
      <div>
        <input type="text"  value={value} onChange={e=>handleChange(e)}/>
        <button onClick={e=>handleSubmit()}>Submit</button>
      </div>
      <div>
        {arr && arr.map(e => 
                              <div>
                                <input disabled value = {e.data}/>
                                <button id={e.id} onClick= {e=> handleDelete(e.target.id)}>X</button> 
                              </div>)}
      </div>
    </div>
    </ApolloProvider>
  )
}