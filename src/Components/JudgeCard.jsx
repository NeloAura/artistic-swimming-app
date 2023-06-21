import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Text,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  CardFooter,
  Badge,
  ButtonGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  PopoverFooter,
  Box,
  Button,
  Stack,
  FormLabel,
  Input,
  Select,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton
} from '@chakra-ui/react';
import { SunIcon, DeleteIcon } from '@chakra-ui/icons';
import NavigationComp from './Navigation';
import { socket } from '../socket_io';
import { emit } from '../socket_io';

// Fetch judges
const fetchJudges = async () => {
  return new Promise((resolve, reject) => {
    socket.emit('fetchJudges');
    socket.on('judgesData', (judges) => {
      resolve(judges);
    });
    socket.on('connect_error', (error) => {
      reject(error);
      socket.disconnect();
    });
  });
};

// Delete judge
async function deleteJudge(JudgeID) {
  try {
    const result = await emit('delete-judge', JudgeID);
    console.log('Judge Deleted successfully:', result);
    return result;
  } catch (error) {
    console.error('Delete failed:', error);
    throw new Error('Delete failed');
  }
}

// Update judge
async function updateJudge(JudgeID, name, username, password, role) {
  try {
    const result = emit('update-user', {
      id: JudgeID,
      name,
      username,
      password,
      role,
    });
    console.log('Update successful:', JudgeID);
    return result;
  } catch (error) {
    console.error('Update failed:', error);
    throw new Error('Update failed');
  }
}


// Delete popover component
const DeletePopover = ({ button, initialFocusRef, JudgeID, onDelete }) => {
  const handleDelete = async () => {
    try {
      await onDelete(JudgeID);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <Popover initialFocusRef={initialFocusRef} placement="bottom" closeOnBlur={false}>
      <PopoverTrigger>{button}</PopoverTrigger>
      <PopoverContent color="white" bg="blue.700" borderColor="twiter.300">
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          Alert !!
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>Are you sure you want to delete? You can't undo this action afterwards.</PopoverBody>
        <PopoverFooter border="0" display="flex" alignItems="center" justifyContent="space-between" pb={4}>
          <ButtonGroup size="md">
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

// Judge form component
function JudgeForm({ initialName, initialUsername, initialRole, isOpen, onOpen, onClose, onUpdate, JudgeID }) {
  const firstField = React.useRef();
  const [formValues, setFormValues] = React.useState({
    name: initialName,
    username: initialUsername,
    password: '',
    role: initialRole,
  });

  React.useEffect(() => {
    if (isOpen) {
      setFormValues({
        name: initialName,
        username: initialUsername,
        password: '',
        role: initialRole,
      });
    }
  }, [isOpen, initialName, initialUsername, initialRole]);

  const handleSubmit = async () => {
    try {
      const { name, username, password, role } = formValues;
      const result = await onUpdate(JudgeID, name, username, password, role);
      onClose();
      console.log('Update successful:', JudgeID);
      return result;
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [field]: value,
    }));
  };

  return (
    <>
      <Button colorScheme="purple" onClick={onOpen}>
        Edit
      </Button>
      <Drawer isOpen={isOpen} placement="right" initialFocusRef={firstField} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Update User Account</DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor={`name_${JudgeID}`}>Name</FormLabel>
                  <Input
                    ref={firstField}
                    id={`name_${JudgeID}`}
                    value={formValues.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Please enter name"
                  />
                  <FormLabel htmlFor={`username_${JudgeID}`}>Username</FormLabel>
                  <Input
                    id={`username_${JudgeID}`}
                    value={formValues.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder="Please enter username"
                  />
                  <FormLabel htmlFor={`password_${JudgeID}`}>Password</FormLabel>
                  <Input
                    type="password"
                    id={`password_${JudgeID}`}
                    value={formValues.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Password is required when updating"
                  />
                </Box>
                <Box>
                  <FormLabel htmlFor={`role_${JudgeID}`}>Select Role</FormLabel>
                  <Select
                    id={`role_${JudgeID}`}
                    value={formValues.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="judge">Judge</option>
                  </Select>
                </Box>
              </Stack>
              <Button mt={4} colorScheme="blue" type="submit">
                Update
              </Button>
            </form>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}



// Judge card component

const JudgeCard = () => {
  const [judges, setJudges] = useState([]);

  useEffect(() => {
    const fetchJudgesData = async () => {
      try {
        const judgesData = await fetchJudges();
        setJudges(judgesData);
      } catch (error) {
        console.error('Error setting judges:', error);
      }
    };

    fetchJudgesData();
  }, []);

  const handleDeleteJudge = async (judgeID) => {
    try {
      await deleteJudge(judgeID);
      const updatedJudges = judges.filter((judge) => judge.id !== judgeID);
      setJudges(updatedJudges);
    } catch (error) {
      console.error('Error deleting judge:', error);
    }
  };

  const handleUpdateJudge = async (judgeID, name, username, password, role) => {
    try {
      await updateJudge(judgeID, name, username, password, role);
      setJudges((prevJudges) =>
        prevJudges.map((judge) => {
          if (judge.id === judgeID) {
            return {
              ...judge,
              name,
              username,
              role,
            };
          }
          return judge;
        })
      );
    } catch (error) {
      console.error('Error updating judge:', error);
    }
  };

  return (
    <ChakraProvider resetCSS>
      <nav>
        <NavigationComp />
      </nav>
      <SimpleGrid spacing={4} templateColumns="repeat(auto-fill, minmax(200px, 1fr))">
        {judges.map((judge) => (
          <JudgeCardItem
            key={judge.id}
            judge={judge}
            onDelete={handleDeleteJudge}
            onUpdate={handleUpdateJudge}
          />
        ))}
      </SimpleGrid>
    </ChakraProvider>
  );
};

// Judge card item component
const JudgeCardItem = ({ judge, onDelete, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <SunIcon boxSize={8} color="blue.300" />
      </CardHeader>
      <CardBody>
        <Badge colorScheme="purple">Judge</Badge>
        <br />
        <Text as="b">{judge.name}</Text>
        <br />
        <Badge variant="solid" colorScheme="blue">
          Type: {judge.type}
        </Badge>
      </CardBody>
      <CardFooter alignItems="center" justifyContent="center">
        <ButtonGroup>
          <JudgeForm
            isOpen={isOpen}
            onOpen={handleOpen}
            onClose={handleClose}
            initialName={judge.name}
            initialUsername={judge.username}
            initialRole={judge.role}
            JudgeID={judge.id}
            onUpdate={onUpdate}
          />
          <DeletePopover
            button={<Button flex="1" variant="ghost" leftIcon={<DeleteIcon />} />}
            JudgeID={judge.id}
            onDelete={onDelete}
          />
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default JudgeCard;




