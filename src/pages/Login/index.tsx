import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { Button, Form } from 'react-bootstrap'
import './styles.scss'
import { auth } from '../../config/firebase-config'

export function Login() {
  // const [show, setShow] = useState(false)
  // const handleClick = () => setShow(!show)

  const navigate = useNavigate()
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [authing, setAuthing] = useState(false)

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword,
      )
      const token = (await user.user.getIdTokenResult()).token
      axios
        .get('https://login-client-om32e3yzoa-uc.a.run.app/authentication', {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          // console.log(res.headers['set-cookie'])
          // console.log(token)
          setAuthing(true)

          navigate('/')
        })
        .catch((err) => {
          alert('Senha ou email incorretos')
          setAuthing(false)
          console.error(err)
        })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="pageContainer">
      <div className="formContainer">
        <Form className="form">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>E-mail</Form.Label>
            <Form.Control
              type="email"
              required
              placeholder="Insira o E-mail"
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              required
              placeholder="Min. 8 caracteres"
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="button"
            className="button"
            onClick={login}
            disabled={authing}
          >
            Entrar
          </Button>
        </Form>
      </div>
    </div>
  )
}
