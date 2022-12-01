import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Trash } from 'phosphor-react'
import { useDeleteBlocksMutation } from '../../../app/services/blocks'
import './remove.scss'

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
        <button className="buttonBody" onClick={handleShow}>
          <Trash size={20} alt="Excluir" />
        </button>
      )}
      <Modal show={show} onHide={handleClose} dialogClassName="RemoveModal">
        <Modal.Header closeButton>
          <Modal.Title>Deseja realmente excluir o bloco?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ao excluir o bloco <strong>{name}</strong>, todos os dados
          relacionados a ele serão excluídos.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="closeButtonRemove"
            onClick={handleClose}
          >
            Fechar
          </Button>
          <Button
            variant="danger"
            className="removeButton"
            onClick={handleDelete}
          >
            Excluir Bloco
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default RemoveBlocks
