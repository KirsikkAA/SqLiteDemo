import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Todo } from '../types/Todo'


interface RowProps{
    item:Todo,
    deleteTodo: (id: number) => Promise<void>
}

export default function Row({item, deleteTodo}:RowProps) {
  return (
    <View style = {styles.row}>
      <Text>{item.text}</Text>
      <TouchableOpacity style={styles.button} onPress={() => deleteTodo(item.id)}>
        <Text style = {styles.btnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    margin: 8,
    justifyContent: 'space-between'
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 4
  },
  btnText: {
    color: 'white',
    padding: 4,
  }
});