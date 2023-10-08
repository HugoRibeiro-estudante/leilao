import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ParticipanteScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');


  useEffect(() => {
    fetch('https://leilao-rest-api.herokuapp.com/participante/')
      .then((resp) => resp.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const adicionarParticipante = () => {
    const novoParticipante = {
      nome: nome,
      cpf: cpf,
    };

    fetch('https://leilao-rest-api.herokuapp.com/participante/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoParticipante),
    })
      .then((resp) => resp.json())
      .then((json) => {
        setData([...data, json]);
        setNome('');
        setCpf('');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const removerParticipante = (id) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza de que deseja remover este participante?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          onPress: () => {
            fetch(`https://leilao-rest-api.herokuapp.com/participante/${id}`, {
              method: 'DELETE',
            })
              .then((resp) => {
                if (resp.status === 204) {
                  // Se a remoção foi bem-sucedida (status 204), atualize os dados
                  const newData = data.filter((item) => item.id !== id);
                  setData(newData);
                } else {
                  // Se ocorreu um erro ao remover, exiba uma mensagem de erro
                  console.error('Erro ao remover participante');
                }
              })
              .catch((error) => {
                console.error(error);
              });
          },
        },
      ]
    );
  };



  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Adicionar Participante</Text>
        <TextInput
          style={styles.input}
          onChangeText={setNome}
          value={nome}
          placeholder="Nome"
        />
        <TextInput
          style={styles.input}
          onChangeText={setCpf}
          value={cpf}
          placeholder="CPF"
        />
        <Button title="Adicionar" onPress={() => adicionarParticipante()} />
      </View>


      <Text style={styles.title}>Lista de Participantes</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{`Nome: ${item.nome}`}</Text>
              <Text style={styles.itemText}>{`CPF: ${item.cpf}`}</Text>
              <TouchableOpacity onPress={() => removerParticipante(item.id)}>
                <MaterialIcons name="delete" size={24} color="red" />
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
    padding: 16,
    backgroundColor: '#fff',
  },
  formContainer: {
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
  },
});
