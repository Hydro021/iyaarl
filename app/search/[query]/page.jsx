"use client"
import Loader from '@components/Loader'
import Navbar from '@components/Navbar'
import WorkList from '@components/WorkList'
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import "styles/Search.scss"

const SearchPage = () => {
  const { query } = useParams()

  const [loading, setLoading] = useState(true)
  const [workList, setWorkList] = useState([])
  const [decodedQuery, setDecodedQuery] = useState("") // State to hold decoded query

  const getWorkList = async () => {
    try {
      const response = await fetch(`/api/work/search/${query}`, {
        method: 'GET',
      })

      const data = await response.json()
      // Replace "%20" with a space in the query string
      const decodedQuery = query.replace(/%20/g, ' ')
      setDecodedQuery(decodedQuery) // Set the decoded query to state
      // Update the state with decoded query
      setWorkList(data.map(work => ({ ...work, query: decodedQuery })))
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getWorkList()
  }, [query])

  return loading ? <Loader /> : (
    <>
      <Navbar />
      <h1 className='title-list'>{decodedQuery} result(s)</h1> {/* Display decoded query */}
      <WorkList data={workList} />
    </>
  )
}

export default SearchPage
