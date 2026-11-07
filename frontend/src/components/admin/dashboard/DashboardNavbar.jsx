import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  Check,
  Trash2,
} from "lucide-react";

import {
  getAdminNotifications,
  getAdminUnreadNotificationCount,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
  deleteAdminNotification,
  clearAllAdminNotifications,
} from "../../../services/admin/adminService";

function DashboardNavbar() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [clearingAll, setClearingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      const [notificationData, unreadData] = await Promise.all([
        getAdminNotifications(),
        getAdminUnreadNotificationCount(),
      ]);

      setNotifications(
        Array.isArray(notificationData)
          ? notificationData
          : notificationData.results || []
      );

      setUnreadCount(unreadData.unread_count || 0);
    } catch (error) {
      console.error(
        "Failed to fetch admin notifications:",
        error
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    if (notification.is_read) {
      return;
    }

    try {
      await markAdminNotificationAsRead(
        notification.id
      );

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id
            ? { ...item, is_read: true }
            : item
        )
      );

      setUnreadCount((previous) =>
        Math.max(previous - 1, 0)
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      setLoading(true);

      await markAllAdminNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (
    notificationId,
    isRead
  ) => {
    try {
      setDeletingId(notificationId);

      await deleteAdminNotification(notificationId);

      setNotifications((previous) =>
        previous.filter(
          (notification) =>
            notification.id !== notificationId
        )
      );

      if (!isRead) {
        setUnreadCount((previous) =>
          Math.max(previous - 1, 0)
        );
      }
    } catch (error) {
      console.error(
        "Failed to delete admin notification:",
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

      await clearAllAdminNotifications();

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to clear all admin notifications:",
        error
      );
    } finally {
      setClearingAll(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString();
  };

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border bg-white px-8">

      {/* Left */}

      <div className="relative w-96">
      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Notification */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setShowNotifications(
                (previous) => !previous
              )
            }
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border transition hover:bg-background"
          >
            <Bell
              size={20}
              className="text-text-secondary"
            />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}

          {showNotifications && (
            <div className="absolute right-0 top-14 z-50 w-[400px] overflow-hidden rounded-2xl border border-border bg-white shadow-xl">

              {/* Header */}

              <div className="flex items-center justify-between border-b border-border px-5 py-4">

                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    Notifications
                  </h3>

                  <p className="mt-1 text-xs text-text-secondary">
                    {notifications.length} notification
                    {notifications.length !== 1
                      ? "s"
                      : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      disabled={loading}
                      className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                    >
                      Mark all as read
                    </button>
                  )}

                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      disabled={clearingAll}
                      className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                    >
                      {clearingAll
                        ? "Clearing..."
                        : "Clear all"}
                    </button>
                  )}

                </div>

              </div>

              {/* Notifications */}

              <div className="max-h-[420px] overflow-y-auto">

                {notifications.length === 0 ? (

                  <div className="px-5 py-10 text-center">

                    <Bell
                      size={28}
                      className="mx-auto mb-3 text-text-secondary"
                    />

                    <p className="text-sm font-medium text-text-primary">
                      No notifications
                    </p>

                    <p className="mt-1 text-xs text-text-secondary">
                      You are all caught up.
                    </p>

                  </div>

                ) : (

                  notifications.map((notification) => (

                    <div
                      key={notification.id}
                      className={`group relative flex gap-3 border-b border-border px-5 py-4 transition hover:bg-background ${
                        !notification.is_read
                          ? "bg-blue-50/50"
                          : "bg-white"
                      }`}
                    >

                      {/* Status */}

                      <button
                        type="button"
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                        className="flex min-w-0 flex-1 gap-3 text-left"
                      >

                        <div className="mt-1 flex-shrink-0">

                          {!notification.is_read ? (
                            <span className="block h-2.5 w-2.5 rounded-full bg-primary" />
                          ) : (
                            <Check
                              size={14}
                              className="text-text-secondary"
                            />
                          )}

                        </div>

                        {/* Content */}

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <h4
                              className={`text-sm ${
                                !notification.is_read
                                  ? "font-semibold text-text-primary"
                                  : "font-medium text-text-primary"
                              }`}
                            >
                              {notification.title}
                            </h4>

                            {!notification.is_read && (
                              <span className="text-[10px] font-medium text-primary">
                                NEW
                              </span>
                            )}

                          </div>

                          <p className="mt-1 text-xs leading-5 text-text-secondary">
                            {notification.message}
                          </p>

                          <p className="mt-2 text-[10px] text-text-secondary">
                            {formatDate(
                              notification.created_at
                            )}
                          </p>

                        </div>

                      </button>

                      {/* Individual Delete */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteNotification(
                            notification.id,
                            notification.is_read
                          )
                        }
                        disabled={
                          deletingId ===
                          notification.id
                        }
                        title="Clear notification"
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                  ))

                )}

              </div>

            </div>
          )}

        </div>

        {/* Admin Profile */}

        <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-2">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
            A
          </div>

          <div>

            <h3 className="text-sm font-semibold text-text-primary">
              Admin
            </h3>

            <p className="text-xs text-text-secondary">
              Super Administrator
            </p>

          </div>

          <ChevronDown
            size={18}
            className="text-text-secondary"
          />

        </div>

      </div>

    </header>
  );
}

export default DashboardNavbar;