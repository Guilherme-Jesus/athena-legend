import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { MdDeleteForever } from 'react-icons/md'
import { useDeleteBlocksMutation } from '../../../app/services/blocks'

type Props = {
  blockId: string
  blockParent: string
  name: string
}

function RemoveBlocks({ blockParent, blockId, name }: Props) {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [blockDelete] = useDeleteBlocksMutation()

  const handleDelete = () => {
    try {
      blockDelete(blockId).unwrap()
    } catch (err) {
      console.log(err)
    }
    setShow(false)
  }

  return (
    <>
      {blockParent !== '0' && (
        <Button variant="primary" onClick={handleShow}>
          <MdDeleteForever />
        </Button>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Deseja realmente excluir o bloco?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ao excluir o bloco <strong>{name}</strong>, todos os dados
          relacionados a ele serão excluídos.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Excluir Bloco
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default RemoveBlocks
