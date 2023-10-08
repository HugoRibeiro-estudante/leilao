  import React, { useState, useEffect } from 'react';
  import {
    Text,
    View,
    TextInput,
    StyleSheet,
    FlatList,
    Button,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
  } from 'react-native';
  import { MaterialIcons } from '@expo/vector-icons';

  export default function Tela3() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [idArrematante, setIdArrematante] = useState('');
    const [valorArremate, setValorArremate] = useState('');
    const [idItem, setIdItem] = useState('');

    useEffect(() => {
      fetch('https://leilao-rest-api.herokuapp.com/lance/')
        .then((resp) => resp.json())
        .then((json) => setData(json))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }, []);


    function enviar() {

      fetch(`https://leilao-rest-api.herokuapp.com/itemdeleilao/${idItem}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: valorArremate,
          arrematante: {
            id: idArrematante,
        },
        }),
        })
        .then((response) => {
          if (response.ok) {
            // A solicitação foi bem-sucedida, exiba um alerta de sucesso
            Alert.alert('Sucesso', 'Seu lance foi registrado com sucesso!', [
              { text: 'OK', onPress: () => console.log('Alerta de sucesso fechado') },
            ]);
          } else {
            // Lide com erros de solicitação aqui
            console.error('Erro na solicitação:', response.status);
          }
        })
        .catch((error) => {
          // Lidar com erros de solicitação, como problemas de conexão ou erro no servidor
          console.error('Erro ao enviar o lance:', error);
        });
      }

    return (
      <View style={styles.container}>

        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
          Criar lance
        </Text>

        <View style={styles.form}>
        <TextInput
          style={styles.input}
          onChangeText={setIdItem}
          value={idItem}
          placeholder="Id do Item"
        />
        <TextInput
          style={styles.input}
          onChangeText={setIdArrematante}
          value={idArrematante}
          placeholder="Id do Arrematante"
        />
        <TextInput
          style={styles.input}
          onChangeText={setValorArremate}
          value={valorArremate}
          placeholder="Valor do Arrematante"
        />

        <Button title="Adicionar" onPress={() => enviar()} />
        </View>

        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
          Lances criados
        </Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                 <Text style={styles.itemText}>{`Nome Arrematante: ${item.arrematante.nome}`}</Text>

                 <Text style={styles.itemText}>{`valor: ${item.valor}`}</Text>
              
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
      backgroundColor: '#f0d071',
      padding: 8,
    },
    itemContainer: {
      backgroundColor: 'white',
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
    input: {
      height: 40,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: '#000',
      backgroundColor: 'white',
      padding: 10,
    },
    form: {
      marginBottom: 20,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      padding: 16,
    }
  });
