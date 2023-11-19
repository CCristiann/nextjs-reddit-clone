import { IncomingHttpHeaders } from "http";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook, WebhookRequiredHeaders } from "svix";
import prisma from "@/libs/prismadb";
import { nanoid } from "nanoid";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

async function handler(req: Request) {
  const payload = await req.json();

  const headersList = headers();
  const heads = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  };

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: Event | null = null;

  try {
    evt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders,
    ) as Event;
  } catch (err) {
    return NextResponse.json({}, { status: 400 });
  }

  const eventType: EventType = evt.type;
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, ...attributes }: any = evt.data;

    if (!attributes.username) {
      await prisma.user.upsert({
        where: { externalId: id as string },
        create: {
          externalId: id as string,
          name: `${
            attributes.first_name && attributes.last_name
              ? `${attributes.first_name} ${attributes.last_name}`
              : null
          }`,
          email: attributes.email_addresses[0].email_address,
          imageUrl: attributes.image_url,
          username: nanoid(10),
        },
        update: {
          name: `${
            attributes.first_name && attributes.last_name
              ? `${attributes.first_name} ${attributes.last_name}`
              : null
          }`,
          email: attributes.email_addresses[0].email_address,
          imageUrl: attributes.image_url,
        },
      });
    } else {
      await prisma.user.upsert({
        where: { externalId: id as string },
        create: {
          externalId: id as string,
          name: `${
            attributes.first_name && attributes.last_name
              ? `${attributes.first_name} ${attributes.last_name}`
              : null
          }`,
          email: attributes.email_addresses[0].email_address,
          imageUrl: attributes.image_url,
          username: attributes.username,
        },
        update: {
          name: `${
            attributes.first_name && attributes.last_name
              ? `${attributes.first_name} ${attributes.last_name}`
              : null
          }`,
          email: attributes.email_addresses[0].email_address,
          imageUrl: attributes.image_url,
          username: attributes.username,
        },
      });
    }
  }

  return NextResponse.json("OK", { status: 200 })
}

type EventType = "user.created" | "user.updated" | "*";

type Event = {
  data: Record<string, string | number>;
  object: "event";
  type: EventType;
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
