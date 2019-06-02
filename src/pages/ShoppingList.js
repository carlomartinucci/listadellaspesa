import React from "react";
import { ButtonGroup, Button, Container, ListGroup, ListGroupItem, Badge } from 'reactstrap';
import useShoppingList from '../hooks/useShoppingList'

const ShoppingList = () => {
  const [shoppingList, setItemState, setDone] = useShoppingList()

  return (
    <Container className="text-left">
      <h1>Lista della spesa</h1>
      <ListGroup>
        {shoppingList.items.map(item => (
          <ListGroupItem
            className="d-flex justify-content-between align-items-center"
            key={item.name}
            color={item.state}>
            <Badge pill>{item.quantity}</Badge>

            <span>
              {item.name}
            </span>

            <ButtonGroup  size="sm">
              <Button color="success" onClick={setItemState(item, 'success')}>:)</Button>
              <Button color="danger" onClick={setItemState(item, 'danger')}>:)</Button>
            </ButtonGroup>
          </ListGroupItem>
        ))
        }
      </ListGroup>

      <Button onClick={setDone}>FINITO!</Button>
    </Container>
  )
}

export default ShoppingList
