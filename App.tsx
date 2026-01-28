import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import { Todo } from './types/Todo';
import Row from './components/Row';
import * as SQLite from 'expo-sqlite'
import { SafeAreaView } from 'react-native-safe-area-context';


export default function App() {
const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null)
const [newTask, setNewTask] = useState('')
const [todos, setTodos] = useState<Todo[]>([])

useEffect(() => {
  const initDB = async() => {
    const database = await SQLite.openDatabaseSync('todos.db')
    setDb(database)
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMERY KET AUTONINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      );
    `)
    loadTodos(database)
  }

  initDB()
}, [])

const loadTodos = async(database: SQLite.SQLiteDatabase) => {
  const result = await database.getAllAsync<Todo>('SELECT * FROM todos ORDER BY id DESC')
  setTodos(result)
}

const addTodo = async() => {
  if (!newTask.trim() || !db) return
 
  await db.runAsync('INSERT INTO todos (text) VALUES (?)', newTask)
  setNewTask('')
  loadTodos(db)
}

const deleteTodo = async (id: number):Promise<void> => {
  if (!db) return
  await db.runAsync('DELETE FROM todos WHERE id = ?', id)
  loadTodos(db)
}

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder='Add new Task'
        value = {newTask}
        onChangeText={setNewTask}
        onSubmitEditing={addTodo}
      />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => <Row item={item} deleteTodo={deleteTodo} />}
        style={styles.list}
      />
      <StatusBar style='auto' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    backgroundColor: '#f0f0f0',
    width: '100%'
  }
});
