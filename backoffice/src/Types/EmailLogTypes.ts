export type EmailLog = {
  id: string;
  sent_time: string;
  content: string | null;
  sender_email: string | null;
  receiver_email: string | null;
  operation_type: string | null;
};
