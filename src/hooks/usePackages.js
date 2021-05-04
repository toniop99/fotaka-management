import { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { channels } from '../shared/constants'

export default function usePackages () {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    ipcRenderer.invoke(channels.GET_PACKAGES).then(({ packages }) => {
      setPackages(packages)
    }, [packages])
  })

  function deletePackage (pack) {
    ipcRenderer.invoke(channels.DELETE_PACKAGE, { id: pack._id }).then(({ packages }) => {
      setPackages(packages)
    })
  }

  return { packages, deletePackage }
}
