import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(ROUTES.START)
  }, [navigate])

  return null
}
