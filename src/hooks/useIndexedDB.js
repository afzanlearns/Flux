import { useEffect, useState } from 'react'
import { openDB } from 'idb'

let dbInstance = null

const getDB = async () => {
  if (dbInstance) return dbInstance

  dbInstance = await openDB('flux-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('transactions')) {
        const txStore = db.createObjectStore('transactions', { keyPath: 'id' })
        txStore.createIndex('date', 'date')
        txStore.createIndex('type', 'type')
      }

      if (!db.objectStoreNames.contains('subscriptions')) {
        const subStore = db.createObjectStore('subscriptions', { keyPath: 'id' })
        subStore.createIndex('status', 'status')
      }

      if (!db.objectStoreNames.contains('debts')) {
        const debtStore = db.createObjectStore('debts', { keyPath: 'id' })
        debtStore.createIndex('status', 'status')
      }

      if (!db.objectStoreNames.contains('accounts')) {
        const accountStore = db.createObjectStore('accounts', { keyPath: 'id' })
        accountStore.createIndex('type', 'type')
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' })
      }
    }
  })

  return dbInstance
}

export const useIndexedDB = () => {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDB()
      .then(() => setReady(true))
      .catch(setError)
  }, [])

  const add = async (storeName, data) => {
    const db = await getDB()
    return db.add(storeName, data)
  }

  const put = async (storeName, data) => {
    const db = await getDB()
    return db.put(storeName, data)
  }

  const get = async (storeName, key) => {
    const db = await getDB()
    return db.get(storeName, key)
  }

  const getAll = async (storeName) => {
    const db = await getDB()
    return db.getAll(storeName)
  }

  const remove = async (storeName, key) => {
    const db = await getDB()
    return db.delete(storeName, key)
  }

  const clear = async (storeName) => {
    const db = await getDB()
    return db.clear(storeName)
  }

  const getAllFromIndex = async (storeName, indexName, value) => {
    const db = await getDB()
    return db.getAllFromIndex(storeName, indexName, value)
  }

  return { ready, error, add, put, get, getAll, remove, clear, getAllFromIndex }
}
