import { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { channels } from '../shared/constants'

export default function useContracts () {
  const [contracts, setContracts] = useState([])

  useEffect(() => {
    ipcRenderer.invoke(channels.GET_CONTRACTS).then(({ contracts }) => {
      contracts.forEach((contract, index) => { contract.key = index + 1 })
      setContracts(contracts)
    })
  }, [])

  function createContract (contract) {
    ipcRenderer.invoke(channels.CREATE_CONTRACT, { id: contract._id }).then(({ contracts }) => {
      setContracts(contracts)
    })
  }

  function deleteContract (contract) {
    ipcRenderer.invoke(channels.DELETE_CONTRACT, { id: contract._id }).then((response) => {
      if (response) {
        ipcRenderer.invoke(channels.GET_CONTRACTS).then(({ contracts }) => {
          contracts.forEach((contract, index) => { contract.key = index + 1 })
          setContracts(contracts)
        })
      }
    })
  }

  return { contracts, deleteContract, createContract }
}
