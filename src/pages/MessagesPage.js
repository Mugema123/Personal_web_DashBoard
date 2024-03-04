import {
    Avatar,
    Divider,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    TextField,
    Typography,
    Container,
  } from "@mui/material";
  import { useFetcher } from "src/api/fetcher";
  import API from "src/api/_api_";
  import React from "react";
  import { useEffect } from "react";
  import { useState } from "react";
  import { toast } from "react-hot-toast";
  import { connect } from "react-redux";
  import DataWidget from "src/components/widgets/DataWidget";
  import ModalDialog from "src/components/Global/ModalDialog";
  import Sidebar from "src/components/Global/Sidebar";
  import ProjectsLoaders from "src/components/Global/ProjectsLoaders";
  import { IconMail, IconMessage, IconTrash } from "@tabler/icons-react";
  import moment from "moment";
  import {
    deleteMessage,
    editMessage,
    getAllMessages,
  } from "src/redux/actions/message";

  const initFormData = {
    replyMessage: "",
  };
  
  const initState = { loading: false, error: null };
  
  const MessagesPage = ({
    messages,
    getMessages,
    addMessage,
    editMessage,
    deleteMessage,
  }) => {
    const [openSidebar, setOpenSidebar] = useState(false);
    const [formData, setFormData] = useState(initFormData);
    const [state, setState] = useState(initState);
    const [currentMessage, setCurrentMessage] = useState(null);
  
    const { data, isError, isLoading } = useFetcher(
      "/messages?all=true&limit=100"
    );
  
    useEffect(() => {
      if (data?.data?.length) {
        getMessages({ messages: data?.data });
      }
    }, [data?.data?.length]);
  
    useEffect(() => {
      if (currentMessage) {
        setFormData({
          replyMessage: currentMessage.replyMessage,
        });
      } else {
        setFormData(initFormData);
      }
    }, [currentMessage]);
  
    const handleChange = (name, value) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async () => {
      setState(initState);
      try {
        setState((prev) => ({ ...prev, loading: true }));
        if (!currentMessage || !formData.replyMessage) {
          throw new Error(
            !currentMessage
              ? "There are no message choosen to reply"
              : "Reply message required!"
          );
        }
        const result = await toast.promise(
          API.patch(`/messages/reply?messageId=${currentMessage._id}`, {
            replyMessage: formData.replyMessage,
          }),
          {
            loading: `Sending a reply to ${currentMessage?.names}'s messsage.`,
            success: `You have replied successfully to ${currentMessage?.names}!`,
            error: `Something went wrong while replying to ${currentMessage?.names}'s message. Try again later!`,
          },
          { position: "top-right" }
        );
        editMessage(result.data.data);
        setCurrentMessage(null);
        setFormData(initFormData);
        setOpenSidebar(false);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error.response?.data?.message ||
            error.message ||
            "Unknown error occured, please try again.",
        }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };
    const handleOpenSidebar = () => {
      setOpenSidebar(true);
    };
    const handleCloseSidebar = () => {
      if (state.loading) return;
      setOpenSidebar(false);
      setCurrentMessage(null);
      setState(initState);
    };
  
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
      setOpenModal(true);
    };
    const handleCloseModal = () => {
      setOpenModal(false);
      setCurrentMessage(null);
    };
  
    return (
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h4">Messages</Typography>
          <Sidebar
            title={"Send a reply"}
            openSidebar={openSidebar}
            onOpenSidebar={() => {
              setCurrentMessage(null);
              handleOpenSidebar();
            }}
            hideButton={true}
            onCloseSidebar={handleCloseSidebar}
            handleSubmit={handleSubmit}
            state={state}
          >
            <TextField
              label="Names"
              color="secondary"
              value={currentMessage?.names || ""}
              disabled={true}
              fullWidth
              required
            />
            <TextField
              label="Email"
              color="secondary"
              value={currentMessage?.email || ""}
              disabled={true}
              fullWidth
              required
            />
            <TextField
              label="Phone Number"
              color="secondary"
              value={currentMessage?.phoneNumber || ""}
              disabled={true}
              fullWidth
              required
            />
            <TextField
              label="Your reply"
              color="secondary"
              multiline
              rows={10}
              value={formData.replyMessage}
              onChange={(e) => handleChange("replyMessage", e.target.value)}
              fullWidth
              required
            />
          </Sidebar>
        </Stack>
        <DataWidget
          title="Messages"
          isLoading={isLoading && !messages.length}
          isError={isError && !messages.length}
          isEmpty={!messages.length}
          customLoaders={<ProjectsLoaders />}
        >
          {messages.map((message, index) => {
            return (
              <div key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar color="primary">
                    <Avatar
                      sx={{
                        bgcolor: "tertiary.main",
                        color: "white",
                        height: 40,
                        width: 40,
                      }}
                    >{`${index + 1}`}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        <Stack sx={{ mb: 0.5 }}>
                          <Typography sx={{ display: "flex", alignItems: 'center', fontSize: "16px", fontWeight: "bold" }}>
                            {message.names}{" "}
                            <Typography variant="caption">
                              &nbsp; {" - "} &nbsp; {moment(message.createdAt).fromNow()}
                            </Typography>
                          </Typography>
                          <Typography
                            href={`tel:${message.phoneNumber}`}
                            component="a"
                            variant="p"
                            sx={{
                              color: "secondary.main",
                              textDecoration: "none",
                              fontSize: "14px"
                            }}
                          >
                            {message.phoneNumber}
                          </Typography>
                        </Stack>
                      </>
                    }
                    secondary={
                      <Stack>
                        <Typography variant="p">{message.message}</Typography>
                        {message.replyMessage && (
                          <Stack
                            direction={"row"}
                            spacing={0.5}
                            sx={{
                              p: 1,
                              mt: 1,
                              color: "inherit",
                              border: "1px solid #d2d2d2",
                              borderRadius: 1,
                            }}
                          >
                            <IconMessage size={15} style={{ marginTop: 3 }} />
                            <Stack>
                              <Typography>{message.replyMessage}</Typography>
                              <Typography variant="caption">
                                {moment(message.updatedAt).fromNow()}
                              </Typography>
                            </Stack>
                          </Stack>
                        )}
                      </Stack>
                    }
                  />
                  <ListItemAvatar>
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        setCurrentMessage(message);
                        handleOpenSidebar();
                      }}
                    >
                      <IconMail size={20} />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      color="error"
                      onClick={() => {
                        setCurrentMessage(message);
                        handleOpenModal();
                      }}
                    >
                      <IconTrash size={20} />
                    </IconButton>
                  </ListItemAvatar>
                </ListItem>
                <Divider variant="inset" />
              </div>
            );
          })}
        </DataWidget>
        <ModalDialog
          title="Delete Message?"
          subTitle={`Are you sure do you want to delete this message? `}
          item={currentMessage?.names}
          open={openModal}
          handleClose={handleCloseModal}
          handleClickOk={async () => {
            const id = currentMessage?._id;
            const title = currentMessage?.names;
            setOpenModal(false);
            try {
              await toast.promise(
                API.delete(`/messages/delete?messageId=${id}`),
                {
                  loading: `Hold on, we are deleting ${title} from our system.`,
                  success: `Message by ${title} has been deleted successfully`,
                  error: (error) => {
                    if (error.response) {
                      return `Error: ${
                        error.response?.data?.message ||
                        error.message ||
                        "Unknown error occured"
                      }`;
                    } else {
                      return "Something went wrong while deleting message, please try again";
                    }
                  },
                }
              );
              deleteMessage(id);
            } catch (error) {
            } finally {
              handleCloseModal();
            }
          }}
        />
      </Container>
    );
  };
  
  const mapStateToProps = (state) => ({
    messages: state.message.messages,
  });
  
  const mapDispatchToProps = (dispatch) => {
    return {
      getMessages: (data) => dispatch(getAllMessages(data)),
      editMessage: (data) => dispatch(editMessage(data)),
      deleteMessage: (id) => dispatch(deleteMessage(id)),
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(MessagesPage);
  