import api from "../api";

export const getCandidateNotifications = async () => {
  const response = await api.get("/candidate/notifications/");
  return response.data;
};

export const getCandidateUnreadNotificationCount = async () => {
  const response = await api.get("/candidate/notifications/unread-count/");
  return response.data;
};

export const markCandidateNotificationAsRead = async (notificationId) => {
  const response = await api.patch(
    `/candidate/notifications/${notificationId}/read/`
  );
  return response.data;
};

export const markAllCandidateNotificationsAsRead = async () => {
  const response = await api.patch(
    "/candidate/notifications/read-all/"
  );
  return response.data;
};

export const clearAllCandidateNotifications = async () => {
  const response = await api.delete(
    "/candidate/notifications/clear-all/"
  );

  return response.data;
};


export const deleteCandidateNotification = async (notificationId) => {
  const response = await api.delete(
    `/candidate/notifications/${notificationId}/delete/`
  );

  return response.data;
};