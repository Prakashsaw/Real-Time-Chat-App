import { useContext } from "react";
import { Stack } from "react-bootstrap";
import avarter from "../../assets/avarter.svg";
import { ChatContext } from "../../context/ChatContext";
import { useFecthLatestMessage } from "../../hooks/useFetchLatestMessage";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";

const UserCard = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { latestMessage } = useFecthLatestMessage(chat);
  const { onlineUsers, notifications, markThisUserNotificationsAsRead } =
    useContext(ChatContext);

  const unreadNotifications = unreadNotificationsFunc(notifications);

  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  const thisUserNotifications = unreadNotifications?.filter(
    (n) => n.senderId == recipientUser?._id
  );

  const truncateText = (text) => {
    let shortText = text.substring(0, 20);

    if (text.length > 20) {
      shortText = shortText + "...";
    }

    return shortText;
  };

  return (
    <>
      <Stack
        direction="horizontal"
        gap={3}
        className="user-card align-items-center p-2 justify-content-between"
        role="button"
        onClick={() => {
          if (thisUserNotifications?.length !== 0) {
            markThisUserNotificationsAsRead(
              thisUserNotifications,
              notifications
            );
          }
        }}
      >
        <div className="d-flex">
          <div className="me-2">
            <img src={avarter} alt="person-circle" height="35px" />
          </div>
          <div className="text-content">
            <div className="name">{recipientUser?.name}</div>
            <div className="text">
              {latestMessage?.text && (
                <span>{truncateText(latestMessage?.text)}</span>
              )}
            </div>
          </div>
        </div>
        <div className="d-flex flex-column align-items-end">
          <div className="date">
            {moment(latestMessage?.createdAt).calendar()}
          </div>
          <div
            className={
              thisUserNotifications?.length > 0 ? "this-user-notifications" : ""
            }
          >
            {thisUserNotifications?.length > 0
              ? thisUserNotifications?.length
              : ""}
          </div>
          <span className={isOnline ? "user-online" : ""}></span>
        </div>
      </Stack>
    </>
  );
};

export default UserCard;
