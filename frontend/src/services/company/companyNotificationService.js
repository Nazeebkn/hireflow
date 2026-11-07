import api from "../api";

export const getCompanyNotifications = async () => {
  const response = await api.get("/company/notifications/");
  return response.data;
};

export const getCompanyUnreadNotificationCount = async () => {
  const response = await api.get(
    "/company/notifications/unread-count/"
  );
  return response.data;
};

export const markCompanyNotificationAsRead = async (
  notificationId
) => {
  const response = await api.patch(
    `/company/notifications/${notificationId}/read/`
  );
  return response.data;
};

export const markAllCompanyNotificationsAsRead = async () => {
  const response = await api.patch(
    "/company/notifications/read-all/"
  );
  return response.data;
};

export const clearAllCompanyNotifications = async () => {
  const response = await api.delete(
    "/company/notifications/clear-all/"
  );
  return response.data;
};

export const deleteCompanyNotification = async (
  notificationId
) => {
  const response = await api.delete(
    `/company/notifications/${notificationId}/delete/`
  );
  return response.data;
};