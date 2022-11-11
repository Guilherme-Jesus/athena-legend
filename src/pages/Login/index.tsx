import { Button, Form } from 'react-bootstrap'
import './styles.scss'

export function Login() {
  return (
    <div className="pageContainer">
      <div className="formContainer">
        <Form className="form">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Button variant="primary" type="submit" className="button">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  )
}
