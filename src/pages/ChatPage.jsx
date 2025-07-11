'use client';
import UsersList from "@/components/mainlayout/components/Chat/UsersList";
import { chatStore } from "@/store/chatStore";
import { useEffect } from "react";

const ChatPage = () => {
  const { fetchUsers } = chatStore();

  // useEffect(() => {
  //   if (user) fetchUsers();
  // }, [fetchUsers, user]);

  // useEffect(() => {
  //   if (selectedUser) fetchMessages(selectedUser.clerkId);
  // }, [fetchMessages, selectedUser]);

  return (
    <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-100px)]">
      <UsersList />
    </div>
  );
};

export default ChatPage;