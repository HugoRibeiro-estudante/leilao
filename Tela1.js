import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';

export default function TelaGet() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [valorMinimo, setValorMinimo] = useState('');
  const [leilaoFechado, setLeilaoFechado] = useState(false);

  useEffect(() => {
    fetch('https://leilao-rest-api.herokuapp.com/itemdeleilao/')
      .then((resp) => resp.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const enviar = () => {
    const novoItem = {
      nome: nome,
      valorMinimo: parseFloat(valorMinimo),
      leilaoAberto: true,
    };

    fetch('https://leilao-rest-api.herokuapp.com/itemdeleilao/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoItem),
    })
      .then((resp) => resp.json())
      .then((json) => {
        setData([...data, json]);
        setNome('');
        setValorMinimo('');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const removerItem = (id) => {
    fetch(`https://leilao-rest-api.herokuapp.com/itemdeleilao/${id}`, {
      method: 'DELETE',
    })
      .then((resp) => resp.json())
      .then(() => {
        // Remove o item da lista
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const finalizarLeilao = (id) => {
    fetch(`https://leilao-rest-api.herokuapp.com/itemdeleilao/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leilaoAberto: false }),
    })
      .then((resp) => resp.json())
      .then(() => {
        setLeilaoFechado(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Novo Item de Leilão</Text>
        <TextInput
          style={styles.input}
          onChangeText={setNome}
          value={nome}
          placeholder="Nome"
        />
        <TextInput
          style={styles.input}
          onChangeText={setValorMinimo}
          value={valorMinimo}
          placeholder="Valor mínimo"
          keyboardType="numeric"
        />
        <Button title="Enviar" onPress={() => enviar()} />
      </View>

      <Text style={styles.title}>Itens de Leilão</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{`Nome: ${item.nome}`}</Text>
              <Text style={styles.itemText}>{`Valor Mínimo: ${item.valorMinimo}`}</Text>
              <TouchableOpacity onPress={() => removerItem(item.id)}>
                <Text style={styles.removerButton}>Remover</Text>

                {leilaoFechado ? (
                  <Text style={styles.leilaoFechadoText}>Leilão Fechado</Text>
                ) : (
                  <TouchableOpacity onPress={() => finalizarLeilao(item.id)}>
                    <Text style={styles.finalizarLeilao}>Finalizar Leilão</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  formContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  itemContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
  },
  removerButton: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 8,
  },
  leilaoFechadoText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
  finalizarLeilao: { 
    fontSize: 16, 
    color: 'blue',
    textDecorationLine: 'underline',
  },
  leilaoContainer: {
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
  },
});
