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
  laurelOverrides:   string | null;
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
  hasLaurel,
  editionDateLabel,
  pastMessages,
}: {
  editionId: string;
  winners: Winner[];
  hasTemplate: boolean;
  hasLaurel: boolean;
  editionDateLabel: string;
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
            hasLaurel={hasLaurel}
            editionDateLabel={editionDateLabel}
            msgSubject={msgSubject}
            msgBody={msgBody}
            includeMessage={include}
          />
        ))}
      </div>
    </>
  );
}
