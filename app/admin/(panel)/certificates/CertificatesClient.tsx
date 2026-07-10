"use client";
import { useState } from "react";
import { MessageComposer } from "./MessageComposer";
import { WinnerRow } from "./WinnerRow";

interface Winner {
  id:                string;
  recipient:         string | null;
  filmTitle:         string | null;
  category:          string;
  email:             string | null;
  certificateSent:   boolean;
  certificateSentAt: Date | null;
  certOverrides:     string | null;
}

interface PastMessage {
  id: string;
  subject: string | null;
  body: string;
  createdAt: Date;
}

export function CertificatesClient({
  editionId,
  winners,
  hasTemplate,
  pastMessages,
}: {
  editionId: string;
  winners: Winner[];
  hasTemplate: boolean;
  pastMessages: PastMessage[];
}) {
  const [msgSubject, setMsgSubject] = useState("");
  const [msgBody,    setMsgBody]    = useState("");
  const [include,    setInclude]    = useState(true);

  const emailCount = winners.filter((w) => w.email).length;

  function handleMessageChange(subject: string, body: string, inc: boolean) {
    setMsgSubject(subject);
    setMsgBody(body);
    setInclude(inc);
  }

  return (
    <>
      <MessageComposer
        editionId={editionId}
        emailCount={emailCount}
        pastMessages={pastMessages}
        onMessageChange={handleMessageChange}
      />

      <div className="space-y-2">
        {winners.map((w) => (
          <WinnerRow
            key={w.id}
            winner={w}
            hasTemplate={hasTemplate}
            msgSubject={msgSubject}
            msgBody={msgBody}
            includeMessage={include}
          />
        ))}
      </div>
    </>
  );
}
