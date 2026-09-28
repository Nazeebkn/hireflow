import { useEffect, useState } from "react";
import {
  X,
  Trash2,
} from "lucide-react";

import {
  getCandidateNotifications,
  markCandidateNotificationAsRead,
  markAllCandidateNotificationsAsRead,
  clearAllCandidateNotifications,
  deleteCandidateNotification,
} from "../../../services/candidate/candidateNotificationService";

const CandidateNotificationPanel = ({
  onClose,
  onUnreadCountChange,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearingAll, setClearingAll] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getCandidateNotifications();

        setNotifications(
          Array.isArray(data)
            ? data
            : data.results || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch notifications:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    if (notification.is_read) {
      return;
    }

    try {
      await markCandidateNotificationAsRead(
        notification.id
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id
            ? { ...item, is_read: true }
            : item
        )
      );

      onUnreadCountChange?.(-1);
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadCount = notifications.filter(
      (notification) => !notification.is_read
    ).length;

    if (unreadCount === 0) {
      return;
    }

    try {
      await markAllCandidateNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

      onUnreadCountChange?.(-unreadCount);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  };

  const handleDeleteNotification = async (
    notificationId,
    isRead
  ) => {
    try {
      setDeletingId(notificationId);

      await deleteCandidateNotification(
        notificationId
      );

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification.id !== notificationId
        )
      );

      if (!isRead) {
        onUnreadCountChange?.(-1);
      }
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) {
      return;
    }

    try {
      setClearingAll(true);

      const unreadCount = notifications.filter(
        (notification) => !notification.is_read
      ).length;

      await clearAllCandidateNotifications();

      setNotifications([]);

      if (unreadCount > 0) {
        onUnreadCountChange?.(-unreadCount);
      }
    } catch (error) {
      console.error(
        "Failed to clear all notifications:",
        error
      );
    } finally {
      setClearingAll(false);
    }
  };

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.is_read
  );

  return (
    <div className="absolute right-0 top-12 z-50 w-[420px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Notifications
          </h3>

          {notifications.length > 0 && (
            <p className="mt-0.5 text-xs text-gray-500">
              {notifications.length}{" "}
              {notifications.length === 1
                ? "notification"
                : "notifications"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">

          {hasUnreadNotifications && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-xs font-medium text-blue-600 transition hover:text-blue-700"
            >
              Mark all as read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={clearingAll}
              className="text-xs font-medium text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {clearingAll
                ? "Clearing..."
                : "Clear all"}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={16} />
          </button>

        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-[450px] overflow-y-auto">

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-10 text-center">

            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <X
                size={18}
                className="text-gray-400"
              />
            </div>

            <p className="text-sm font-medium text-gray-700">
              No notifications
            </p>

            <p className="mt-1 text-xs text-gray-400">
              You're all caught up.
            </p>

          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`group relative border-b border-gray-100 px-5 py-4 transition ${
                !notification.is_read
                  ? "bg-blue-50/50 hover:bg-blue-50"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3 pr-7">

                {/* Unread Indicator */}
                <div className="mt-1.5 w-2 shrink-0">
                  {!notification.is_read && (
                    <span className="block h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>

                {/* Notification Content */}
                <button
                  type="button"
                  onClick={() =>
                    handleNotificationClick(
                      notification
                    )
                  }
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-sm font-semibold text-gray-900">
                    {notification.title}
                  </p>

                  <p className="mt-1 text-sm leading-5 text-gray-600">
                    {notification.message}
                  </p>

                  {notification.created_at && (
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(
                        notification.created_at
                      ).toLocaleString()}
                    </p>
                  )}
                </button>

              </div>

              {/* Individual Clear Button */}
              <button
                type="button"
                onClick={() =>
                  handleDeleteNotification(
                    notification.id,
                    notification.is_read
                  )
                }
                disabled={
                  deletingId === notification.id
                }
                title="Clear notification"
                className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default CandidateNotificationPanel;